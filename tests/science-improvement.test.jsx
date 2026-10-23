// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { it, expect } from "vitest";
import { existsSync } from "node:fs";
import { scienceTopics } from "../src/science/catalog.mjs";
import { readingGuides } from "../src/science/readingGuides.mjs";
import { supplementalVisuals } from "../src/science/supplementalVisuals.mjs";
import ReadingGuide from "../src/science/ReadingGuide.jsx";
import VisualStory from "../src/science/VisualStory.jsx";
import StructureAtlas from "../src/science/StructureAtlas.jsx";
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
it("all 120 guides render their own explanation and respect hidden answers", () => {
  const el = document.createElement("div"),
    root = createRoot(el);
  expect(Object.keys(readingGuides)).toHaveLength(120);
  for (const t of scienceTopics) {
    const g = readingGuides[t.id];
    expect(g).toBeTruthy();
    act(() => root.render(<ReadingGuide id={t.id} />));
    expect(el.textContent).toContain(g.explanation);
    expect(el.textContent).toContain(g.answer);
    act(() => root.render(<ReadingGuide id={t.id} hiddenAnswers />));
    expect(el.textContent).not.toContain(g.answer);
  }
  act(() => root.unmount());
});
it("supplementary structures and stories point to their own image and explanations", () => {
  const el = document.createElement("div"),
    root = createRoot(el);
  for (const [id, s] of Object.entries(supplementalVisuals)) {
    expect(existsSync("public/" + s.entry.file)).toBe(true);
    act(() =>
      root.render(
        s.type === "structure" ? (
          <StructureAtlas key={id} id={id} entry={s.entry} />
        ) : (
          <VisualStory key={id} id={id} entry={s.entry} />
        ),
      ),
    );
    expect(el.querySelector("img").getAttribute("src")).toContain(s.entry.file);
    const buttons = [
      ...el.querySelectorAll(".structure-note,.story-steps button"),
    ];
    expect(buttons).toHaveLength(4);
    buttons.forEach((b, i) => {
      act(() => b.click());
      expect(el.textContent).toContain(
        s.type === "structure"
          ? s.entry.parts[i].detail
          : s.entry.steps[i].text,
      );
    });
  }
  act(() => root.unmount());
});
