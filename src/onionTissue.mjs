// Deterministic shared-vertex tissue. Adjacent cells reuse the very same edge,
// so variation cannot introduce overlapping walls or transparent gaps.
export function onionWallControl(a, b) {
  const [start, end] =
    a[0] < b[0] || (a[0] === b[0] && a[1] < b[1]) ? [a, b] : [b, a];
  const dx = end[0] - start[0],
    dy = end[1] - start[1];
  const length = Math.hypot(dx, dy) || 1;
  const bow =
    Math.sin((start[0] + end[0]) * 0.027 + (start[1] + end[1]) * 0.041) * 1.1;
  return [
    (start[0] + end[0]) / 2 - (dy / length) * bow,
    (start[1] + end[1]) / 2 + (dx / length) * bow,
  ];
}
export function onionTissue() {
  let seed = 721;
  const random = () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 4294967296;
  };
  const columns = 18,
    rows = 50,
    vertices = [];
  for (let row = 0; row <= rows; row++) {
    const line = [];
    for (let col = 0; col <= columns; col++)
      line.push([
        col * 110 - 165 + Math.sin(row * 0.8) * 24 + (random() - 0.5) * 28,
        row * 34 - 65 + (random() - 0.5) * 9,
      ]);
    vertices.push(line);
  }
  const cells = [];
  for (let row = 0; row < rows; row++)
    for (let col = 0; col < columns; col++) {
      const points = [
        vertices[row][col],
        vertices[row][col + 1],
        vertices[row + 1][col + 1],
        vertices[row + 1][col],
      ];
      const u = 0.2 + random() * 0.6,
        v = random() < 0.5 ? 0.2 : 0.8;
      const top = points[0].map((n, i) => n + (points[1][i] - n) * u);
      const bottom = points[3].map((n, i) => n + (points[2][i] - n) * u);
      cells.push({
        points,
        nucleus: top.map((n, i) => n + (bottom[i] - n) * v),
        shade: random(),
        row,
        col,
      });
    }
  return cells;
}
