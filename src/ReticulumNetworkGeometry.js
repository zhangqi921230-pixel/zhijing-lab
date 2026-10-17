import * as THREE from "three";
import { MarchingCubes } from "three/addons/objects/MarchingCubes.js";
import { mergeVertices } from "three/addons/utils/BufferGeometryUtils.js";

// Bake the union of narrow curved tubes once. A shared surface removes the
// overlapping circular tube ends at branches without changing their paths.
export function reticulumNetworkGeometry(paths) {
  const resolution = 64;
  const bounds = new THREE.Box3();
  const curves = paths.map((points) => {
    const samples = new THREE.CatmullRomCurve3(
      points.map((point) => new THREE.Vector3(...point)),
    ).getPoints(points.length > 3 ? 80 : 32);
    samples.forEach((point) => bounds.expandByPoint(point));
    return samples;
  });
  bounds.expandByScalar(0.025);
  const size = bounds.getSize(new THREE.Vector3());
  const grid = new MarchingCubes(resolution, undefined, true, false, 50000);
  grid.isolation = 0;
  grid.field.fill(-0.02);
  const step = size.clone().divideScalar(resolution);
  const radius = 0.01,
    blend = 0.002;
  for (const points of curves) {
    for (let i = 1; i < points.length; i++) {
      const a = points[i - 1],
        b = points[i];
      const delta = b.clone().sub(a),
        lengthSq = delta.lengthSq();
      const low = a
        .clone()
        .min(b)
        .addScalar(-radius - blend)
        .sub(bounds.min)
        .divide(step)
        .floor();
      const high = a
        .clone()
        .max(b)
        .addScalar(radius + blend)
        .sub(bounds.min)
        .divide(step)
        .ceil();
      for (
        let z = Math.max(1, low.z);
        z <= Math.min(resolution - 2, high.z);
        z++
      )
        for (
          let y = Math.max(1, low.y);
          y <= Math.min(resolution - 2, high.y);
          y++
        )
          for (
            let x = Math.max(1, low.x);
            x <= Math.min(resolution - 2, high.x);
            x++
          ) {
            const px = bounds.min.x + x * step.x - a.x;
            const py = bounds.min.y + y * step.y - a.y;
            const pz = bounds.min.z + z * step.z - a.z;
            const t = THREE.MathUtils.clamp(
              (px * delta.x + py * delta.y + pz * delta.z) / lengthSq,
              0,
              1,
            );
            const value =
              radius -
              Math.hypot(px - t * delta.x, py - t * delta.y, pz - t * delta.z);
            const index = x + y * resolution + z * resolution * resolution;
            // Max union is independent of sampling density; no repeated-sample swelling.
            grid.field[index] = Math.max(grid.field[index], value);
          }
    }
  }
  grid.update();
  const geometry = new THREE.BufferGeometry();
  for (const key of ["position"]) {
    const attr = grid.geometry.getAttribute(key);
    geometry.setAttribute(
      key,
      new THREE.BufferAttribute(
        attr.array.slice(0, grid.count * attr.itemSize),
        attr.itemSize,
      ),
    );
  }
  geometry.scale(size.x / 2, size.y / 2, size.z / 2);
  const center = bounds.getCenter(new THREE.Vector3());
  geometry.translate(center.x, center.y, center.z);
  geometry.computeBoundingSphere();
  grid.geometry.dispose();
  grid.material.dispose();
  const indexed = mergeVertices(geometry, 1e-6);
  const triangles = [],
    indices = indexed.index.array;
  for (let i = 0; i < indices.length; i += 3) {
    const a = indices[i],
      b = indices[i + 1],
      c = indices[i + 2];
    if (a !== b && b !== c && c !== a) triangles.push(a, b, c);
  }
  indexed.setIndex(triangles);
  indexed.computeVertexNormals();
  const positions = indexed.attributes.position,
    uv = [];
  for (let i = 0; i < positions.count; i++)
    uv.push(
      (positions.getX(i) - bounds.min.x) / size.x,
      (positions.getZ(i) - bounds.min.z) / size.z,
    );
  indexed.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
  geometry.dispose();
  return indexed;
}
