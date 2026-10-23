import { expect, it } from "vitest";
import {
  functionExpression,
  functionRange,
} from "../src/functionDescription.mjs";

it("substitutes actual coefficients with unambiguous shifted inputs", () => {
  const p = { a: -2, k: 3, b: 1, shift: 1 };
  expect(functionExpression({ ...p, type: 6, a: -1 })).toBe(
    "y = −2^(3(x − 1)) + 1",
  );
  expect(functionExpression({ ...p, type: 0 })).toBe("y = −2[3(x − 1)]² + 1");
  expect(functionExpression({ ...p, type: 3 })).toBe("y = −2/(3(x − 1)) + 1");
  expect(functionExpression({ ...p, type: 7, k: -1, shift: -2 })).toBe(
    "y = −2log₂(−(x + 2)) + 1",
  );
  expect(
    functionExpression({ ...p, type: 1, a: 1, k: 1, b: 0, shift: 0 }),
  ).toBe("y = sin(x)");
});

it("preserves open and closed range endpoints independently of horizontal reflection", () => {
  for (const k of [-3, 0.5, 2]) {
    for (const type of [0, 2, 5]) {
      expect(functionRange({ type, a: 2, b: 1, k })).toBe("[1, +∞)");
      expect(functionRange({ type, a: -2, b: 1, k })).toBe("(−∞, 1]");
    }
    expect(functionRange({ type: 1, a: -2, b: 1, k })).toBe("[−1, 3]");
    expect(functionRange({ type: 3, a: 2, b: 1, k })).toBe("全体实数，除去 1");
    expect(functionRange({ type: 6, a: 2, b: 1, k })).toBe("(1, +∞)");
    expect(functionRange({ type: 6, a: -2, b: 1, k })).toBe("(−∞, 1)");
    for (const type of [4, 7])
      expect(functionRange({ type, a: 2, b: 1, k })).toBe("全体实数");
  }
});

it("distinguishes constant functions from empty domains when input scale vanishes", () => {
  for (let type = 0; type < 8; type++) {
    const p = { type, a: 2, k: 0, b: 3, shift: 1 };
    const empty = [3, 7].includes(type);
    expect(functionRange(p)).toBe(empty ? "空集" : type === 6 ? "{5}" : "{3}");
    expect(functionExpression(p)).toBe(
      empty ? "无定义（k = 0）" : type === 6 ? "y = 5" : "y = 3",
    );
    expect(functionRange({ ...p, k: 1, a: 0 })).toBe("{3}");
    expect(functionExpression({ ...p, k: 1, a: 0 })).toBe("y = 3");
  }
});
