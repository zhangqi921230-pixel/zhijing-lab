export const gasParticles = Array.from({ length: 42 }, (_, i) => ({
  x: ((i * 47 + 13) % 101) / 101,
  y: ((i * 31 + 7) % 97) / 97,
  vx: (i % 2 ? 1 : -1) * (0.12 + (i % 5) * 0.02),
  vy: (i % 3 ? 1 : -1) * (0.1 + (i % 7) * 0.02),
}));
function reflected(start, velocity, span, time) {
  const phase = (((start + (velocity * time) / span) % 2) + 2) % 2;
  return {
    position: (1 - Math.abs(phase - 1)) * span,
    velocity: velocity * (phase < 1 ? 1 : -1),
  };
}
// Fixed reference lengths preserve speed when the vessel changes size.
export function gasParticleState(p, time, particle = gasParticles[0]) {
  const h = (p.volume / 30) * 260,
    speed = Math.sqrt(p.temperature / 300);
  const x = reflected(particle.x, particle.vx * 205 * speed, 205, time);
  const y = reflected(particle.y, particle.vy * 234 * speed, h - 26, time);
  return {
    x: 191 + x.position,
    y: 370 - h + 14 + y.position,
    vx: x.velocity,
    vy: y.velocity,
    verticalPeriod: (2 * (h - 26)) / Math.abs(y.velocity),
  };
}
