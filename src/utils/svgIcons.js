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
  const shape = new THREE.Shape();
  
  // Dış hilal (ay) - büyük daire
  const moonR = s * 0.85;
  shape.absarc(0, 0, moonR, Math.PI * 0.15, Math.PI * 1.85, false);
  
  // İç hilal kesimi - daha küçük daire ile kapat
  const innerR = moonR * 0.72;
  const offsetX = moonR * 0.35;
  shape.absarc(offsetX, 0, innerR, Math.PI * 1.85, Math.PI * 0.15, true);

  return shape;
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

// Simge fabrika fonksiyonu - type'a göre shape üretir
export function createIconShape(type, size = 24) {
  switch (type) {
    case 'clover': return createCloverShape(size);
    case 'heart': return createHeartShape(size);
    case 'star_crescent': return createStarCrescentShape(size);
    case 'skull': return createSkullShape(size);
    case 'rook': return createRookShape(size);
    case 'racket_tennis': return createTennisRacketShape(size);
    case 'racket_table': return createTableTennisShape(size);
    default: return null;
  }
}
