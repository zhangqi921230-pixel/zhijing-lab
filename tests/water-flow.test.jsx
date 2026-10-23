// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { it, expect } from "vitest";
import WaterBudgetFlow, { waterFlowBands } from "../src/WaterBudgetFlow.jsx";
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
it("band widths conserve water and share the same scale over valid partitions", () => {
  for (const rain of [0, 50, 100, 200])
    for (const infil of [0, 20, 40, 70])
      for (const evap of [0, 10, 25]) {
        const bands = waterFlowBands({ rain, infil, evap });
        expect(bands.reduce((a, b) => a + b.value, 0)).toBeCloseTo(rain);
        expect(bands.reduce((a, b) => a + b.height, 0)).toBeCloseTo(
          rain * 0.65,
        );
        bands.forEach((b, i) => {
          expect(b.height).toBeGreaterThanOrEqual(0);
          expect(b.bottom - b.top).toBeCloseTo(b.end - b.start);
          if (i) expect(b.start).toBeCloseTo(bands[i - 1].end);
        });
      }
});
it("focus highlights a destination without changing allocation and zero rain draws no flow", async () => {
  const host = document.createElement("div"),
    root = createRoot(host);
  try {
    await act(() =>
      root.render(<WaterBudgetFlow p={{ rain: 100, infil: 40, evap: 15 }} />),
    );
    const before = [
      ...host.querySelectorAll('[data-testid="water-flow-band"]'),
    ].map((e) => e.getAttribute("d"));
    await act(() =>
      [...host.querySelectorAll("button")]
        .find((b) => b.textContent === "下渗")
        .click(),
    );
    expect(
      [...host.querySelectorAll('[data-testid="water-flow-band"]')].map((e) =>
        e.getAttribute("d"),
      ),
    ).toEqual(before);
    expect(
      host.querySelectorAll(".water-flow-branch")[1].getAttribute("opacity"),
    ).toBe("1");
    expect(host.textContent).toContain("下渗每增加1 mm");
    await act(() =>
      root.render(<WaterBudgetFlow p={{ rain: 0, infil: 40, evap: 15 }} />),
    );
    expect(
      host.querySelectorAll('[data-testid="water-flow-band"]'),
    ).toHaveLength(0);
    expect(host.textContent).toContain("三个分支均为零");
  } finally {
    await act(() => root.unmount());
  }
});
