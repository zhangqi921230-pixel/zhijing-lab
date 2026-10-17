export function conicPointerProbe(clientX, clientY, bounds, points) {
  const scale = Math.min(bounds.width / 360, bounds.height / 290);
  if (!(scale > 0) || points.length < 2) return null;
  const x = (clientX - bounds.left - (bounds.width - 360 * scale) / 2) / scale;
  const y = (clientY - bounds.top - (bounds.height - 290 * scale) / 2) / scale;
  let nearest = 0,
    distance = Infinity;
  points.forEach(([px, py], index) => {
    const d = (px - x) ** 2 + (py - y) ** 2;
    if (d < distance) {
      distance = d;
      nearest = index;
    }
  });
  return (nearest / (points.length - 1)) * 100;
}
