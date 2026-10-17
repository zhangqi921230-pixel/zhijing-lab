import * as THREE from "three";

// Baked into the environment once. These reflection cards never enter the
// interactive scene, so they add neither live lights nor per-frame draw calls.
export function addLaboratorySoftboxes(environment) {
  const geometry = new THREE.PlaneGeometry(1, 1);
  const material = new THREE.MeshBasicMaterial({
    color: new THREE.Color("#f5f9ff").multiplyScalar(12),
    side: THREE.DoubleSide,
    toneMapped: false,
  });
  const cards = [
    { position: [-5, 3, 3], size: [1.1, 7] },
    { position: [5, 2, -2], size: [0.7, 6] },
    { position: [0, 7, 1], size: [5, 2] },
    { position: [3, 4, -5], size: [4, 0.6] },
  ];
  cards.forEach(({ position, size }, i) => {
    const card = new THREE.Mesh(geometry, material);
    card.name = `laboratory-reflection-card-${i}`;
    card.position.set(...position);
    card.scale.set(...size, 1);
    card.lookAt(0, 0.5, 0);
    environment.add(card);
  });
}
