import { expect, it } from "vitest";
import {
  functionValue,
  functionDerivative,
  functionRates,
  advancedCalculate,
} from "../src/advancedModels.mjs";

it("matches analytical derivatives to independent centered differences at regular transformed points", () => {
  for (let type = 0; type < 8; type++) {
    for (const k of [-2, 0.5, 3]) {
      const p = { type, a: -1.7, b: 0.4, k, shift: 0.3 };
      const x = 0.3 + 1.6 / k,
        h = 1e-5;
      const numerical =
        (functionValue(p, x + h) - functionValue(p, x - h)) / (2 * h);
      expect(functionDerivative(p, x)).toBeCloseTo(numerical, 6);
    }
  }
});

it("distinguishes cusp, endpoint, undefined input and degenerate constant cases", () => {
  const p = { a: 1, b: 0, k: 1, shift: 0 };
  expect(functionDerivative({ ...p, type: 2 }, 0)).toBeNull();
  expect(functionDerivative({ ...p, type: 2, a: 0 }, 0)).toBe(0);
  expect(functionDerivative({ ...p, type: 5 }, 0)).toBeNull();
  expect(functionDerivative({ ...p, type: 5, a: 0 }, 0)).toBeNull();
  expect(functionDerivative({ ...p, type: 7 }, 0)).toBeNull();
  expect(functionDerivative({ ...p, type: 3, a: 0 }, 0)).toBeNull();
  expect(functionDerivative({ ...p, type: 6, k: 0 }, 3)).toBe(0);
  expect(functionDerivative({ ...p, type: 7, k: 0 }, 3)).toBeNull();
});

it("shows secant convergence on both sides and rejects coincident or undefined points", () => {
  const p = { type: 0, a: 1, b: 0, shift: 0, probe: 1 };
  for (const dx of [-1, -0.1, 0.05, 0.1, 1]) {
    const r = functionRates({ ...p, dx });
    expect(r.secant).toBeCloseTo(2 + dx, 10);
    expect(r.tangent).toBe(2);
  }
  expect(functionRates({ ...p, dx: 0 }).secant).toBeNull();
  expect(functionRates({ ...p, type: 7, dx: -1 }).secant).toBeNull();
  expect(functionRates({ ...p, type: 3, dx: -2 }).crossesGap).toBe(true);
  expect(functionRates({ ...p, type: 2, probe: 0, dx: 0.5 }).secant).toBe(1);
  expect(functionRates({ ...p, type: 2, probe: 0, dx: -0.5 }).secant).toBe(-1);
  const values = advancedCalculate("functions", { ...p, analysis: 1, dx: 0.1 });
  expect(values.find((v) => v.label === "割线斜率").value).toBeCloseTo(2.1);
  expect(values.find((v) => v.label === "导数 f′(x)").value).toBe(2);
});
