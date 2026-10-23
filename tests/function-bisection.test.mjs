import { expect, it } from "vitest";
import { functionBisection } from "../src/functionBisection.mjs";
const p = { type: 0, a: 1, k: 1, b: -2, shift: 0 };
it("retains the sqrt(2) bracket and its half-width error bound at every step", () => {
  for (let steps = 0; steps <= 30; steps++) {
    const result = functionBisection(p, 0, 2, steps);
    expect(result.valid).toBe(true);
    expect(result.left).toBeLessThan(Math.SQRT2);
    expect(result.right).toBeGreaterThan(Math.SQRT2);
    expect(result.right - result.left).toBe(2 / 2 ** steps);
    expect(Math.abs(result.estimate - Math.SQRT2)).toBeLessThanOrEqual(
      result.error,
    );
  }
});
it("rejects poles, undefined endpoints, same signs and malformed intervals", () => {
  expect(functionBisection({ ...p, type: 3, b: 0, shift: 1 }, 0, 2).valid).toBe(
    false,
  );
  expect(
    functionBisection({ ...p, type: 3, a: 0, b: 0, shift: 1 }, 0, 2).valid,
  ).toBe(false);
  expect(functionBisection({ ...p, type: 7 }, 0, 2).valid).toBe(false);
  expect(functionBisection({ ...p, b: 0 }, -1, 1).message).toContain("不代表");
  for (const [a, b] of [
    [NaN, 2],
    [0, Infinity],
    [2, 2],
    [3, 1],
    [-6, 2],
  ])
    expect(functionBisection(p, a, b).valid).toBe(false);
});
it("stops on computed zeros and supports a reflected logarithmic domain", () => {
  expect(
    functionBisection({ ...p, type: 4, b: -1 }, 0, 2, 30).rows,
  ).toHaveLength(1);
  expect(functionBisection({ ...p, b: 0 }, 0, 2, 30).exact).toBe(0);
  const log = functionBisection({ ...p, type: 7, k: -1, b: 0 }, -2, -0.5, 20);
  expect(log.valid).toBe(true);
  expect(Math.abs(log.estimate + 1)).toBeLessThanOrEqual(log.error);
});
