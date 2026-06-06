// src/utils/svgIcons.js
// Programmatik THREE.Shape tanımları - SVGLoader'a ihtiyaç duymaz!
import * as THREE from 'three';

/**
 * Yonca (Four-Leaf Clover) şekli oluşturur
 * @param {number} size - Toplam boyut
 * @returns {THREE.Shape}
 */
export function createCloverShape(size = 24) {
  const shape = new THREE.Shape();
  const r = size * 0.22; // Yaprak yarıçapı
  const offset = size * 0.15; // Merkeze olan mesafe

  // 4 yaprak (üst, sağ, alt, sol) - her biri tam daire
  const centers = [
    { x: 0, y: offset },    // Üst
    { x: offset, y: 0 },    // Sağ
    { x: 0, y: -offset },   // Alt
    { x: -offset, y: 0 },   // Sol
  ];

  // İlk yaprak ile başla
  shape.absarc(centers[0].x, centers[0].y, r, 0, Math.PI * 2, false);

  // Diğer yapraklar hole değil, ana shape'e birleştirilmiş gibi olmalı
  // THREE.Shape tek bir path olduğu için, 4 ayrı shape döndürelim
  // ve hepsini merge edelim. 
  // Ancak daha basit bir yaklaşım: kalp benzeri bezier eğrileriyle tek shape çizelim
  
  // Daha iyi yaklaşım: 4 yapraklı yonca tek path olarak
  const s = size / 2;
  const leaf = s * 0.45;
  
  const shape2 = new THREE.Shape();
  // Merkez noktadan başla
  shape2.moveTo(0, 0);
  
  // Üst yaprak
  shape2.bezierCurveTo(-leaf, leaf * 0.3, -leaf, leaf * 1.2, 0, leaf * 1.4);
  shape2.bezierCurveTo(leaf, leaf * 1.2, leaf, leaf * 0.3, 0, 0);
  
  // Sağ yaprak
  shape2.bezierCurveTo(leaf * 0.3, leaf, leaf * 1.2, leaf, leaf * 1.4, 0);
  shape2.bezierCurveTo(leaf * 1.2, -leaf, leaf * 0.3, -leaf, 0, 0);
  
  // Alt yaprak
  shape2.bezierCurveTo(leaf, -leaf * 0.3, leaf, -leaf * 1.2, 0, -leaf * 1.4);
  shape2.bezierCurveTo(-leaf, -leaf * 1.2, -leaf, -leaf * 0.3, 0, 0);
  
  // Sol yaprak
  shape2.bezierCurveTo(-leaf * 0.3, -leaf, -leaf * 1.2, -leaf, -leaf * 1.4, 0);
  shape2.bezierCurveTo(-leaf * 1.2, leaf, -leaf * 0.3, leaf, 0, 0);

  return shape2;
}

/**
 * Kalp (Heart) şekli oluşturur
 * @param {number} size - Toplam boyut
 * @returns {THREE.Shape}
 */
export function createHeartShape(size = 24) {
  const x = 0, y = 0;
  const s = size / 2;
  
  const shape = new THREE.Shape();
  // Three.js koordinat sistemine göre (Y yukarı pozitif) düzeltme
  shape.moveTo(x, y + s * 0.5);
  
  // Sol üst kavis
  shape.bezierCurveTo(x, y + s * 0.9, x - s, y + s * 0.9, x - s, y + s * 0.3);
  shape.bezierCurveTo(x - s, y - s * 0.3, x, y - s * 0.5, x, y - s);
  
  // Sağ üst kavis (simetrik)
  shape.bezierCurveTo(x, y - s * 0.5, x + s, y - s * 0.3, x + s, y + s * 0.3);
  shape.bezierCurveTo(x + s, y + s * 0.9, x, y + s * 0.9, x, y + s * 0.5);

  return shape;
}

/**
 * Ay-Yıldız şekli oluşturur
 * @param {number} size - Toplam boyut
 * @returns {THREE.Shape}
 */
export function createStarCrescentShape(size = 24) {
  const s = size / 2;
  const shapes = [];

  // 1. Dış hilal (ay) - büyük daire
  const crescent = new THREE.Shape();
  const moonR = s * 0.85;
  crescent.absarc(-s*0.1, 0, moonR, Math.PI * 0.15, Math.PI * 1.85, false);
  
  // İç hilal kesimi - daha küçük daire ile kapat
  const innerR = moonR * 0.72;
  const offsetX = moonR * 0.35 - s*0.1;
  crescent.absarc(offsetX, 0, innerR, Math.PI * 1.85, Math.PI * 0.15, true);
  shapes.push(crescent);

  // 2. Yıldız
  const star = new THREE.Shape();
  const starR = s * 0.35;
  const starInnerR = starR * 0.4;
  const starCx = s * 0.35;
  const starCy = s * 0.15;
  const points = 5;
  
  // Yıldız çizimi (CCW)
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? starR : starInnerR;
    const angle = (Math.PI / 2) + (i * Math.PI / points);
    const px = starCx + Math.cos(angle) * r;
    const py = starCy + Math.sin(angle) * r;
    if (i === 0) star.moveTo(px, py);
    else star.lineTo(px, py);
  }
  star.closePath();
  shapes.push(star);

  return shapes;
}

