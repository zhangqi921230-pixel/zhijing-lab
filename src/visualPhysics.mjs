export function waveState(p, x, t) {
  const k = (2 * Math.PI * p.frequency) / p.speed;
  const w = 2 * Math.PI * p.frequency;
  const first = p.amplitude * Math.sin(k * x - w * t);
  const second =
    p.mode === 0
      ? 0
      : p.amplitude *
        Math.sin(
          k * x + (p.mode === 2 ? w * t : -w * t) + (p.phase * Math.PI) / 180,
        );
  return { first, second, total: first + second };
}
export function buoyancyState(p) {
  const ratio = p.solid / p.liquid;
  const fraction = p.mode === 0 ? p.immersion / 100 : Math.min(1, ratio);
  const volume = p.volume / 1000;
  const weight = p.solid * volume * 9.8;
  const force = p.liquid * volume * fraction * 9.8;
  return {
    fraction,
    displaced: p.volume * fraction,
    weight,
    force,
    support: weight - force,
    state:
      p.mode === 0
        ? "受外力约束"
        : ratio < 1
          ? "漂浮平衡"
          : ratio === 1
            ? "悬浮平衡"
            : "沉底平衡",
  };
}
