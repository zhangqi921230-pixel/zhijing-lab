export const CONIC_HEIGHT = 2.2;
export function conicState(p) {
  const alpha = (p.alpha * Math.PI) / 180;
  const theta = (p.tilt * Math.PI) / 180;
  const k = Math.tan(alpha),
    s = Math.sin(theta),
    c = Math.cos(theta);
  const eccentricity = s / Math.cos(alpha);
  const degenerate = Math.abs(p.offset) < 1e-10;
  const kind =
    Math.abs(eccentricity - 1) < 1e-9
      ? "抛物线"
      : eccentricity > 1
        ? "双曲线"
        : p.tilt === 0
          ? "圆"
          : "椭圆";
  return {
    k,
    s,
    c,
    eccentricity,
    kind: degenerate
      ? Math.abs(eccentricity - 1) < 1e-9
        ? "一条直线"
        : eccentricity > 1
          ? "两条相交直线"
          : "一个点"
      : kind,
    degenerate,
  };
}
export function conicSegments(p, samples = 2048) {
  const q = conicState(p),
    d = p.offset,
    H = CONIC_HEIGHT;
  if (q.degenerate) {
    if (q.eccentricity < 1 - 1e-9) return [];
    const x = q.c / q.s;
    const z = Math.sqrt(Math.max(0, q.k * q.k - x * x));
    return (z < 1e-7 ? [1] : [-1, 1]).map((sign) => [
      [-x * H, -H, -sign * z * H],
      [x * H, H, sign * z * H],
    ]);
  }
  const point = (angle) => {
    const denominator = q.c - q.k * q.s * Math.cos(angle);
    if (Math.abs(denominator) < 1e-10) return null;
    const y = d / denominator;
    return Math.abs(y) <= H
      ? [q.k * y * Math.cos(angle), y, q.k * y * Math.sin(angle)]
      : null;
  };
  const segments = [];
  let previous = point(0);
  for (let i = 1; i <= samples; i++) {
    const next = point((i / samples) * 2 * Math.PI);
    if (previous && next && previous[1] * next[1] > 0)
      segments.push([previous, next]);
    previous = next;
  }
  return segments;
}
export function conicPlanePoint(p, point) {
  const { s, c } = conicState(p);
  return [point[0] * c + point[1] * s, point[2]];
}

// Orthogonal projections of the axis-centered tangent spheres onto the cutting
// plane. At the parabolic limit one sphere recedes to infinity; only the finite
// focus remains. Plane coordinates use an orthonormal basis.
export const CONIC_FOCUS_RANGE = 3.2;
export function conicFoci(p) {
  const q = conicState(p);
  if (q.degenerate) return [];
  const sinAlpha = Math.sin((p.alpha * Math.PI) / 180);
  const result = [];
  for (const denominator of [q.c + sinAlpha, q.c - sinAlpha]) {
    if (Math.abs(denominator) < 1e-9) continue;
    const u = (p.offset * q.s) / denominator;
    if (result.some((f) => Math.abs(f.u - u) < 1e-9)) continue;
    result.push({
      u,
      point: [-p.offset * q.s + u * q.c, p.offset * q.c + u * q.s, 0],
    });
  }
  return result.sort((a, b) => a.u - b.u);
}
