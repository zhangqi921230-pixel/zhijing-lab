import { expect, it } from "vitest";
import { solidNetMeasures } from "../src/SolidNets.jsx";

it("展开保持弧长和侧面积，且覆盖大于半圆的扇形", () => {
  for (const r of [0.5, 0.8, 1.2, 2])
    for (const h of [1, 2.5, 4]) {
      const q = solidNetMeasures(r, h);
      expect(q.slant ** 2).toBeCloseTo(r ** 2 + h ** 2, 12);
      expect(q.angle * q.slant).toBeCloseTo(2 * Math.PI * r, 12);
      expect(0.5 * q.angle * q.slant ** 2).toBeCloseTo(q.coneArea, 12);
      expect(q.circumference * h).toBeCloseTo(q.cylinderArea, 12);
      expect(q.angle).toBeLessThan(2 * Math.PI);
    }
  expect(solidNetMeasures(2, 1).angle).toBeGreaterThan(Math.PI);
});
