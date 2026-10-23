// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { renderToStaticMarkup } from "react-dom/server";
import { it, expect } from "vitest";
import {
  comparisonLessons,
  similarState,
  polarizationState,
} from "../src/comparisonLessons.mjs";
import ComparisonScene from "../src/ComparisonScene.jsx";
import MotionLab from "../src/MotionLab.jsx";
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
it("length, perimeter and area use the same instantaneous scale", () => {
  for (const shape of [0, 1])
    for (const scale of [0.5, 1, 1.5, 2, 3])
      for (let t = 0; t <= 6; t += 0.125) {
        const q = similarState({ shape, scale }, t);
        expect(q.perimeter / q.basePerimeter).toBeCloseTo(q.k, 12);
        expect(q.area / q.baseArea).toBeCloseTo(q.k ** 2, 12);
      }
  expect(similarState({ shape: 0, scale: 2 }, 6).area).toBe(24);
  expect(similarState({ shape: 1, scale: 0.5 }, 6).area).toBe(0.75);
});
it("successive Malus projections preserve passivity and crossed limits", () => {
  expect(polarizationState({ angle: 90, insert: 0, middle: 45 }).output).toBe(
    0,
  );
  expect(
    polarizationState({ angle: 90, insert: 1, middle: 45 }).output,
  ).toBeCloseTo(0.125, 12);
  for (let angle = 0; angle <= 90; angle++)
    for (let middle = 0; middle <= 90; middle++) {
      const q = polarizationState({ angle, insert: 1, middle });
      expect(q.output).toBeGreaterThanOrEqual(0);
      expect(q.output).toBeLessThanOrEqual(q.middle + 1e-12);
      expect(q.middle).toBeLessThanOrEqual(q.first + 1e-12);
      if (angle === 90) expect(q.output).toBeLessThanOrEqual(0.125 + 1e-12);
    }
});
it("every new chapter renders a distinct finite demonstration", () => {
  for (const lesson of comparisonLessons) {
    const views = lesson.chapters.map((c) =>
      renderToStaticMarkup(
        <ComparisonScene id={lesson.id} p={c.preset} time={c.time} />,
      ),
    );
    expect(new Set(views).size).toBe(lesson.chapters.length);
    views.forEach((x) => expect(x).not.toMatch(/NaN|Infinity|undefined/));
  }
});
it("inserting the middle filter changes the light and preserves the observation time", async () => {
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
      host.querySelectorAll('[aria-label="学习子主题"] button')[2].click(),
    );
    expect(host.querySelector('[aria-label="演示进度"]').value).toBe("3");
    await act(() =>
      [...host.querySelectorAll("button")]
        .find((b) => b.textContent === "插入中间片")
        .click(),
    );
    expect(host.textContent).toContain("12.5%");
    expect(host.querySelector('[aria-label="演示进度"]').value).toBe("3");
    expect(host.textContent).toContain("播放演示");
  } finally {
    await act(() => root.unmount());
  }
});
