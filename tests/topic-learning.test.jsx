// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { expect, it, vi } from "vitest";
import {
  TopicGuide,
  TopicChapters,
  TopicPicker,
} from "../src/TopicLearning.jsx";
import { topicChapters } from "../src/topicChapters.mjs";
import { lessons, defaults } from "../src/lessons.mjs";
import { workbenches } from "../src/courseCatalog.mjs";

it("covers every remaining lesson with actionable chapters and valid, distinct scenarios", () => {
  const specialized = [
    "ohm",
    "lens",
    "dilution",
    "acid",
    "solubility",
    "microscope",
    "contour",
  ];
  expect(
    lessons.every(
      (lesson) => specialized.includes(lesson.id) || topicChapters[lesson.id],
    ),
  ).toBe(true);
  for (const [id, chapters] of Object.entries(topicChapters)) {
    const lesson = lessons.find((item) => item.id === id);
    expect(chapters.length).toBeGreaterThanOrEqual(3);
    for (const chapter of chapters) {
      expect(chapter.keys.length).toBeGreaterThan(0);
      expect(chapter.scenarios.length).toBeGreaterThanOrEqual(2);
      expect(
        new Set(
          chapter.scenarios.map((item) =>
            JSON.stringify([item.p, item.time ?? 0]),
          ),
        ).size,
      ).toBe(chapter.scenarios.length);
      for (const key of chapter.keys)
        expect(lesson.params.some((param) => param.key === key)).toBe(true);
      for (const scenario of chapter.scenarios)
        for (const [key, value] of Object.entries(scenario.p)) {
          const param = lesson.params.find((item) => item.key === key);
          expect(param, `${id}: ${key}`).toBeDefined();
          expect(value).toBeGreaterThanOrEqual(param.min);
          expect(value).toBeLessThanOrEqual(param.max);
        }
    }
  }
});

it("applies complete reproducible conditions, supports chapter selection, and exposes all topics grouped by subject", async () => {
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  const host = document.createElement("div"),
    root = createRoot(host),
    onApply = vi.fn(),
    onSelect = vi.fn();
  const lesson = lessons.find((item) => item.id === "functions"),
    chapters = topicChapters.functions;
  try {
    await act(() =>
      root.render(
        <>
          <TopicPicker lesson={lesson} lessons={lessons} onSelect={onSelect} />
          <TopicChapters chapters={chapters} chapter={0} onSelect={onSelect} />
          <TopicGuide
            lesson={lesson}
            chapters={chapters}
            chapter={0}
            p={{ ...defaults(lesson), b: 3 }}
            onApply={onApply}
            onSelect={onSelect}
          />
        </>,
      ),
    );
    expect(
      host.querySelector('nav [aria-current="step"]').textContent,
    ).toContain("比较函数形态");
    expect(host.querySelectorAll(".topic-picker option").length).toBe(
      workbenches.length,
    );
    expect(host.querySelector("optgroup").label).toBe("数学");
    await act(() =>
      host.querySelectorAll(".topic-scenarios button")[1].click(),
    );
    expect(onApply).toHaveBeenCalledWith(
      { ...defaults(lesson), type: 1 },
      "perspective",
      "正弦",
    );
    const stepButton = (text) =>
      [...host.querySelectorAll(".micro-step button")].find(
        (button) => button.textContent.trim() === text,
      );
    await act(() => stepButton("重做本节").click());
    expect(onApply).toHaveBeenLastCalledWith(
      { ...defaults(lesson), ...chapters[0].scenarios[0].p },
      chapters[0].view,
      chapters[0].scenarios[0].label,
    );
    expect(onSelect).not.toHaveBeenCalled();
    await act(() => stepButton("下一节 →").click());
    expect(onSelect).toHaveBeenCalledWith(1);
    expect(host.querySelector(".micro-step button").disabled).toBe(true);
  } finally {
    await act(() => root.unmount());
  }
});
