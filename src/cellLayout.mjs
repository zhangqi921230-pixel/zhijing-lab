// Teaching layout, not measured organelle coordinates. Distribute complete
// mitochondria through the peripheral cytoplasm around the central vacuole.
export const mitochondrionSites = [
  [-0.85, -0.3, -1.58],
  [0.25, -0.34, -1.6],
  [2.08, -0.48, -0.25],
  [-0.45, -0.56, 1.55],
];
export const mitochondrionPoses = [
  { scale: 1, yaw: 0 },
  { scale: 0.82, yaw: 0.2 },
  { scale: 0.85, yaw: 1.15 },
  { scale: 0.65, yaw: -0.04 },
];
export const mitochondrionAnchor = mitochondrionSites[0];
// Visible left rim of the lower-hemisphere nuclear cutaway, not its removed roof.
export const nucleusAnchor = [-1.91, -0.25, 0.55];
