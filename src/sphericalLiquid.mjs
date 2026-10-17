// Height is measured from the bottom of a spherical vessel.
export function sphericalLiquidLevel(radius, fraction) {
  const f = Math.max(0, Math.min(1, fraction));
  let low = 0,
    high = 2;
  for (let i = 0; i < 40; i++) {
    const h = (low + high) / 2;
    if ((h * h * (3 - h)) / 4 < f) low = h;
    else high = h;
  }
  const height =
    f === 0 ? 0 : f === 1 ? 2 * radius : ((low + high) * radius) / 2;
  return {
    height,
    y: height - radius,
    surfaceRadius: Math.sqrt(Math.max(0, height * (2 * radius - height))),
  };
}
