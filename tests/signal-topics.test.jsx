import React from "react";
import { it, expect } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import SignalScene from "../src/SignalScene.jsx";
import {
  signalLessons,
  radianState,
  beatState,
} from "../src/signalLessons.mjs";
it("radians are radius independent and arc length scales with radius", () => {
  for (let angle = 0; angle <= 360; angle++)
    for (const radius of [1, 1.5, 2, 2.5, 3]) {
      const q = radianState({ radius, angle });
      expect(q.length / radius).toBeCloseTo((angle * Math.PI) / 180, 12);
    }
  expect(radianState({ radius: 2, angle: 180 }).length).toBeCloseTo(
    2 * Math.PI,
  );
});
it("beat minima, unequal amplitudes, and the single source limit agree with superposition", () => {
  for (const amplitude of [0, 0.5, 1])
    for (const difference of [0.1, 0.5, 1]) {
      const p = { frequency: 3, difference, amplitude };
      expect(beatState(p, 0).envelope).toBeCloseTo(1 + amplitude);
      expect(beatState(p, 1 / (2 * difference)).envelope).toBeCloseTo(
        1 - amplitude,
      );
      for (let t = 0; t <= 6; t += 0.037) {
        const q = beatState(p, t);
        expect(q.total).toBeCloseTo(q.A + q.B);
        expect(Math.abs(q.total)).toBeLessThanOrEqual(q.envelope + 1e-10);
      }
    }
  expect(
    beatState({ frequency: 3, difference: 0, amplitude: 1 }, 1.3).envelope,
  ).toBe(2);
});
it("all chapters render distinct finite states; guidance can be hidden", () => {
  for (const lesson of signalLessons) {
    const states = lesson.chapters.map((c) => {
      for (const f of lesson.params) {
        expect(c.preset[f.key]).toBeGreaterThanOrEqual(f.min);
        expect(c.preset[f.key]).toBeLessThanOrEqual(f.max);
      }
      const html = renderToStaticMarkup(
        <SignalScene id={lesson.id} p={c.preset} time={c.time} />,
      );
      expect(html).not.toMatch(/NaN|undefined|Infinity/);
      return html;
    });
    expect(new Set(states).size).toBe(lesson.chapters.length);
    const c = lesson.chapters[0];
    expect(
      renderToStaticMarkup(
        <SignalScene id={lesson.id} p={c.preset} time={2} guides={false} />,
      ),
    ).not.toBe(states[0]);
  }
});
