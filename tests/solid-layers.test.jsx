// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { it, expect } from "vitest";
import { solidLayers } from "../src/solidLayers.mjs";
import SolidLayerStudy from "../src/SolidLayerStudy.jsx";
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
it("bounds exact cone volume at every scan height and shrinks the gap on refinement", () => {
  for (const f of [0, 0.17, 0.5, 1])
    for (const r of [0.8, 2])
      for (const h of [1, 3.5]) {
        let gap = Infinity;
        for (const n of [4, 8, 16, 32]) {
          const q = solidLayers(r, h, f, n);
          expect(q.lower).toBeLessThanOrEqual(q.exact + 1e-12);
          expect(q.upper).toBeGreaterThanOrEqual(q.exact - 1e-12);
          expect(q.upper - q.lower).toBeLessThanOrEqual(gap);
          gap = q.upper - q.lower;
          expect(gap).toBeCloseTo(
            ((Math.PI * r * r * h * f) / n) * (1 - (1 - f) ** 2),
            10,
          );
        }
      }
  const q = solidLayers(2, 3, 0.5, 8);
  expect(q.exact / ((Math.PI * 4 * 3) / 3)).toBeCloseTo(7 / 8, 12);
});
it("switches actual layer widths and counts and responds to the shared scan height", async () => {
  const host = document.createElement("div"),
    root = createRoot(host);
  const draw = async (f) =>
    act(() =>
      root.render(<SolidLayerStudy radius={1} height={3} fraction={f} />),
    );
  try {
    await draw(0.5);
    const inner = +host.querySelector("rect").getAttribute("width");
    const button = (text) =>
      [...host.querySelectorAll("button")].find((b) => b.textContent === text);
    await act(() => button("外接：偏大").click());
    expect(+host.querySelector("rect").getAttribute("width")).toBeGreaterThan(
      inner,
    );
    await act(() => button("32 层").click());
    expect(host.querySelectorAll("rect")).toHaveLength(32);
    await draw(0);
    expect(host.querySelector("rect").getAttribute("height")).toBe("0");
    expect(host.querySelector("dd").textContent).toBe("0.0000 cm³");
  } finally {
    await act(() => root.unmount());
  }
});
