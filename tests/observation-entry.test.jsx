// @vitest-environment jsdom
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { expect, it } from "vitest";
import { natureLessons } from "../src/natureLessons.mjs";
import { natureState } from "../src/natureModels.mjs";
import NatureScene from "../src/NatureScene.jsx";
import { sectionLessons, sectionState } from "../src/sectionLessons.mjs";

it("comparison chapters expose their outcome immediately while retaining a replayable beginning", () => {
  for (const id of [
    "filtration",
    "germination",
    "rusting",
    "crystallization",
  ]) {
    const lesson = natureLessons.find((x) => x.id === id);
    expect(lesson.chapters[0].time).toBe(0);
    for (const chapter of lesson.chapters.slice(1)) {
      const atEntry = renderToStaticMarkup(
        <NatureScene id={id} p={chapter.preset} time={chapter.time} />,
      );
      const atStart = renderToStaticMarkup(
        <NatureScene id={id} p={chapter.preset} time={0} />,
      );
      expect(atEntry, id + chapter.title).not.toBe(atStart);
      expect(atEntry).not.toMatch(/NaN|Infinity/);
    }
  }
});

it("unsaturated solution contains no crystal shapes and matches the dissolved-solute legend", () => {
  const p = { salt: 20, evaporation: 20 };
  expect(natureState("crystallization", p, 6).crystal).toBe(0);
  const host = document.createElement("div");
  host.innerHTML = renderToStaticMarkup(
    <NatureScene id="crystallization" p={p} time={6} />,
  );
  expect(host.querySelector('rect[width="12"]')).toBeNull();
  const solute = [...host.querySelectorAll("circle")].filter(
    (circle) => Number(circle.getAttribute("cy")) > 280,
  );
  expect(solute.length).toBeGreaterThan(0);
  expect(
    solute.every((circle) => circle.getAttribute("fill") === "#4c9fbd"),
  ).toBe(true);
  host.innerHTML = renderToStaticMarkup(
    <NatureScene
      id="crystallization"
      p={{ salt: 36, evaporation: 80 }}
      time={6}
    />,
  );
  expect(host.querySelector('rect[width="12"]')).not.toBeNull();
});

it("the cone-volume chapter opens with one of three equal-volume portions", () => {
  const chapter = sectionLessons.find((x) => x.id === "solid-volume")
    .chapters[1];
  const q = sectionState("solid-volume", chapter.preset, chapter.time);
  expect(q.progress).toBeCloseTo(1 / 3);
});
