// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { it, expect, vi } from "vitest";
import MoonPhasePair, { moonPhasePair } from "../src/MoonPhasePair.jsx";
import MoonCycle from "../src/MoonCycle.jsx";
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
it("paired illumination agrees throughout a cycle and both predictions move forward independently", () => {
  for (let angle = 0; angle <= 360; angle++) {
    const [a, b] = moonPhasePair(angle);
    expect(a.fraction).toBeCloseTo(b.fraction, 12);
    expect(a.next.angle).toBe((a.angle + 15) % 360);
    expect(b.next.angle).toBe((b.angle + 15) % 360);
  }
  for (const angle of [45, 90, 135]) {
    const [a, b] = moonPhasePair(angle);
    expect(a.next.fraction).toBeGreaterThan(a.fraction);
    expect(b.next.fraction).toBeLessThan(b.fraction);
  }
});
it("switching and forward actions use the shared angle; degenerate pair is disabled", async () => {
  const host = document.createElement("div"),
    root = createRoot(host),
    change = vi.fn();
  try {
    await act(() =>
      root.render(<MoonPhasePair angle={315} onChange={change} />),
    );
    await act(() => host.querySelectorAll("button")[0].click());
    expect(change).toHaveBeenLastCalledWith("angle", 45);
    await act(() => host.querySelectorAll("button")[1].click());
    expect(change).toHaveBeenLastCalledWith("angle", 330);
    for (const angle of [0, 180, 360]) {
      await act(() =>
        root.render(<MoonPhasePair angle={angle} onChange={change} />),
      );
      expect(host.querySelector("button").disabled).toBe(true);
    }
  } finally {
    await act(() => root.unmount());
  }
});
it("the paired study belongs to the equal-illumination lesson only", async () => {
  const host = document.createElement("div"),
    root = createRoot(host);
  try {
    await act(() =>
      root.render(<MoonCycle angle={90} chapter={4} onChange={() => {}} />),
    );
    expect(
      host.querySelector('[aria-label="相同比例的两个月相"]'),
    ).not.toBeNull();
    expect(host.textContent).toContain("上弦月");
    expect(host.textContent).toContain("下弦月");
    await act(() =>
      root.render(<MoonCycle angle={90} chapter={0} onChange={() => {}} />),
    );
    expect(host.querySelector('[aria-label="相同比例的两个月相"]')).toBeNull();
  } finally {
    await act(() => root.unmount());
  }
});
