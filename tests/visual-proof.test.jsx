// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { renderToStaticMarkup } from "react-dom/server";
import { it, expect } from "vitest";
import { squareAreas, mirrorRay } from "../src/visualProofModels.mjs";
import { visualProofLessons } from "../src/visualProofLessons.mjs";
import VisualProofScene from "../src/VisualProofScene.jsx";
import MotionLab from "../src/MotionLab.jsx";
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
it("four nonoverlapping corner triangles leave the correct rotated square at all side lengths", () => {
  for (let a = 2; a <= 6; a += 0.5)
    for (let b = 2; b <= 6; b += 0.5) {
      const q = squareAreas({ a, b });
      const v = [
        [a, 0],
        [a + b, a],
        [b, a + b],
        [0, b],
      ];
      const polygon =
        Math.abs(
          v.reduce(
            (sum, p, i) =>
              sum + p[0] * v[(i + 1) % 4][1] - p[1] * v[(i + 1) % 4][0],
            0,
          ),
        ) / 2;
      expect(polygon).toBeCloseTo(q.a2 + q.b2, 10);
      expect(q.outer - q.triangles).toBeCloseTo(polygon, 10);
      const edges = v.map((p, i) => [
        v[(i + 1) % 4][0] - p[0],
        v[(i + 1) % 4][1] - p[1],
      ]);
      edges.forEach((e, i) => {
        expect(Math.hypot(...e)).toBeCloseTo(q.c, 10);
        expect(
          e[0] * edges[(i + 1) % 4][0] + e[1] * edges[(i + 1) % 4][1],
        ).toBeCloseTo(0, 10);
      });
    }
});
it("mirror intersection obeys equal angles and collinear virtual extension throughout supported ranges", () => {
  for (const distance of [2, 4, 6])
    for (const eyeDistance of [2, 4, 6])
      for (const objectHeight of [1, 3, 5])
        for (const eyeHeight of [1, 3, 5]) {
          const p = { distance, eyeDistance, objectHeight, eyeHeight },
            q = mirrorRay(p);
          expect(q.incident).toBeCloseTo(q.reflected, 12);
          expect((objectHeight - q.height) * eyeDistance).toBeCloseTo(
            (q.height - eyeHeight) * distance,
            12,
          );
          expect(q.height).toBeGreaterThanOrEqual(
            Math.min(objectHeight, eyeHeight),
          );
          expect(q.height).toBeLessThanOrEqual(
            Math.max(objectHeight, eyeHeight),
          );
          expect(q.imageDistance).toBe(distance);
          expect(q.imageHeight).toBe(objectHeight);
        }
});
it.each(visualProofLessons)(
  "$id changes each chapter scene and resets playback on parameter changes",
  async (lesson) => {
    const frames = lesson.chapters.map((c, chapter) =>
      renderToStaticMarkup(
        <VisualProofScene
          id={lesson.id}
          p={c.preset}
          time={c.time}
          chapter={chapter}
        />,
      ),
    );
    expect(new Set(frames).size).toBe(lesson.chapters.length);
    frames.forEach((frame) =>
      expect(frame).not.toMatch(/NaN|Infinity|undefined/),
    );
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
          Number(host.querySelector('[aria-label="演示进度"]').value),
        ).toBe(lesson.chapters[i].time);
        if (i < lesson.chapters.length - 1)
          await act(() =>
            [...host.querySelectorAll("button")]
              .find((b) => b.textContent === "下一节")
              .click(),
          );
      }
      const field = host.querySelector(
        `[aria-label="${lesson.params[0].label}"]`,
      );
      await act(() => {
        Object.getOwnPropertyDescriptor(
          HTMLInputElement.prototype,
          "value",
        ).set.call(field, String(lesson.params[0].max));
        field.dispatchEvent(new Event("input", { bubbles: true }));
        field.dispatchEvent(new Event("change", { bubbles: true }));
      });
      expect(host.querySelector('[aria-label="演示进度"]').value).toBe("0");
      expect(host.querySelector(".motion-diagram").outerHTML).not.toMatch(
        /NaN|Infinity/,
      );
      expect(
        [...host.querySelectorAll("button")].some(
          (b) => b.textContent === "播放演示",
        ),
      ).toBe(true);
    } finally {
      await act(() => root.unmount());
    }
  },
);
