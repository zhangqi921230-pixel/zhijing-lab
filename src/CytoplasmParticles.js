import * as THREE from "three";
import { cytoplasmicParticles } from "./cellParticles.mjs";
import { addCellParticles } from "./CellOrganelles.js";

// Enlarged illustrative free ribosomes, not a molecular-scale density model.
export function addCytoplasmParticles(root) {
  root.updateMatrixWorld(true);
  const radius = 0.013;
  const inverseRoot = root.matrixWorld.clone().invert();
  const occupied = [];
  root.traverse((object) => {
    if (
      [
        "chloroplast-envelope",
        "mitochondrion-outer-membrane",
        "golgi-apparatus",
        "endoplasmic-reticulum",
      ].includes(object.name)
    ) {
      const box = new THREE.Box3();
      if (
        object.name.endsWith("envelope") ||
        object.name.endsWith("outer-membrane")
      ) {
        // Reserve the complete envelope even while its cutaway is displayed.
        box.set(new THREE.Vector3(-1, -1, -1), new THREE.Vector3(1, 1, 1));
        box.applyMatrix4(
          new THREE.Matrix4().multiplyMatrices(inverseRoot, object.matrixWorld),
        );
      } else
        object.traverse((child) => {
          if (child.isMesh)
            box.union(
              new THREE.Box3().setFromObject(child).applyMatrix4(inverseRoot),
            );
        });
      occupied.push(box.expandByScalar(radius));
    }
  });
  const probe = new THREE.Vector3();
  const positions = cytoplasmicParticles().filter((point) => {
    probe.set(...point);
    return !occupied.some((box) => box.containsPoint(probe));
  });
  const particles = addCellParticles(
    root,
    "cell-ribosomes",
    positions,
    radius,
    "#9b936f",
  );
  const matrix = new THREE.Matrix4();
  positions.forEach((point, i) => {
    const scale = 0.65 + ((i * 0.61803398875) % 1) * 0.35;
    matrix.makeScale(scale, scale, scale).setPosition(...point);
    particles.setMatrixAt(i, matrix);
  });
  particles.instanceMatrix.needsUpdate = true;
  particles.computeBoundingSphere();
  return particles;
}
