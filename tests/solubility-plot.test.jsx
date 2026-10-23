// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { expect, it, vi } from "vitest";
import { SolubilityPlot } from "../src/SolubilityPlot.jsx";

it("shows dissolved mass rather than capacity when the solution is unsaturated", async () => {
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  const host = document.createElement("div"),
    root = createRoot(host),
    change = vi.fn();
  try {
    await act(() =>
      root.render(
        <SolubilityPlot
          p={{ temp: 20, water: 100, mass: 50 }}
          onChange={change}
        />,
      ),
    );
    expect(host.querySelector("svg").getAttribute("aria-label")).toContain(
      "剩余固体18.40克",
    );
    expect(Number(host.querySelector("circle").getAttribute("cy"))).toBeCloseTo(
      220 - (31.6 / 200) * 176,
    );
    await act(() => host.querySelectorAll("button")[3].click());
    expect(change).toHaveBeenCalledWith("temp", 80);
    await act(() =>
      root.render(
        <SolubilityPlot
          p={{ temp: 80, water: 100, mass: 50 }}
          onChange={change}
        />,
      ),
    );
    expect(host.querySelector("svg").getAttribute("aria-label")).toContain(
      "已溶解50.00克，剩余固体0.00克",
    );
    expect(Number(host.querySelector("circle").getAttribute("cy"))).toBeCloseTo(
      176,
    );
    await act(() =>
      root.render(
        <SolubilityPlot
          p={{ temp: 20, water: 200, mass: 50 }}
          onChange={change}
        />,
      ),
    );
    expect(host.querySelector("svg").getAttribute("aria-label")).toContain(
      "最多溶解63.20克",
    );
  } finally {
    await act(() => root.unmount());
  }
});
