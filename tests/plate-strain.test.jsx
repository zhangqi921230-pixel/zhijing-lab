// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { it, expect } from "vitest";
import PlateStrainExplorer from "../src/PlateStrainExplorer.jsx";
import { plateColumn } from "../src/plateModel.mjs";
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
it("material-column ratios conserve local area and deformation decreases inland", () => {
  for (const type of [0, 1, 2])
    for (const progress of [0, 35, 100])
      for (const u of [0, 0.5, 1]) {
        const q = plateColumn(u, 0, { type, progress });
        expect((q.jacobian * q.thickness) / 1.1).toBeCloseTo(1);
      }
  expect(
    plateColumn(0, 0, { type: 0, progress: 100 }).jacobian,
  ).toBeGreaterThan(plateColumn(1, 0, { type: 0, progress: 100 }).jacobian);
});
it("sampling changes the observed column without modifying plate progress", async () => {
  const host = document.createElement("div"),
    root = createRoot(host),
    p = { type: 1, progress: 100 };
  try {
    await act(() => root.render(<PlateStrainExplorer p={p} />));
    expect(host.querySelector("svg").getAttribute("aria-label")).toContain(
      "厚度2.50倍",
    );
    await act(() => host.querySelectorAll("button")[2].click());
    expect(host.querySelector("svg").getAttribute("aria-label")).toContain(
      "厚度1.01倍",
    );
    expect(p.progress).toBe(100);
  } finally {
    await act(() => root.unmount());
  }
});
