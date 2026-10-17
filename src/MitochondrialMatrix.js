import * as T from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";

// Magnified teaching symbols. DNA topology, particle counts and positions
// are not a reconstruction of a particular plant mitochondrial genome.
export function matrixPointFits([x, y, z], radius = 0) {
  const inside =
    ((Math.abs(x) + radius) / 0.252) ** 2 +
      ((Math.abs(y) + radius) / 0.098) ** 2 +
      ((Math.abs(z) + radius) / 0.127) ** 2 <
    0.94;
  // Each lamellar fold stays within ±.020 of its x centre. Leave its
  // entire band empty, including the lumen enclosed by the fold.
  return (
    inside &&
    y + radius < 0 &&
    Array.from(
      { length: 7 },
      (_, n) => Math.abs(x - (n - 3) * 0.058) > 0.021 + radius,
    ).every(Boolean)
  );
}

export function createMitochondrialMatrix() {
  const group = new T.Group();
  group.name = "mitochondrion-matrix-detail";
  const points = [];
  for (let i = 1; i <= 420; i++) {
    const point = [
      (((i * 0.61803398875) % 1) - 0.5) * 0.44,
      -0.014 - ((i * 0.41421356237) % 1) * 0.063,
      (((i * 0.73205080757) % 1) - 0.5) * 0.2,
    ];
    if (matrixPointFits(point, 0.0023)) points.push(point);
  }
  // Two unequal lobes suggest the subunits without adding per-particle draws.
  // Both remain inside the existing .0023 exclusion radius.
  const lobes = [
    new T.IcosahedronGeometry(0.00155, 0).translate(0, 0.00065, 0),
    new T.IcosahedronGeometry(0.00115, 0).translate(0, -0.00095, 0),
  ];
  const ribosomeGeometry = mergeGeometries(lobes);
  lobes.forEach((geometry) => geometry.dispose());
  const particles = new T.InstancedMesh(
    ribosomeGeometry,
    new T.MeshStandardMaterial({ color: "#8d6841", roughness: 0.8 }),
    points.length,
  );
  particles.name = "mitochondrion-matrix-ribosomes";
  const matrix = new T.Matrix4();
  points.forEach((point, i) => {
    const scale = 0.65 + ((i * 0.61803398875) % 1) * 0.35;
    matrix.makeScale(scale, scale, scale).setPosition(...point);
    particles.setMatrixAt(i, matrix);
  });
  group.add(particles);
  const tubes = [-0.087, 0.087].map((center, index) => {
    const path = Array.from({ length: 97 }, (_, i) => {
      const t = (i / 96) * Math.PI * 2;
      return new T.Vector3(
        center + 0.004 * Math.sin(t * 3 + index),
        -0.027 + 0.009 * Math.sin(t * 2),
        0.032 * Math.cos(t),
      );
    });
    return new T.TubeGeometry(
      new T.CatmullRomCurve3(path.slice(0, -1), true),
      128,
      0.00065,
      5,
      true,
    );
  });
  const dna = new T.Mesh(
    mergeGeometries(tubes),
    new T.MeshStandardMaterial({ color: "#8e5974", roughness: 0.68 }),
  );
  dna.name = "mitochondrion-matrix-dna";
  tubes.forEach((g) => g.dispose());
  group.add(dna);
  return group;
}
