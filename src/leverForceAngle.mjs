export function leverForceAngle(distance, force, degrees) {
  const a = (degrees * Math.PI) / 180,
    c = Math.cos(a),
    s = Math.abs(Math.sin(a)) < 1e-12 ? 0 : Math.sin(a);
  return {
    parallel: force * c,
    perpendicular: force * s,
    arm: distance * s,
    torque: force * distance * s,
    foot: [distance * s * s, -distance * c * s],
    direction: [c, s],
  };
}
