// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { it, expect, vi } from "vitest";
import SeismicArrival from "../src/SeismicArrival.jsx";
import { seismic } from "../src/advancedModels.mjs";
import { topicChapters } from "../src/topicChapters.mjs";
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
it("time-distance graph supports keyboard seeking and arrival-state boundaries", async () => {
  const host = document.createElement("div"),
    root = createRoot(host),
    seek = vi.fn();
  const p = { depth: 20, distance: 60 },
    q = seismic(p, 0);
  try {
    await act(() =>
      root.render(<SeismicArrival p={p} time={14} onSeek={seek} />),
    );
    const graph = host.querySelector("svg");
    for (const key of ["Home", "ArrowRight", "End"])
      await act(() =>
        graph.dispatchEvent(
          new KeyboardEvent("keydown", { key, bubbles: true }),
        ),
      );
    expect(seek.mock.calls.map((c) => c[0])).toEqual([0, 14.25, 25]);
    expect(host.textContent).toContain("P 波已到站");
    expect(seismic(p, q.tp).stage).toBe("P 波已到站");
    expect(seismic(p, q.ts).stage).toBe("P、S 波均已到站");
  } finally {
    await act(() => root.unmount());
  }
});
it("different source depths can give the same source distance and arrival pair", () => {
  const [a, b] = topicChapters.earthquake[4].scenarios.map((s) =>
    seismic(s.p, 0),
  );
  expect(a.distance).toBe(50);
  expect(b.distance).toBe(50);
  expect(a.tp).toBe(b.tp);
  expect(a.ts).toBe(b.ts);
});
