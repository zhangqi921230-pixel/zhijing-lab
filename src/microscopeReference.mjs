export function microscopeReference({ mag, x, y }) {
  const dx = (-x * mag) / 100,
    dy = (y * mag) / 100;
  return {
    dx,
    dy,
    visible: Math.hypot(dx, dy) <= 124,
    edgeFraction: Math.hypot(dx, dy) / 124,
    lowX: ((-x * 0.4) / 124) * 70,
    lowY: ((y * 0.4) / 124) * 70,
  };
}
