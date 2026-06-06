import React, { useMemo, useState } from 'react';
import { Text3D, PerspectiveCamera, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js';
import { createIconShape } from '../../utils/svgIcons';
import { createContourBaseShape } from '../../utils/contourUtils';
import ClipperLib from 'clipper-lib';

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

// Kalp taban şekli - Three.js resmi kalp formülü (kanıtlanmış bezier eğrileri)
const createHeartBaseShape = (width, depth, holeConfig) => {
  // Önce birim kalp çiz, sonra ölçekle
  const raw = new THREE.Shape();
  
  // Three.js official heart (origin offset: x+5, y+5 based)
  raw.moveTo(5, 5);
  raw.bezierCurveTo(5, 5, 4, 0, 0, 0);
  raw.bezierCurveTo(-6, 0, -6, 7, -6, 7);
  raw.bezierCurveTo(-6, 11, -3, 15.4, 5, 19);
  raw.bezierCurveTo(12, 15.4, 16, 11, 16, 7);
  raw.bezierCurveTo(16, 7, 16, 0, 10, 0);
  raw.bezierCurveTo(7, 0, 5, 5, 5, 5);
  
  // Bu kalbin bounding box'ı: x: -6..16 (w=22), y: 0..19 (h=19)
  // Merkez: x=5, y=9.5
  const rawW = 22;
  const rawH = 19;
  const rawCx = 5;   // merkez x
  const rawCy = 9.5; // merkez y
  
  // Hedef boyut: yazıyı rahatça içine alsın
  const targetSize = Math.max(width, depth) * 0.9;
  const scaleX = targetSize / rawW;
  const scaleY = targetSize / rawH;
  const uniformScale = Math.max(scaleX, scaleY);
  
  // Yeni centered + scaled shape oluştur
  const shape = new THREE.Shape();
  const pts = raw.getPoints(64);
  
  for (let i = 0; i < pts.length; i++) {
    const px = (pts[i].x - rawCx) * uniformScale;
    const py = -(pts[i].y - rawCy) * uniformScale; // Y ters çevir: tepeler yukarı, sivri uç aşağı
    if (i === 0) shape.moveTo(px, py);
    else shape.lineTo(px, py);
  }
  shape.closePath();
  
  // Delik: iki tepe arasındaki çukura (üst orta)
  if (holeConfig) {
    const holePath = new THREE.Path();
    // Çukur noktası: raw (5, 5) -> flipped: (0, +(9.5-5)*scale) = üst orta
    const holeY = (rawCy - 5) * uniformScale;
    holePath.absarc(0, holeY, holeConfig.r, 0, Math.PI * 2, true);
    shape.holes.push(holePath);
  }
  
  return shape;
};

// ClipperOffset ile taban plakasının içe doğru bükülmüş (offset) halini alarak kenarlık şablonu oluşturma
const createBorderShape = (baseShape, borderWidth) => {
  if (!baseShape) return null;

  // 1. Get points of the outer boundary of the base shape
  const outerPoints = baseShape.getPoints(64);
  if (outerPoints.length < 3) return null;
  
  // 2. Convert to Clipper format (scale up to avoid precision issues)
  const scale = 1000;
  const clipperPath = outerPoints.map(p => ({
    X: Math.round(p.x * scale),
    Y: Math.round(p.y * scale)
  }));
  
  // Make sure orientation is clockwise or counter-clockwise as expected by Clipper
  if (!ClipperLib.Clipper.Orientation(clipperPath)) {
    clipperPath.reverse();
  }
  
  // 3. Offset inwards (negative delta)
  const co = new ClipperLib.ClipperOffset();
  co.AddPath(clipperPath, ClipperLib.JoinType.jtRound, ClipperLib.EndType.etClosedPolygon);
  
  const offsetPaths = new ClipperLib.Paths();
  co.Execute(offsetPaths, -borderWidth * scale);
  
  // 4. Create the new shape for the border (outer path - inner path as hole)
  const borderShape = new THREE.Shape();
  
  // The outer path of the border is the same as the baseShape outer path
  outerPoints.forEach((p, idx) => {
    if (idx === 0) borderShape.moveTo(p.x, p.y);
    else borderShape.lineTo(p.x, p.y);
  });
  borderShape.closePath();
  
  // The inner path of the border is the offset path (added as a hole)
  if (offsetPaths.length > 0) {
    let maxArea = -1;
    let mainOffsetPath = null;
    for (let i = 0; i < offsetPaths.length; i++) {
      const area = Math.abs(ClipperLib.Clipper.Area(offsetPaths[i]));
      if (area > maxArea) {
        maxArea = area;
        mainOffsetPath = offsetPaths[i];
      }
    }
    
    if (mainOffsetPath) {
      const innerPath = new THREE.Path();
      mainOffsetPath.forEach((pt, idx) => {
        const px = pt.X / scale;
        const py = pt.Y / scale;
        if (idx === 0) innerPath.moveTo(px, py);
        else innerPath.lineTo(px, py);
      });
      innerPath.closePath();
      borderShape.holes.push(innerPath);
    }
  }
  
  return borderShape;
};

// THREE.Shape veya Shape dizisini typeface.json formatındaki glyph'e dönüştürür
const convertShapeToGlyph = (shapeOrShapes, resolution = 1000) => {
  const shapes = Array.isArray(shapeOrShapes) ? shapeOrShapes : [shapeOrShapes];
  
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  
  shapes.forEach(shape => {
    const points = shape.getPoints(32);
    points.forEach(p => {
      if (p.x < minX) minX = p.x;
      if (p.x > maxX) maxX = p.x;
      if (p.y < minY) minY = p.y;
      if (p.y > maxY) maxY = p.y;
    });
  });
  
  if (minX === Infinity || minY === Infinity) {
    return { ha: 600, o: '' };
  }
  
  const w = maxX - minX;
  const h = maxY - minY;
  if (w === 0 || h === 0) return { ha: 600, o: '' };
  
  const targetH = 700;
  const scale = targetH / h;
  const glyphW = w * scale;
  const ha = Math.round(glyphW + 160); // 80px left/right padding
  const offsetX = 80 - minX * scale;
  const offsetY = -minY * scale; // align bottom to y = 0
  
  const fmt = (x, y) => `${Math.round(x * scale + offsetX)} ${Math.round(y * scale + offsetY)}`;
  
  let pathStr = '';
  
  shapes.forEach(shape => {
    const points = shape.getPoints(32);
    if (points.length > 0) {
      if (pathStr) pathStr += ' ';
      pathStr += `m ${fmt(points[0].x, points[0].y)}`;
      for (let i = 1; i < points.length; i++) {
        pathStr += ` l ${fmt(points[i].x, points[i].y)}`;
      }
      
      const startPt = points[0];
      const endPt = points[points.length - 1];
      if (Math.abs(startPt.x - endPt.x) > 0.01 || Math.abs(startPt.y - endPt.y) > 0.01) {
        pathStr += ` l ${fmt(startPt.x, startPt.y)}`;
      }
    }
    
    if (shape.holes && shape.holes.length > 0) {
      shape.holes.forEach(hole => {
        const holePts = hole.getPoints(32);
        if (holePts.length > 0) {
          pathStr += ` m ${fmt(holePts[0].x, holePts[0].y)}`;
          for (let i = 1; i < holePts.length; i++) {
            pathStr += ` l ${fmt(holePts[i].x, holePts[i].y)}`;
          }
          const hStart = holePts[0];
          const hEnd = holePts[holePts.length - 1];
          if (Math.abs(hStart.x - hEnd.x) > 0.01 || Math.abs(hStart.y - hEnd.y) > 0.01) {
            pathStr += ` l ${fmt(hStart.x, hStart.y)}`;
          }
        }
      });
    }
  });
  
  return { ha, o: pathStr };
};

// SVG şekillerini normalize edip 3D sahneye uyarlar
const normalizeSvgShapes = (shapes, targetSize = 24) => {
  if (!shapes || shapes.length === 0) return [];
  
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  shapes.forEach(shape => {
    const points = shape.getPoints(16);
    points.forEach(p => {
      if (p.x < minX) minX = p.x;
      if (p.x > maxX) maxX = p.x;
      if (p.y < minY) minY = p.y;
      if (p.y > maxY) maxY = p.y;
    });
  });
  
  const w = maxX - minX;
  const h = maxY - minY;
  if (w === 0 || h === 0) return shapes;
  
  const maxDim = Math.max(w, h);
  const scale = targetSize / maxDim;
  const cx = (minX + maxX) / 2;
  const cy = (minY + maxY) / 2;
  
  return shapes.map(shape => {
    const newShape = new THREE.Shape();
    
    const transformPt = (p) => new THREE.Vector2(
      (p.x - cx) * scale,
      -(p.y - cy) * scale // Y-invert for SVG
    );
    
    const outerPts = shape.getPoints(32);
    if (outerPts.length > 0) {
      const first = transformPt(outerPts[0]);
      newShape.moveTo(first.x, first.y);
      for (let i = 1; i < outerPts.length; i++) {
        const pt = transformPt(outerPts[i]);
        newShape.lineTo(pt.x, pt.y);
      }
      newShape.closePath();
    }
    
    if (shape.holes && shape.holes.length > 0) {
      shape.holes.forEach(hole => {
        const holePts = hole.getPoints(32);
        if (holePts.length > 0) {
          const newHole = new THREE.Path();
          const first = transformPt(holePts[0]);
          newHole.moveTo(first.x, first.y);
          for (let i = 1; i < holePts.length; i++) {
            const pt = transformPt(holePts[i]);
            newHole.lineTo(pt.x, pt.y);
          }
          newHole.closePath();
          newShape.holes.push(newHole);
        }
      });
    }
    
    return newShape;
  });
};

export const Scene3D = ({
  text,
  subText,
  phoneText,
  phoneDepth,
  isILoveMode,
  fontFamily,
  iconType,
  customSvgUrl,
  iconPosition,
  isItalic,
  textStyle,
  textDepth,
  engraveDepth,
  groupRef,
  materialColor,
  baseColor,
  baseShape: selectedShape,
  holePosition,
  textScale,
  textOffset,
  autoCenter,
  baseHeight,
  targetWidth,
  hasBorder,
  borderWidth,
  borderDepth,
  iconScale: customIconScale = 100,
  cornerRadius = 5.0,
  isHoleExternal = false,
  holeRadius = 3.5,
  holeThickness = 2.5,
  holeHeight = 3.0,
  subTextScale = 80,
  textAlignment = 'center',
  textSpacing = 0.0,
  subTextSpacing = 0.0,
  borderColor = '#0F172A',
  subTextColor,
  mainSubSpacing = 0.3,
}) => {
  const [textSizeMain, setTextSizeMain] = useState([60, 20, 6]);
  const [textSizeSub, setTextSizeSub] = useState([0, 0, 0]);
  const [textSizePhone, setTextSizePhone] = useState([0, 0, 0]);
  const [fontData, setFontData] = useState(null);
  const [customSvgShape, setCustomSvgShape] = useState(null);

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

  React.useEffect(() => {
    if (!phoneText || phoneText.trim().length === 0) {
      setTextSizePhone([0, 0, 0]);
    }
  }, [phoneText]);

  const mainScaleRatio = (textScale || 100) / 100.0;
  const subScaleRatio = (subTextScale || 80) / 100.0;
  const letterSize = 30.0 * mainScaleRatio;         
  const letterSizeSub = 30.0 * subScaleRatio;
  const phoneLetterSize = 18.0 * mainScaleRatio;
  const baseH = baseHeight;        
  const isPocket = textStyle === 'engraved';
  const currentDepth = isPocket ? engraveDepth : textDepth;
  const startY = isPocket ? (baseHeight - engraveDepth) : baseHeight;

  // Metalik renk algılama: bronz, altın, gümüş
  const METALLIC_COLORS = ['#CD7F32','#B8730A','#8B5E3C','#FFD700','#FFC200','#DAA520','#C5A028','#C0C0C0','#A8A9AD','#8E9299'];
  const getMatProps = (color) => {
    const isMetallic = METALLIC_COLORS.includes((color || '').toUpperCase()) ||
      METALLIC_COLORS.includes(color);
    return isMetallic
      ? { roughness: 0.25, metalness: 0.85 }
      : { roughness: 0.4, metalness: 0.1 };
  };
  const mainMatProps = getMatProps(materialColor);
  const subMatProps  = getMatProps(subTextColor || materialColor);
  const effectiveSubColor = subTextColor || materialColor;

  const hasSubText = subText && subText.trim().length > 0;
  const hasPhoneText = phoneText && phoneText.trim().length > 0;
  
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
    if (fontFamily === 'jakarta') return "/fonts/Plus_Jakarta_Sans_Bold.json";
    if (fontFamily === 'orbitron') return "/fonts/orbitron_bold.typeface.json";
    return "/fonts/optimer_bold.typeface.json";
  }, [fontFamily]);

  // Fetch and inject custom glyphs into the JSON font data
  React.useEffect(() => {
    fetch(fontPath)
      .then(res => res.json())
      .then(data => {
        if (data && data.glyphs) {
          // Stilize-E (三): Sağa yatık U (⊏) + ortaya aynı boyda tire
          // Tek konturlu tarak path: sol gövde + 3 EŞİT UZUNLUKTA yatay çubuk
          // Font grid: ha=720, y: 0(baseline) .. 720(capHeight)
          data.glyphs['三'] = {
            ha: 720,
            o: 'm 30 0 l 700 0 l 700 120 l 130 120 l 130 300 l 700 300 l 700 420 l 130 420 l 130 600 l 700 600 l 700 720 l 30 720 z'
          };
          // Stilize-X (※): >.< — sol > + orta nokta + sağ <
          // Her ok: 6 noktalı chevron polygon, nokta: 8 noktalı oktagon
          // Font grid: ha=700, orta y=360
          data.glyphs['※'] = {
            ha: 700,
            // Sol >: kollar x=60'ta, sivri uç x=300 
            // Sağ <: kollar x=640'ta, sivri uç x=400
            // Nokta: merkez x=350, y=360, r≥44
            o: [
              'm 300 360 l 60 620 l 60 500 l 220 360 l 60 220 l 60 100 z',
              'm 400 360 l 640 620 l 640 500 l 480 360 l 640 220 l 640 100 z',
              'm 350 404 l 381 393 l 394 360 l 381 327 l 350 316 l 319 327 l 306 360 l 319 393 z'
            ].join(' ')
          };

          const resolution = data.resolution || 1000;

          // clover (🍀)
          const cloverShape = createIconShape('clover', 100);
          data.glyphs['🍀'] = convertShapeToGlyph(cloverShape, resolution);

          // crescent (🌙)
          const crescentShape = createIconShape('star_crescent', 100);
          data.glyphs['🌙'] = convertShapeToGlyph(crescentShape, resolution);

          // heart (♥, ❤, ❤️)
          const heartShape = createIconShape('heart', 100);
          const heartGlyph = convertShapeToGlyph(heartShape, resolution);
          data.glyphs['♥'] = heartGlyph;
          data.glyphs['❤'] = heartGlyph;
          data.glyphs['❤️'] = heartGlyph;

          // skull (💀)
          const skullShape = createIconShape('skull', 100);
          data.glyphs['💀'] = convertShapeToGlyph(skullShape, resolution);

          // rook (♖, ♜)
          const rookShape = createIconShape('rook', 100);
          const rookGlyph = convertShapeToGlyph(rookShape, resolution);
          data.glyphs['♖'] = rookGlyph;
          data.glyphs['♜'] = rookGlyph;

          // table tennis (🏓)
          const pingPongShape = createIconShape('racket_table', 100);
          data.glyphs['🏓'] = convertShapeToGlyph(pingPongShape, resolution);

          // tennis (🎾)
          const tennisShape = createIconShape('racket_tennis', 100);
          data.glyphs['🎾'] = convertShapeToGlyph(tennisShape, resolution);

          // star (⭐, ★, ☆)
          const starShape = createIconShape('star', 100);
          const starGlyph = convertShapeToGlyph(starShape, resolution);
          data.glyphs['⭐'] = starGlyph;
          data.glyphs['★'] = starGlyph;
          data.glyphs['☆'] = starGlyph;
        }
        setFontData(data);
      })
      .catch(err => console.error("Error loading font data:", err));
  }, [fontPath]);

  // Load and normalize custom SVG shape
  React.useEffect(() => {
    if (iconType === 'custom' && customSvgUrl) {
      try {
        const loader = new SVGLoader();
        loader.load(
          customSvgUrl,
          (data) => {
            const paths = data.paths;
            const shapes = [];
            for (let i = 0; i < paths.length; i++) {
              const path = paths[i];
              const shapesForPath = SVGLoader.createShapes(path);
              shapes.push(...shapesForPath);
            }
            if (shapes.length > 0) {
              const normalized = normalizeSvgShapes(shapes, letterSize);
              setCustomSvgShape(normalized);
            } else {
              setCustomSvgShape(null);
            }
          },
          null,
          (err) => console.error("Error loading SVG:", err)
        );
      } catch (err) {
        console.error("SVGLoader error:", err);
      }
    } else {
      setCustomSvgShape(null);
    }
  }, [iconType, customSvgUrl, letterSize]);

  const loadedFont = useMemo(() => {
    if (!fontData) return null;
    const loader = new FontLoader();
    return loader.parse(fontData);
  }, [fontData]);

  // Programatik veya custom icon shape oluştur
  const iconScale = 0.65 * (customIconScale / 100.0); // İkon yazıdan biraz küçük
  const iconShape = useMemo(() => {
    if (iconType === 'none') return null;
    if (iconType === 'custom') return customSvgShape;
    return createIconShape(iconType, letterSize);
  }, [iconType, letterSize, customSvgShape]);

  const hasIcon = iconShape !== null;
  const iconSpacing = 2.0;
  const iconRealSize = hasIcon ? (letterSize * iconScale) : 0;

  const iLoveShape = useMemo(() => isILoveMode ? createIconShape('i_love', letterSize) : null, [isILoveMode, letterSize]);

  // VERTICAL LAYOUT (Z-axis in 3D)
  let currentZ = 0;
  
  let iconZ = 0;
  let iLoveZ = 0;
  let textMainZ = 0;
  let textSubZ = 0;

  if (hasIcon && iconPosition === 'top') {
    iconZ = currentZ + iconRealSize / 2;
    currentZ += iconRealSize + iconSpacing;
  }

  if (isILoveMode) {
    iLoveZ = currentZ + letterSize / 2;
    currentZ += letterSize + iconSpacing;
  }

  textMainZ = currentZ + letterSize / 2;
  currentZ += letterSize;

  if (hasSubText) {
    const gap = ((letterSize + letterSizeSub) / 2) * mainSubSpacing;
    currentZ += gap;
    textSubZ = currentZ + letterSizeSub / 2;
    currentZ += letterSizeSub;
  }

  const totalContentDepth = currentZ;
  const zOffset = -totalContentDepth / 2;

  if (hasIcon && (iconPosition === 'left' || iconPosition === 'right')) {
    iconZ = totalContentDepth / 2;
  }

  iconZ += zOffset;
  iLoveZ += zOffset;
  textMainZ += zOffset;
  textSubZ += zOffset;

  // HORIZONTAL LAYOUT (X-axis)
  const isLeft = holePosition.includes('left');
  const isRight = holePosition.includes('right');
  const pLeft = isLeft ? 24.0 : 10.0;
  const pRight = isRight ? 24.0 : 10.0;
  const pTop = 12.0;
  const pBottom = 12.0;

  const maxTextWidth = Math.max(textSizeMain[0], textSizeSub[0]);
  const iLoveWidth = isILoveMode ? (letterSize * 0.85) : 0;
  
  const textBlockWidth = Math.max(maxTextWidth, iLoveWidth);
  let actualContentW = textBlockWidth;
  
  if (hasIcon) {
    if (iconPosition === 'top') {
      actualContentW = Math.max(actualContentW, iconRealSize);
    } else {
      actualContentW = textBlockWidth + iconSpacing + iconRealSize;
    }
  }

  let baseW = actualContentW + pLeft + pRight;
  let baseD = totalContentDepth + pTop + pBottom;

  if (selectedShape === 'teardrop') {
    baseW += (10.0 * mainScaleRatio);
  }

  // Calculate local centers
  const contentCenter = (pLeft - pRight) / 2;
  const contentLeft = contentCenter - actualContentW / 2;
  const contentRight = contentCenter + actualContentW / 2;

  let textX = contentCenter;
  let iconX = contentCenter;
  let iLoveX = contentCenter;

  if (hasIcon) {
    if (iconPosition === 'left') {
      iconX = contentLeft + iconRealSize / 2;
      textX = contentRight - textBlockWidth / 2;
      iLoveX = textX;
    } else if (iconPosition === 'right') {
      textX = contentLeft + textBlockWidth / 2;
      iLoveX = textX;
      iconX = contentRight - iconRealSize / 2;
    }
  } else {
    // If no icon, still need to align I Love with text
    iLoveX = textX;
  }

  // Metinlerin hizalanması (textAlignment: left, right, center)
  let textBlockStart = contentLeft;
  if (hasIcon && iconPosition === 'left') {
    textBlockStart = contentLeft + iconRealSize + iconSpacing;
  }

  let textX_main = textX;
  let textX_sub = textX;

  if (textAlignment === 'left') {
    textX_main = textBlockStart + textSizeMain[0] / 2;
    textX_sub = textBlockStart + textSizeSub[0] / 2;
  } else if (textAlignment === 'right') {
    const textBlockEnd = textBlockStart + textBlockWidth;
    textX_main = textBlockEnd - textSizeMain[0] / 2;
    textX_sub = textBlockEnd - textSizeSub[0] / 2;
  } else {
    // center
    textX_main = textBlockStart + textBlockWidth / 2;
    textX_sub = textBlockStart + textBlockWidth / 2;
  }

  const baseCenterX = 0; 
  const baseCenterZ = 0; 
  const zCenterOffset = autoCenter ? 0 : textOffset;

  const holeR = holeRadius; 
  let holeX = 0;
  let holeZ = 0;

  if (selectedShape === 'contour') {
    // Tight bounds for contour to avoid long bridges
    if (isLeft) holeX = contentLeft - holeR - 1.0;
    else if (isRight) holeX = contentRight + holeR + 1.0;

    if (holePosition.includes('top')) holeZ = -totalContentDepth/2 - 1.0;
    else if (holePosition.includes('bottom')) holeZ = totalContentDepth/2 + 1.0;
    else holeZ = 0;
  } else {
    // Standard bounds
    if (isLeft) holeX = -baseW/2 + holeR + 4.5;
    else if (isRight) holeX = baseW/2 - holeR - 4.5;

    if (holePosition.includes('top')) holeZ = -baseD/2 + holeR + 4.5;
    else if (holePosition.includes('bottom')) holeZ = baseD/2 - holeR - 4.5;
    else holeZ = 0;
  }

  if (selectedShape === 'teardrop') {
    holeZ = 0;
  }

  const holeConfig = holePosition === 'none' ? null : { x: holeX, y: holeZ, r: holeR };

  const safeCornerRadius = Math.min(cornerRadius, baseW / 2, baseD / 2);

  // Dış halka parametreleri (isHoleExternal = true için)
  const outerR = holeR + holeThickness; // Halka kalınlığı dinamik
  const overlap = 2.0;       // Taban plakası ile çakışma payı
  let loopX = 0;
  let loopZ = 0;

  const showExternalHole = isHoleExternal && holePosition !== 'none' && (selectedShape === 'rectangle' || selectedShape === 'contour');

  if (showExternalHole) {
    if (isLeft) {
      loopX = -baseW / 2 - outerR + overlap;
    } else if (isRight) {
      loopX = baseW / 2 + outerR - overlap;
    }

    const straightHalf = Math.max(0, baseD / 2 - safeCornerRadius);
    if (holePosition.includes('top')) {
      loopZ = -straightHalf;
    } else if (holePosition.includes('bottom')) {
      loopZ = straightHalf;
    } else {
      loopZ = 0;
    }
  }

  const loopShape = useMemo(() => {
    if (!showExternalHole) return null;
    
    const shape = new THREE.Shape();
    shape.absarc(0, 0, outerR, 0, Math.PI * 2, false);
    const hole = new THREE.Path();
    hole.absarc(0, 0, holeR, 0, Math.PI * 2, true);
    shape.holes.push(hole);
    return shape;
  }, [showExternalHole, outerR, holeR]);

  const effectiveHoleConfig = showExternalHole ? null : holeConfig;

  const innerScale = targetWidth ? (targetWidth / baseW) : 1;
  const scaledCenterZ = baseCenterZ * innerScale;
  const scaledBaseW = baseW * innerScale;
  const scaledBaseD = baseD * innerScale;

  // Taban şekli seçimi
  const baseShape = useMemo(() => {
    if (selectedShape === 'contour' && loadedFont) {
      return createContourBaseShape({
        font: loadedFont,
        text,
        subText,
        hasSubText,
        letterSize,
        letterSizeSub,
        isItalic,
        iconShape,
        iconX: iconX,
        iconScale,
        textShiftX: textX_main,
        subTextShiftX: textX_sub,
        mainYOffset: -textMainZ,
        subYOffset: -textSubZ,
        iconYOffset: -iconZ,
        extraShapes: isILoveMode && iLoveShape ? [
          { shape: iLoveShape, x: iLoveX, y: -iLoveZ, scale: 1.0 }
        ] : [],
        holeConfig: effectiveHoleConfig,
        offsetRadius: 5.0, // 5mm contour padding
        letterSpacing: textSpacing,
        subTextSpacing: subTextSpacing
      });
    } else if (selectedShape === 'heart') {
      return createHeartBaseShape(baseW, baseD, effectiveHoleConfig);
    } else if (selectedShape === 'teardrop') {
      return createTeardropShape(baseW, baseD, isLeft, effectiveHoleConfig);
    } else {
      return createRoundedRectShape(
        baseW, 
        baseD, 
        safeCornerRadius, 
        effectiveHoleConfig
      );
    }
  }, [selectedShape, baseW, baseD, isLeft, effectiveHoleConfig, safeCornerRadius, letterSizeSub, textX_main, textX_sub, textSpacing, subTextSpacing]);

  // Kenarlık (Border) şekli oluşturma
  const borderShape = useMemo(() => {
    if (!hasBorder || !baseShape) return null;
    return createBorderShape(baseShape, borderWidth);
  }, [baseShape, hasBorder, borderWidth]);



  const processTextGeometry = (self, setSizeFunc, xOffset, yOffset) => {
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
      
      // Z ekseninde yerleşim
      self.geometry.translate(xOffset, startY, yOffset);

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

  const processPhoneGeometry = (self, setSizeFunc) => {
    if (!self.geometry.userData.morphed) {
      self.geometry.computeBoundingBox();
      let bbox = self.geometry.boundingBox;
      
      if (!bbox || bbox.min.x === Infinity || isNaN(bbox.min.x)) return;
      
      self.geometry.translate(
        -(bbox.max.x + bbox.min.x) / 2, 
        -(bbox.max.y + bbox.min.y) / 2,                    
        0 
      );
      
      // Normal yazilar gibi yukari (Y+) extrude olmasi icin X ekseni etrafinda -90 derece donder
      self.geometry.rotateX(-Math.PI / 2);
      
      // Y=0 seviyesinde taban merkezine yerleştir
      self.geometry.translate(baseCenterX, 0, baseCenterZ);

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
          {fontData && text && text.trim().length > 0 && (
            <Text3D
              name="TextMain"
              key={`main-${text}-${currentDepth}-${textStyle}-${baseHeight}-${textScale}-${subTextScale}-${textAlignment}-${textSpacing}-${hasSubText}-${isItalic}-${fontFamily}-${hasIcon}`}
              font={fontData}
              size={letterSize}
              height={currentDepth} 
              letterSpacing={textSpacing}
              curveSegments={16}
              bevelEnabled={false}
              onUpdate={(self) => processTextGeometry(self, setTextSizeMain, textX_main, textMainZ)}
            >
              {text}
              <meshStandardMaterial color={materialColor} roughness={mainMatProps.roughness} metalness={mainMatProps.metalness} />
            </Text3D>
          )}

          {/* ALT METİN (Opsiyonel) */}
          {fontData && hasSubText && (
            <Text3D
              name="TextSub"
              key={`sub-${subText}-${currentDepth}-${textStyle}-${baseHeight}-${textScale}-${subTextScale}-${textAlignment}-${subTextSpacing}-${isItalic}-${fontFamily}-${hasIcon}`}
              font={fontData}
              size={letterSizeSub}
              height={currentDepth} 
              letterSpacing={subTextSpacing}
              curveSegments={16}
              bevelEnabled={false}
              onUpdate={(self) => processTextGeometry(self, setTextSizeSub, textX_sub, textSubZ)}
            >
              {subText}
              <meshStandardMaterial color={effectiveSubColor} roughness={subMatProps.roughness} metalness={subMatProps.metalness} />
            </Text3D>
          )}

          {/* ARKA YÜZ METNİ (TELEFON VB.) */}
          {fontData && hasPhoneText && phoneDepth > 0 && (
            <group scale={[-1, 1, 1]}> {/* X ekseninde aynala ki alttan bakinca duz okunsun */}
              <Text3D
                name="TextPhone"
                key={`phone-${phoneText}-${phoneDepth}-${mainScaleRatio}-${fontFamily}`}
                font={fontData}
                size={phoneLetterSize}
                height={phoneDepth} // Kullanicinin sectigi derinlik kadar yukari (ice) dogru
                curveSegments={16}
                bevelEnabled={false}
                onUpdate={(self) => processPhoneGeometry(self, setTextSizePhone)}
              >
                {phoneText}
                <meshStandardMaterial color={materialColor} roughness={mainMatProps.roughness} metalness={mainMatProps.metalness} />
              </Text3D>
            </group>
          )}

          {/* I LOVE TITLE (Extra) */}
          {isILoveMode && iLoveShape && (
            <group 
              key={`ilove-${currentDepth}-${textStyle}-${baseHeight}-${mainScaleRatio}-${isItalic}-${letterSize}`}
              name="ILoveGroup"
              position={[iLoveX, startY, iLoveZ]}
              rotation={[-Math.PI / 2, 0, 0]}
              scale={[1, 1, 1]}
            >
              {iLoveShape.map((shape, idx) => (
                <mesh key={idx} name={`ILoveIcon_${idx}`}>
                  <extrudeGeometry args={[shape, { depth: currentDepth, bevelEnabled: false }]} />
                  <meshStandardMaterial color={idx === 1 ? '#EF4444' : materialColor} roughness={0.4} metalness={0.1} />
                </mesh>
              ))}
            </group>
          )}

          {/* SİMGE (ICON) */}
          {hasIcon && (
            Array.isArray(iconShape) ? (
              <group
                key={`icon-${iconType}-${currentDepth}-${textStyle}-${baseHeight}-${mainScaleRatio}-${isItalic}-${iconPosition}-${letterSize}`}
                name="TextIconGroup"
                position={[iconX, startY, iconZ]}
                rotation={[-Math.PI / 2, 0, 0]}
                scale={[iconScale, iconScale, 1]}
              >
                {iconShape.map((shape, idx) => (
                  <mesh key={idx} name={`TextIcon_${idx}`}>
                    <extrudeGeometry args={[shape, { depth: currentDepth, bevelEnabled: false }]} />
                    <meshStandardMaterial color={materialColor} roughness={mainMatProps.roughness} metalness={mainMatProps.metalness} />
                  </mesh>
                ))}
              </group>
            ) : (
              <mesh 
                key={`icon-${iconType}-${currentDepth}-${textStyle}-${baseHeight}-${mainScaleRatio}-${isItalic}-${iconPosition}-${letterSize}`}
                name="TextIcon"
                position={[iconX, startY, iconZ]}
                rotation={[-Math.PI / 2, 0, 0]}
                scale={[iconScale, iconScale, 1]}
              >
                <extrudeGeometry args={[iconShape, { depth: currentDepth, bevelEnabled: false }]} />
                <meshStandardMaterial color={materialColor} roughness={mainMatProps.roughness} metalness={mainMatProps.metalness} />
              </mesh>
            )
          )}

          {/* TABAN PLAKASI */}
          <mesh 
            key={`base-${selectedShape}-${baseW}-${baseD}-${baseH}-${effectiveHoleConfig ? 'hole' : 'nohole'}-${safeCornerRadius}-${letterSizeSub}-${textX_main}-${textX_sub}`}
            name="BasePlate" 
            position={[baseCenterX, 0, baseCenterZ]} 
            rotation={[-Math.PI / 2, 0, 0]}
            receiveShadow
          >
            <extrudeGeometry args={[baseShape, { depth: baseH, bevelEnabled: false }]} />
            <meshStandardMaterial color={baseColor || '#334155'} roughness={0.8} />
          </mesh>

          {/* DIŞ DELİK HALKASI (EXTERNAL HOLE LOOP) */}
          {showExternalHole && loopShape && (
            <mesh 
              key={`loop-${loopX}-${loopZ}-${outerR}-${holeR}-${holeHeight}`}
              name="HoleLoop" 
              position={[loopX, 0, loopZ]} 
              rotation={[-Math.PI / 2, 0, 0]}
              receiveShadow
              castShadow
            >
              <extrudeGeometry args={[loopShape, { depth: holeHeight, bevelEnabled: false }]} />
              <meshStandardMaterial color={baseColor || '#334155'} roughness={0.8} />
            </mesh>
          )}

          {/* KENARLIK (BORDER) */}
          {hasBorder && borderShape && (
            <mesh 
              key={`border-${selectedShape}-${baseW}-${baseD}-${baseH}-${borderWidth}-${borderDepth}`}
              name="Border" 
              position={[baseCenterX, 0, baseCenterZ]} 
              rotation={[-Math.PI / 2, 0, 0]}
              receiveShadow
            >
              <extrudeGeometry args={[borderShape, { depth: baseH + borderDepth, bevelEnabled: false }]} />
              <meshStandardMaterial color={borderColor || baseColor || '#334155'} roughness={0.8} />
            </mesh>
          )}

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