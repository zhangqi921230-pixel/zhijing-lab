export function dissectionPoses(a, b, time) {
  const l = a + b;
  const start = [
    [0, 0, 0],
    [l, 0, 90],
    [l, l, 180],
    [0, l, 270],
  ];
  const end = [
    [0, 0, 0],
    [a, b, 180],
    [a, l, 270],
    [l, b, 450],
  ];
  return start.map((pose, i) => {
    const progress =
      i === 0 ? 1 : Math.max(0, Math.min(1, (time - 2 * (i - 1)) / 2));
    const eased = progress * progress * (3 - 2 * progress);
    return pose.map((v, j) => v + (end[i][j] - v) * eased);
  });
}
export function dissectionVertices(a, b, pose) {
  const [x, y, angle] = pose,
    r = (angle * Math.PI) / 180;
  return [
    [x, y],
    [x + a * Math.cos(r), y + a * Math.sin(r)],
    [x - b * Math.sin(r), y + b * Math.cos(r)],
  ];
}
