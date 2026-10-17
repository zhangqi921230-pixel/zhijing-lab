// Fixed illustrative geometry; distances are display units, not measured bond lengths.
export const molecules = [
  { formula: "H₂O", shape: "折线形", angle: 104.5, pairs: 2, domains: 4 },
  { formula: "CO₂", shape: "直线形", angle: 180, pairs: 0, domains: 2 },
  {
    formula: "CH₄",
    shape: "正四面体",
    angle: (Math.acos(-1 / 3) * 180) / Math.PI,
    pairs: 0,
    domains: 4,
  },
  { formula: "NH₃", shape: "三角锥形", angle: 107.3, pairs: 1, domains: 4 },
];

export function moleculeGeometry(type, spread = 1) {
  let points, types, faces;
  if (type === 0) {
    const a = (104.5 * Math.PI) / 360;
    points = [
      [0, 0, 0],
      [1.6 * Math.sin(a), 1.6 * Math.cos(a), 0],
      [-1.6 * Math.sin(a), 1.6 * Math.cos(a), 0],
    ];
    types = ["O", "H", "H"];
    faces = [[0, 1, 2]];
  } else if (type === 1) {
    points = [
      [0, 0, 0],
      [-2, 0, 0],
      [2, 0, 0],
    ];
    types = ["C", "O", "O"];
    faces = [];
  } else if (type === 3) {
    const y = -Math.sqrt((Math.cos((107.3 * Math.PI) / 180) + 0.5) / 1.5);
    const r = Math.sqrt(1 - y * y);
    points = [
      [0, 0, 0],
      ...Array.from({ length: 3 }, (_, i) => {
        const a = (i * 2 * Math.PI) / 3 - Math.PI / 6;
        return [1.7 * r * Math.cos(a), 1.7 * y, 1.7 * r * Math.sin(a)];
      }),
    ];
    types = ["N", "H", "H", "H"];
    faces = [
      [1, 2, 3],
      [0, 1, 2],
      [0, 2, 3],
      [0, 3, 1],
    ];
  } else {
    points = [
      [0, 0, 0],
      [1, 1, 1],
      [-1, -1, 1],
      [-1, 1, -1],
      [1, -1, -1],
    ];
    types = ["C", "H", "H", "H", "H"];
    faces = [
      [1, 2, 3],
      [1, 4, 2],
      [1, 3, 4],
      [2, 4, 3],
    ];
  }
  return { points: points.map((p) => p.map((v) => v * spread)), types, faces };
}
