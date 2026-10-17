import * as THREE from "three";
import {
  HABITAT_POND,
  habitatHeight,
  habitatSites,
} from "./ecologyHabitat.mjs";

export function addEcologyGround(root) {
  const sites = habitatSites();
  let seed = 731;
  const random = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const positions = [],
    colors = [],
    indices = [];
  const color = new THREE.Color();
  const stones = new THREE.InstancedMesh(
    new THREE.DodecahedronGeometry(1, 0),
    new THREE.MeshStandardMaterial({ color: "#ffffff", roughness: 1 }),
    96,
  );
  const dummy = new THREE.Object3D();
  let stoneCount = 0,
    leafCount = 0;
  for (
    let attempt = 0;
    attempt < 1000 && (stoneCount < 96 || leafCount < 48);
    attempt++
  ) {
    const x = -3.35 + random() * 6.7,
      z = -2.25 + random() * 4.5;
    if (
      Math.hypot(x - HABITAT_POND.x, z - HABITAT_POND.z) < 0.93 ||
      sites.some((s) => Math.hypot(x - s.x, z - s.z) < 0.22)
    )
      continue;
    if (stoneCount < 96) {
      const size = 0.018 + random() * 0.024;
      dummy.scale.set(size * 1.4, size * 0.55, size);
      dummy.rotation.set(0, random() * Math.PI * 2, 0);
      dummy.position.set(x, habitatHeight(x, z) + size * 0.35, z);
      dummy.updateMatrix();
      stones.setMatrixAt(stoneCount, dummy.matrix);
      color.setHSL(
        0.09,
        0.08 + random() * 0.08,
        0.25 + random() * 0.15,
        THREE.SRGBColorSpace,
      );
      stones.setColorAt(stoneCount++, color);
    }
    if (leafCount < 48 && attempt % 2 === 0) {
      const angle = random() * Math.PI * 2,
        length = 0.12 + random() * 0.13,
        width = length * 0.24;
      const first = positions.length / 3;
      color.setHSL(
        0.07 + random() * 0.035,
        0.3,
        0.23 + random() * 0.1,
        THREE.SRGBColorSpace,
      );
      for (let j = 0; j <= 8; j++)
        for (const edge of [-1, 0, 1]) {
          const t = j / 8,
            u = (t - 0.5) * length,
            v = Math.sin(Math.PI * t) * width * edge;
          const px = x + u * Math.cos(angle) - v * Math.sin(angle),
            pz = z + u * Math.sin(angle) + v * Math.cos(angle);
          positions.push(
            px,
            habitatHeight(px, pz) +
              0.006 +
              Math.sin(Math.PI * t) * (0.005 + 0.007 * edge * edge),
            pz,
          );
          colors.push(color.r, color.g, color.b);
        }
      for (let j = 0; j < 8; j++)
        for (let k = 0; k < 2; k++) {
          const n = first + j * 3 + k;
          indices.push(n, n + 1, n + 3, n + 1, n + 4, n + 3);
        }
      leafCount++;
    }
  }
  stones.name = "habitat-ground-stones";
  stones.count = stoneCount;
  stones.receiveShadow = true;
  stones.computeBoundingSphere();
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(positions, 3),
  );
  geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  const leaves = new THREE.Mesh(
    geometry,
    new THREE.MeshStandardMaterial({
      vertexColors: true,
      side: THREE.DoubleSide,
      roughness: 1,
    }),
  );
  leaves.name = "habitat-leaf-litter";
  leaves.receiveShadow = true;
  root.add(stones, leaves);
  return (visible) => {
    stones.visible = leaves.visible = visible;
  };
}
