import * as T from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";

// A shared broadleaf crown with asymmetric branch clusters; instances provide
// rotation, scale and colour variation without one draw call per tree.
export function watershedCrownGeometry() {
  const clusters = [
    [0, 0.025, 0, 0.087, 1.35],
    [-0.059, -0.022, 0.027, 0.065, 1.12],
    [0.057, -0.015, 0.02, 0.071, 1.05],
    [0.015, -0.035, -0.065, 0.066, 1.22],
    [-0.045, 0.005, -0.042, 0.06, 1.16],
  ];
  const pieces = clusters.map(([x, y, z, r, stretch], index) => {
    const geometry = new T.IcosahedronGeometry(r, index < 2 ? 1 : 0);
    const pos = geometry.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const px = pos.getX(i),
        py = pos.getY(i),
        pz = pos.getZ(i);
      const ripple =
        1 + 0.075 * Math.sin(px * 190 + index) * Math.cos(pz * 170 + py * 91);
      pos.setXYZ(
        i,
        px * ripple + x,
        py * stretch * ripple + y,
        pz * ripple + z,
      );
    }
    geometry.computeVertexNormals();
    return geometry;
  });
  const result = mergeGeometries(pieces);
  pieces.forEach((g) => g.dispose());
  result.computeBoundingSphere();
  return result;
}
