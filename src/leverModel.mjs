const G = 9.8,
  LIMIT = (20 * Math.PI) / 180;
export function leverState(p, t = 0) {
  const left = p.f1 * p.l1,
    right = p.f2 * p.l2,
    inertia = (p.f1 * p.l1 * p.l1 + p.f2 * p.l2 * p.l2) / G;
  let theta = 0,
    omega = 0,
    stopped = false;
  const end = Math.max(0, Math.min(8, t)),
    steps = Math.ceil(end * 240),
    dt = steps ? end / steps : 0;
  const acceleration = (a) => ((left - right) * Math.cos(a)) / inertia;
  for (let i = 0; i < steps; i++) {
    const a1 = acceleration(theta),
      v2 = omega + (a1 * dt) / 2,
      a2 = acceleration(theta + (omega * dt) / 2),
      v3 = omega + (a2 * dt) / 2,
      a3 = acceleration(theta + (v2 * dt) / 2),
      v4 = omega + a3 * dt,
      a4 = acceleration(theta + v3 * dt);
    theta += (dt * (omega + 2 * v2 + 2 * v3 + v4)) / 6;
    omega += (dt * (a1 + 2 * a2 + 2 * a3 + a4)) / 6;
    if (Math.abs(theta) >= LIMIT) {
      theta = Math.sign(theta) * LIMIT;
      omega = 0;
      stopped = true;
      break;
    }
  }
  const cos = Math.cos(theta),
    potentialDrop = (left - right) * Math.sin(theta);
  return {
    theta,
    angle: (theta * 180) / Math.PI,
    omega,
    inertia,
    stopped,
    leftArm: p.l1 * cos,
    rightArm: p.l2 * cos,
    leftTorque: left * cos,
    rightTorque: right * cos,
    alpha: stopped ? 0 : acceleration(theta),
    stopTorque: stopped ? -(left - right) * cos : 0,
    kinetic: 0.5 * inertia * omega * omega,
    potentialDrop,
  };
}
export const leverPoint = (distance, angle) => [
  360 + distance * 140 * Math.cos(angle),
  270 - distance * 140 * Math.sin(angle),
];