/**
 * Yıldız (5 köşeli) şekli oluşturur
 * @param {number} size - Toplam boyut
 * @returns {THREE.Shape}
 */
export function createStarShape(size = 24) {
  const s = size / 2;
  const shape = new THREE.Shape();
  const outerR = s * 0.4;
  const innerR = outerR * 0.4;
  const points = 5;
  
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? outerR : innerR;
    const angle = (Math.PI / 2) + (i * Math.PI / points);
    const px = Math.cos(angle) * r;
    const py = Math.sin(angle) * r;
    if (i === 0) shape.moveTo(px, py);
    else shape.lineTo(px, py);
  }
  shape.closePath();
  
  return shape;
}

/**
 * Kurukafa (Skull) şekli oluşturur - basitleştirilmiş silhouette
 * @param {number} size - Toplam boyut
 * @returns {THREE.Shape}
 */
export function createSkullShape(size = 24) {
  const s = size / 2;
  const shape = new THREE.Shape();
  
  // Kafa üst kısmı - yarı daire
  const headR = s * 0.8;
  shape.absarc(0, s * 0.1, headR, 0, Math.PI, false);
  
  // Çene kısmı
  shape.lineTo(-headR * 0.55, -s * 0.3);
  shape.quadraticCurveTo(-headR * 0.4, -s * 0.75, 0, -s * 0.75);
  shape.quadraticCurveTo(headR * 0.4, -s * 0.75, headR * 0.55, -s * 0.3);
  shape.lineTo(headR, s * 0.1);
  
  // Sol göz deliği
  const eyeR = headR * 0.2;
  const eyeHole = new THREE.Path();
  eyeHole.absarc(-headR * 0.35, s * 0.2, eyeR, 0, Math.PI * 2, true);
  shape.holes.push(eyeHole);
  
  // Sağ göz deliği
  const eyeHole2 = new THREE.Path();
  eyeHole2.absarc(headR * 0.35, s * 0.2, eyeR, 0, Math.PI * 2, true);
  shape.holes.push(eyeHole2);
  
  return shape;
}

export function createRookShape(size = 24) {
  const s = size / 2;
  const shape = new THREE.Shape();
  
  // Base
  shape.moveTo(-s * 0.6, -s * 0.9);
  shape.lineTo(s * 0.6, -s * 0.9);
  shape.lineTo(s * 0.6, -s * 0.7);
  shape.lineTo(s * 0.45, -s * 0.6);
  
  // Waist
  shape.quadraticCurveTo(s * 0.35, 0, s * 0.45, s * 0.4);
  
  // Top collar
  shape.lineTo(s * 0.6, s * 0.5);
  shape.lineTo(s * 0.6, s * 0.9);
  
  // Battlements (CCW)
  shape.lineTo(s * 0.3, s * 0.9);
  shape.lineTo(s * 0.3, s * 0.65);
  shape.lineTo(s * 0.1, s * 0.65);
  shape.lineTo(s * 0.1, s * 0.9);
  shape.lineTo(-s * 0.1, s * 0.9);
  shape.lineTo(-s * 0.1, s * 0.65);
  shape.lineTo(-s * 0.3, s * 0.65);
  shape.lineTo(-s * 0.3, s * 0.9);
  shape.lineTo(-s * 0.6, s * 0.9);
  
  // Left side going down
  shape.lineTo(-s * 0.6, s * 0.5);
  shape.lineTo(-s * 0.45, s * 0.4);
  shape.quadraticCurveTo(-s * 0.35, 0, -s * 0.45, -s * 0.6);
  shape.lineTo(-s * 0.6, -s * 0.7);
  shape.lineTo(-s * 0.6, -s * 0.9);

  return shape;
}

