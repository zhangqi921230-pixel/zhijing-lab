import * as THREE from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";

function ellipsoid(x, y, z, sx, sy, sz) {
  return new THREE.SphereGeometry(1, 12, 8)
    .scale(sx, sy, sz)
    .translate(x, y, z);
}
function merge(parts) {
  const result = mergeGeometries(parts);
  parts.forEach((part) => part.dispose());
  return result;
}

// Generic small bird for the qualitative community model, not a species ID.
// Static geometry is shared; each individual owns its shoulder transforms.
export function createEcologyBirdTemplate() {
  const body = ellipsoid(0, 0, 0, 0.105, 0.11, 0.2);
  const head = ellipsoid(0, 0.08, 0.165, 0.073, 0.073, 0.08);
  const eyes = merge(
    [-1, 1].map((s) => ellipsoid(s * 0.058, 0.1, 0.206, 0.012, 0.012, 0.012)),
  );
  const beak = new THREE.ConeGeometry(0.027, 0.09, 8);
  beak.rotateX(Math.PI / 2).translate(0, 0.065, 0.265);
  const wing = merge([
    ellipsoid(0.1, 0, 0.005, 0.14, 0.024, 0.09),
    ...Array.from({ length: 7 }, (_, i) => {
      const feather = ellipsoid(0, 0, 0, 0.16 + i * 0.008, 0.009, 0.022);
      feather.rotateY(-0.13 - i * 0.075);
      return feather.translate(
        0.14 + i * 0.01,
        -0.004 - i * 0.001,
        0.045 - i * 0.025,
      );
    }),
  ]);
  const tail = merge(
    Array.from({ length: 5 }, (_, i) => {
      const feather = ellipsoid(0, 0, 0, 0.025, 0.009, 0.125);
      feather.rotateY((i - 2) * 0.15);
      return feather.translate((i - 2) * 0.023, -0.01, -0.255);
    }),
  );
  const plumage = new THREE.MeshStandardMaterial({
    color: "#596963",
    roughness: 0.92,
  });
  const breast = new THREE.MeshStandardMaterial({
    color: "#c5ad80",
    roughness: 0.96,
  });
  const dark = new THREE.MeshStandardMaterial({
    color: "#202c28",
    roughness: 0.65,
  });
  const horn = new THREE.MeshStandardMaterial({
    color: "#96774a",
    roughness: 0.8,
  });
  return () => {
    const bird = new THREE.Group();
    for (const [geometry, material, name] of [
      [body, breast, "breast"],
      [head, plumage, "head"],
      [eyes, dark, "eyes"],
      [beak, horn, "beak"],
      [tail, plumage, "tail-feathers"],
    ]) {
      const mesh = new THREE.Mesh(geometry, material);
      mesh.name = name;
      mesh.castShadow = true;
      bird.add(mesh);
    }
    for (const side of [-1, 1]) {
      const shoulder = new THREE.Group();
      shoulder.position.set(side * 0.07, 0.035, 0.02);
      shoulder.userData.wing = true;
      const mesh = new THREE.Mesh(wing, plumage);
      mesh.scale.x = side;
      mesh.castShadow = true;
      shoulder.add(mesh);
      bird.add(shoulder);
    }
    return bird;
  };
}
