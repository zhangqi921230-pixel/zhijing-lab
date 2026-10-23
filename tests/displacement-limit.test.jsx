// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { it, expect, vi } from "vitest";
import DisplacementBalance, {
  displacementBalance,
} from "../src/DisplacementBalance.jsx";
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
it("exact amount buttons prepare reachable masses and stoichiometric endpoints for iron and zinc", async () => {
  const host = document.createElement("div"),
    root = createRoot(host),
    prepare = vi.fn();
  try {
    for (const [metal, molar] of [
      ["iron", 55.845],
      ["zinc", 65.38],
    ]) {
      await act(() =>
        root.render(
          <DisplacementBalance
            p={{ metal, mass: 0.5 }}
            time={0}
            onPrepare={prepare}
            onEnd={() => {}}
          />,
        ),
      );
      const buttons = host.querySelectorAll("button");
      for (let i = 0; i < 3; i++) {
        await act(() => buttons[i].click());
        const mass = prepare.mock.lastCall[0],
          n = [5, 10, 15][i];
        expect(mass).toBeCloseTo((n * molar) / 1000, 12);
        expect(mass).toBeLessThanOrEqual(1);
        const q = displacementBalance(metal, mass, 1);
        expect(q.extent).toBeCloseTo(Math.min(n, 10) / 1000, 12);
      }
      await act(() =>
        root.render(
          <DisplacementBalance
            p={{ metal, mass: molar * 0.01 }}
            time={0}
            onPrepare={prepare}
            onEnd={() => {}}
          />,
        ),
      );
      expect(host.textContent).toContain("两种反应物同时用完");
    }
  } finally {
    await act(() => root.unmount());
  }
});
it("copper remains a no-reaction control at every comparison quantity", () => {
  for (const n of [5, 10, 15]) {
    const q = displacementBalance("copper", n * 0.063546, 1);
    expect(q.extent).toBe(0);
    expect(q.remaining).toBe(0.01);
    expect(q.remainingMetal).toBeCloseTo(n / 1000);
  }
});
