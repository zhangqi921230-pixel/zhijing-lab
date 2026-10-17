// Illustrative trajectories, not measured locomotion or calibrated velocities.
// Analytic tangents keep the anterior aligned with travel without frame history.
export function pondMotion(index, time) {
  const kind = index % 3;
  const phase = index * 2.399963;
  const rate = [0.19, 0.13, 0.025][kind];
  const radius = [42, 32, 12][kind];
  const a = time * rate + phase;
  const b = a * 2 + index * 0.7;
  const x = Math.sin(index * 13.3) * 245 + radius * Math.cos(a);
  const y =
    Math.cos(index * 8.1) * 245 +
    radius * 0.7 * Math.sin(a) +
    radius * 0.1 * Math.sin(b);
  const vx = -radius * rate * Math.sin(a);
  const vy = radius * rate * (0.7 * Math.cos(a) + 0.2 * Math.cos(b));
  return { x, y, heading: Math.atan2(vy, vx), vx, vy };
}
