import * as THREE from 'three';
import ClipperLib from 'clipper-lib';

/**
 * Gets scaled and transformed 2D points from text using a loaded font.
 */
function getTextPoints(font, text, size, isItalic, shiftX, shiftY) {
  if (!text || text.trim().length === 0) return [];
  
  const shapes = font.generateShapes(text, size);
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
  isItalic,
  iconShape,
  iconX,
  iconScale,
  textShiftX,
  mainYOffset,
  subYOffset,
  holeConfig,
  offsetRadius = 5.0
}) {
  const co = new ClipperLib.ClipperOffset();
  const c = new ClipperLib.Clipper();
  const scale = 1000;

  // Local center is BaseCenter. 
  // Text 3D pos: X = baseCenterX + textShiftX, Z = -mainYOffset
  // Relative to base: X = textShiftX, Z = -mainYOffset.
  // 2D Y = -3D Z => 2D Y = mainYOffset
  
  // 1. Main Text
  const mainTextPts = getTextPoints(font, text, letterSize, isItalic, textShiftX, mainYOffset);
  mainTextPts.forEach(pts => co.AddPath(pts, ClipperLib.JoinType.jtRound, ClipperLib.EndType.etClosedPolygon));

  // 2. Sub Text
  if (hasSubText) {
    const subTextPts = getTextPoints(font, subText, letterSize, isItalic, textShiftX, subYOffset);
    subTextPts.forEach(pts => co.AddPath(pts, ClipperLib.JoinType.jtRound, ClipperLib.EndType.etClosedPolygon));
  }

  // 3. Icon
  if (iconShape) {
    const iconPts = iconShape.getPoints(16);
    const tIconPts = iconPts.map(p => {
      const px = (p.x * iconScale) + iconX;
      const py = (p.y * iconScale); 
      return { X: Math.round(px * scale), Y: Math.round(py * scale) };
    });
    co.AddPath(tIconPts, ClipperLib.JoinType.jtRound, ClipperLib.EndType.etClosedPolygon);
  }

  // 4. Bridges (Spines) to connect everything so they form a single solid body
  const textCenter = { X: Math.round(textShiftX * scale), Y: 0 };
  let closestToHole = textCenter;
  
  if (iconShape) {
    const iconCenter = { X: Math.round(iconX * scale), Y: 0 };
    // Bridge from text to icon
    co.AddPath([textCenter, iconCenter], ClipperLib.JoinType.jtRound, ClipperLib.EndType.etOpenRound);

    // If there is a hole, find if it's closer to the icon or the text
    if (holeConfig) {
      if (Math.abs(holeConfig.x - iconX) < Math.abs(holeConfig.x - textShiftX)) {
        closestToHole = iconCenter;
      }
    }
  }

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
