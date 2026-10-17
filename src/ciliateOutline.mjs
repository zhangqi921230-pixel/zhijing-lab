// One outline drives both the illustrative body and the attached cilia.
export const ciliateCurves = [
  [
    [18, 0],
    [17, -6],
    [4, -8],
    [-9, -6],
  ],
  [
    [-9, -6],
    [-22, -3],
    [-20, 5],
    [-7, 7],
  ],
  [
    [-7, 7],
    [1, 8],
    [6, 3],
    [10, 4],
  ],
  [
    [10, 4],
    [14, 5],
    [19, 3],
    [18, 0],
  ],
];
export function ciliateBoundary(fraction) {
  const phase = (((fraction % 1) + 1) % 1) * 4;
  const points = ciliateCurves[Math.floor(phase)],
    t = phase % 1,
    u = 1 - t;
  const position = [0, 1].map(
    (k) =>
      u ** 3 * points[0][k] +
      3 * u ** 2 * t * points[1][k] +
      3 * u * t ** 2 * points[2][k] +
      t ** 3 * points[3][k],
  );
  const velocity = [0, 1].map(
    (k) =>
      3 * u ** 2 * (points[1][k] - points[0][k]) +
      6 * u * t * (points[2][k] - points[1][k]) +
      3 * t ** 2 * (points[3][k] - points[2][k]),
  );
  const length = Math.hypot(...velocity);
  const tangent = velocity.map((v) => v / length);
  return { position, tangent, normal: [-tangent[1], tangent[0]] };
}
export const ciliaRoots = Array.from({ length: 64 }, (_, i) =>
  ciliateBoundary(i / 64),
);
export function ciliumTip(root, index, time) {
  const beat = Math.sin(time * 7 - index * 0.65);
  return root.position.map(
    (v, k) =>
      v + root.normal[k] * (1.7 + 0.35 * beat) + root.tangent[k] * beat * 1.2,
  );
}
