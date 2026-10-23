// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { expect, it } from "vitest";
import LeverForceAngle from "../src/LeverForceAngle.jsx";
import { leverForceAngle } from "../src/leverForceAngle.mjs";
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
it("signed components reconstruct force and its moment", () => {
  for (const a of [0, 30, 90, 150, 180])
    for (const d of [0.2, 1, 2]) {
      const q = leverForceAngle(d, 12, a);
      expect(Math.hypot(q.parallel, q.perpendicular)).toBeCloseTo(12);
      expect(d * q.perpendicular).toBeCloseTo(q.torque);
      expect(12 * q.arm).toBeCloseTo(q.torque);
    }
  expect(leverForceAngle(1, 12, 150).parallel).toBeLessThan(0);
});
it("component overlay follows angle and hides on request", async () => {
  const host = document.createElement("div"),
    root = createRoot(host);
  const button = (t) =>
    [...host.querySelectorAll("button")].find((b) => b.textContent === t);
  try {
    await act(() => root.render(<LeverForceAngle p={{ l2: 1, f2: 10 }} />));
    await act(() => button("分解为沿杆与垂直分力").click());
    await act(() => button("30°").click());
    expect(host.querySelector("[role=status]").textContent).toContain(
      "垂直分力 F sinα = 5 N",
    );
    expect(
      host.querySelector('[data-testid="lever-force-components"]'),
    ).not.toBeNull();
    await act(() => button("收起力的分解").click());
    expect(
      host.querySelector('[data-testid="lever-force-components"]'),
    ).toBeNull();
  } finally {
    await act(() => root.unmount());
  }
});
