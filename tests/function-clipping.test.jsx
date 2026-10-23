import { expect, it } from "vitest";
import { functionPaths } from "../src/FunctionStudio.jsx";
import { clipFunctionSamples } from "../src/functionClipping.mjs";

it("二次曲线精确延伸到上下视窗边缘，而非最后一个网格采样点", () => {
  const paths = functionPaths({ type: 0, a: 1, k: 1, b: 0, shift: 0.23 }, 6, 2);
  const points = paths.flat();
  expect(points[0][1]).toBe(2);
  expect(points.at(-1)[1]).toBe(2);
  expect(points[0][0]).toBeCloseTo(0.23 - Math.sqrt(2), 10);
  expect(points.at(-1)[0]).toBeCloseTo(0.23 + Math.sqrt(2), 10);
});
it("反比例两支分开裁剪，不跨越渐近线", () => {
  const paths = functionPaths({ type: 3, a: 1, k: 1, b: 0, shift: 0.23 }, 6, 2);
  expect(paths.length).toBe(2);
  expect(paths[0].at(-1)[0]).toBeCloseTo(-0.27, 10);
  expect(paths[1][0][0]).toBeCloseTo(0.73, 10);
  expect(paths[0].every(([x]) => x < 0.23)).toBe(true);
  expect(paths[1].every(([x]) => x > 0.23)).toBe(true);
});
it("处理跨越整个视窗的陡线和指数溢出，输出有限坐标", () => {
  expect(clipFunctionSamples([-1, 1], (x) => x * 100, 2)[0]).toEqual(
    expect.arrayContaining([
      expect.arrayContaining([-2]),
      expect.arrayContaining([2]),
    ]),
  );
  const paths = clipFunctionSamples([0, 2000], (x) => 2 ** x, 5);
  expect(paths[0].at(-1)[0]).toBeCloseTo(Math.log2(5), 8);
  expect(paths.flat(2).every(Number.isFinite)).toBe(true);
});
