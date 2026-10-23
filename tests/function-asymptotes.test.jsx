// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { it, expect } from "vitest";
import { functionAsymptotes } from "../src/functionAsymptotes.mjs";
import { functionValue } from "../src/advancedModels.mjs";
import FunctionStudio from "../src/FunctionStudio.jsx";

it("asymptotes follow translated and reflected functions, excluding degeneracies", () => {
  for (const type of [3, 6, 7])
    for (const k of [-2, 1])
      for (const a of [-1, 2]) {
        const p = { type, k, a, b: 2, shift: -1 };
        const lines = functionAsymptotes(p);
        for (const { axis, value } of lines) {
          if (axis === "y") {
            const farX = type === 6 ? -Math.sign(k) * 50 : 1e8;
            expect(functionValue(p, farX)).toBeCloseTo(value, 6);
          } else {
            const near = value + 1e-6 / k;
            const nearer = value + 1e-8 / k;
            expect(Math.abs(functionValue(p, nearer) - p.b)).toBeGreaterThan(
              Math.abs(functionValue(p, near) - p.b),
            );
          }
        }
        expect(functionAsymptotes({ ...p, a: 0 })).toEqual([]);
        expect(functionAsymptotes({ ...p, k: 0 })).toEqual([]);
      }
});

it("the teaching guides toggle controls both reciprocal asymptotes", async () => {
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  const host = document.createElement("div"),
    root = createRoot(host);
  try {
    await act(() =>
      root.render(
        <FunctionStudio
          p={{ type: 3, k: 1, a: 1, b: 2, shift: -1, probe: 1, analysis: 0 }}
          onChange={() => {}}
        />,
      ),
    );
    const count = () => host.querySelectorAll('[aria-label^="渐近线 "]').length;
    expect(count()).toBe(2);
    const toggle = [...host.querySelectorAll("button")].find(
      (e) => e.textContent === "辅助线",
    );
    await act(() => toggle.click());
    expect(count()).toBe(0);
    await act(() => toggle.click());
    expect(count()).toBe(2);
  } finally {
    await act(() => root.unmount());
  }
});
