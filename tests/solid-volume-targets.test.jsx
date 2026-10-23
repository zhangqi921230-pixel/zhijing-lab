// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { it, expect, vi } from "vitest";
import {
  accumulatedVolumes,
  coneHeightForVolume,
} from "../src/advancedModels.mjs";
import SolidVolumeGuide from "../src/SolidVolumeGuide.jsx";
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
it("inverse height cuts the requested fraction independently of radius and height", () => {
  for (const r of [0.5, 1, 2])
    for (const h of [1, 2, 4])
      for (const v of [0, 0.25, 0.5, 0.75, 1]) {
        const f = coneHeightForVolume(v),
          q = accumulatedVolumes(r, h, f);
        expect(q.coneFraction).toBeCloseTo(v, 12);
        expect(q.cone).toBeCloseTo((Math.PI * r * r * h * v) / 3, 12);
      }
  expect(coneHeightForVolume(0.5)).toBeCloseTo(0.206299474, 8);
});
it("applies the unrounded height and distinguishes cylinder half-volume", async () => {
  const host = document.createElement("div"),
    root = createRoot(host),
    change = vi.fn();
  try {
    await act(() =>
      root.render(
        <SolidVolumeGuide
          p={{ radius: 1, height: 3, slice: 50 }}
          t={0}
          onChange={change}
        />,
      ),
    );
    const btn = (t) =>
      [...host.querySelectorAll("button")].find((b) => b.textContent === t);
    await act(() => btn("圆锥二分之一体积").click());
    expect(change.mock.lastCall[0]).toBe("slice");
    expect(
      accumulatedVolumes(1, 3, change.mock.lastCall[1] / 100).coneFraction,
    ).toBeCloseTo(0.5, 12);
    await act(() => btn("对照圆柱半体积").click());
    expect(change).toHaveBeenLastCalledWith("slice", 50);
  } finally {
    await act(() => root.unmount());
  }
});
