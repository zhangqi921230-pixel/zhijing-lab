// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { it, expect, vi } from "vitest";
import DisplacementComparison, {
  displacementComparison,
} from "../src/DisplacementComparison.jsx";
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
it("compares equal mole amounts, preserves copper balance, and keeps the copper control unchanged", () => {
  for (const t of [0, 15, 30, 60]) {
    const [iron, zinc, copper] = displacementComparison(t);
    for (const row of [iron, zinc, copper]) {
      expect(row.mass / row.molar).toBeCloseTo(0.01);
      expect(row.extent + row.remaining).toBeCloseTo(0.01);
    }
    expect(iron.copper).toBeCloseTo(zinc.copper);
    expect(copper.extent).toBe(0);
    expect(copper.remaining).toBe(0.01);
  }
  expect(displacementComparison(60)[0].copper).toBeCloseTo(0.63546);
});
it("endpoint removes consumed metal but not the copper control and buttons share the host timeline", async () => {
  const host = document.createElement("div"),
    root = createRoot(host),
    onSeek = vi.fn(),
    onInspect = vi.fn();
  try {
    await act(() =>
      root.render(
        <DisplacementComparison
          time={60}
          p={{ metal: "iron", mass: 0.55845 }}
          onSeek={onSeek}
          onInspect={onInspect}
        />,
      ),
    );
    expect(
      host.querySelector('[data-compare-metal="iron"] [data-original-metal]'),
    ).toBeNull();
    expect(
      host.querySelector('[data-compare-metal="zinc"] [data-original-metal]'),
    ).toBeNull();
    expect(
      host.querySelector('[data-compare-metal="copper"] [data-original-metal]'),
    ).not.toBeNull();
    expect(
      host.querySelector('[data-compare-metal="copper"] [data-new-copper]'),
    ).toBeNull();
    await act(() =>
      [...host.querySelectorAll("button")]
        .find((b) => b.textContent === "对照中间过程")
        .click(),
    );
    expect(onSeek).toHaveBeenCalledWith(30);
    await act(() =>
      [...host.querySelectorAll("button")]
        .find((b) => b.textContent === "主模型观察锌")
        .click(),
    );
    expect(onInspect.mock.calls[0][0]).toBe("zinc");
    expect(onInspect.mock.calls[0][1]).toBeCloseTo(0.6538, 12);
  } finally {
    await act(() => root.unmount());
  }
});
