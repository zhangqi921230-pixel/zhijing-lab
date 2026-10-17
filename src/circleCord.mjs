// A circular arc with continuously decreasing curvature, parameterized by
// distance along the cord. This illustrates unbending, not elastic stretching.
export function circleCordPoint(radius, progress, fraction) {
  const length = 2 * Math.PI * radius;
  const k = (1 - Math.max(0, Math.min(1, progress))) / radius;
  const s = (fraction - 0.5) * length;
  if (k < 1e-8) return [s, 0];
  // The cosine difference form avoids cancellation near the straight limit.
  const halfAngle = (k * length) / 2;
  return [
    Math.sin(k * s) / k,
    (2 *
      Math.sin((halfAngle + k * s) / 2) *
      Math.sin((halfAngle - k * s) / 2)) /
      k,
  ];
}
