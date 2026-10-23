// @vitest-environment jsdom
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { it, expect } from "vitest";
import { areaCutState, hydraulicState } from "../src/discoveryModels.mjs";
import { discoveryLessons } from "../src/discoveryLessons.mjs";
import DiscoveryScene from "../src/DiscoveryScene.jsx";
it("cut triangle plus trapezoid equal the destination rectangle for every shape", () => {
  for (const base of [3, 4, 6])
    for (const height of [1, 2, 3])
      for (const shear of [0, 0.5, 2]) {
        const p = { base, height, shear },
          q = areaCutState(p, 6);
        expect(q.shift).toBe(base);
        expect(q.triangle + ((2 * base - shear) * height) / 2).toBeCloseTo(
          q.area,
          12,
        );
        for (const t of [0, 1, 3, 6])
          expect(areaCutState(p, t).area).toBe(base * height);
      }
});
it("hydraulic pressure, transferred volume and work agree across the full parameter range", () => {
  for (const ratio of [1, 2, 4, 8])
    for (const force of [10, 40, 100])
      for (const stroke of [2, 8, 10])
        for (const t of [0, 2, 6]) {
          const q = hydraulicState({ ratio, force, stroke }, t);
          expect(q.outputForce / (ratio * 10e-4)).toBeCloseTo(
            q.pressure * 1000,
            8,
          );
          expect(10 * q.distance).toBeCloseTo(
            10 * ratio * q.outputDistance,
            12,
          );
          expect((q.outputForce * q.outputDistance) / 100).toBeCloseTo(
            q.work,
            12,
          );
        }
});
it.each(discoveryLessons)(
  "$id all chapters have finite, visibly distinct demonstrations",
  (lesson) => {
    const frames = lesson.chapters.map((c) =>
      renderToStaticMarkup(
        <DiscoveryScene id={lesson.id} p={c.preset} time={c.time} />,
      ),
    );
    expect(new Set(frames).size).toBe(5);
    for (const frame of frames)
      expect(frame).not.toMatch(/NaN|Infinity|undefined/);
    const p = lesson.chapters[0].preset;
    expect(
      renderToStaticMarkup(<DiscoveryScene id={lesson.id} p={p} time={0} />),
    ).not.toBe(
      renderToStaticMarkup(<DiscoveryScene id={lesson.id} p={p} time={6} />),
    );
  },
);
