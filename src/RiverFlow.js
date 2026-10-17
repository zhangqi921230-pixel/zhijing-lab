import { terrainHeightAt } from "./models.mjs";
import * as T from "three";
import { riverCenter, riverHeight, TERRAIN_SCALE } from "./terrainWorld.mjs";
export function riverArrow(z) {
  if (z < -2.95 || z > 2.85 || (z > 0.73 && z < 2.23)) return null;
  const end = z + 0.08,
    x = riverCenter(z),
    tx = riverCenter(end),
    dx = tx - x,
    dz = end - z,
    length = Math.hypot(dx, dz),
    px = (-dz / length) * 0.018,
    pz = (dx / length) * 0.018;
  const point = (x, z) => [x, riverHeight(z) / TERRAIN_SCALE + 0.012, z];
  const a = point(x, z),
    b = point(tx, end);
  for (let scale = 1; scale >= 0.0625; scale *= 0.5) {
    const left = point(
        tx - dx * 0.45 + px * scale,
        end - dz * 0.45 + pz * scale,
      ),
      right = point(tx - dx * 0.45 - px * scale, end - dz * 0.45 - pz * scale);
    const points = [...a, ...b, ...b, ...left, ...b, ...right];
    let wet = true;
    for (let segment = 0; segment < 3; segment++)
      for (let i = 0; i <= 4; i++) {
        const offset = segment * 6,
          t = i / 4,
          sx = points[offset] * (1 - t) + points[offset + 3] * t,
          sz = points[offset + 2] * (1 - t) + points[offset + 5] * t;
        if (terrainHeightAt(sx, sz) >= riverHeight(sz)) {
          wet = false;
          break;
        }
      }
    if (wet) return points;
  }
  return null;
}
export function buildRiverFlow(root) {
  const geometry = new T.BufferGeometry();
  geometry.setAttribute(
    "position",
    new T.BufferAttribute(new Float32Array(20 * 18), 3).setUsage(
      T.DynamicDrawUsage,
    ),
  );
  const arrows = new T.LineSegments(
    geometry,
    new T.LineBasicMaterial({
      color: "#d5f4f0",
      transparent: true,
      opacity: 0.85,
      depthWrite: false,
    }),
  );
  arrows.name = "river-flow-vectors";
  arrows.frustumCulled = false;
  arrows.visible = false;
  root.add(arrows);
}
export function updateRiverFlow(root, time, enabled) {
  const arrows = root.getObjectByName("river-flow-vectors");
  if (!arrows) return;
  arrows.visible = enabled;
  if (!enabled) return;
  const attribute = arrows.geometry.getAttribute("position");
  let count = 0;
  for (let i = 0; i < 20; i++) {
    const z = -2.95 + (((i / 20) * 5.8 + time * 0.17) % 5.8),
      points = riverArrow(z);
    if (points) {
      attribute.array.set(points, count * 18);
      count++;
    }
  }
  arrows.geometry.setDrawRange(0, count * 6);
  attribute.needsUpdate = true;
  if (root.userData.waterTime) root.userData.waterTime.value = time;
}
