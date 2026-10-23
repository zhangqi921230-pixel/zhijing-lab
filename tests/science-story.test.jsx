// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { it, expect } from "vitest";
import { existsSync } from "node:fs";
import VisualStory from "../src/science/VisualStory.jsx";
import { storyboards } from "../src/science/storyboards.mjs";
import { structureAtlases } from "../src/science/structureAtlases.mjs";
import { scienceById } from "../src/science/catalog.mjs";
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
it("all 120 topics have complementary visual coverage and all new frames have local assets and sources", () => {
  expect(
    new Set([
      ...Object.keys(storyboards),
      ...Object.keys(structureAtlases),
      "air-conditioner",
      "rocket",
    ]).size,
  ).toBe(120);
  expect(Object.keys(storyboards)).toHaveLength(73);
  for (const [id, s] of Object.entries(storyboards)) {
    expect(scienceById[id]).toBeTruthy();
    expect(s.steps.length).toBeGreaterThanOrEqual(2);
    expect(s.sources.length).toBeGreaterThan(0);
    for (const p of s.steps) {
      expect(p.text.length).toBeGreaterThan(5);
      expect(existsSync("public/" + (p.file || s.file))).toBe(true);
      if (s.kind === "photo") {
        expect(p.author).toBeTruthy();
        expect(p.license).toBeTruthy();
        expect(p.source).toMatch(/^https:/);
      }
    }
  }
});
it("every topic can reveal each frame, compare, hide explanations, zoom and reset", () => {
  for (const [id, s] of Object.entries(storyboards)) {
    const el = document.createElement("div");
    document.body.append(el);
    const root = createRoot(el);
    act(() => root.render(<VisualStory id={id} />));
    const click = (text) => {
      const b = [...el.querySelectorAll("button")].find(
        (b) => b.textContent === text,
      );
      expect(b).toBeTruthy();
      act(() => b.click());
    };
    for (let i = 0; i < s.steps.length; i++) {
      act(() => el.querySelectorAll(".story-steps button")[i].click());
      expect(el.querySelector(".story-explanation").textContent).toContain(
        s.steps[i].text,
      );
      expect(el.querySelector(".story-picture").dataset.frame).toBe(String(i));
    }
    click("放大观察");
    expect(el.querySelector(".story-picture").dataset.zoom).toBe("true");
    click("并排对照");
    expect(el.querySelectorAll("figure")).toHaveLength(s.steps.length);
    click("先隐藏解释");
    expect(el.querySelectorAll("figcaption p")).toHaveLength(0);
    click("从头观察");
    expect(el.querySelector(".story-picture").dataset.frame).toBe("0");
    expect(el.querySelector(".story-explanation").textContent).toContain(
      s.steps[0].text,
    );
    act(() => root.unmount());
    el.remove();
  }
});
it("image failure retains readable explanations and print contains all frames", () => {
  const el = document.createElement("div"),
    root = createRoot(el);
  act(() => root.render(<VisualStory id="sky-blue" />));
  act(() => el.querySelector("img").dispatchEvent(new Event("error")));
  expect(el.textContent).toContain("图片暂未加载");
  expect(el.textContent).toContain(storyboards["sky-blue"].steps[0].text);
  act(() => root.render(<VisualStory id="sky-blue" print />));
  expect(el.querySelectorAll("figure")).toHaveLength(4);
  expect(el.querySelectorAll("button")).toHaveLength(0);
  act(() => root.unmount());
});
