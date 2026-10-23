// @vitest-environment jsdom
import React, { act, useState } from "react";
import { createRoot } from "react-dom/client";
import { it, expect } from "vitest";
import RadiusScaleStudy, { circleScale } from "../src/RadiusScaleStudy.jsx";
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
it("circumference scales linearly and area quadratically for enlargement and reduction", () => {
  for (const r of [1, 2, 3, 5])
    for (const reference of [1, 2, 4, 5]) {
      const q = circleScale(r, reference);
      expect(q.length).toBe(r / reference);
      expect(q.area).toBe((r / reference) ** 2);
      expect(q.surface / (Math.PI * reference ** 2)).toBeCloseTo(q.area, 12);
    }
  expect(circleScale(4, 2).area).toBe(4);
  expect(circleScale(1, 2).area).toBe(0.25);
});
it("reference captures pause through shared change and doubling respects the radius limit", async () => {
  const host = document.createElement("div"),
    root = createRoot(host);
  function Harness() {
    const [r, setR] = useState(2);
    return <RadiusScaleStudy p={{ r }} onChange={(k, v) => setR(v)} />;
  }
  try {
    await act(() => root.render(<Harness />));
    const button = (t) =>
      [...host.querySelectorAll("button")].find((b) => b.textContent === t);
    await act(() => button("半径变为参照的 2 倍").click());
    expect(host.querySelector(".radius-scale-results").textContent).toContain(
      "面积比 B/A4 倍",
    );
    await act(() => button("保留当前半径为参照").click());
    expect(host.querySelector(".radius-scale-results").textContent).toContain(
      "面积比 B/A1 倍",
    );
    expect(button("半径变为参照的 2 倍").disabled).toBe(true);
    await act(() => button("参照设为 2 cm").click());
    expect(button("半径变为参照的 2 倍").disabled).toBe(false);
    await act(() => button("恢复参照大小").click());
    expect(host.querySelector("svg").getAttribute("aria-label")).toContain(
      "当前半径2厘米",
    );
  } finally {
    await act(() => root.unmount());
  }
});
