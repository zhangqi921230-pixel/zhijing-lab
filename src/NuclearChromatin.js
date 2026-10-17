import * as T from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";

export const nucleusCenter = new T.Vector3(-1.36, -0.25, 0.55);
export const nucleolusCenter = new T.Vector3(-1.42, -0.4, 0.61);

// Folded interphase chromatin, not condensed chromosomes or molecular-scale DNA.
// Deterministic curves are confined to the retained half of the teaching nucleus.
export function buildNuclearChromatin() {
  const geometries = [];
  const localNucleolus = nucleolusCenter.clone().sub(nucleusCenter);
  for (let strand = 0; strand < 12; strand++) {
    const points = [];
    for (let k = 0; k <= 180; k++) {
      const t = (k / 180) * 12,
        phase = strand * 2.399963;
      const point = new T.Vector3(
        0.31 * Math.sin(t * 0.91 + phase) + 0.045 * Math.sin(t * 5.3 + phase),
        -0.22 + 0.15 * Math.sin(t * 1.31 + phase) + 0.014 * Math.sin(t * 7.1),
        0.31 * Math.cos(t * 0.73 + phase) + 0.042 * Math.sin(t * 4.7),
      );
      if (point.length() > 0.43) point.setLength(0.43);
      const offset = point.clone().sub(localNucleolus);
      if (offset.length() < 0.17)
        point.copy(localNucleolus).add(offset.setLength(0.17));
      points.push(point.add(nucleusCenter));
    }
    const curve = new T.CatmullRomCurve3(points);
    const geometry = new T.TubeGeometry(curve, 220, 0.0045, 6, false);
    const colors = new Float32Array(geometry.attributes.position.count * 3);
    const position = geometry.attributes.position;
    const color = new T.Color(),
      vertex = new T.Vector3();
    // Vary the illustrative packing continuously along each fibre; no extra
    // particles, molecular beads, or per-frame geometry are required.
    for (let ring = 0; ring <= 220; ring++) {
      const u = ring / 220,
        center = curve.getPointAt(u);
      const packing =
        0.5 +
        0.3 * Math.sin(u * 27 + strand * 1.7) +
        0.2 * Math.sin(u * 71 + strand);
      const thickness = 0.65 + 0.75 * packing;
      color.setHSL(0.755 + strand * 0.002, 0.28, 0.36 + packing * 0.13);
      for (let side = 0; side <= 6; side++) {
        const i = ring * 7 + side;
        vertex
          .fromBufferAttribute(position, i)
          .sub(center)
          .multiplyScalar(thickness)
          .add(center);
        position.setXYZ(i, vertex.x, vertex.y, vertex.z);
        color.toArray(colors, i * 3);
      }
    }
    geometry.computeVertexNormals();
    geometry.setAttribute("color", new T.BufferAttribute(colors, 3));
    geometries.push(geometry);
  }
  const merged = mergeGeometries(geometries);
  geometries.forEach((g) => g.dispose());
  const mesh = new T.Mesh(
    merged,
    new T.MeshStandardMaterial({ vertexColors: true, roughness: 0.72 }),
  );
  mesh.name = "cell-chromatin";
  mesh.userData = { action: "parameter", key: "part", value: 1 };
  return mesh;
}
