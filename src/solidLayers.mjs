export function solidLayers(radius, height, fraction, count) {
  const f = Math.max(0, Math.min(1, fraction)),
    n = Math.max(1, Math.round(count));
  const dz = (height * f) / n,
    base = Math.PI * radius * radius;
  const layers = Array.from({ length: n }, (_, i) => {
    const bottom = (f * i) / n,
      top = (f * (i + 1)) / n;
    return {
      bottom,
      top,
      inner: radius * (1 - top),
      outer: radius * (1 - bottom),
    };
  });
  return {
    layers,
    dz,
    lower: layers.reduce((sum, s) => sum + Math.PI * s.inner ** 2 * dz, 0),
    upper: layers.reduce((sum, s) => sum + Math.PI * s.outer ** 2 * dz, 0),
    exact: base * height * (f - f * f + (f * f * f) / 3),
  };
}
