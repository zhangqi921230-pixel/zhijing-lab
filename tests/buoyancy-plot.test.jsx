// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { it, expect, vi } from "vitest";
import BuoyancyPlot from "../src/BuoyancyPlot.jsx";
import { buoyancyState } from "../src/visualPhysics.mjs";
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
it("locates force balance and excludes an impossible intersection", async () => {
  const host = document.createElement("div"),
    root = createRoot(host),
    onChange = vi.fn();
  const p = { solid: 600, liquid: 1000, volume: 1, immersion: 50, mode: 0 };
  try {
    await act(() => root.render(<BuoyancyPlot p={p} onChange={onChange} />));
    const button = () =>
      [...host.querySelectorAll("button")].find(
        (b) => b.textContent === "定位两力相等",
      );
    await act(() => button().click());
    expect(onChange).toHaveBeenCalledWith("immersion", 60);
    const q = buoyancyState({ ...p, immersion: onChange.mock.lastCall[1] });
    expect(q.support).toBeCloseTo(0, 10);
    await act(() =>
      root.render(
        <BuoyancyPlot p={{ ...p, solid: 1400 }} onChange={onChange} />,
      ),
    );
    expect(button()).toBeUndefined();
    expect(host.textContent).toContain("3.92 N");
    await act(() =>
      root.render(<BuoyancyPlot p={{ ...p, mode: 1 }} onChange={onChange} />),
    );
    expect(host.querySelectorAll("button")).toHaveLength(0);
  } finally {
    await act(() => root.unmount());
  }
});
