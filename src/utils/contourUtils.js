import * as THREE from 'three';
import ClipperLib from 'clipper-lib';

/**
 * Gets scaled and transformed 2D points from text using a loaded font.
 */
function getTextPoints(font, text, size, isItalic, shiftX, shiftY, letterSpacing = 0) {
  if (!text || text.trim().length === 0) return [];
  
  const shapes = font.generateShapes(text, size, { letterSpacing });
  if (!shapes || shapes.length === 0) return [];

  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  const allPts = [];
  
  shapes.forEach(shape => {
    const pts = shape.getPoints(16);
    pts.forEach(p => {
      if (p.x < minX) minX = p.x;
      if (p.x > maxX) maxX = p.x;
      if (p.y < minY) minY = p.y;
      if (p.y > maxY) maxY = p.y;
    });
    allPts.push(pts);
  });

  const cx = (maxX + minX) / 2;
  const cy = (maxY + minY) / 2;
  
  const angle = Math.tan(THREE.MathUtils.degToRad(12));

  const transformedShapesPts = [];
  allPts.forEach(pts => {
    const tPts = pts.map(p => {
      let px = p.x - cx;
      let py = p.y - cy;
      
      if (isItalic) {
        px += py * angle;
      }
      
      px += shiftX;
      py += shiftY;
      
      return { X: Math.round(px * 1000), Y: Math.round(py * 1000) };
    });
    transformedShapesPts.push(tPts);
  });

  return transformedShapesPts;
}

/**
 * Creates a contour base shape
 */
