import { conicState, CONIC_HEIGHT } from "./conicGeometry.mjs";
export function dandelinSpheres(p) {
  const q = conicState(p);
  if (q.degenerate) return [];
  const alpha = (p.alpha * Math.PI) / 180,
    sin = Math.sin(alpha),
    cos = Math.cos(alpha);
  return [q.c + sin, q.c - sin]
    .filter((d) => Math.abs(d) > 1e-9)
    .map((denominator) => {
      const y = p.offset / denominator,
        radius = Math.abs(y) * sin,
        distance = q.c * y - p.offset;
      return {
        y,
        radius,
        focus: [distance * q.s, y - distance * q.c, 0],
        ringY: y * cos * cos,
        ringRadius: Math.abs(y) * sin * cos,
        visible: Math.abs(y) + radius <= CONIC_HEIGHT + 1e-9,
      };
    });
}
export function dandelinTangents(sphere, point) {
  if (!point || Math.abs(point[1]) < 1e-10) return null;
  const factor = sphere.ringY / point[1];
  const tangent = [point[0] * factor, sphere.ringY, point[2] * factor];
  const distance = (to) => Math.hypot(...point.map((v, i) => v - to[i]));
  return {
    tangent,
    toFocus: distance(sphere.focus),
    toCone: distance(tangent),
  };
}
