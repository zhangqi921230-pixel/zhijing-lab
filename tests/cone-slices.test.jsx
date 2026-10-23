// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { it, expect, vi } from "vitest";
import ConeSlices, { coneSliceBounds } from "../src/ConeSlices.jsx";
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
it("inner and outer cylinders bound the cone with monotonically shrinking gaps", () => {
  for (const radius of [1, 2, 3])
    for (const height of [3, 6]) {
      let previous = Infinity;
      for (const n of [4, 8, 16, 32]) {
        const q = coneSliceBounds({ radius, height }, n);
        expect(q.lower).toBeLessThan(q.exact);
        expect(q.upper).toBeGreaterThan(q.exact);
        expect(q.upper - q.lower).toBeCloseTo(
          (Math.PI * radius ** 2 * height) / n,
          8,
        );
        expect(q.upper - q.lower).toBeLessThan(previous);
        previous = q.upper - q.lower;
        for (const s of q.slices) {
          const midpoint = radius * (1 - (s.z + s.height / 2) / height);
          expect(s.inner).toBeLessThan(midpoint);
          expect(s.outer).toBeGreaterThan(midpoint);
        }
      }
    }
});
it("layer selection updates the scene and seeks the complete construction", async () => {
  const host = document.createElement("div"),
    root = createRoot(host),
    seek = vi.fn();
  try {
    await act(() =>
      root.render(
        <ConeSlices p={{ radius: 2, height: 6 }} time={0} onSeek={seek} />,
      ),
    );
    expect(host.textContent).toContain("已显示 0/8 层");
    await act(() =>
      [...host.querySelectorAll("button")]
        .find((b) => b.textContent === "32 层")
        .click(),
    );
    expect(seek).toHaveBeenCalledWith(6);
    await act(() =>
      root.render(
        <ConeSlices p={{ radius: 2, height: 6 }} time={6} onSeek={seek} />,
      ),
    );
    expect(host.textContent).toContain("已显示 32/32 层");
    expect(host.querySelectorAll("rect").length).toBe(64);
  } finally {
    await act(() => root.unmount());
  }
});
