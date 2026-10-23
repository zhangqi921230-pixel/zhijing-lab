// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { it, expect, vi } from "vitest";
import { TopicGuide } from "../src/TopicLearning.jsx";
import { topicChapters } from "../src/topicChapters.mjs";
import { topicEntry } from "../src/chapterEntry.mjs";
import { lessons, defaults } from "../src/lessons.mjs";
const lesson = lessons.find((l) => l.id === "volcano");
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
it("volcano lessons open at visible eruption stages and preserve identical conditions for cooling comparison", () => {
  const entries = topicChapters.volcano.map((_, i) =>
    topicEntry(lesson, topicChapters.volcano, i, defaults(lesson)),
  );
  expect(entries.map((e) => e.time)).toEqual([0, 8, 8, 8, 8]);
  const [a, b] = topicChapters.volcano[4].scenarios;
  expect(a.p).toEqual(b.p);
  expect(a.time).toBe(8);
  expect(b.time).toBe(20);
});
it("time distinguishes otherwise identical volcano scenarios and is passed through the guide", async () => {
  const host = document.createElement("div"),
    root = createRoot(host),
    apply = vi.fn();
  try {
    await act(() =>
      root.render(
        <TopicGuide
          lesson={lesson}
          chapters={topicChapters.volcano}
          chapter={4}
          p={{
            ...defaults(lesson),
            ...topicChapters.volcano[4].scenarios[0].p,
          }}
          time={20}
          onApply={apply}
          onSelect={() => {}}
        />,
      ),
    );
    const buttons = host.querySelectorAll(".topic-scenarios button");
    expect(buttons[0].getAttribute("aria-pressed")).toBe("false");
    expect(buttons[1].getAttribute("aria-pressed")).toBe("true");
    await act(() => buttons[0].click());
    expect(apply.mock.calls[0][3]).toBe(8);
  } finally {
    await act(() => root.unmount());
  }
});