export function createContourBaseShape({
  font,
  text,
  subText,
  hasSubText,
  letterSize,
  letterSizeSub, // Alt metin boyutu
  isItalic,
  iconShape,
  iconX,
  iconScale,
  textShiftX,
  subTextShiftX, // Alt metin yatay konumu (hizalama)
  mainYOffset,
  subYOffset,
  iconYOffset, // Yeni parametre: İkon dikey konumu
  extraShapes = [], // [{ shape, x, y, scale }]
  holeConfig,
  offsetRadius = 5.0,
  letterSpacing = 0,
  subTextSpacing = 0
}) {
  const co = new ClipperLib.ClipperOffset();
  const c = new ClipperLib.Clipper();
  const scale = 1000;

  // Local center is BaseCenter. 
  // Text 3D pos: X = baseCenterX + textShiftX, Z = -mainYOffset
  // Relative to base: X = textShiftX, Z = -mainYOffset.
  // 2D Y = -3D Z => 2D Y = mainYOffset
  
  // 1. Main Text
  const mainTextPts = getTextPoints(font, text, letterSize, isItalic, textShiftX, mainYOffset, letterSpacing);
  mainTextPts.forEach(pts => {
    if (ClipperLib.Clipper.Orientation(pts)) pts.reverse();
    co.AddPath(pts, ClipperLib.JoinType.jtRound, ClipperLib.EndType.etClosedPolygon);
  });

  // 2. Sub Text
  if (hasSubText) {
    const activeSubSize = letterSizeSub !== undefined ? letterSizeSub : letterSize;
    const activeSubShiftX = subTextShiftX !== undefined ? subTextShiftX : textShiftX;
    const activeSubSpacing = subTextSpacing !== undefined ? subTextSpacing : letterSpacing;
    const subTextPts = getTextPoints(font, subText, activeSubSize, isItalic, activeSubShiftX, subYOffset, activeSubSpacing);
    subTextPts.forEach(pts => {
      if (ClipperLib.Clipper.Orientation(pts)) pts.reverse();
      co.AddPath(pts, ClipperLib.JoinType.jtRound, ClipperLib.EndType.etClosedPolygon);
    });
  }

  const allIconCenters = [];

  const processShape = (s, x, y, scaleVal) => {
    const pts = s.getPoints(16);
    const tPts = pts.map(p => {
      const px = (p.x * scaleVal) + x;
      const py = (p.y * scaleVal) + y;
      return { X: Math.round(px * scale), Y: Math.round(py * scale) };
    });
    if (ClipperLib.Clipper.Orientation(tPts)) tPts.reverse();
    co.AddPath(tPts, ClipperLib.JoinType.jtRound, ClipperLib.EndType.etClosedPolygon);
  };

  // 3. Icon
  if (iconShape) {
    const shapes = Array.isArray(iconShape) ? iconShape : [iconShape];
    shapes.forEach(shape => processShape(shape, iconX, iconYOffset, iconScale));
    allIconCenters.push({ X: Math.round(iconX * scale), Y: Math.round(iconYOffset * scale) });
  }

  // 3.5 Extra Shapes (I Love Title etc.)
  extraShapes.forEach(es => {
    const shapes = Array.isArray(es.shape) ? es.shape : [es.shape];
    shapes.forEach(shape => processShape(shape, es.x, es.y, es.scale));
    allIconCenters.push({ X: Math.round(es.x * scale), Y: Math.round(es.y * scale) });
  });

  // 4. Bridges (Spines) to connect everything so they form a single solid body
  const textCenter = { X: Math.round(textShiftX * scale), Y: Math.round(mainYOffset * scale) };
  let closestToHole = textCenter;
  
  allIconCenters.forEach(ic => {
    // Bridge from text to icon
    co.AddPath([textCenter, ic], ClipperLib.JoinType.jtRound, ClipperLib.EndType.etOpenRound);

    // If there is a hole, find if it's closer to the icon or the text
    if (holeConfig) {
      if (Math.abs(holeConfig.x - (ic.X/scale)) < Math.abs(holeConfig.x - textShiftX)) {
        closestToHole = ic;
      }
    }
  });

  if (holeConfig) {
    const holeCenter = { X: Math.round(holeConfig.x * scale), Y: Math.round(holeConfig.y * scale) };
    // Bridge from hole to closest element
    co.AddPath([holeCenter, closestToHole], ClipperLib.JoinType.jtRound, ClipperLib.EndType.etOpenRound);
  }

  // Execute Offset
  const inflatedPaths = new ClipperLib.Paths();
  co.Execute(inflatedPaths, offsetRadius * scale);

  // Union with Hole Extension Pad
  if (holeConfig) {
    const padR = holeConfig.r + 4.0;
    const holePadPts = [];
    const segments = 32;
    for (let i = 0; i < segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      const hx = holeConfig.x + Math.cos(angle) * padR;
      const hy = holeConfig.y + Math.sin(angle) * padR; // holeConfig is in local coords
      holePadPts.push({ X: Math.round(hx * scale), Y: Math.round(hy * scale) });
    }
    
    c.AddPaths(inflatedPaths, ClipperLib.PolyType.ptSubject, true);
    c.AddPath(holePadPts, ClipperLib.PolyType.ptClip, true);
    
    const unionedPaths = new ClipperLib.Paths();
    c.Execute(ClipperLib.ClipType.ctUnion, unionedPaths, ClipperLib.PolyFillType.pftNonZero, ClipperLib.PolyFillType.pftNonZero);
    
    if (unionedPaths.length > 0) {
      inflatedPaths.length = 0;
      unionedPaths.forEach(p => inflatedPaths.push(p));
    }
  }

  // Find the largest area path (outer boundary)
  let maxArea = -1;
  let mainPath = null;
  
  for (let i = 0; i < inflatedPaths.length; i++) {
    const area = Math.abs(ClipperLib.Clipper.Area(inflatedPaths[i]));
    if (area > maxArea) {
      maxArea = area;
      mainPath = inflatedPaths[i];
    }
  }

  const finalShape = new THREE.Shape();
  if (!mainPath) {
    finalShape.absarc(0, 0, 10, 0, Math.PI * 2, false);
    return finalShape;
  }

  mainPath.forEach((pt, i) => {
    const px = pt.X / scale;
    const py = pt.Y / scale;
    if (i === 0) finalShape.moveTo(px, py);
    else finalShape.lineTo(px, py);
  });
  finalShape.closePath();

  // Add the hole
  if (holeConfig) {
    const holePath = new THREE.Path();
    holePath.absarc(holeConfig.x, holeConfig.y, holeConfig.r, 0, Math.PI * 2, true);
    finalShape.holes.push(holePath);
  }

  return finalShape;
}
