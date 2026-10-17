// A kinematic teaching section, not a rheology or geological-time solver.
// Horizontal strain and layer thickness are reciprocal: each material column
// retains its cross-sectional area during the prescribed deformation.
export function plateColumn(u, z, p) {
  const s = Math.max(0, Math.min(1, p.progress / 100));
  const strain =
    p.type === 0
      ? 1.2 * s
      : p.type === 1
        ? -(0.6 + 0.08 * Math.sin(z * 3)) * s
        : 0;
  const jacobian = 1 + strain * Math.exp(-4 * u);
  const thickness = 1.1 / jacobian;
  const relief =
    0.05 +
    0.045 * Math.sin(z * 6) * Math.cos(u * 5) +
    0.025 * Math.sin(z * 17) * Math.sin(u * 11) +
    // Shared, deterministic relief adds gullies without changing column volume.
    (p.type === 1
      ? s *
        Math.exp(-u * 2.6) *
        (0.075 * Math.sin(z * 13 + u * 19) + 0.04 * Math.sin(z * 27 - u * 31))
      : 0);
  return {
    x: 3 * (u + (strain * (1 - Math.exp(-4 * u))) / 4),
    top: relief + 0.65 * (thickness - 1.1),
    thickness,
    jacobian,
    offset: p.type === 2 ? s * 0.75 : 0,
  };
}
export function platePoint(side, u, z, fraction, p) {
  const c = plateColumn(u, z, p);
  return [
    side * (c.x + (p.type === 2 ? 0.015 : 0)),
    c.top - fraction * c.thickness,
    z + side * c.offset,
  ];
}
