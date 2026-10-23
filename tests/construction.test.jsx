// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { it, expect } from "vitest";
import {
  trianglePoints,
  transformedPoint,
  pulleyState,
} from "../src/constructionModels.mjs";
import { constructionLessons } from "../src/constructionLessons.mjs";
import MotionLab from "../src/MotionLab.jsx";
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
it("reflections preserve distance and bisect corresponding points perpendicularly", () => {
  for (const axis of [0, 15, 45, 90])
    for (const v of trianglePoints) {
      const a = (axis * Math.PI) / 180,
        u = [Math.cos(a), Math.sin(a)],
        w = transformedPoint(v, { mode: 0, axis }, 6);
      expect(Math.hypot(...w)).toBeCloseTo(Math.hypot(...v), 10);
      expect((w[0] - v[0]) * u[0] + (w[1] - v[1]) * u[1]).toBeCloseTo(0, 10);
      expect(-(w[0] + v[0]) * u[1] + (w[1] + v[1]) * u[0]).toBeCloseTo(0, 10);
      const back = transformedPoint(w, { mode: 0, axis }, 6);
      expect(back[0]).toBeCloseTo(v[0], 10);
      expect(back[1]).toBeCloseTo(v[1], 10);
    }
});
it("rotation preserves lengths throughout and half-turn reverses coordinates", () => {
  for (const time of [0, 1, 3, 6]) {
    const pts = trianglePoints.map((v) =>
      transformedPoint(v, { mode: 1, turn: 180 }, time),
    );
    expect(
      Math.hypot(pts[0][0] - pts[1][0], pts[0][1] - pts[1][1]),
    ).toBeCloseTo(2, 10);
  }
  expect(transformedPoint([1, 2], { mode: 1, turn: 180 }, 6)[0]).toBeCloseTo(
    -1,
    10,
  );
});
it("pulley work, forces and actual drawn rope length remain consistent", () => {
  for (const mode of [0, 1])
    for (const mass of [1, 5, 10])
      for (const lift of [0.2, 0.6, 0.8])
        for (const time of [0, 1, 3, 6]) {
          const q = pulleyState({ mode, mass, lift }, time);
          expect(q.force * q.n).toBeCloseTo(q.weight, 10);
          expect(q.force * q.distance).toBeCloseTo(q.work, 10);
          const cy = (mode ? 330 : 310) - q.h * 100,
            end = 175 + q.distance * 100;
          const length = mode
            ? cy - 65 + cy - 130 + end - 130 + 110 * Math.PI
            : cy - 130 + end - 130 + 55 * Math.PI;
          const initial = mode
            ? 330 - 65 + 330 - 130 + 175 - 130 + 110 * Math.PI
            : 310 - 130 + 175 - 130 + 55 * Math.PI;
          expect(length).toBeCloseTo(initial, 10);
        }
});
it.each(constructionLessons)(
  "$id each chapter updates the scene, controls and end navigation",
  async (lesson) => {
    const host = document.createElement("div"),
      root = createRoot(host);
    document.body.append(host);
    try {
      await act(() =>
        root.render(
          <MotionLab lesson={lesson} open={() => {}} goHome={() => {}} />,
        ),
      );
      const button = (name) =>
        [...host.querySelectorAll("button")].find(
          (b) => b.textContent === name,
        );
      const scenes = [];
      for (let i = 0; i < lesson.chapters.length; i++) {
        expect(host.querySelector("h1").textContent).toBe(
          lesson.chapters[i].title,
        );
        scenes.push(host.querySelector("svg.motion-diagram").innerHTML);
        if (i < 4) await act(() => button("下一节").click());
      }
      expect(new Set(scenes).size).toBe(5);
      expect(button("下一节").disabled).toBe(true);
      await act(() => button("回到起点").click());
      expect(host.querySelector('[aria-label="演示进度"]').value).toBe("0");
      await act(() => button("前进一步").click());
      expect(host.querySelector('[aria-label="演示进度"]').value).toBe("0.25");
    } finally {
      await act(() => root.unmount());
      host.remove();
    }
  },
);
