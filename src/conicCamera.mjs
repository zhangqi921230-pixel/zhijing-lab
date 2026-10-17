export function conicCameraFov(baseFov, aspect) {
  // Preserve a useful vertical drawing scale on desktop; widen only when
  // the available width, rather than the height, limits the double cone.
  return (
    (360 / Math.PI) *
    Math.atan(
      Math.tan((baseFov * Math.PI) / 360) *
        Math.max(1.12, 1.2 / Math.max(0.1, aspect)),
    )
  );
}
