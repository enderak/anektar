// src/utils/exportUtils.js — v6.0.0 (3-file AMS with physical mesh separation)
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
  
  const originalScale = groupRef.current.scale.clone();
  const originalRotation = groupRef.current.rotation.clone();

  groupRef.current.scale.multiplyScalar(20);
  groupRef.current.rotation.x += Math.PI / 2;
  groupRef.current.updateMatrixWorld(true);

  const stlBuf = (res) => res instanceof ArrayBuffer ? res : (res.buffer || res);

  // Recursive: tüm mesh'leri topla
  const collectMeshes = (obj) => {
    let meshes = [];
    if (obj.isMesh && obj.geometry) meshes.push(obj);
    if (obj.children) obj.children.forEach(c => meshes.push(...collectMeshes(c)));
    return meshes;
  };

  if (isMultiColor) {
    const zip = new JSZip();
    const allChildren = [...groupRef.current.children];
    const allMeshes = collectMeshes(groupRef.current);
    const heartMesh = allMeshes.find(m => m.name === 'ILoveIcon_1');

    // 1. TABAN
    groupRef.current.children = allChildren.filter(c => c.name === 'BasePlate');
    groupRef.current.updateMatrixWorld(true);
    zip.file(`${fileName}_TABAN.stl`, stlBuf(exporter.parse(groupRef.current, { binary: true })));

    if (heartMesh) {
      const heartParent = heartMesh.parent;
      const heartIndex = heartParent.children.indexOf(heartMesh);

      // 2a. YAZI — kalp mesh'ini fiziksel olarak gruptan çıkar
      heartParent.children.splice(heartIndex, 1);
      groupRef.current.children = allChildren.filter(c => c.name && c.name !== 'BasePlate');
      groupRef.current.updateMatrixWorld(true);
      zip.file(`${fileName}_YAZI.stl`, stlBuf(exporter.parse(groupRef.current, { binary: true })));

      // 2b. KALP — sadece kalbi gruptan çıkar, diğerlerini çıkar
      // Kalbi geri koy, diğer kardeşlerini geçici olarak çıkar
      const siblings = [...heartParent.children]; // I harfi vs.
      heartParent.children.length = 0;
      heartParent.children.push(heartMesh);

      // Diğer top-level çocukları da geçici kaldır (TextMain vs.)
      groupRef.current.children = allChildren.filter(c => c.name && c.name !== 'BasePlate');
      // Ama sadece ILoveGroup'u tut
      const textChildren = groupRef.current.children.filter(c => c !== heartParent);
      groupRef.current.children = [heartParent];
      groupRef.current.updateMatrixWorld(true);
      zip.file(`${fileName}_KALP_KIRMIZI.stl`, stlBuf(exporter.parse(groupRef.current, { binary: true })));

      // Geri yükle
      heartParent.children.length = 0;
      siblings.forEach(s => heartParent.children.push(s));
      heartParent.children.splice(heartIndex, 0, heartMesh);
    } else {
      // Kalp yoksa 2'li export
      groupRef.current.children = allChildren.filter(c => c.name && c.name !== 'BasePlate');
      groupRef.current.updateMatrixWorld(true);
      zip.file(`${fileName}_YAZI.stl`, stlBuf(exporter.parse(groupRef.current, { binary: true })));
    }

    // Sahneyi eski haline getir
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

  groupRef.current.scale.copy(originalScale);
  groupRef.current.rotation.copy(originalRotation);
  groupRef.current.updateMatrixWorld(true);
};