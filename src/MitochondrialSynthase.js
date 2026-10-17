import * as T from "three";
import { cristaPoint } from "./mitochondrialSurface.mjs";

// Enlarged symbols, not an atomic reconstruction. Paired complexes follow the
// crista crest; catalytic heads project toward the matrix side of the membrane.
export function synthaseSites() {
  const sites = [];
  for (let n = 0; n < 7; n++)
    for (const v of [-0.48, 0, 0.48])
      for (const u of [0.43, 0.57]) {
        const point = new T.Vector3(...cristaPoint(n, u, v));
        const du = new T.Vector3(...cristaPoint(n, u + 0.0001, v)).sub(point);
        const dv = new T.Vector3(...cristaPoint(n, u, v + 0.0001)).sub(point);
        const normal = du.cross(dv).normalize();
        if (normal.y < 0) normal.negate();
        sites.push({ point, normal });
      }
  return sites;
}

export function createMitochondrialSynthase() {
  const group = new T.Group();
  group.name = "mitochondrion-atp-synthase";
  const sites = synthaseSites();
  const components = [
    [
      "membrane-base",
      new T.CylinderGeometry(0.0021, 0.0021, 0.002, 8),
      0,
      "#ad8750",
    ],
    [
      "stalk",
      new T.CylinderGeometry(0.0008, 0.0008, 0.005, 6),
      0.0035,
      "#dec99e",
    ],
    ["catalytic-head", new T.IcosahedronGeometry(0.0034, 0), 0.0075, "#c9aa61"],
  ];
  const matrix = new T.Matrix4(),
    rotation = new T.Quaternion(),
    up = new T.Vector3(0, 1, 0);
  for (const [name, geometry, offset, color] of components) {
    const mesh = new T.InstancedMesh(
      geometry,
      new T.MeshStandardMaterial({ color, roughness: 0.65 }),
      sites.length,
    );
    mesh.name = `synthase-${name}`;
    sites.forEach(({ point, normal }, i) => {
      rotation.setFromUnitVectors(up, normal);
      matrix.compose(
        point.clone().addScaledVector(normal, offset),
        rotation,
        new T.Vector3(1, 1, 1),
      );
      mesh.setMatrixAt(i, matrix);
    });
    mesh.computeBoundingSphere();
    group.add(mesh);
  }
  return group;
}
