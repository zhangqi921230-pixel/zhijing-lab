// Samples must belong to one continuous domain branch. Solve at the actual
// function boundary rather than connecting an extrapolated chord to the frame.
export function clipFunctionSamples(samples, evaluate, limit) {
  const paths = [];
  let points = [],
    previous = null;
  const flush = () => {
    if (points.length > 1) paths.push(points);
    points = [];
  };
  const crossing = (a, b, boundary) => {
    let low = a[0],
      high = b[0],
      lowY = a[1];
    for (let i = 0; i < 48; i++) {
      const mid = (low + high) / 2,
        y = evaluate(mid);
      if (y === null || Number.isNaN(y)) return null;
      if (lowY < boundary === y < boundary) {
        low = mid;
        lowY = y;
      } else high = mid;
    }
    return [(low + high) / 2, boundary];
  };
  for (const x of samples) {
    const y = evaluate(x);
    if (y === null || Number.isNaN(y)) {
      flush();
      previous = null;
      continue;
    }
    const current = [x, y],
      inside = Number.isFinite(y) && Math.abs(y) <= limit;
    if (previous) {
      const beforeInside =
        Number.isFinite(previous[1]) && Math.abs(previous[1]) <= limit;
      if (!beforeInside && inside) {
        const edge = crossing(
          previous,
          current,
          Math.sign(previous[1]) * limit,
        );
        if (edge) points.push(edge);
      } else if (beforeInside && !inside) {
        const edge = crossing(previous, current, Math.sign(y) * limit);
        if (edge) points.push(edge);
        flush();
      } else if (
        !beforeInside &&
        !inside &&
        Math.sign(previous[1]) !== Math.sign(y)
      ) {
        const a = crossing(previous, current, Math.sign(previous[1]) * limit);
        const b = crossing(previous, current, Math.sign(y) * limit);
        if (a && b) paths.push([a, b]);
      }
    }
    if (inside) points.push(current);
    previous = current;
  }
  flush();
  return paths;
}
