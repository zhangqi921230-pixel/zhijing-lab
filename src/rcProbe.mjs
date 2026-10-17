export function rcProbeTime(clientX, bounds, tau) {
  const scale = Math.min(bounds.width / 440, bounds.height / 225);
  if (!(scale > 0) || !(tau > 0)) return null;
  const left = bounds.left + (bounds.width - 440 * scale) / 2;
  const x = (clientX - left) / scale;
  return Math.max(0, Math.min(1, (x - 46) / 360)) * 5 * tau;
}
