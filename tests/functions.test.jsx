import { it, expect } from "vitest";
import { functionPaths, functionDomain } from "../src/FunctionStudio.jsx";
import { functionValue } from "../src/advancedModels.mjs";

it("maps original points through horizontal scaling, reflection and translation for all families", () => {
  for (let type = 0; type < 8; type++) {
    for (const k of [-3, -0.5, 0.5, 2]) {
      const original = { type, a: 1, b: 0, shift: 0 };
      const transformed = { type, a: -1.5, b: 0.7, shift: 1.3, k };
      for (const u of [0.2, 1, 2]) {
        expect(functionValue(transformed, u / k + 1.3)).toBeCloseTo(
          -1.5 * functionValue(original, u) + 0.7,
          9,
        );
      }
    }
  }
});

it("reflects restricted domains and separates zero input from zero output scale", () => {
  for (const type of [5, 7]) {
    const p = { type, k: -2, a: 0, b: 2, shift: 1 };
    expect(functionValue(p, 2)).toBeNull();
    expect(functionValue(p, 0)).toBe(2);
    expect(functionDomain(p)).toBe(type === 5 ? "x ≤ 1" : "x < 1");
    expect(
      functionPaths(p, 6)
        .flat()
        .every(([x]) => (type === 5 ? x <= 1 : x < 1)),
    ).toBe(true);
  }
  for (let type = 0; type < 8; type++) {
    const p = { type, k: 0, a: 2, b: 3, shift: 1 };
    for (const x of [-5, 0, 5]) {
      expect(functionValue(p, x)).toBe(
        [3, 7].includes(type) ? null : type === 6 ? 5 : 3,
      );
    }
    expect(functionPaths(p, 6).length).toBe([3, 7].includes(type) ? 0 : 1);
  }
});

it("samples transformed sine extrema and preserves the new period", () => {
  for (const k of [-3, -0.5, 0.5, 2]) {
    const p = { type: 1, a: 2, b: 1, shift: 0.23, k };
    const peak = p.shift + Math.PI / (2 * k);
    expect(
      functionPaths(p, 6)
        .flat()
        .some(
          ([x, y]) => Math.abs(x - peak) < 1e-10 && Math.abs(y - 3) < 1e-10,
        ),
    ).toBe(true);
    expect(functionValue(p, 0.4)).toBeCloseTo(
      functionValue(p, 0.4 + (2 * Math.PI) / Math.abs(k)),
      10,
    );
  }
});

it("preserves root and logarithm domains at shifted boundaries even with zero scale", () => {
  for (const a of [-2, 0, 2]) {
    const root = { type: 5, a, b: 1, shift: 0.23 };
    const log = { ...root, type: 7 };
    expect(functionValue(root, 0.22)).toBeNull();
    expect(functionValue(root, 0.23)).toBe(1);
    expect(functionValue(log, 0.23)).toBeNull();
    expect(functionValue(log, 2.23)).toBeCloseTo(a + 1);
    for (const [p, inclusive] of [
      [root, true],
      [log, false],
    ]) {
      const points = functionPaths(p, 6).flat();
      expect(points.length).toBeGreaterThan(0);
      expect(
        points.every(([x]) => (inclusive ? x >= p.shift : x > p.shift)),
      ).toBe(true);
    }
  }
  expect(functionDomain({ type: 5, shift: 2 })).toBe("x ≥ 2");
  expect(functionDomain({ type: 7, shift: 2 })).toBe("x > 2");
});

it("evaluates added families independently and keeps reciprocal paths within narrow viewports", () => {
  const p = { a: -2, b: 1, shift: 1 };
  expect(functionValue({ ...p, type: 4 }, 3)).toBe(-15);
  expect(functionValue({ ...p, type: 5 }, 5)).toBe(-3);
  expect(functionValue({ ...p, type: 6 }, 4)).toBe(-15);
  expect(functionValue({ ...p, type: 7 }, 9)).toBe(-5);
  for (const shift of [-3, 3]) {
    const points = functionPaths({ type: 3, a: 1, b: 0, shift }, 1).flat();
    expect(points.length).toBeGreaterThan(0);
    expect(points.every(([x]) => x >= -1 && x <= 1)).toBe(true);
  }
});
it("非网格上的顶点与正弦峰值被明确纳入图像路径", () => {
  for (const type of [0, 2]) {
    const points = functionPaths(
      { type, a: 1.7, b: -0.6, shift: 0.23 },
      6,
    ).flat();
    expect(points.some(([x, y]) => x === 0.23 && y === -0.6)).toBe(true);
  }
  const points = functionPaths({ type: 1, a: 2, b: 1, shift: 0.23 }, 6).flat();
  expect(
    points.some(
      ([x, y]) =>
        Math.abs(x - (0.23 + Math.PI / 2)) < 1e-12 && Math.abs(y - 3) < 1e-12,
    ),
  ).toBe(true);
});
it("反比例分支严格位于奇点两侧，即使系数为零也不跨越空点", () => {
  for (const a of [-3, -0.1, 0, 0.1, 3])
    for (const shift of [-3, -0.37, 0, 0.23, 3])
      for (const b of [-3, 0, 3]) {
        const p = { type: 3, a, shift, b },
          paths = functionPaths(p, 6);
        expect(paths).toHaveLength(2);
        for (const points of paths) {
          const sides = points.map(([x]) => Math.sign(x - shift));
          expect(sides.every((v) => v === sides[0] && v !== 0)).toBe(true);
          for (const [x, y] of points) {
            expect((y - b) * (x - shift)).toBeCloseTo(a, 9);
            expect(Math.abs(y)).toBeLessThanOrEqual(6);
          }
        }
      }
});
it("四类采样图像满足各自方程，零系数保留反比例定义域限制", () => {
  for (const type of [0, 1, 2, 3]) {
    const p = { type, a: 2, b: -1, shift: 0.5 },
      paths = functionPaths(p, 12);
    expect(paths.length).toBeGreaterThan(0);
    for (const pts of paths)
      for (const [x, y] of pts.filter((_, i) => i % 40 === 0)) {
        const z = x - 0.5;
        expect(y).toBeCloseTo(
          type === 0
            ? 2 * z * z - 1
            : type === 1
              ? 2 * Math.sin(z) - 1
              : type === 2
                ? 2 * Math.abs(z) - 1
                : 2 / z - 1,
          12,
        );
      }
  }
  expect(functionDomain({ type: 3, a: 0, shift: 2 })).toBe("x ≠ 2");
  expect(functionDomain({ type: 0, a: 0, shift: 2 })).toBe("全体实数");
});

it("wide and narrow graph sampling retain independent horizontal and vertical bounds", () => {
  for (const xRange of [4, 18]) {
    const points = functionPaths(
      { type: 0, a: 1, b: 0, shift: 0 },
      xRange,
      6,
    ).flat();
    expect(points.every(([x, y]) => Math.abs(x) <= xRange && y <= 6)).toBe(
      true,
    );
    expect(Math.max(...points.map((p) => p[1]))).toBeGreaterThan(5.8);
  }
});
