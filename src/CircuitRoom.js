import * as THREE from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";

// Context behind the apparatus only. It never participates in picking or fit.
export function addCircuitRoom(scene) {
  const room = new THREE.Group();
  room.name = "circuit-laboratory-room";
  const batches = new Map();
  const box = (color, size, position) => {
    if (!batches.has(color)) batches.set(color, []);
    batches
      .get(color)
      .push(new THREE.BoxGeometry(...size).translate(...position));
  };
  box("#d9dfd8", [28, 12, 0.18], [0, 2.3, -7.8]);
  box("#bbc9c5", [28, 0.08, 0.12], [0, -0.2, -7.64]);
  // Recessed daylight opening and painted timber mullions.
  box("#f2f8f4", [5.6, 4.6, 0.12], [-6, 3.3, -7.62]);
  for (const x of [-8.88, -6, -3.12])
    box("#f6f2e5", [0.13, 4.85, 0.24], [x, 3.3, -7.44]);
  for (const y of [0.88, 3.3, 5.72])
    box("#f6f2e5", [5.88, 0.13, 0.24], [-6, y, -7.44]);
  box("#eee9dc", [6.05, 0.14, 0.6], [-6, 0.8, -7.3]);
  // Matte teaching board, thin wooden surround, chalk rail.
  box("#756e5d", [7.2, 3.4, 0.16], [1.8, 3.5, -7.59]);
  box("#355d59", [6.96, 3.16, 0.08], [1.8, 3.5, -7.46]);
  box("#9a988a", [7.25, 0.09, 0.3], [1.8, 1.77, -7.3]);
  // Rear storage counter: repeated seams and recessed handles, no animation.
  box("#aab8b3", [17, 2.5, 1.2], [1, -2.45, -6.9]);
  box("#777e76", [17.2, 0.12, 1.4], [1, -1.14, -6.85]);
  for (let x = -6.8; x < 9; x += 1.6) {
    box("#758b84", [0.025, 2.25, 0.035], [x, -2.45, -6.285]);
    box("#5d6b67", [0.36, 0.045, 0.08], [x + 0.72, -1.6, -6.24]);
  }
  for (const [color, geometries] of batches) {
    const geometry = mergeGeometries(geometries);
    geometries.forEach((g) => g.dispose());
    const material = new THREE.MeshStandardMaterial({ color, roughness: 0.92 });
    if (color === "#f2f8f4") {
      material.emissive.set(color);
      material.emissiveIntensity = 0.5;
    }
    room.add(new THREE.Mesh(geometry, material));
  }
  scene.add(room);
  // Supports stay visible when the backdrop hides during rear observation.
  const supports = new THREE.Group();
  supports.name = "circuit-table-supports";
  const steel = new THREE.MeshStandardMaterial({
    color: "#4e6460",
    roughness: 0.62,
    metalness: 0.35,
  });
  const rubber = new THREE.MeshStandardMaterial({
    color: "#303835",
    roughness: 0.95,
  });
  for (const x of [-3, 3])
    for (const z of [-1.2, 2.5]) {
      const leg = new THREE.Mesh(
        new THREE.BoxGeometry(0.16, 2.15, 0.16),
        steel,
      );
      leg.position.set(x, -2.55, z);
      leg.castShadow = leg.receiveShadow = true;
      supports.add(leg);
      const foot = new THREE.Mesh(
        new THREE.BoxGeometry(0.2, 0.075, 0.2),
        rubber,
      );
      foot.position.set(x, -3.6625, z);
      supports.add(foot);
    }
  for (const z of [-1.2, 2.5]) {
    const rail = new THREE.Mesh(new THREE.BoxGeometry(6.16, 0.15, 0.14), steel);
    rail.position.set(0, -1.6, z);
    supports.add(rail);
  }
  scene.add(supports);
  return room;
}
