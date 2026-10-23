// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { it, expect, vi } from "vitest";
import PolarizationStudy, {
  polarizationSweep,
  brightestMiddle,
} from "../src/PolarizationStudy.jsx";
import {
  polarizationState,
  comparisonLessons,
} from "../src/comparisonLessons.mjs";
import MotionLab from "../src/MotionLab.jsx";
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
it("the half-angle maximum bounds the entire sweep for every allowed analyzer direction", () => {
  for (let angle = 0; angle <= 90; angle++) {
    const best = brightestMiddle(angle),
      max = polarizationState({ angle, insert: 1, middle: best }).output;
    const samples = polarizationSweep(angle);
    expect(samples).toHaveLength(181);
    expect(samples[0].angle).toBe(0);
    expect(samples.at(-1).angle).toBe(90);
    for (const q of samples) {
      expect(q.output).toBeLessThanOrEqual(max + 1e-12);
      expect(q.middle).toBeGreaterThanOrEqual(q.output - 1e-12);
    }
    expect(samples[angle].output).toBeCloseTo(max, 12);
  }
  expect(
    polarizationState({ angle: 60, insert: 1, middle: 30 }).output,
  ).toBeCloseTo(0.28125, 12);
});
it("angle actions preserve conditions and become unavailable with the middle filter removed", async () => {
  const host = document.createElement("div"),
    root = createRoot(host),
    change = vi.fn();
  const p = { angle: 37, insert: 1, middle: 45, extra: 9 };
  try {
    await act(() => root.render(<PolarizationStudy p={p} onChange={change} />));
    await act(() =>
      [...host.querySelectorAll("button")]
        .find((b) => b.textContent.includes("定位最亮方向"))
        .click(),
    );
    expect(change).toHaveBeenCalledWith({ ...p, middle: 18.5 });
    await act(() =>
      root.render(
        <PolarizationStudy p={{ ...p, insert: 0 }} onChange={change} />,
      ),
    );
    expect([...host.querySelectorAll("button")].every((b) => b.disabled)).toBe(
      true,
    );
    expect(host.querySelector("svg").querySelectorAll("circle")).toHaveLength(
      0,
    );
    expect(host.textContent).toContain("实线保留为插入后的预测");
  } finally {
    await act(() => root.unmount());
  }
});
it("the new course chapter and graph update the main demonstration without resetting time", async () => {
  const host = document.createElement("div"),
    root = createRoot(host);
  try {
    await act(() =>
      root.render(
        <MotionLab
          lesson={comparisonLessons[1]}
          open={() => {}}
          goHome={() => {}}
        />,
      ),
    );
    await act(() =>
      host.querySelectorAll('[aria-label="学习子主题"] button')[5].click(),
    );
    expect(host.querySelector("h1").textContent).toBe("最亮方向不总是45度");
    expect(host.querySelector('[aria-label="中间片方向"]').value).toBe("30");
    await act(() =>
      [
        ...host
          .querySelector('[aria-label="定位中间片方向"]')
          .querySelectorAll("button"),
      ]
        .find((b) => b.textContent === "45°")
        .click(),
    );
    expect(host.querySelector('[aria-label="中间片方向"]').value).toBe("45");
    expect(host.querySelector('[aria-label="演示进度"]').value).toBe("4.5");
    await act(() =>
      [...host.querySelectorAll("button")]
        .find((b) => b.textContent.includes("定位最亮方向"))
        .click(),
    );
    expect(host.querySelector('[aria-label="中间片方向"]').value).toBe("30");
    expect(host.textContent).toContain("28.13%");
  } finally {
    await act(() => root.unmount());
  }
});
