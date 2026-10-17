// Project world north (-Z) onto the camera's screen plane. The matrix is the
// current world-to-camera transform; CSS clockwise angles start at screen up.
export function northScreenAngle(elements) {
  const right = -elements[8],
    up = -elements[9];
  if (Math.hypot(right, up) < 1e-8) return null;
  return (Math.atan2(right, up) * 180) / Math.PI;
}