export function createTennisRacketShape(size = 24) {
  const s = size / 2;
  const shape = new THREE.Shape();
  
  const hw = s * 0.12; 
  const cy = s * 0.35; 
  const hrX = s * 0.6; 
  const hrY = s * 0.75; 
  
  // Sap ve boyun (CCW)
  shape.moveTo(-hw, -s * 0.9);
  shape.lineTo(hw, -s * 0.9);
  shape.lineTo(hw, -s * 0.25);
  
  shape.lineTo(hrX * 0.6, 0); // V yaka açılır
  
  shape.bezierCurveTo(hrX, 0, hrX, cy + hrY, 0, cy + hrY);
  shape.bezierCurveTo(-hrX, cy + hrY, -hrX, 0, -hrX * 0.6, 0);
  
  shape.lineTo(-hw, -s * 0.25);
  shape.lineTo(-hw, -s * 0.9);
  
  // Büyük İç Boşluk (Tel kısmı) - Saat Yönü (CW)
  const hole1 = new THREE.Path();
  const irX = hrX * 0.85;
  const irY = hrY * 0.85;
  hole1.moveTo(0, cy + irY);
  hole1.bezierCurveTo(irX, cy + irY, irX, cy - irY + s*0.2, 0, cy - irY + s*0.1);
  hole1.bezierCurveTo(-irX, cy - irY + s*0.2, -irX, cy + irY, 0, cy + irY);
  shape.holes.push(hole1);

  // Boyun Boşluğu (V şeklinde üçgen delik)
  const hole2 = new THREE.Path();
  // Saat Yönünde (CW)
  hole2.moveTo(0, -s * 0.05); // Üst orta
  hole2.lineTo(hw * 0.8, -s * 0.2); // Sağ alt
  hole2.lineTo(-hw * 0.8, -s * 0.2); // Sol alt
  hole2.lineTo(0, -s * 0.05);
  shape.holes.push(hole2);
  
  return shape;
}

export function createTableTennisShape(size = 24) {
  const s = size / 2;
  const shape = new THREE.Shape();
  
  const hw = s * 0.18; // Sap geniş
  const cy = s * 0.25; 
  const hrX = s * 0.6; 
  const hrY = s * 0.7; 
  
  // Dış hat (CCW)
  shape.moveTo(-hw, -s * 0.9);
  shape.lineTo(hw, -s * 0.9);
  shape.lineTo(hw, -s * 0.3); // sap sonu
  
  // Raket kısmı (Oval kafa)
  shape.lineTo(hrX * 0.5, -s * 0.05); // Raket alt sağ köşesi
  shape.bezierCurveTo(hrX * 1.1, -s * 0.05, hrX * 1.1, cy + hrY, 0, cy + hrY);
  shape.bezierCurveTo(-hrX * 1.1, cy + hrY, -hrX * 1.1, -s * 0.05, -hrX * 0.5, -s * 0.05);
  
  shape.lineTo(-hw, -s * 0.3);
  shape.lineTo(-hw, -s * 0.9);
  
  return shape;
}


export function createILoveShape(size = 24) {
  const s = size / 2;
  const shapes = [];
  
  // Dimensions
  const iW = s * 0.25;      // I letter width
  const iH = s * 1.2;       // I letter height  
  const hs = s * 0.65;      // Heart half-size
  const gap = s * 0.15;     // Gap between I and heart
  
  // Total width: I + gap + heart diameter
  const totalW = iW + gap + hs * 2;
  
  // Center everything at origin (0,0)
  const iCenterX = -totalW / 2 + iW / 2;
  const heartCenterX = -totalW / 2 + iW + gap + hs;
  
  // 1. "I" harfi — centered vertically and horizontally
  const iShape = new THREE.Shape();
  iShape.moveTo(iCenterX - iW / 2, -iH / 2);
  iShape.lineTo(iCenterX + iW / 2, -iH / 2);
  iShape.lineTo(iCenterX + iW / 2, iH / 2);
  iShape.lineTo(iCenterX - iW / 2, iH / 2);
  iShape.closePath();
  shapes.push(iShape);
  
  // 2. Kalp — centered at heartCenterX
  const hx = heartCenterX;
  const heart = new THREE.Shape();
  heart.moveTo(hx, hs * 0.5);
  heart.bezierCurveTo(hx, hs * 0.9, hx - hs, hs * 0.9, hx - hs, hs * 0.3);
  heart.bezierCurveTo(hx - hs, -hs * 0.3, hx, -hs * 0.5, hx, -hs);
  heart.bezierCurveTo(hx, -hs * 0.5, hx + hs, -hs * 0.3, hx + hs, hs * 0.3);
  heart.bezierCurveTo(hx + hs, hs * 0.9, hx, hs * 0.9, hx, hs * 0.5);
  shapes.push(heart);
  
  return shapes;
}

/**
 * Stilize-E: Sağa yatık U (⊏) üzerine aynı boyda tire
 * Sol dikey gövde + 3 EŞİT UZUNLUKTA yatay çubuk — tek konturlu tarak şekli
 * @param {number} size
 * @returns {THREE.Shape}
 */
