export function distillationDrop(time, collected) {
  const surface = 0.21 + (collected / 60) * 0.55,
    phase = ((time % 1) + 1) % 1,
    fall = Math.min(1, phase / 0.8),
    impact = phase >= 0.8;
  return {
    surface,
    y: 0.96 - (0.96 - surface - 0.035) * fall * fall,
    visible: !impact,
    ripple: impact ? (phase - 0.8) / 0.2 : 0,
  };
}
