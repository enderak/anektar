import React, { useMemo, useState } from 'react';
import { Text3D, PerspectiveCamera, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

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
  
  // R_main (Geniş uç) ve R_small (Dar uç/Delik ucu)
  const rMain = depth / 2;
  const rSmall = holeConfig ? holeConfig.r + 4.5 : depth / 3;

  const cxLeft = -width / 2 + (isLeft ? rSmall : rMain);
  const cxRight = width / 2 - (isLeft ? rMain : rSmall);

  const rLeft = isLeft ? rSmall : rMain;
  const rRight = isLeft ? rMain : rSmall;

  const d = cxRight - cxLeft;
  
  // Teğet açıları
  const theta = Math.asin((rMain - rSmall) / d); // Daralma açısı
  const angleLeft = isLeft ? theta : -theta;
  const angleRight = isLeft ? theta : -theta;

  // Saat yönünün tersine (CCW) çizim:
  // Sağ alt -> Sağ üst yay
  shape.absarc(cxRight, 0, rRight, -Math.PI/2 + angleRight, Math.PI/2 - angleRight, false);
  
  // Üst teğet çizgi (Sağ üstten Sol üste)
  shape.lineTo(cxLeft + rLeft * Math.sin(angleLeft), rLeft * Math.cos(angleLeft));

  // Sol üst -> Sol alt yay
  shape.absarc(cxLeft, 0, rLeft, Math.PI/2 + angleLeft, Math.PI*1.5 - angleLeft, false);

  // Alt teğet çizgi (Sol alttan Sağ alta)
  shape.lineTo(cxRight + rRight * Math.sin(-angleRight), -rRight * Math.cos(-angleRight));

  // Delik (Hole)
  if (holeConfig) {
    const holePath = new THREE.Path();
    holePath.absarc(holeConfig.x, holeConfig.y, holeConfig.r, 0, Math.PI * 2, true);
    shape.holes.push(holePath);
  }
  
  return shape;
};

export const Scene3D = ({
  text,
  isItalic,
  groupRef,
  isThicknessThick,
  materialColor,
  baseColor,
  baseShape: selectedShape,
  holePosition,
  textOffset,
  autoCenter,
  baseHeight,
  targetWidth
}) => {
  const [textSize, setTextSize] = useState([60, 20, 6]);

  const letterSize = 30.0;         
  const textDepth = isThicknessThick ? 5.0 : 2.5;
  const baseH = baseHeight;        

  // Padding ayarları
  const isLeft = holePosition.includes('left');
  const isRight = holePosition.includes('right');
  
  const pLeft = isLeft ? 24.0 : 10.0;
  const pRight = isRight ? 24.0 : 10.0;
  const pTop = 10.0;
  const pBottom = 10.0;

  let baseW = textSize[0] + pLeft + pRight;
  let baseD = textSize[1] + pTop + pBottom;

  // Damla şeklinde uçlar yuvarlak olduğu için yazının taşmaması adına ekstra genişlik
  if (selectedShape === 'teardrop') {
    baseW += 10.0;
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

  // Damla şeklindeyken deliği her zaman ortalayalım (daha estetik olur)
  if (selectedShape === 'teardrop') {
    holeZ = 0;
  }

  const innerScale = targetWidth ? (targetWidth / baseW) : 1;
  const scaledCenterZ = baseCenterZ * innerScale;
  const scaledBaseW = baseW * innerScale;
  const scaledBaseD = baseD * innerScale;

  // Taban şekli seçimi
  const baseShape = useMemo(() => {
    if (selectedShape === 'teardrop') {
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

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 15, 25]} fov={38} />
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

          {/* DÜZ ANA HARF */}
          <Text3D
            name="TextMain"
            key={`main-${text}-${isItalic}-${isThicknessThick}-${baseHeight}-optimer`}
            font="/fonts/optimer_bold.typeface.json"
            size={letterSize}
            height={textDepth}
            curveSegments={16}
            bevelEnabled={false}
            onUpdate={(self) => {
              if (!self.geometry.userData.morphed) {
                self.geometry.computeBoundingBox();
                let bbox = self.geometry.boundingBox;
                
                self.geometry.translate(
                  -(bbox.max.x + bbox.min.x) / 2, 
                  -(bbox.max.y + bbox.min.y) / 2,                    
                  0 
                );

                if (isItalic) {
                  const positions = self.geometry.attributes.position;
                  const italicRad = THREE.MathUtils.degToRad(12);
                  for(let i = 0; i < positions.count; i++) {
                      const x = positions.getX(i);
                      const y = positions.getY(i);
                      const xShift = y * Math.tan(italicRad);
                      positions.setX(i, x + xShift);
                  }
                }

                self.geometry.rotateX(-Math.PI / 2);
                self.geometry.translate(0, baseH, 0);

                self.geometry.computeVertexNormals();
                self.geometry.computeBoundingBox();
                self.geometry.userData.morphed = true;

                const fbox = self.geometry.boundingBox;
                setTextSize([
                  fbox.max.x - fbox.min.x,
                  fbox.max.z - fbox.min.z, 
                  fbox.max.y - fbox.min.y
                ]);
              }
            }}
          >
            {text || "73"}
            <meshStandardMaterial color={materialColor} roughness={0.4} metalness={0.1} />
          </Text3D>

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