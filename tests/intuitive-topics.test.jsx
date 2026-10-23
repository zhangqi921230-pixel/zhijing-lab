import React from "react";
import { it, expect } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import IntuitiveScene from "../src/IntuitiveScene.jsx";
import {
  intuitiveLessons,
  squareDifference,
  rippleState,
} from "../src/intuitiveLessons.mjs";
it("cut areas and final rectangle agree for every supported pair of side lengths", () => {
  for (let a = 4; a <= 8; a++)
    for (let b = 1; b <= 3; b += 0.5) {
      const q = squareDifference({ a, b });
      expect(q.green + q.gold).toBe(q.area);
      expect(q.width * q.height).toBe(q.area);
      expect(q.height).toBeGreaterThan(0);
    }
});
it("half wavelength cancels at all times; a full wavelength and equal paths reinforce", () => {
  const p = { separation: 16, wavelength: 16, phase: 0, probeX: 4, probeY: 0 };
  for (let time = 0; time <= 6; time += 0.07) {
    expect(rippleState(p, time).total).toBeCloseTo(0, 10);
    expect(
      rippleState({ ...p, probeX: 0, probeY: 8, phase: 180 }, time).total,
    ).toBeCloseTo(0, 10);
  }
  expect(rippleState(p, 0).difference).toBe(8);
  expect(rippleState({ ...p, wavelength: 8 }, 0).amplitude).toBeCloseTo(2);
  expect(rippleState({ ...p, probeX: 16 }, 0).amplitude).toBeCloseTo(2);
  const q = rippleState({ ...p, phase: 60 }, 0.15);
  expect(q.total).toBeCloseTo(q.A + q.B);
  expect(rippleState({ ...p, phase: 60 }, 0.15 + q.period).total).toBeCloseTo(
    q.total,
  );
});
it("every new chapter has an in-bounds distinct visible state and uses no nonfinite geometry", () => {
  for (const lesson of intuitiveLessons) {
    const markup = lesson.chapters.map((c) => {
      for (const f of lesson.params) {
        expect(c.preset[f.key]).toBeGreaterThanOrEqual(f.min);
        expect(c.preset[f.key]).toBeLessThanOrEqual(f.max);
      }
      const html = renderToStaticMarkup(
        <IntuitiveScene id={lesson.id} p={c.preset} time={c.time} />,
      );
      expect(html).not.toMatch(/NaN|undefined|Infinity/);
      return html;
    });
    expect(new Set(markup).size).toBe(lesson.chapters.length);
  }
});
it("clipped wave crests move and area block rotates with the shared progress", () => {
  for (const lesson of intuitiveLessons) {
    const p = lesson.chapters[0].preset;
    const before = renderToStaticMarkup(
      <IntuitiveScene id={lesson.id} p={p} time={0} />,
    );
    const after = renderToStaticMarkup(
      <IntuitiveScene id={lesson.id} p={p} time={3.2} />,
    );
    expect(before).not.toBe(after);
  }
});
