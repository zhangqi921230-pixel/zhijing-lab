import { conicPlanePoint } from "./conicGeometry.mjs";

// Bound the finite, visible intersection in the plane's orthonormal coordinates.
// Padding makes the plane readable without covering the entire teaching stage.
export function conicPlaneFrame(p, segments) {
  let minU = Infinity,
    maxU = -Infinity,
    maxV = 0;
  for (const segment of segments)
    for (const point of segment) {
      const [u, v] = conicPlanePoint(p, point);
      minU = Math.min(minU, u);
      maxU = Math.max(maxU, u);
      maxV = Math.max(maxV, Math.abs(v));
    }
  if (!Number.isFinite(minU)) minU = maxU = 0;
  return {
    u: (minU + maxU) / 2,
    width: Math.max(2.4, maxU - minU + 0.8),
    height: Math.max(2.4, 2 * maxV + 0.8),
  };
}
