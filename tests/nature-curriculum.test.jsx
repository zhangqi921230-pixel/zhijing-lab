// @vitest-environment jsdom
import React from "react";
import { it, expect } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { allExperiments, workbenches } from "../src/courseCatalog.mjs";
import { levelFor, compareLevels } from "../src/curriculumLevels.mjs";
import { natureLessons } from "../src/natureLessons.mjs";
import { natureState } from "../src/natureModels.mjs";
import NatureScene from "../src/NatureScene.jsx";
import MotionLab from "../src/MotionLab.jsx";
it("each experiment is explicitly classified and every subject is ordered by learning level", () => {
  for (const x of allExperiments) expect(levelFor(x.id), x.id).toBeDefined();
  for (const subject of new Set(workbenches.map((x) => x.subject))) {
    const list = workbenches.filter((x) => x.subject === subject);
    for (let i = 1; i < list.length; i++)
      expect(compareLevels(list[i - 1], list[i])).toBeLessThanOrEqual(0);
  }
  for (const x of workbenches)
    for (const id of x.members)
      expect(x.curriculum.year).toBeGreaterThanOrEqual(levelFor(id).year);
});
it("higher-level content is not presented as compulsory primary or junior study", () => {
  for (const id of [
    "capacitor",
    "polar",
    "probability",
    "foodweb",
    "photosynthesis",
    "refraction",
    "sea-breeze",
  ])
    expect(levelFor(id).stage).toBe("high");
  expect(levelFor("capacitor").scope).toBe("拓展");
});
it("all new chapters render distinct finite states through the actual laboratory", () => {
  for (const lesson of natureLessons) {
    expect(
      renderToStaticMarkup(
        <MotionLab lesson={lesson} open={() => {}} goHome={() => {}} />,
      ),
      lesson.id,
    ).not.toMatch(/NaN|Infinity|undefined/);
    const views = lesson.chapters.map((c) =>
      renderToStaticMarkup(
        <NatureScene id={lesson.id} p={c.preset} time={c.time || 2} />,
      ),
    );
    for (const view of views)
      expect(view, lesson.id).not.toMatch(/NaN|Infinity|undefined/);
    expect(new Set(views).size, lesson.id).toBeGreaterThanOrEqual(3);
  }
});
it("burning needs all three conditions, with no false positives", () => {
  for (const fuel of [0, 1])
    for (const oxygen of [0, 1])
      for (const heat of [0, 1])
        expect(natureState("combustion", { fuel, oxygen, heat }).burning).toBe(
          Boolean(fuel && oxygen && heat),
        );
});
it("filtration conserves salt and sand separately at all stages", () => {
  for (let t = 0; t <= 6; t += 0.1) {
    const q = natureState("filtration", { sand: 13, salt: 7 }, t);
    expect(q.sandIn + q.sandHeld).toBeCloseTo(13);
    expect(q.saltIn + q.saltOut).toBeCloseTo(7);
  }
  expect(natureState("filtration", { sand: 13, salt: 7 }, 6).saltOut).toBe(7);
});
it("breathing volume increases during inspiration and decreases during expiration", () => {
  const state = (t) => natureState("breathing", { depth: 70 }, t);
  expect(state(1).inhale).toBe(true);
  expect(state(2).volume).toBeGreaterThan(state(1).volume);
  expect(state(4).inhale).toBe(false);
  expect(state(5).volume).toBeLessThan(state(4).volume);
});
it("germination preserves the control while changing a single experimental factor", () => {
  for (const c of natureLessons
    .find((x) => x.id === "germination")
    .chapters.slice(1)) {
    const p = c.preset;
    expect(
      Object.entries(p).filter(
        ([k, v]) => v !== { water: 1, air: 1, temperature: 25 }[k],
      ).length,
    ).toBe(1);
    const q = natureState("germination", p, 6);
    expect(q.growth).toBe(1);
    expect(q.experiment).toBe(0);
  }
});
it("river model deposits coarser grains and weak flows consistently", () => {
  expect(
    natureState("river-deposition", { slope: 8, flow: 80, grain: 3 }).transport,
  ).toBe(true);
  expect(
    natureState("river-deposition", { slope: 8, flow: 80, grain: 8 }).transport,
  ).toBe(false);
  expect(
    natureState("river-deposition", { slope: 2, flow: 50, grain: 3 }).transport,
  ).toBe(false);
});
