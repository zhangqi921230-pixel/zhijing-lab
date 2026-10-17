const clamp = (v) => Math.max(0, Math.min(1, v));
export function squareDissection(p, time) {
  const a = p.a * 38,
    b = p.b * 38,
    h = a - b,
    radius = Math.hypot(h, b) / 2;
  const travel = clamp(time - 1),
    lower = clamp((time - 2) / 0.5),
    turn = clamp((time - 2.5) / 1.5),
    join = clamp((time - 4) / 2);
  const stagingX = a + radius + 18,
    stagingY = radius + 14;
  const cx =
    (h / 2 + (stagingX - h / 2) * travel) * (1 - join) + (a + b / 2) * join;
  const cy =
    (b / 2 + (stagingY - b / 2) * lower) * (1 - join) + (b + h / 2) * join;
  return { a, b, h, cx, cy, angle: turn * 90 };
}
