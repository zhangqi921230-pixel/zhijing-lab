import * as THREE from "three";

// Shared instrument fittings: recessed slotted screws and a raised dial rim.
export function addCircuitHardware(root, instruments) {
  const head = new THREE.Shape();
  head.absarc(0, 0, 0.025, 0, Math.PI * 2, false);
  const slot = new THREE.Path();
  slot.moveTo(-0.018, -0.004);
  slot.lineTo(-0.018, 0.004);
  slot.lineTo(0.018, 0.004);
  slot.lineTo(0.018, -0.004);
  slot.closePath();
  head.holes.push(slot);
  const heads = new THREE.InstancedMesh(
    new THREE.ExtrudeGeometry(head, {
      depth: 0.01,
      bevelEnabled: true,
      bevelThickness: 0.001,
      bevelSize: 0.001,
      bevelSegments: 2,
      steps: 1,
      curveSegments: 12,
    }),
    new THREE.MeshStandardMaterial({
      color: "#aeb7b2",
      metalness: 0.8,
      roughness: 0.32,
    }),
    instruments.length * 4,
  );
  heads.name = "circuit-recessed-screw-heads";
  const recesses = new THREE.InstancedMesh(
    new THREE.CircleGeometry(0.025, 24),
    new THREE.MeshStandardMaterial({ color: "#26352f", roughness: 0.85 }),
    instruments.length * 4,
  );
  recesses.name = "circuit-screw-recesses";
  const rim = new THREE.Shape();
  rim.moveTo(-0.707, -0.392);
  rim.lineTo(0.707, -0.392);
  rim.lineTo(0.707, 0.392);
  rim.lineTo(-0.707, 0.392);
  rim.closePath();
  const opening = new THREE.Path();
  opening.moveTo(-0.686, -0.371);
  opening.lineTo(-0.686, 0.371);
  opening.lineTo(0.686, 0.371);
  opening.lineTo(0.686, -0.371);
  opening.closePath();
  rim.holes.push(opening);
  const bezels = new THREE.InstancedMesh(
    new THREE.ExtrudeGeometry(rim, {
      depth: 0.015,
      bevelEnabled: true,
      bevelSize: 0.002,
      bevelThickness: 0.002,
      bevelSegments: 2,
      steps: 1,
    }),
    new THREE.MeshStandardMaterial({
      color: "#63736e",
      metalness: 0.45,
      roughness: 0.48,
    }),
    instruments.length,
  );
  bezels.name = "circuit-dial-bezels";
  const transform = new THREE.Object3D();
  let index = 0;
  instruments.forEach(({ x, y, z, height, range }, instrumentIndex) => {
    for (const dx of [-0.62, 0.62])
      for (const dy of [-height / 2 + 0.2, height / 2 - 0.12]) {
        transform.position.set(x + dx, y + dy, z + 0.7);
        transform.rotation.z = 0.25 + index * 0.73;
        transform.updateMatrix();
        heads.setMatrixAt(index, transform.matrix);
        transform.position.z -= 0.002;
        transform.updateMatrix();
        recesses.setMatrixAt(index++, transform.matrix);
      }
    transform.rotation.z = 0;
    transform.position.set(x, y + (range ? 0.17 : 0.4), z + 0.692);
    transform.updateMatrix();
    bezels.setMatrixAt(instrumentIndex, transform.matrix);
  });
  for (const batch of [heads, recesses, bezels]) {
    batch.castShadow = batch.receiveShadow = true;
    root.add(batch);
  }
}
