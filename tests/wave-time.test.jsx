// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { it, expect } from "vitest";
import WaveTimeStudy from "../src/WaveTimeStudy.jsx";
import { waveState } from "../src/visualPhysics.mjs";
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
it("fixed-position wave displacement repeats for each mode and frequency", () => {
  for (const mode of [0, 1, 2])
    for (const frequency of [0.5, 1, 2]) {
      const p = {
        mode,
        frequency,
        amplitude: 0.4,
        speed: 2,
        phase: 90,
        probe: 3,
      };
      for (const t of [0, 0.3, 1.4])
        expect(waveState(p, 3, t).total).toBeCloseTo(
          waveState(p, 3, t + 1 / frequency).total,
        );
    }
});
it("time cursor moves while the complete-cycle prediction remains unchanged", async () => {
  const host = document.createElement("div"),
    root = createRoot(host),
    p = {
      mode: 0,
      frequency: 0.5,
      amplitude: 0.4,
      speed: 2,
      phase: 0,
      probe: 3,
    };
  try {
    await act(() => root.render(<WaveTimeStudy p={p} t={0} />));
    const paths = [...host.querySelectorAll("path")],
      path = paths
        .find((x) => x.getAttribute("stroke-width") === "3")
        .getAttribute("d");
    const x = host.querySelector("circle").getAttribute("cx");
    await act(() => root.render(<WaveTimeStudy p={p} t={0.5} />));
    expect(host.querySelector("circle").getAttribute("cx")).not.toBe(x);
    expect(
      [...host.querySelectorAll("path")]
        .find((x) => x.getAttribute("stroke-width") === "3")
        .getAttribute("d"),
    ).toBe(path);
    expect(host.textContent).toContain("0.50 s");
  } finally {
    await act(() => root.unmount());
  }
});
