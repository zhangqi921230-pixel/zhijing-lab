import { mitochondrionAnchor } from "./cellLayout.mjs";
const closeups = {
  nucleus: [[-1.36, -0.25, 0.55], [-1.4, 1.6, 2.4], 0.8],
  vacuole: [[0.55, -0.08, 0], [2.5, 2.8, 4.4], 1],
  chloroplast: [[1.75, -0.51, 1.05], [2, 0.4, 2.6], 0.6],
  mitochondrion: [
    mitochondrionAnchor.map((v, i) => v - (i === 1 ? 0.03 : 0)),
    mitochondrionAnchor.map((v, i) => v + [0.2, 0.7, 0.98][i]),
    0.35,
  ],
  golgi: [[-1.6, -0.08, -0.5], [-0.8, 0.5, 1.05], 0.45],
  reticulum: [[-1.06, -0.43, -0.5], [-0.5, 0.2, 0.7], 0.35],
};

export function cellCameraFov(baseFov, aspect) {
  return (
    (360 / Math.PI) *
    Math.atan(Math.tan((baseFov * Math.PI) / 360) * Math.max(1, 1.5 / aspect))
  );
}

export function cellCloseupCamera(view, angle = 0) {
  const preset = closeups[view];
  if (!preset) return null;
  const [target, oblique, minDistance] = preset;
  const distance = Math.hypot(...oblique.map((v, i) => v - target[i]));
  // Keep the same orbit radius in all three directions. A tiny Z offset
  // avoids the top view becoming collinear with the camera's up vector.
  const offset =
    angle === 1
      ? [0, 0, distance]
      : [0, Math.sqrt(distance ** 2 - 0.000001), 0.001];
  return {
    target: [...target],
    position:
      angle === 1 || angle === 2
        ? target.map((v, i) => v + offset[i])
        : [...oblique],
    minDistance,
  };
}
