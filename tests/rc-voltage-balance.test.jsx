// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { it, expect } from "vitest";
import { rc } from "../src/advancedModels.mjs";
import RCVoltageBalance from "../src/RCVoltageBalance.jsx";
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
it("signed resistor and capacitor voltages balance for both modes and partial initial states", () => {
  for (const mode of [0, 1])
    for (const ratio of [0, 37, 100])
      for (const t of [0, 0.2, 2, 10]) {
        const p = {
            u: 9,
            r: 500,
            c: 4,
            mode,
            initialRatio: ratio,
            chargeInitialRatio: ratio,
          },
          q = rc(p, t);
        expect(q.current * p.r + q.voltage).toBeCloseTo(mode ? 0 : 9, 12);
        expect(q.resistorPower).toBeGreaterThanOrEqual(0);
        if (mode) expect(q.current).toBeLessThanOrEqual(0);
      }
});
it("observation presets seek actual RC times and discharge explains its signed balance", async () => {
  const host = document.createElement("div"),
    root = createRoot(host);
  let time;
  try {
    await act(() =>
      root.render(
        <RCVoltageBalance
          p={{ u: 9, r: 500, c: 4, mode: 1 }}
          t={0}
          onSeek={(v) => {
            time = v;
          }}
        />,
      ),
    );
    expect(host.textContent).toContain("0.000 V = (-9.000 V) + 9.000 V");
    await act(() =>
      [...host.querySelectorAll("button")]
        .find((b) => b.textContent === "3τ")
        .click(),
    );
    expect(time).toBe(6);
  } finally {
    await act(() => root.unmount());
  }
});
