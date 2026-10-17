import * as T from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import { envelopePoint } from "./CellEnvelope.js";

// Illustrative cortical arrays, not traced microscopy data. All paths lie in
// the peripheral cytoplasm; plant cortical microtubules do not radiate from
// an animal-style centrosome. Diameter and separation are enlarged for teaching.
export function corticalPaths(kind) {
  return Array.from({ length: kind === "microtubules" ? 18 : 12 }, (_, i) => {
    const micro = kind === "microtubules";
    const start = Math.PI + 0.12 + (micro ? (i % 3) * 0.84 : (i % 4) * 0.59);
    const span = micro ? 0.84 : 0.68;
    return Array.from({ length: 33 }, (_, j) => {
      const t = j / 32;
      const phi = start + span * t;
      const theta = micro
        ? 1.7 + Math.floor(i / 3) * 0.19 + 0.035 * Math.sin(t * Math.PI + i)
        : 1.68 +
          Math.floor(i / 4) * 0.22 +
          0.45 * t +
          0.07 * Math.sin(t * Math.PI * 2 + i);
      return new T.Vector3(
        ...envelopePoint(
          -Math.sin(theta) * Math.cos(phi),
          Math.cos(theta),
          Math.sin(theta) * Math.sin(phi),
          micro ? 0.944 : 0.929,
        ),
      );
    });
  });
}

export function createCellCytoskeleton() {
  const group = new T.Group();
  group.name = "cell-cytoskeleton";
  for (const [kind, radius, color] of [
    ["microtubules", 0.009, "#e6c374"],
    ["actin", 0.005, "#a4d6ec"],
  ]) {
    const parts = corticalPaths(kind).map(
      (points) =>
        new T.TubeGeometry(
          new T.CatmullRomCurve3(points),
          40,
          radius,
          6,
          false,
        ),
    );
    const mesh = new T.Mesh(
      mergeGeometries(parts),
      new T.MeshStandardMaterial({ color, roughness: 0.67, metalness: 0 }),
    );
    parts.forEach((part) => part.dispose());
    mesh.name = `cell-cortical-${kind}`;
    mesh.raycast = () => {};
    group.add(mesh);
  }
  group.userData.update = (mode) => {
    group.children[0].visible = mode === 1 || mode === 3;
    group.children[1].visible = mode === 2 || mode === 3;
  };
  return group;
}
