// @vitest-environment jsdom
import React, { act, useState } from "react";
import { createRoot } from "react-dom/client";
import { it, expect } from "vitest";
import CellRecognition, {
  cellRecognitionTasks,
} from "../src/CellRecognition.jsx";
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
it("six tasks distinguish wrong choices, preserve observation and reset feedback on navigation", async () => {
  const host = document.createElement("div"),
    root = createRoot(host),
    observed = [];
  function Harness() {
    const [part, setPart] = useState(0);
    return (
      <CellRecognition
        part={part}
        onSelect={(p) => {
          setPart(p);
          observed.push(p);
        }}
      />
    );
  }
  await act(() => root.render(<Harness />));
  const button = (t) =>
    [...host.querySelectorAll("button")].find((b) => b.textContent === t);
  const click = async (t) => act(() => button(t).click());
  const names = [
    "",
    "细胞核",
    "液泡",
    "叶绿体",
    "线粒体",
    "高尔基体",
    "内质网",
  ];
  try {
    expect(button("核对选择").disabled).toBe(true);
    for (let i = 0; i < 6; i++) {
      const task = cellRecognitionTasks[i];
      expect(host.textContent).toContain(task.prompt);
      await click(`选择${names[task.part === 1 ? 2 : 1]}`);
      await click("核对选择");
      expect(host.textContent).toContain("再观察一下");
      await click(`选择${names[task.part]}`);
      expect(host.querySelector('[role="status"]')).toBe(null);
      await click("核对选择");
      expect(host.textContent).toContain(task.explanation);
      expect(observed.at(-1)).toBe(task.part);
      if (i < 5) {
        await click("下一任务");
        expect(observed.at(-1)).toBe(0);
      }
    }
    expect(button("下一任务").disabled).toBe(true);
    await click("重新辨认");
    expect(host.textContent).toContain("任务 1 / 6");
    expect(button("核对选择").disabled).toBe(true);
  } finally {
    await act(() => root.unmount());
  }
});
