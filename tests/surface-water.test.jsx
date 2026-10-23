// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { expect, it, vi } from "vitest";
import {
  surfaceBudget,
  surfaceTarget,
  surfaceInfiltration,
} from "../src/surfaceWater.mjs";
import SurfaceWaterStudy from "../src/SurfaceWaterStudy.jsx";
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
it("conserves water and matches the area-weighted end members", () => {
  for (const rain of [0, 50, 100, 200])
    for (const evap of [0, 10, 20])
      for (const share of [0, 25, 50, 75, 100]) {
        const q = surfaceBudget(rain, evap, share),
          a = surfaceBudget(rain, evap, 0),
          b = surfaceBudget(rain, evap, 100);
        expect(q.infil + q.evap + q.runoff).toBeCloseTo(rain, 9);
        expect(q.runoff).toBeCloseTo(
          a.runoff * (1 - share / 100) + (b.runoff * share) / 100,
          9,
        );
      }
  expect(surfaceInfiltration(25)).toBe(25);
  expect(surfaceInfiltration(75)).toBe(55);
});
it("finds the exact feasible boundary, zero-rain case, and impossible target", () => {
  for (const rain of [50, 100]) {
    const q = surfaceTarget(rain, 10);
    expect(q.possible).toBe(true);
    expect(surfaceBudget(rain, 10, q.required).runoff).toBeCloseTo(30, 9);
    expect(surfaceBudget(rain, 10, q.required - 1).runoff).toBeGreaterThan(30);
  }
  expect(surfaceTarget(0, 10)).toEqual({ possible: true, required: 0 });
  expect(surfaceTarget(200, 10).possible).toBe(false);
  expect(surfaceBudget(200, 10, 100).runoff).toBe(40);
});
it("applies a ground scheme and exact target through the parent, and removes unreachable actions", async () => {
  const host = document.createElement("div"),
    root = createRoot(host),
    change = vi.fn();
  const render = (rain, infil = 40) =>
    act(() =>
      root.render(
        <SurfaceWaterStudy
          p={{ rain, infil, evap: 10 }}
          chapter={7}
          onChange={change}
        />,
      ),
    );
  const button = (s) =>
    [...host.querySelectorAll("button")].find((b) => b.textContent === s);
  try {
    await render(100);
    await act(() => button("透水 75%").click());
    expect(change).toHaveBeenLastCalledWith("infil", 55);
    await act(() => button("查看刚好达标的方案").click());
    expect(change.mock.lastCall[0]).toBe("infil");
    expect(change.mock.lastCall[1]).toBeCloseTo(60, 10);
    await render(100, 60);
    expect(host.textContent).toContain("当前方案已达到目标");
    await render(200);
    expect(host.textContent).toContain("无法达标");
    expect(button("查看刚好达标的方案")).toBeUndefined();
    await render(0);
    expect(host.textContent).toContain("无降水输入");
    await render(100, 80);
    expect(host.textContent).toContain("不在本小节");
    expect(host.querySelector("svg")).toBeNull();
  } finally {
    await act(() => root.unmount());
  }
});
