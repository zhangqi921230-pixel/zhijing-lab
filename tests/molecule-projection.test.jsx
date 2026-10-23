// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { it, expect } from "vitest";
import { moleculeProjection } from "../src/moleculeProjection.mjs";
import { moleculeGeometry } from "../src/moleculeGeometry.mjs";
import Panel from "../src/MoleculeProjection.jsx";
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
it("rotation preserves spatial distances while projected angles change or degenerate", () => {
  for (let type = 0; type < 4; type++)
    for (const angle of [0, 30, 90, 180]) {
      const before = moleculeGeometry(type),
        after = moleculeProjection(type, angle);
      after.points.forEach((p, i) =>
        expect(Math.hypot(...p)).toBeCloseTo(
          Math.hypot(...before.points[i]),
          12,
        ),
      );
    }
  expect(moleculeProjection(0, 0).projectedAngle).toBeCloseTo(104.5, 8);
  expect(moleculeProjection(0, 90).projectedAngle).toBeCloseTo(0, 8);
  expect(moleculeProjection(1, 90).projectedAngle).toBeNull();
  expect(moleculeProjection(1, 0).projectedAngle).toBeCloseTo(180, 8);
});
it("view presets report degenerate projection explicitly", async () => {
  const host = document.createElement("div"),
    root = createRoot(host);
  try {
    await act(() => root.render(<Panel p={{ type: 1 }} />));
    await act(() =>
      [...host.querySelectorAll("button")]
        .find((b) => b.textContent === "90°")
        .click(),
    );
    expect(host.textContent).toContain("无法定义（键投影为点）");
    expect(host.textContent).toContain("真实键角 ≈ 180.00°");
  } finally {
    await act(() => root.unmount());
  }
});
