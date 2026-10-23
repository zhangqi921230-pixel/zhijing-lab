// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { it, expect, vi } from "vitest";
import SeismicStationTimes, {
  stationArrivals,
} from "../src/SeismicStationTimes.jsx";
import { duration } from "../src/advancedModels.mjs";
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
it("each station uses its own source distance and exact arrival boundaries within the main timeline", () => {
  for (const depth of [5, 15, 30])
    for (const distance of [10, 40, 80]) {
      const p = { depth, distance },
        stations = stationArrivals(p, 0);
      for (const s of stations) {
        expect(s.ts - s.tp).toBeCloseTo(s.lag);
        expect(s.tp * 6).toBeCloseTo(Math.hypot(s.x, s.y, depth));
        expect(s.ts).toBeLessThan(duration("earthquake", p));
        expect(
          stationArrivals(p, s.tp).find((v) => v.name === s.name).stage,
        ).toBe("P 波已到站");
        expect(
          stationArrivals(p, s.ts).find((v) => v.name === s.name).stage,
        ).toBe("P、S 波均已到站");
      }
    }
});
it("station shortcuts seek unrounded times and update visible receiver status", async () => {
  const host = document.createElement("div"),
    root = createRoot(host),
    onSeek = vi.fn(),
    p = { depth: 15, distance: 40 };
  try {
    await act(() =>
      root.render(<SeismicStationTimes p={p} time={0} onSeek={onSeek} />),
    );
    await act(() =>
      [...host.querySelectorAll("button")]
        .find((b) => b.textContent === "定位 B 的 S 波")
        .click(),
    );
    const b = stationArrivals(p, 0)[1];
    expect(onSeek).toHaveBeenCalledWith(b.ts);
    await act(() =>
      root.render(<SeismicStationTimes p={p} time={b.ts} onSeek={onSeek} />),
    );
    expect(host.textContent).toContain("P、S 波均已到站");
  } finally {
    await act(() => root.unmount());
  }
});
