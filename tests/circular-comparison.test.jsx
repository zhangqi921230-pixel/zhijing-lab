// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { it, expect } from "vitest";
import { circularComparison } from "../src/observableModels.mjs";
import MotionLab from "../src/MotionLab.jsx";
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
it("isolates one variable and gives square, inverse-radius and mass force ratios", () => {
  const p = { radius: 1, speed: 4, mass: 2 };
  for (const [chapter, key, ratio] of [
    [2, "speed", 4],
    [3, "radius", 2],
    [4, "mass", 2],
  ]) {
    const q = circularComparison(p, chapter, 1);
    expect(q.ratio).toBeCloseTo(ratio);
    for (const other of ["radius", "speed", "mass"].filter((k) => k !== key))
      expect(q.reference[other]).toBe(p[other]);
  }
  const q = circularComparison(p, 4, 1);
  expect(q.referenceState.x).toBe(q.currentState.x);
  expect(q.referenceState.acceleration).toBe(q.currentState.acceleration);
});
it("shows synchronized comparison and locates a complete orbit beyond six seconds", async () => {
  const host = document.createElement("div"),
    root = createRoot(host);
  const click = async (name) =>
    act(() =>
      [...host.querySelectorAll("button")]
        .find((b) => b.textContent === name)
        .click(),
    );
  try {
    await act(() =>
      root.render(
        <MotionLab
          lesson={{ id: "circular-motion" }}
          open={() => {}}
          goHome={() => {}}
        />,
      ),
    );
    expect(
      Number(host.querySelector('[aria-label="演示进度"]').max),
    ).toBeGreaterThan(2 * Math.PI);
    await click("当前组完整一周");
    expect(
      Number(host.querySelector('[data-object="ball"]').getAttribute("cx")),
    ).toBeCloseTo(442);
    await act(() =>
      host.querySelectorAll('[aria-label="学习子主题"] button')[2].click(),
    );
    expect(host.querySelectorAll("[data-comparison-ball]").length).toBe(2);
    expect(host.textContent).toContain("4.00 倍");
    await click("当前组完整一周");
    const balls = host.querySelectorAll("[data-comparison-ball]");
    expect(Number(balls[0].getAttribute("cx"))).toBeCloseTo(240 - 88);
    expect(Number(balls[1].getAttribute("cx"))).toBeCloseTo(660 + 88);
  } finally {
    await act(() => root.unmount());
  }
});
