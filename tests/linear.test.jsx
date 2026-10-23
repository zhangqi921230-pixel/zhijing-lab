import { it, expect } from "vitest";
import {
  graphPoint,
  graphCoordinates,
  linearSegment,
  snapLinear,
} from "../src/LinearScene.jsx";
it("坐标双向换算精确且横纵轴等比例", () => {
  for (const e of [8, 12, 17, 18])
    for (const x of [-4, -0.3, 0, 2.7, 4])
      for (const y of [-16, -0.2, 0, 7, 16]) {
        const screen = graphPoint(x, y, e),
          world = graphCoordinates(...screen, e);
        expect(world[0]).toBeCloseTo(x, 12);
        expect(world[1]).toBeCloseTo(y, 12);
        const origin = graphPoint(0, 0, e),
          unitX = graphPoint(1, 0, e),
          unitY = graphPoint(0, 1, e);
        expect(unitX[0] - origin[0]).toBeCloseTo(origin[1] - unitY[1], 12);
      }
});
it("全部斜率与截距的裁切端点满足方程且落在视窗边界", () => {
  for (const e of [8, 12, 18])
    for (let ki = -30; ki <= 30; ki++)
      for (let bi = -40; bi <= 40; bi++) {
        const k = ki / 10,
          b = bi / 10,
          seg = linearSegment(k, b, e);
        expect(seg).toHaveLength(2);
        for (const [x, y] of seg) {
          expect(y).toBeCloseTo(k * x + b, 10);
          expect(Math.max(Math.abs(x), Math.abs(y))).toBeCloseTo(e, 10);
          expect(Math.abs(x)).toBeLessThanOrEqual(e + 1e-9);
          expect(Math.abs(y)).toBeLessThanOrEqual(e + 1e-9);
        }
      }
});
it("直接操作按步长吸附并限制到课程的有效范围", () => {
  expect(snapLinear(9, -4, 4)).toBe(4);
  expect(snapLinear(-9, -4, 4)).toBe(-4);
  expect(snapLinear(2.73, -4, 4)).toBe(2.7);
  expect(snapLinear(-2.77, -4, 4)).toBe(-2.8);
});
