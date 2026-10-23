// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { it, expect, vi } from "vitest";
import CircleLimitStudy, {
  circleApproximation,
} from "../src/CircleLimitStudy.jsx";

globalThis.IS_REACT_ACT_ENVIRONMENT = true;
it("inscribed polygon stays below circle area and converges as arc height decreases", () => {
  const values = [8, 16, 32, 48].map((n) => circleApproximation(3, n));
  for (let i = 0; i < values.length; i++) {
    expect(values[i].polygonArea).toBeLessThan(values[i].circleArea);
    if (i) {
      expect(values[i].polygonArea).toBeGreaterThan(values[i - 1].polygonArea);
      expect(values[i].sagitta).toBeLessThan(values[i - 1].sagitta);
    }
  }
  expect(circleApproximation(1, 4).polygonArea).toBeCloseTo(2, 12);
  expect(circleApproximation(6, 16).polygonArea).toBeCloseTo(
    4 * values[1].polygonArea,
    12,
  );
});
it("arc and polygon chapters show distinct comparisons and route subdivisions through lesson parameters", async () => {
  const host = document.createElement("div"),
    root = createRoot(host),
    change = vi.fn();
  try {
    await act(() =>
      root.render(
        <CircleLimitStudy
          p={{ r: 3, parts: 16 }}
          chapter={3}
          onChange={change}
        />,
      ),
    );
    expect(host.querySelectorAll(".circle-arc-detail").length).toBe(2);
    await act(() => host.querySelectorAll("button")[3].click());
    expect(change).toHaveBeenCalledWith("parts", 48);
    await act(() =>
      root.render(
        <CircleLimitStudy
          p={{ r: 3, parts: 48 }}
          chapter={4}
          onChange={change}
        />,
      ),
    );
    expect(host.querySelector(".circle-arc-detail")).toBeNull();
    expect(
      host.querySelector("polygon").getAttribute("points").split(" ").length,
    ).toBe(48);
    expect(host.textContent).toContain("0.285%");
  } finally {
    await act(() => root.unmount());
  }
});
