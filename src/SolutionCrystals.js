import * as THREE from "three";
import { crystalHull, settleCrystal } from "./CrystalContact.js";
import packing from "./crystalPacking.json" with { type: "json" };

let packedLayout;

export function crystalTransform(i) {
  const transform = new THREE.Object3D();
  const angle = i * 2.399963,
    r = 0.6 * Math.sqrt(((i % 80) + 0.5) / 80);
  transform.quaternion.setFromUnitVectors(
    new THREE.Vector3(0, 1, 0),
    new THREE.Vector3(
      Math.cos(i * 0.71),
      0.25 * Math.sin(i * 0.47),
      Math.sin(i * 0.71),
    ).normalize(),
  );
  transform.rotateY(i * 0.23);
  transform.scale.set(
    0.4 + (i % 7) * 0.06,
    0.8 + (i % 5) * 0.22,
    0.46 + (i % 4) * 0.07,
  );
  transform.position.set(Math.cos(angle) * r, 0, Math.sin(angle) * r);
  transform.updateMatrix();
  return transform.matrix;
}

// Faceted teaching geometry; not a crystallographic unit-cell reconstruction.
export function crystalGeometry() {
  const vertices = [],
    indices = [];
  for (const [y, scale] of [
    [-0.09, 0.55],
    [-0.06, 1],
    [0.06, 1],
    [0.09, 0.55],
  ])
    for (const [x, z] of [
      [-1, -1],
      [-1, 1],
      [1, 1],
      [1, -1],
    ])
      vertices.push(x * 0.035 * scale, y, z * 0.024 * scale);
  for (let ring = 0; ring < 3; ring++)
    for (let side = 0; side < 4; side++) {
      const a = ring * 4 + side,
        b = ring * 4 + ((side + 1) % 4),
        c = a + 4,
        d = b + 4;
      indices.push(a, b, c, b, d, c);
    }
  indices.push(0, 2, 1, 0, 3, 2, 12, 13, 14, 12, 14, 15);
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(vertices, 3),
  );
  geometry.setIndex(indices);
  const flat = geometry.toNonIndexed();
  geometry.dispose();
  flat.computeVertexNormals();
  return flat;
}

export function addSolutionCrystals(parent) {
  const crystals = new THREE.InstancedMesh(
    crystalGeometry(),
    new THREE.MeshPhysicalMaterial({
      color: "#baccc9",
      roughness: 0.22,
      metalness: 0,
      ior: 1.5,
      clearcoat: 0.18,
      clearcoatRoughness: 0.24,
      envMapIntensity: 0.55,
    }),
    400,
  );
  crystals.name = "solubility-crystals";
  crystals.castShadow = crystals.receiveShadow = true;
  parent.add(crystals);
  const bases = packedLayout?.bases ?? [],
    supports = packedLayout?.supports ?? [];
  for (let i = 0; i < 400; i++) {
    if (!packedLayout) {
      const matrix = crystalTransform(i);
      matrix.elements[13] = packing.heights[i];
      supports.push(crystalHull(crystals.geometry, matrix));
      bases.push(matrix);
    }
    crystals.setMatrixAt(i, bases[i]);
    crystals.setColorAt(
      i,
      new THREE.Color().setRGB(
        0.83 + (i % 7) * 0.02,
        0.86 + (i % 5) * 0.018,
        0.83 + (i % 3) * 0.025,
      ),
    );
  }
  packedLayout ??= { bases, supports };
  // Keep bounds for the full population, even when a hot solution starts empty.
  crystals.computeBoundingBox();
  crystals.computeBoundingSphere();
  let previousPartial = -1,
    previousMass;
  const matrix = new THREE.Matrix4(),
    scale = new THREE.Vector3();
  return (mass) => {
    mass = Math.max(0, Math.min(180, mass));
    if (mass === previousMass) return;
    previousMass = mass;
    if (previousPartial >= 0)
      crystals.setMatrixAt(previousPartial, bases[previousPartial]);
    const equivalent = (mass / 180) * 400,
      full = Math.floor(equivalent),
      fraction = equivalent - full;
    crystals.count = Math.ceil(equivalent);
    previousPartial = -1;
    if (fraction > 0 && full < 400) {
      const factor = Math.cbrt(fraction);
      matrix.copy(bases[full]).scale(scale.setScalar(factor));
      settleCrystal(crystals.geometry, matrix, supports, full);
      crystals.setMatrixAt(full, matrix);
      previousPartial = full;
    }
    crystals.instanceMatrix.needsUpdate = true;
  };
}
