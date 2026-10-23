// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { it, expect } from "vitest";
import FractionComparison, {
  compareFractions,
} from "../src/FractionComparison.jsx";
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
it("compares equivalent and improper fractions without rounding", () => {
  expect(compareFractions({ n: 1, d: 3 }, { n: 4, d: 12 })).toBe(0);
  expect(compareFractions({ n: 9, d: 8 }, { n: 1, d: 1 })).toBe(1);
  expect(compareFractions({ n: 3, d: 8 }, { n: 3, d: 4 })).toBe(-1);
  expect(compareFractions({ n: 0, d: 1 }, { n: 0, d: 12 })).toBe(0);
});
it("preserves reference when denominator changes and uses the same whole scale", async () => {
  const host = document.createElement("div"),
    root = createRoot(host);
  try {
    await act(() => root.render(<FractionComparison p={{ n: 3, d: 4 }} />));
    await act(() => root.render(<FractionComparison p={{ n: 3, d: 8 }} />));
    expect(
      host.querySelector(".fraction-compare-result").textContent,
    ).toContain("3/4 ＞ 3/8");
    const fills = host.querySelectorAll(".fraction-compare-fill");
    expect(fills[0].style.width).toBe("75%");
    expect(fills[1].style.width).toBe("37.5%");
    await act(() => root.render(<FractionComparison p={{ n: 9, d: 8 }} />));
    expect(host.querySelectorAll(".fraction-compare-unit")).toHaveLength(4);
    await act(() => host.querySelector("button").click());
    expect(
      host.querySelector(".fraction-compare-result").textContent,
    ).toContain("9/8 = 9/8");
  } finally {
    await act(() => root.unmount());
  }
});
