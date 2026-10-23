// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { it, expect, vi } from "vitest";
import StandingProbe from "../src/StandingProbe.jsx";
import { standingState } from "../src/oscillationModels.mjs";
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
it("exact buttons locate every node and antinode without slider rounding", async () => {
  const host = document.createElement("div"),
    root = createRoot(host),
    position = vi.fn(),
    seek = vi.fn();
  try {
    for (const mode of [1, 2, 3, 4, 5]) {
      const p = { mode, tension: 36, amplitude: 12, probe: 25 };
      await act(() =>
        root.render(
          <StandingProbe
            p={p}
            time={0.3}
            onPosition={position}
            onSeek={seek}
          />,
        ),
      );
      const buttons = [...host.querySelectorAll("button")];
      for (const b of buttons.filter((b) => b.textContent.startsWith("波节"))) {
        await act(() => b.click());
        for (const t of [0, 0.1, 0.25, 1.3])
          expect(
            standingState({ ...p, probe: position.mock.lastCall[0] }, t).y,
          ).toBe(0);
      }
      for (const b of buttons.filter((b) => b.textContent.startsWith("波腹"))) {
        await act(() => b.click());
        expect(
          Math.abs(
            standingState({ ...p, probe: position.mock.lastCall[0] }, 0).y,
          ),
        ).toBeCloseTo(12);
      }
      await act(() =>
        buttons.find((b) => b.textContent === "相位 0.25 T").click(),
      );
      expect(standingState(p, seek.mock.lastCall[0]).y).toBe(0);
    }
  } finally {
    await act(() => root.unmount());
  }
});
it("neighboring antinodes are opposite throughout the cycle", () => {
  for (const mode of [2, 3, 4, 5])
    for (const t of [0, 0.1, 0.25, 0.7]) {
      const p = { mode, tension: 144, amplitude: 20 };
      expect(standingState(p, t, 1 / (2 * mode)).y).toBeCloseTo(
        -standingState(p, t, 3 / (2 * mode)).y,
        9,
      );
    }
});
