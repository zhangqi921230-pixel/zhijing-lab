// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { it, expect, vi } from "vitest";
import { TopicGuide } from "../src/TopicLearning.jsx";
import { lessons, defaults } from "../src/lessons.mjs";

it.each([
  ["cell", { cellAngle: 2, labels: 0 }, { part: 3, chloroplastMode: 1 }],
  ["precipitation", { volumeGuide: 1 }, { base: 25 }],
  [
    "biodiversity",
    { groundDetails: 0 },
    { plants: 8, insects: 8, birds: 8, fungi: 8 },
  ],
])("%s 情境保留显示偏好，同时应用目标实验条件", async (id, prefs, target) => {
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  const lesson = lessons.find((l) => l.id === id),
    onApply = vi.fn();
  const host = document.createElement("div"),
    root = createRoot(host);
  document.body.append(host);
  try {
    await act(() =>
      root.render(
        <TopicGuide
          lesson={lesson}
          chapters={[
            {
              title: "对照",
              text: "比较",
              task: "选择",
              keys: [],
              view: "perspective",
              scenarios: [{ label: "准备情境", p: target }],
            },
          ]}
          chapter={0}
          p={{ ...defaults(lesson), ...prefs }}
          onApply={onApply}
          onSelect={() => {}}
        />,
      ),
    );
    await act(() => host.querySelector(".topic-scenarios button").click());
    expect(onApply.mock.calls[0][0]).toMatchObject({ ...prefs, ...target });
  } finally {
    await act(() => root.unmount());
    host.remove();
  }
});
