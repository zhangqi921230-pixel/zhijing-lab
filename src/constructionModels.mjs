export const trianglePoints = [
  [1, 1],
  [3, 1],
  [2, 2.8],
];
export function transformedPoint([x, y], p, time) {
  const f = Math.max(0, Math.min(1, time / 6));
  if (p.mode === 1) {
    const a = ((p.turn * Math.PI) / 180) * f;
    return [
      x * Math.cos(a) - y * Math.sin(a),
      x * Math.sin(a) + y * Math.cos(a),
    ];
  }
  const a = (p.axis * Math.PI) / 180,
    u = x * Math.cos(a) + y * Math.sin(a),
    v = (-x * Math.sin(a) + y * Math.cos(a)) * Math.cos(Math.PI * f);
  return [u * Math.cos(a) - v * Math.sin(a), u * Math.sin(a) + v * Math.cos(a)];
}
export function pulleyState(p, time) {
  const n = p.mode === 1 ? 2 : 1,
    h = p.lift * Math.max(0, Math.min(1, time / 6)),
    weight = p.mass * 9.8,
    force = weight / n;
  return { n, h, distance: n * h, weight, force, work: weight * h };
}
