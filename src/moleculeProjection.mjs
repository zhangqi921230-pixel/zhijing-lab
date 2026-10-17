import { moleculeGeometry } from "./moleculeGeometry.mjs";
export function moleculeProjection(type, angle) {
  const a = (angle * Math.PI) / 180,
    c = Math.cos(a),
    s = Math.sin(a),
    g = moleculeGeometry(type);
  const points = g.points.map(([x, y, z]) => [
    x * c + z * s,
    y,
    -x * s + z * c,
  ]);
  const u = points[1],
    v = points[2],
    length = Math.hypot(u[0], u[1]) * Math.hypot(v[0], v[1]);
  const projectedAngle =
    length < 1e-10
      ? null
      : (Math.acos(
          Math.max(-1, Math.min(1, (u[0] * v[0] + u[1] * v[1]) / length)),
        ) *
          180) /
        Math.PI;
  return { ...g, points, projectedAngle };
}
