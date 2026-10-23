import { it, expect } from "vitest";
import { pythagorasPieces } from "../src/PythagorasScene.jsx";
const area = (p) =>
  Math.abs(
    p.reduce(
      (s, [x, y], i) =>
        s + x * p[(i + 1) % p.length][1] - y * p[(i + 1) % p.length][0],
      0,
    ),
  ) / 2;
function overlaps(a, b) {
  for (const p of [a, b])
    for (let i = 0; i < p.length; i++) {
      const q = p[(i + 1) % p.length],
        n = [q[1] - p[i][1], p[i][0] - q[0]];
      const x = a.map((v) => v[0] * n[0] + v[1] * n[1]),
        y = b.map((v) => v[0] * n[0] + v[1] * n[1]);
      if (
        Math.min(Math.max(...x), Math.max(...y)) -
          Math.max(Math.min(...x), Math.min(...y)) <
        1e-8
      )
        return false;
    }
  return true;
}
it("全部可选边长的两端拼法均无重叠、无缺口，剩余面积分别为 c² 与 a²+b²", () => {
  for (let ai = 10; ai <= 60; ai++)
    for (let bi = 10; bi <= 60; bi++) {
      const a = ai / 10,
        b = bi / 10,
        L = a + b;
      for (const t of [0, 1]) {
        const pieces = pythagorasPieces(a, b, t).map((x) => x.points);
        const remainder =
          t === 0
            ? [
                [
                  [a, 0],
                  [L, a],
                  [b, L],
                  [0, b],
                ],
              ]
            : [
                [
                  [0, 0],
                  [a, 0],
                  [a, a],
                  [0, a],
                ],
                [
                  [a, a],
                  [L, a],
                  [L, L],
                  [a, L],
                ],
              ];
        const all = [...pieces, ...remainder];
        expect(all.reduce((sum, p) => sum + area(p), 0)).toBeCloseTo(L * L, 9);
        expect(remainder.reduce((sum, p) => sum + area(p), 0)).toBeCloseTo(
          a * a + b * b,
          9,
        );
        for (let i = 0; i < all.length; i++) {
          for (const [x, y] of all[i]) {
            expect(x).toBeGreaterThanOrEqual(-1e-8);
            expect(y).toBeGreaterThanOrEqual(-1e-8);
            expect(x).toBeLessThanOrEqual(L + 1e-8);
            expect(y).toBeLessThanOrEqual(L + 1e-8);
          }
          for (let j = i + 1; j < all.length; j++)
            expect(overlaps(all[i], all[j])).toBe(false);
        }
      }
    }
});
it("移动期间三角板面积和三边长度保持不变", () => {
  for (const [a, b] of [
    [1, 6],
    [6, 1],
    [3, 4],
    [2.3, 5.7],
  ])
    for (let i = 0; i <= 20; i++) {
      for (const { points: p } of pythagorasPieces(a, b, i / 20)) {
        expect(area(p)).toBeCloseTo((a * b) / 2, 10);
        expect(Math.hypot(p[1][0] - p[0][0], p[1][1] - p[0][1])).toBeCloseTo(
          a,
          10,
        );
        expect(Math.hypot(p[2][0] - p[0][0], p[2][1] - p[0][1])).toBeCloseTo(
          b,
          10,
        );
        expect(Math.hypot(p[2][0] - p[1][0], p[2][1] - p[1][1])).toBeCloseTo(
          Math.hypot(a, b),
          10,
        );
      }
    }
});
