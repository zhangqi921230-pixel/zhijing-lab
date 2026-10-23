// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { expect, it, vi } from "vitest";
import { DilutionPlot, dilutionFraction } from "../src/DilutionPlot.jsx";

it("uses solution mass, preserves solute, and shows diminishing concentration reductions", () => {
  const values = [0, 100, 200, 300].map((add) => dilutionFraction(10, 90, add));
  expect(values).toEqual([10, 5, 10 / 3, 2.5]);
  expect(values[0] - values[1]).toBeGreaterThan(values[1] - values[2]);
  expect(values[1] - values[2]).toBeGreaterThan(values[2] - values[3]);
  expect(dilutionFraction(30, 200, 300)).toBeCloseTo(3000 / 530);
});

it("sample controls request only water changes and moving the marker reuses the theory curve", async () => {
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  const host = document.createElement("div"),
    root = createRoot(host),
    change = vi.fn();
  try {
    await act(() =>
      root.render(
        <DilutionPlot
          p={{ solute: 10, water: 90, add: 0 }}
          onChange={change}
        />,
      ),
    );
    const curve = host.querySelector(".dilution-curve").getAttribute("d");
    await act(() => host.querySelectorAll("button")[2].click());
    expect(change).toHaveBeenCalledWith("add", 200);
    await act(() =>
      root.render(
        <DilutionPlot
          p={{ solute: 10, water: 90, add: 200 }}
          onChange={change}
        />,
      ),
    );
    expect(host.querySelector(".dilution-curve").getAttribute("d")).toBe(curve);
    expect(host.querySelector("svg").getAttribute("aria-label")).toContain(
      "3.33%",
    );
    expect(
      host.querySelectorAll("button")[2].getAttribute("aria-pressed"),
    ).toBe("true");
    expect(Number(host.querySelector("circle").getAttribute("cx"))).toBe(374);
  } finally {
    await act(() => root.unmount());
  }
});
