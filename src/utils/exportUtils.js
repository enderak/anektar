// src/utils/exportUtils.js — v5.0.0 (3-file AMS export)
import { STLExporter } from 'three/examples/jsm/exporters/STLExporter';
import JSZip from 'jszip';

function downloadBlob(blob, filename) {
  const link = document.createElement('a');
  link.style.display = 'none';
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  setTimeout(() => {
    URL.revokeObjectURL(link.href);
    document.body.removeChild(link);
  }, 100);
}

export const handleExport = (groupRef, fileName = "SAKRAD_Isimlik", isMultiColor = false) => {
  if (!groupRef.current) return;

  const exporter = new STLExporter();
  
  // THREE.js: Y=Yukarı → Slicer: Z=Yukarı dönüşümü
  const originalScale = groupRef.current.scale.clone();
  const originalRotation = groupRef.current.rotation.clone();

  // Sahne ölçeği 0.05 → gerçek mm için 20x
  groupRef.current.scale.multiplyScalar(20);
  groupRef.current.rotation.x += Math.PI / 2;
  groupRef.current.updateMatrixWorld(true);

  // Yardımcı: STL buffer'ı normalize et
  const stlBuf = (res) => res instanceof ArrayBuffer ? res : (res.buffer || res);

  // Yardımcı: Tüm mesh'leri recursive topla (group içindekiler dahil)
  const collectMeshes = (obj) => {
    let meshes = [];
    if (obj.isMesh && obj.geometry) meshes.push(obj);
    if (obj.children) obj.children.forEach(c => meshes.push(...collectMeshes(c)));
    return meshes;
  };

  if (isMultiColor) {
    const zip = new JSZip();
    const allChildren = [...groupRef.current.children];

    // Kalp mesh'i var mı kontrol et (ILoveIcon_1 = kalp)
    const allMeshes = collectMeshes(groupRef.current);
    const heartMesh = allMeshes.find(m => m.name === 'ILoveIcon_1');

    // 1. SADECE TABANI AKTAR
    groupRef.current.children = allChildren.filter(c => c.name === 'BasePlate');
    groupRef.current.updateMatrixWorld(true);
    zip.file(`${fileName}_TABAN.stl`, stlBuf(exporter.parse(groupRef.current, { binary: true })));

    if (heartMesh) {
      // 2a. YAZI (kalp HARİÇ — I harfi, simge, ana metin)
      heartMesh.visible = false;
      groupRef.current.children = allChildren.filter(c => c.name && c.name !== 'BasePlate');
      groupRef.current.updateMatrixWorld(true);
      zip.file(`${fileName}_YAZI.stl`, stlBuf(exporter.parse(groupRef.current, { binary: true })));
      heartMesh.visible = true;

      // 2b. KALP (sadece kalp — kırmızı renk için ayrı dosya)
      const otherMeshes = allMeshes.filter(m => m !== heartMesh);
      otherMeshes.forEach(m => { m.userData._vis = m.visible; m.visible = false; });
      groupRef.current.children = allChildren.filter(c => c.name && c.name !== 'BasePlate');
      groupRef.current.updateMatrixWorld(true);
      zip.file(`${fileName}_KALP_KIRMIZI.stl`, stlBuf(exporter.parse(groupRef.current, { binary: true })));
      otherMeshes.forEach(m => { m.visible = m.userData._vis !== false; });
    } else {
      // Kalp yoksa normal 2'li export
      groupRef.current.children = allChildren.filter(c => c.name && c.name !== 'BasePlate');
      groupRef.current.updateMatrixWorld(true);
      zip.file(`${fileName}_YAZI.stl`, stlBuf(exporter.parse(groupRef.current, { binary: true })));
    }

    // Çocukları eski haline getir
    groupRef.current.children = allChildren;
    
    zip.generateAsync({ type: "blob" }).then((content) => {
      downloadBlob(content, `${fileName}_CiftRenk.zip`);
    });

  } else {
    try {
      const result = exporter.parse(groupRef.current, { binary: true });
      const blob = new Blob([stlBuf(result)], { type: 'application/octet-stream' });
      downloadBlob(blob, `${fileName}_${new Date().getTime()}.stl`);
    } catch (err) {
      console.error('STL Export Error:', err);
      alert('STL dışa aktarma hatası: ' + err.message);
    }
  }

  // Eski görsel boyuta geri al
  groupRef.current.scale.copy(originalScale);
  groupRef.current.rotation.copy(originalRotation);
  groupRef.current.updateMatrixWorld(true);
};