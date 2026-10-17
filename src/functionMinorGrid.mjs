// Subdivide major intervals only when the resulting screen spacing stays
// legible. Minor lines are unlabelled and never duplicate major grid lines.
export function functionMinorGrid(ticks, extent, pixelsPerUnit) {
  if (ticks.length < 2 || !Number.isFinite(pixelsPerUnit) || pixelsPerUnit <= 0)
    return [];
  const step = ticks[1].value - ticks[0].value;
  const spacing = step * pixelsPerUnit;
  const divisions = spacing >= 50 ? 5 : spacing >= 24 ? 2 : 1;
  if (divisions === 1 || !(step > 0)) return [];
  const increment = step / divisions;
  const count = Math.floor(extent / increment + 1e-9);
  // Extremely wide displays must not create thousands of SVG nodes.
  if (count > 160) return [];
  return Array.from({ length: count * 2 + 1 }, (_, i) => i - count)
    .filter((i) => i % divisions !== 0)
    .map((i) => i * increment);
}
