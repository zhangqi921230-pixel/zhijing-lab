// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { it, expect } from "vitest";
import Panel from "../src/EnergyComparison.jsx";
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
it("retains reference across parameter updates and distinguishes linear and squared gains", async () => {
  const host = document.createElement("div"),
    root = createRoot(host);
  let stopped = 0;
  const render = async (energy, eff) =>
    act(() =>
      root.render(<Panel p={{ energy, eff }} onCapture={() => stopped++} />),
    );
  try {
    await render(5000, 10);
    await act(() => host.querySelector("button").click());
    expect(stopped).toBe(1);
    await render(5000, 20);
    const rows = [...host.querySelectorAll(".energy-comparison-row")];
    expect(rows[0].textContent).toContain("B/A：1 倍");
    expect(rows[1].textContent).toContain("B/A：2 倍");
    expect(rows[2].textContent).toContain("B/A：4 倍");
    expect(host.textContent).toContain("参照 A：5,000 kJ · 10%");
    await render(10000, 10);
    host
      .querySelectorAll(".energy-comparison-row")
      .forEach((row) => expect(row.textContent).toContain("B/A：2 倍"));
    await act(() => host.querySelector("button").click());
    expect(host.textContent).toContain("参照 A：10,000 kJ · 10%");
  } finally {
    await act(() => root.unmount());
  }
});
