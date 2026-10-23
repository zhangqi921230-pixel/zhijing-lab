import { it, expect } from "vitest";
import {
  circleDissection,
  circleSector,
  packedSector,
} from "../src/CircleScene.jsx";
it("SVG 扇形端点在半径圆上，夹角与等分数量一致", () => {
  for (const r of [1, 2.3, 5])
    for (let n = 6; n <= 48; n += 2) {
      const nums = circleSector(r, n)
        .match(/-?\d+(?:\.\d+)?(?:e[-+]?\d+)?/gi)
        .map(Number);
      const x = nums[2],
        y = nums[3],
        q = circleDissection(r, n);
      expect(Math.hypot(x, y)).toBeCloseTo(r, 12);
      expect(2 * Math.atan2(x, y)).toBeCloseTo((2 * Math.PI) / n, 12);
      expect(nums[4]).toBe(r);
      expect(nums[5]).toBe(r);
      expect(nums[8]).toBe(1);
      expect(nums[9]).toBeCloseTo(-x, 12);
      expect(nums[10]).toBeCloseTo(y, 12);
      expect(q.sectorArea * n).toBeCloseTo(Math.PI * r * r, 12);
    }
});
it("拼合后每个扇形的内部采样点不落入任何其他扇形", () => {
  for (let n = 6; n <= 48; n += 2) {
    const r = 3,
      half = Math.PI / n,
      poses = Array.from({ length: n }, (_, i) => packedSector(r, n, i));
    for (let i = 0; i < n; i++)
      for (const radial of [0.2, 0.65, 0.99])
        for (const angular of [-0.9, 0, 0.9]) {
          const dir = i % 2 ? -1 : 1,
            x = poses[i].x + dir * r * radial * Math.sin(half * angular),
            y = poses[i].y + dir * r * radial * Math.cos(half * angular);
          for (let j = 0; j < n; j++)
            if (j !== i) {
              const sign = j % 2 ? -1 : 1,
                u = (x - poses[j].x) * sign,
                v = (y - poses[j].y) * sign;
              const inside =
                Math.hypot(u, v) < r - 1e-9 &&
                Math.abs(Math.atan2(u, v)) < half - 1e-9;
              expect(inside).toBe(false);
            }
        }
  }
});
it("有限分割的弧高为正，细分时趋于零，弦长之和趋近半圆周", () => {
  let previous = Infinity;
  for (let n = 6; n <= 48; n += 2) {
    const q = circleDissection(3, n);
    expect(q.sagitta).toBeGreaterThan(0);
    expect(q.sagitta).toBeLessThan(previous);
    previous = q.sagitta;
    expect(q.base).toBeLessThan(Math.PI * 3);
  }
  const q = circleDissection(3, 4800);
  expect(q.base).toBeCloseTo(Math.PI * 3, 5);
  expect(q.height).toBeCloseTo(3, 5);
});
