export function unitCircleState(p) {
  const theta = (p.k ?? 1) * (p.probe - p.shift);
  return {
    theta,
    cosine: Math.cos(theta),
    sine: Math.sin(theta),
    y: p.a * Math.sin(theta) + p.b,
  };
}
export function circleProbe(p, principalAngle) {
  const k = p.k ?? 1;
  if (k === 0) return null;
  const theta = unitCircleState(p).theta;
  const unwrapped =
    principalAngle +
    2 * Math.PI * Math.round((theta - principalAngle) / (2 * Math.PI));
  return Math.max(-5, Math.min(5, p.shift + unwrapped / k));
}
