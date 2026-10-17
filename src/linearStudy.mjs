export function linearPointPair(k, b, a, x) {
  const ya = k * a + b,
    y = k * x + b,
    dx = x - a,
    dy = y - ya;
  return { a, ya, x, y, dx, dy, slope: Math.abs(dx) < 1e-10 ? null : dy / dx };
}
export function linearZero(k, b) {
  return k === 0
    ? { kind: b === 0 ? "all" : "none", x: null }
    : { kind: "one", x: -b / k };
}
