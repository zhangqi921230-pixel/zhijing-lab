// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { it, expect, vi } from "vitest";
import RadianComparison, {
  radianComparisonCases,
} from "../src/RadianComparison.jsx";
import { radianState } from "../src/signalLessons.mjs";
import MotionLab from "../src/MotionLab.jsx";
import { motionTopics } from "../src/motionLessons.mjs";
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
it("the comparison controls only one quantity at a time", () => {
  for (const p of radianComparisonCases("arc")) {
    expect(radianState(p).length).toBeCloseTo(Math.PI, 12);
    expect(p.radius * p.angle).toBe(180);
  }
  for (const p of radianComparisonCases("angle")) {
    expect(p.angle).toBe(90);
    expect(radianState(p).length / p.radius).toBeCloseTo(Math.PI / 2, 12);
  }
});
it("switching comparison modes keeps the main conditions; explicitly loading preserves other fields", async () => {
  const host = document.createElement("div"),
    root = createRoot(host),
    change = vi.fn();
  try {
    await act(() =>
      root.render(
        <RadianComparison
          p={{ radius: 2, angle: 57, other: 9 }}
          chapter={5}
          onChange={change}
        />,
      ),
    );
    const buttons = () => [...host.querySelectorAll("button")];
    await act(() =>
      buttons()
        .find((x) => x.textContent === "固定圆心角 90°")
        .click(),
    );
    expect(change).not.toHaveBeenCalled();
    expect(
      host.querySelectorAll('[aria-label="载入对照条件"] [aria-pressed="true"]')
        .length,
    ).toBe(0);
    await act(() =>
      buttons()
        .find((x) => x.textContent === "载入 r=3 cm、90°")
        .click(),
    );
    expect(change).toHaveBeenCalledWith({ radius: 3, angle: 90, other: 9 });
  } finally {
    await act(() => root.unmount());
  }
});
it("sixth chapter offers equal-arc presets and loading pauses without resetting progress", async () => {
  const host = document.createElement("div"),
    root = createRoot(host),
    lesson = motionTopics.find((x) => x.id === "radian-arc");
  try {
    await act(() =>
      root.render(
        <MotionLab lesson={lesson} open={() => {}} goHome={() => {}} />,
      ),
    );
    await act(() =>
      host.querySelectorAll('[aria-label="学习子主题"] button')[5].click(),
    );
    expect(host.querySelector("h1").textContent).toBe("弧长相同，圆心角不同");
    await act(() =>
      [...host.querySelectorAll("button")]
        .find((x) => x.textContent === "3 秒")
        .click(),
    );
    await act(() =>
      [...host.querySelectorAll("button")]
        .find((x) => x.textContent === "载入 r=1 cm、180°")
        .click(),
    );
    expect(host.querySelector('[aria-label="半径 r"]').value).toBe("1");
    expect(host.querySelector('[aria-label="圆心角"]').value).toBe("180");
    expect(host.querySelector('[aria-label="演示进度"]').value).toBe("3");
    expect(host.textContent).toContain("播放演示");
    await act(() =>
      host.querySelectorAll('[aria-label="学习子主题"] button')[4].click(),
    );
    expect(
      [...host.querySelectorAll("button")]
        .find((x) => x.textContent === "固定圆心角 90°")
        .getAttribute("aria-pressed"),
    ).toBe("true");
  } finally {
    await act(() => root.unmount());
  }
});
