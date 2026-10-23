// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { it, expect } from "vitest";
import ElectrolysisCompare, {
  electrolysisAmounts,
} from "../src/ElectrolysisCompare.jsx";
it("same charge gives same yield; volume and approximate mass ratios differ", () => {
  const a = electrolysisAmounts(0.5, 600),
    b = electrolysisAmounts(1, 300);
  expect(a).toEqual(b);
  expect(a.hydrogen / a.oxygen).toBeCloseTo(2, 12);
  expect(a.oxygenMg / a.hydrogenMg).toBeCloseTo(8, 12);
  expect(a.hydrogenMmol).toBeCloseTo(2 * a.oxygenMmol, 12);
});
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
it("switching to mass reverses bar ordering and zero charge has no current ratio", async () => {
  const host = document.createElement("div"),
    root = createRoot(host);
  try {
    await act(() =>
      root.render(<ElectrolysisCompare p={{ current: 1 }} time={300} />),
    );
    const widths = () =>
      [...host.querySelectorAll(".electrolysis-compare-track i")].map((x) =>
        parseFloat(x.style.width),
      );
    expect(widths()[0]).toBeGreaterThan(widths()[1]);
    await act(() => host.querySelectorAll("button")[1].click());
    expect(widths()[0]).toBeLessThan(widths()[1]);
    expect(host.textContent).toContain("1 : 8");
    await act(() =>
      root.render(<ElectrolysisCompare p={{ current: 1 }} time={0} />),
    );
    expect(host.textContent).toContain("不能计算零与零的比值");
  } finally {
    await act(() => root.unmount());
  }
});
