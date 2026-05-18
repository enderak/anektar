// src/utils/exportUtils.js — v6.0.0 (3-file AMS with physical mesh separation)
import { STLExporter } from 'three/examples/jsm/exporters/STLExporter';
import JSZip from 'jszip';
import { Evaluator, Brush, SUBTRACTION } from 'three-bvh-csg';
import * as THREE from 'three';

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

export const handleExport = (groupRef, fileName = "SAKRAD_Isimlik", isMultiColor = false, textStyle = 'embossed') => {
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
      const allChildren = [...groupRef.current.children];
      const baseMesh = allChildren.find(c => c.name === 'BasePlate');
      const isPocketStyle = textStyle === 'engraved' || textStyle === 'carved';
      
      let originalBaseGeometry = null;

      if (isPocketStyle && baseMesh) {
        // Backup the original geometry to restore later
        originalBaseGeometry = baseMesh.geometry.clone();

        // Collect all meshes to subtract (everything except BasePlate)
        const subMeshes = collectMeshes(groupRef.current).filter(m => m.name !== 'BasePlate');

        if (subMeshes.length > 0) {
          const evaluator = new Evaluator();

          const ensureGeometryIndexed = (geom) => {
            if (geom.index) return geom;
            const posCount = geom.attributes.position.count;
            const indices = Array.from({ length: posCount }, (_, i) => i);
            geom.setIndex(indices);
            return geom;
          };

          ensureGeometryIndexed(baseMesh.geometry);
          let baseBrush = new Brush(baseMesh.geometry, baseMesh.material);
          baseBrush.position.copy(baseMesh.position);
          baseBrush.rotation.copy(baseMesh.rotation);
          baseBrush.scale.copy(baseMesh.scale);
          baseBrush.updateMatrixWorld(true);

          for (const subMesh of subMeshes) {
            if (subMesh.visible === false) continue;

            const subGeom = subMesh.geometry.clone();
            ensureGeometryIndexed(subGeom);

            let subBrush = new Brush(subGeom, subMesh.material);
            subBrush.position.copy(subMesh.position);
            subBrush.rotation.copy(subMesh.rotation);
            subBrush.scale.copy(subMesh.scale);

            // Handle nested group transformations if any (e.g. TextIconGroup, ILoveGroup)
            if (subMesh.parent && subMesh.parent !== groupRef.current) {
              const parentPos = new THREE.Vector3();
              const parentRot = new THREE.Quaternion();
              const parentScl = new THREE.Vector3();
              subMesh.parent.updateMatrixWorld(true);
              subMesh.parent.matrixWorld.decompose(parentPos, parentRot, parentScl);
              
              // Apply world transformations relative to the container group
              const worldPos = new THREE.Vector3();
              const worldRot = new THREE.Quaternion();
              const worldScl = new THREE.Vector3();
              subMesh.matrixWorld.decompose(worldPos, worldRot, worldScl);
              
              // Map to local group coordinates
              const localMatrix = groupRef.current.matrixWorld.clone().invert().multiply(subMesh.matrixWorld);
              localMatrix.decompose(subBrush.position, subBrush.quaternion, subBrush.scale);
            }
            subBrush.updateMatrixWorld(true);

            // Perform physical subtraction
            baseBrush = evaluator.evaluate(baseBrush, subBrush, SUBTRACTION);
          }

          // Apply subtracted geometry to base mesh
          baseMesh.geometry = baseBrush.geometry;
        }

        // Export only the subtracted BasePlate
        groupRef.current.children = [baseMesh];
        groupRef.current.updateMatrixWorld(true);
      }

      // Generate the single-color STL
      const result = exporter.parse(groupRef.current, { binary: true });
      const blob = new Blob([stlBuf(result)], { type: 'application/octet-stream' });
      downloadBlob(blob, `${fileName}_${new Date().getTime()}.stl`);

      // Restore original state
      if (isPocketStyle && baseMesh) {
        if (originalBaseGeometry) {
          baseMesh.geometry.dispose();
          baseMesh.geometry = originalBaseGeometry;
        }
        groupRef.current.children = allChildren;
        groupRef.current.updateMatrixWorld(true);
      }
    } catch (err) {
      console.error('STL Export Error:', err);
      alert('STL dışa aktarma hatası: ' + err.message);
    }
  }

  groupRef.current.scale.copy(originalScale);
  groupRef.current.rotation.copy(originalRotation);
  groupRef.current.updateMatrixWorld(true);
};