export function createStilizeEShape(size = 24) {
  const s = size / 2;

  // Sabitler
  const spL  = -s * 0.70;  // Sol gövde sol kenar
  const spR  = -s * 0.33;  // Sol gövde sağ kenar (çubukların ayrıldığı nokta)
  const barR =  s * 0.70;  // Tüm çubukların sağ ucu (EŞİT UZUNLUK)
  const topY =  s * 0.86;  // En üst y
  const botY = -s * 0.86;  // En alt y

  // Çubuk kalınlıkları ve boşluklar (3 eşit çubuk + 2 boşluk)
  // Toplam yükseklik 2*s*0.86 = s*1.72 → her çubuk s*0.29, boşluk s*0.27
  const bH  = s * 0.27;   // çubuk yarı-kalınlığı
  const bM1 =  s * 0.57;  // üst çubuk merkezi
  const bM2 =  0;          // orta çubuk merkezi
  const bM3 = -s * 0.57;  // alt çubuk merkezi

  // Tek konturlu tarak path (CCW)
  const shape = new THREE.Shape();
  shape.moveTo(spL,  botY);          // ① sol gövde alt-sol
  shape.lineTo(barR, botY);          // ② alt çubuk sağ alt
  shape.lineTo(barR, bM3 + bH);      // ③ alt çubuk sağ üst
  shape.lineTo(spR,  bM3 + bH);      // ④ gövdeye dön
  shape.lineTo(spR,  bM2 - bH);      // ⑤ orta çubuk alt
  shape.lineTo(barR, bM2 - bH);      // ⑥ orta çubuk sağ alt
  shape.lineTo(barR, bM2 + bH);      // ⑦ orta çubuk sağ üst
  shape.lineTo(spR,  bM2 + bH);      // ⑧ gövdeye dön
  shape.lineTo(spR,  bM1 - bH);      // ⑨ üst çubuk alt
  shape.lineTo(barR, bM1 - bH);      // ⑩ üst çubuk sağ alt
  shape.lineTo(barR, topY);          // ⑪ üst çubuk sağ üst
  shape.lineTo(spL,  topY);          // ⑫ sol gövde üst-sol
  shape.closePath();                 // geri ①'e

  return shape;
}

/**
 * Stilize-X: >.< kompozisyonu
 * Sol > (sivri uç sağda) + ortada daire + sağ < (sivri uç solda)
 * @param {number} size
 * @returns {THREE.Shape[]}
 */
export function createStilizeXShape(size = 24) {
  const s = size / 2;
  const shapes = [];

  // Boyutlar
  const armX   =  s * 0.72;  // Ok kollarının dış X (sol için -armX, sağ için +armX)
  const armOH  =  s * 0.84;  // Kolun dış uç Y (en geniş yer)
  const armIH  =  s * 0.52;  // Kolun iç üst/alt Y (kol kalınlığını belirler)
  const tipX   =  s * 0.26;  // Ok ucunun merkeze uzaklığı
  const cncX   =  s * 0.24;  // İç çentik (concave) merkeze uzaklığı
  const dotR   =  s * 0.13;  // Orta nokta yarıçapı

  // Sol ok > : sol kollar (-armX), sivri uç sağda (+tipX)
  const left = new THREE.Shape();
  left.moveTo( tipX,  0);           // sivri uç (sağ)
  left.lineTo(-armX,  armOH);       // üst dış
  left.lineTo(-armX,  armIH);       // üst iç (kol kalınlığı)
  left.lineTo(-cncX,  0);           // iç çentik
  left.lineTo(-armX, -armIH);       // alt iç
  left.lineTo(-armX, -armOH);       // alt dış
  left.closePath();
  shapes.push(left);

  // Sağ ok < : sağ kollar (+armX), sivri uç solda (-tipX)
  const right = new THREE.Shape();
  right.moveTo(-tipX,  0);          // sivri uç (sol)
  right.lineTo( armX,  armOH);      // üst dış
  right.lineTo( armX,  armIH);      // üst iç
  right.lineTo( cncX,  0);          // iç çentik
  right.lineTo( armX, -armIH);      // alt iç
  right.lineTo( armX, -armOH);      // alt dış
  right.closePath();
  shapes.push(right);

  // Ortadaki nokta
  const dot = new THREE.Shape();
  dot.absarc(0, 0, dotR, 0, Math.PI * 2, false);
  shapes.push(dot);

  return shapes;
}

// Simge fabrika fonksiyonu - type'a göre shape üretir
export function createIconShape(type, size = 24) {
  switch (type) {
    case 'clover': return createCloverShape(size);
    case 'heart': return createHeartShape(size);
    case 'star_crescent': return createStarCrescentShape(size);
    case 'star': return createStarShape(size);
    case 'skull': return createSkullShape(size);
    case 'rook': return createRookShape(size);
    case 'racket_tennis': return createTennisRacketShape(size);
    case 'racket_table': return createTableTennisShape(size);
    case 'i_love': return createILoveShape(size);
    case 'stilize_e': return createStilizeEShape(size);
    case 'stilize_x': return createStilizeXShape(size);
    default: return null;
  }
}

