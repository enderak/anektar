import React, { useMemo, useState } from 'react';
import { Text3D, PerspectiveCamera, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { createIconShape } from '../../utils/svgIcons';

const SCALE = 0.05;

// Taban plakası için kavisli dikdörtgen şablonu (Saat yönünün tersine çizilmeli)
const createRoundedRectShape = (width, depth, radius, holeConfig) => {
  const shape = new THREE.Shape();
  const x = -width / 2;
  const y = -depth / 2;
  
  shape.moveTo(x + radius, y);
  shape.lineTo(x + width - radius, y);
  shape.quadraticCurveTo(x + width, y, x + width, y + radius);
  shape.lineTo(x + width, y + depth - radius);
  shape.quadraticCurveTo(x + width, y + depth, x + width - radius, y + depth);
  shape.lineTo(x + radius, y + depth);
  shape.quadraticCurveTo(x, y + depth, x, y + depth - radius);
  shape.lineTo(x, y + radius);
  shape.quadraticCurveTo(x, y, x + radius, y);

  // Delik (Hole) ekleme
  if (holeConfig) {
    const holePath = new THREE.Path();
    holePath.absarc(holeConfig.x, holeConfig.y, holeConfig.r, 0, Math.PI * 2, true);
    shape.holes.push(holePath);
  }
  
  return shape;
};

// Damla (Teardrop) şablonu
const createTeardropShape = (width, depth, isLeft, holeConfig) => {
  const shape = new THREE.Shape();
  
  const rMain = depth / 2;
  const rSmall = holeConfig ? holeConfig.r + 4.5 : depth / 3;

  const cxLeft = -width / 2 + (isLeft ? rSmall : rMain);
  const cxRight = width / 2 - (isLeft ? rMain : rSmall);

  const rLeft = isLeft ? rSmall : rMain;
  const rRight = isLeft ? rMain : rSmall;

  const d = cxRight - cxLeft;
  
  // Teğet açıları
  const theta = Math.asin((rMain - rSmall) / d); 
  const angleLeft = isLeft ? theta : -theta;
  const angleRight = isLeft ? theta : -theta;

  // Saat yönünün tersine (CCW) çizim:
  shape.absarc(cxRight, 0, rRight, -Math.PI/2 + angleRight, Math.PI/2 - angleRight, false);
  shape.lineTo(cxLeft - rLeft * Math.sin(angleLeft), rLeft * Math.cos(angleLeft));
  shape.absarc(cxLeft, 0, rLeft, Math.PI/2 + angleLeft, Math.PI*1.5 - angleLeft, false);
  shape.lineTo(cxRight + rRight * Math.sin(angleRight), -rRight * Math.cos(angleRight));

  // Delik (Hole)
  if (holeConfig) {
    const holePath = new THREE.Path();
    holePath.absarc(holeConfig.x, holeConfig.y, holeConfig.r, 0, Math.PI * 2, true);
    shape.holes.push(holePath);
  }
  
  return shape;
};

// Kalp taban şekli
const createHeartBaseShape = (width, depth, holeConfig) => {
  const shape = new THREE.Shape();
  // Kalbin genişliği ve yüksekliği baseW/baseD'ye uyacak şekilde ölçekle
  const sx = width / 2;  // X ekseni yarı genişlik
  const sy = depth / 2;  // Y ekseni yarı yükseklik
  
  // Kalp üst noktası (çukur kısım) - Y ekseninde yukarı
  shape.moveTo(0, sy * 0.55);
  
  // Sağ üst kavis (sağ tepe)
  shape.bezierCurveTo(sx * 0.1, sy * 0.95, sx * 0.65, sy * 1.05, sx * 0.95, sy * 0.55);
  // Sağ alt (aşağıya doğru kıvrım)
  shape.bezierCurveTo(sx * 1.1, sy * 0.05, sx * 0.3, -sy * 0.55, 0, -sy);
  // Sol alt  
  shape.bezierCurveTo(-sx * 0.3, -sy * 0.55, -sx * 1.1, sy * 0.05, -sx * 0.95, sy * 0.55);
  // Sol üst kavis (sol tepe)
  shape.bezierCurveTo(-sx * 0.65, sy * 1.05, -sx * 0.1, sy * 0.95, 0, sy * 0.55);
  
  // Delik: Kalp şeklinde delik her zaman üst orta noktaya (iki tepe arasındaki çukura) yerleşir
  if (holeConfig) {
    const holePath = new THREE.Path();
    // Deliği kalbin üst-orta çukuruna koy
    const holeY = sy * 0.55;
    holePath.absarc(0, holeY, holeConfig.r, 0, Math.PI * 2, true);
    shape.holes.push(holePath);
  }
  
  return shape;
};

export const Scene3D = ({
  text,
  subText,
  fontFamily,
  iconType,
  customSvgUrl,
  iconPosition,
  isItalic,
  textDepth,
  groupRef,
  materialColor,
  baseColor,
  baseShape: selectedShape,
  holePosition,
  textScale,
  textOffset,
  autoCenter,
  baseHeight,
  targetWidth
}) => {
  const [textSizeMain, setTextSizeMain] = useState([60, 20, 6]);
  const [textSizeSub, setTextSizeSub] = useState([0, 0, 0]);

  React.useEffect(() => {
    if (!text || text.trim().length === 0) {
      setTextSizeMain([0, 0, 0]);
    }
  }, [text]);

  React.useEffect(() => {
    if (!subText || subText.trim().length === 0) {
      setTextSizeSub([0, 0, 0]);
    }
  }, [subText]);

  const scaleRatio = (textScale || 100) / 100.0;
  const letterSize = 30.0 * scaleRatio;         
  const baseH = baseHeight;        

  const hasSubText = subText && subText.trim().length > 0;
  
  // Italik için Shear Matrisi
  const shearMatrix = useMemo(() => {
    const matrix = new THREE.Matrix4();
    if (isItalic) {
      const angle = Math.tan(THREE.MathUtils.degToRad(12)); 
      // xy, xz, yx, yz, zx, zy
      matrix.makeShear(angle, 0, 0, 0, 0, 0); 
    }
    return matrix;
  }, [isItalic]);

  // Font haritalama
  const fontPath = useMemo(() => {
    if (fontFamily === 'helvetiker') return "/fonts/helvetiker_bold.typeface.json";
    if (fontFamily === 'droid') return "/fonts/droid_sans_bold.typeface.json";
    return "/fonts/optimer_bold.typeface.json";
  }, [fontFamily]);

  // Programatik icon shape oluştur
  const iconShape = useMemo(() => {
    if (iconType === 'none') return null;
    // Özel SVG desteği şimdilik devre dışı - programatik şekiller kullanılıyor
    return createIconShape(iconType, letterSize);
  }, [iconType, letterSize]);

  const hasIcon = iconShape !== null;

  // Y ekseni (3D Z ekseni) metin yerleşimi
  const lineSpacing = letterSize * 1.3;
  const mainYOffset = hasSubText ? (lineSpacing / 2) : 0;
  const subYOffset = hasSubText ? -(lineSpacing / 2) : 0;

  // Padding ayarları
  const isLeft = holePosition.includes('left');
  const isRight = holePosition.includes('right');
  
  const pLeft = isLeft ? 24.0 : 10.0;
  const pRight = isRight ? 24.0 : 10.0;
  const pTop = 12.0;
  const pBottom = 12.0;

  // Taban genişliği için en uzun metni baz al
  const maxTextWidth = Math.max(textSizeMain[0], textSizeSub[0]);
  
  const iconTotalWidth = hasIcon ? (letterSize + 5.0) : 0;
  
  let baseW = maxTextWidth + pLeft + pRight + iconTotalWidth;
  
  // Taban derinliği (satır sayısına göre)
  const totalTextDepth = hasSubText ? (lineSpacing + letterSize) : letterSize;
  let baseD = totalTextDepth + pTop + pBottom;

  // Damla şeklinde uçlar yuvarlak olduğu için yazının taşmaması adına ekstra genişlik
  if (selectedShape === 'teardrop') {
    baseW += (10.0 * scaleRatio);
  }

  // Tabanın merkezi
  const baseCenterX = (pRight - pLeft) / 2;
  const baseCenterZ = 0; 
  const zCenterOffset = autoCenter ? 0 : textOffset;

  // Delik koordinatları (Taban merkezine göre lokal)
  const holeR = 3.5; 
  let holeX = 0;
  let holeZ = 0;

  if (isLeft) {
    holeX = -baseW/2 + holeR + 4.5;
  } else if (isRight) {
    holeX = baseW/2 - holeR - 4.5;
  }

  if (holePosition.includes('top')) {
    holeZ = -baseD/2 + holeR + 4.5; 
  } else if (holePosition.includes('bottom')) {
    holeZ = baseD/2 - holeR - 4.5;
  } else {
    holeZ = 0; // center
  }

  if (selectedShape === 'teardrop') {
    holeZ = 0;
  }

  const innerScale = targetWidth ? (targetWidth / baseW) : 1;
  const scaledCenterZ = baseCenterZ * innerScale;
  const scaledBaseW = baseW * innerScale;
  const scaledBaseD = baseD * innerScale;

  // Taban şekli seçimi
  const baseShape = useMemo(() => {
    if (selectedShape === 'heart') {
      return createHeartBaseShape(baseW, baseD, { x: holeX, y: holeZ, r: holeR });
    } else if (selectedShape === 'teardrop') {
      return createTeardropShape(baseW, baseD, isLeft, { x: holeX, y: holeZ, r: holeR });
    } else {
      return createRoundedRectShape(
        baseW, 
        baseD, 
        Math.min(5, baseW/2, baseD/2), 
        { x: holeX, y: holeZ, r: holeR }
      );
    }
  }, [selectedShape, baseW, baseD, isLeft, holeX, holeZ, holeR]);

  const processIconGeometry = (self) => {
    if (!self.geometry.userData.morphed) {
      self.geometry.computeBoundingBox();
      const bbox = self.geometry.boundingBox;
      
      if (!bbox || bbox.min.x === Infinity || isNaN(bbox.min.x)) return;
      
      // Center the shape
      self.geometry.translate(
        -(bbox.max.x + bbox.min.x) / 2,
        -(bbox.max.y + bbox.min.y) / 2,
        0
      );
      
      if (isItalic) {
        self.geometry.applyMatrix4(shearMatrix);
      }

      self.geometry.rotateX(-Math.PI / 2);

      // Move to correct X position
      const textShiftX = iconPosition === 'left' ? iconTotalWidth / 2 : -iconTotalWidth / 2;
      const iconShiftX = iconPosition === 'left' ? -(maxTextWidth / 2 + letterSize * 0.5) : (maxTextWidth / 2 + letterSize * 0.5);
      self.geometry.translate(baseCenterX + iconShiftX + textShiftX, baseH, 0);
      
      self.geometry.computeVertexNormals();
      self.geometry.userData.morphed = true;
    }
  };

  const processTextGeometry = (self, setSizeFunc, yOffset) => {
    if (!self.geometry.userData.morphed) {
      self.geometry.computeBoundingBox();
      let bbox = self.geometry.boundingBox;
      
      if (!bbox || bbox.min.x === Infinity || isNaN(bbox.min.x)) return;
      
      self.geometry.translate(
        -(bbox.max.x + bbox.min.x) / 2, 
        -(bbox.max.y + bbox.min.y) / 2,                    
        0 
      );

      if (isItalic) {
        self.geometry.applyMatrix4(shearMatrix);
      }

      self.geometry.rotateX(-Math.PI / 2);
      
      const textShiftX = hasIcon ? (iconPosition === 'left' ? iconTotalWidth / 2 : -iconTotalWidth / 2) : 0;
      
      // Z ekseninde yerleşim
      self.geometry.translate(baseCenterX + textShiftX, baseH, yOffset);

      self.geometry.computeVertexNormals();
      self.geometry.computeBoundingBox();
      self.geometry.userData.morphed = true;

      const fbox = self.geometry.boundingBox;
      setSizeFunc([
        fbox.max.x - fbox.min.x,
        fbox.max.z - fbox.min.z, 
        fbox.max.y - fbox.min.y
      ]);
    }
  };

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 20, 30]} fov={35} />
      <OrbitControls 
        makeDefault 
        minPolarAngle={0.1} 
        maxPolarAngle={Math.PI / 1.8}
        target={[0, 0, 0]}
      />
      <ambientLight intensity={0.9} />
      <directionalLight position={[5, 10, 5]} intensity={1.5} castShadow />
      <pointLight position={[10, 10, 10]} intensity={1.2} castShadow />

      <group scale={[SCALE, SCALE, SCALE]} position={[0, -0.5, zCenterOffset * SCALE]}>
        <group ref={groupRef} scale={[innerScale, innerScale, innerScale]}>

          {/* ANA METİN */}
          {text && text.trim().length > 0 && (
            <Text3D
              name="TextMain"
              key={`main-${text}-${textDepth}-${baseHeight}-${scaleRatio}-${hasSubText}-${isItalic}-${fontFamily}`}
              font={fontPath}
              size={letterSize}
              height={textDepth} // textDepth kullanılıyor
              curveSegments={16}
              bevelEnabled={false}
              onUpdate={(self) => processTextGeometry(self, setTextSizeMain, -mainYOffset)}
            >
              {text}
              <meshStandardMaterial color={materialColor} roughness={0.4} metalness={0.1} />
            </Text3D>
          )}

          {/* ALT METİN (Opsiyonel) */}
          {hasSubText && (
            <Text3D
              name="TextSub"
              key={`sub-${subText}-${textDepth}-${baseHeight}-${scaleRatio}-${isItalic}-${fontFamily}`}
              font={fontPath}
              size={letterSize}
              height={textDepth} 
              curveSegments={16}
              bevelEnabled={false}
              onUpdate={(self) => processTextGeometry(self, setTextSizeSub, -subYOffset)}
            >
              {subText}
              <meshStandardMaterial color={materialColor} roughness={0.4} metalness={0.1} />
            </Text3D>
          )}

          {/* SİMGE (ICON) */}
          {hasIcon && (
            <mesh 
              key={`icon-${iconType}-${textDepth}-${baseHeight}-${scaleRatio}-${isItalic}-${iconPosition}-${letterSize}`}
              name="TextIcon"
              onUpdate={processIconGeometry}
            >
              <extrudeGeometry args={[iconShape, { depth: textDepth, bevelEnabled: false }]} />
              <meshStandardMaterial color={materialColor} roughness={0.4} metalness={0.1} />
            </mesh>
          )}

          {/* TABAN PLAKASI */}
          <mesh 
            name="BasePlate" 
            position={[baseCenterX, 0, baseCenterZ]} 
            rotation={[-Math.PI / 2, 0, 0]}
            receiveShadow
          >
            <extrudeGeometry args={[baseShape, { depth: baseH, bevelEnabled: false }]} />
            <meshStandardMaterial color={baseColor || '#334155'} roughness={0.8} />
          </mesh>

        </group>

        {/* ZEMİN GÖLGE DÜZLEMI */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, scaledCenterZ]} receiveShadow>
          <planeGeometry args={[scaledBaseW + 40, scaledBaseD + 40]} />
          <shadowMaterial opacity={0.15} />
        </mesh>
      </group>
    </>
  );
};