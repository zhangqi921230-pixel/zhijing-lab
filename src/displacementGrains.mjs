// Deterministic qualitative deposit layout; distances are scene units, not
// a microscopic grain-size or settling-speed prediction.
export function displacementGrain(i, fraction, appearance, support = 0.034026) {
  const scale = Math.cbrt(Math.max(0, fraction)) * (0.45 + (i % 7) * 0.08);
  const edge = support * scale;
  const u = ((i + 1) * 0.61803398875) % 1;
  const v = ((i + 1) * 0.41421356237) % 1;
  const radius = 0.55 * Math.sqrt((i + 0.5) / 100);
  const angle = i * 2.39996322973;
  const t = appearance.settling;
  return {
    scale,
    x:
      (u - 0.5) * Math.max(0, 0.24 - 2 * edge) * (1 - t) +
      radius * Math.cos(angle) * t,
    y: (0.32 + v * 1.1) * (1 - t) + (0.21 + edge) * t,
    z:
      (i % 2 ? 1 : -1) * (0.0425 * appearance.metalFraction + edge) * (1 - t) +
      radius * Math.sin(angle) * t,
  };
}
