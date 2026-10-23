// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { renderToStaticMarkup } from "react-dom/server";
import { it, expect } from "vitest";
import { triangleAngles, communicatingState } from "../src/insightModels.mjs";
import { insightLessons } from "../src/insightLessons.mjs";
import InsightScene from "../src/InsightScene.jsx";
import MotionLab from "../src/MotionLab.jsx";
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
it("angle sum and exterior theorem hold for the full parameter extremes", () => {
  for (const base of [4, 6, 8])
    for (const offset of [1, 2, 3])
      for (const height of [1, 2, 4]) {
        const q = triangleAngles({ base, offset, height });
        expect(q.a + q.b + q.c).toBeCloseTo(Math.PI, 12);
        expect(q.a + q.c).toBeCloseTo(q.exterior, 12);
        expect(Math.min(q.a, q.b, q.c)).toBeGreaterThan(0);
        if (offset === base / 2) expect(q.a).toBeCloseTo(q.b, 12);
      }
});
it("unequal tube areas conserve liquid at every frame and converge without overshoot", () => {
  for (const ratio of [1, 2, 4])
    for (const left of [8, 18, 28])
      for (const right of [8, 18, 28]) {
        const p = { ratio, left, right };
        let previous = Math.abs(left - right);
        for (let i = 0; i <= 60; i++) {
          const q = communicatingState(p, i / 10);
          expect(q.volume).toBeCloseTo(10 * left + 10 * ratio * right, 10);
          expect(q.transfer).toBeCloseTo(10 * ratio * (q.right - right), 10);
          expect(Math.abs(q.left - q.right)).toBeLessThanOrEqual(
            previous + 1e-10,
          );
          previous = Math.abs(q.left - q.right);
        }
        const end = communicatingState(p, 6);
        expect(end.left).toBeCloseTo(end.right, 12);
        expect(end.pressure).toBeCloseTo(0, 10);
      }
});
it.each(insightLessons)(
  "$id has distinct real scenes and chapter navigation updates them",
  async (lesson) => {
    const frames = lesson.chapters.map((c) =>
      renderToStaticMarkup(
        <InsightScene id={lesson.id} p={c.preset} time={c.time} />,
      ),
    );
    expect(new Set(frames).size).toBe(lesson.chapters.length);
    for (const frame of frames)
      expect(frame).not.toMatch(/NaN|Infinity|undefined/);
    const host = document.createElement("div"),
      root = createRoot(host);
    await act(() =>
      root.render(
        <MotionLab lesson={lesson} open={() => {}} goHome={() => {}} />,
      ),
    );
    try {
      for (let i = 0; i < lesson.chapters.length; i++) {
        expect(host.querySelector("h1").textContent).toBe(
          lesson.chapters[i].title,
        );
        expect(
          Number(host.querySelector('input[aria-label="演示进度"]').value),
        ).toBe(lesson.chapters[i].time);
        expect(host.querySelector(".motion-diagram").outerHTML).not.toMatch(
          /NaN|Infinity|undefined/,
        );
        if (i < lesson.chapters.length - 1)
          await act(() =>
            [...host.querySelectorAll("button")]
              .find((b) => b.textContent === "下一节")
              .click(),
          );
      }
    } finally {
      await act(() => root.unmount());
    }
  },
);
