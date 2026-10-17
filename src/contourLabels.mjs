import { contourSegments } from "./models.mjs";
const cache = new Map();
// Coordinates remain in the same model space as the interpolated contour.
export function contourLabelAnchors(interval) {
  if (cache.has(interval)) return cache.get(interval);
  if (![50, 100, 200].includes(interval)) return [];
  const labels = [];
  // Label distinct index elevations first. On low-relief maps with a coarse
  // interval, repeat an index elevation in another well-separated location.
  for (let pass = 0; pass < 2; pass++) {
    if (pass === 1 && labels.length >= 2) break;
    for (
      let level = Math.floor(2400 / (interval * 5)) * interval * 5;
      level > 0;
      level -= interval * 5
    ) {
      let best = null,
        bestScore = -Infinity;
      for (const [a, b] of contourSegments(level)) {
        const x = (a[0] + b[0]) / 2,
          z = (a[2] + b[2]) / 2;
        if (Math.abs(x) > 2.45 || Math.abs(z) > 2.6) continue;
        const distance = labels.length
          ? Math.min(...labels.map((p) => Math.hypot(x - p.x, z - p.z)))
          : Math.hypot(x, z) * 0.2;
        const score = distance - Math.abs(x) * 0.025;
        if (score > bestScore) {
          bestScore = score;
          best = { x, z, level };
        }
      }
      if (
        best &&
        (!labels.length ||
          labels.every((p) => Math.hypot(best.x - p.x, best.z - p.z) > 1.05))
      )
        labels.push(best);
    }
  }
  cache.set(interval, labels);
  return labels;
}
