export function polarPoint(p, theta) {
  const rawRadius =
    p.shape === 0
      ? p.radius
      : p.shape === 1
        ? p.radius * (1 + Math.cos(theta))
        : p.radius * Math.cos(p.petals * theta);
  const r = Math.abs(rawRadius) < 1e-12 ? 0 : rawRadius;
  return { r, x: r * Math.cos(theta), y: r * Math.sin(theta), theta };
}
export function projectileState(p, progress) {
  const a = (p.angle * Math.PI) / 180,
    vx = p.angle === 90 ? 0 : p.speed * Math.cos(a),
    vy0 = p.speed * Math.sin(a);
  const duration =
    (vy0 + Math.sqrt(vy0 * vy0 + 2 * p.gravity * p.height)) / p.gravity;
  const t = Math.min(1, Math.max(0, progress)) * duration;
  return {
    t,
    duration,
    vx,
    vy: Math.abs(vy0 - p.gravity * t) < 1e-10 ? 0 : vy0 - p.gravity * t,
    x: vx * t,
    y: Math.max(0, p.height + vy0 * t - (p.gravity * t * t) / 2),
    range: vx * duration,
    apex: p.height + (vy0 * vy0) / (2 * p.gravity),
  };
}

export function projectileApexProgress(p) {
  const duration = projectileState(p, 0).duration;
  return duration === 0
    ? 0
    : (p.speed * Math.sin((p.angle * Math.PI) / 180)) / p.gravity / duration;
}
