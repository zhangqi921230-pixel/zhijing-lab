// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { it, expect, vi } from "vitest";
import ExplorationLab from "../src/ExplorationLab.jsx";
import { explorations } from "../src/explorations.mjs";
import { TopicPicker } from "../src/TopicLearning.jsx";
import { lessons } from "../src/lessons.mjs";
async function mount(element) {
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  const host = document.createElement("div"),
    root = createRoot(host);
  document.body.append(host);
  await act(() => root.render(element));
  return {
    host,
    close: async () => {
      await act(() => root.unmount());
      host.remove();
    },
  };
}
it.each(explorations.map((l) => [l.id, l]))(
  "%s has distinct, repeatable chapter states",
  async (id, lesson) => {
    const { host, close } = await mount(
      <ExplorationLab lesson={lesson} open={() => {}} goHome={() => {}} />,
    );
    try {
      let previous = "";
      for (const button of host.querySelectorAll(
        'nav[aria-label="学习子主题"] button',
      )) {
        await act(() => button.click());
        expect(button.getAttribute("aria-current")).toBe("step");
        const values = () =>
          [...host.querySelectorAll("input[type=range]")].map((e) => [
            e.getAttribute("aria-label"),
            e.value,
          ]);
        const state = JSON.stringify(values());
        expect(state).not.toBe(previous);
        previous = state;
        await act(() => button.click());
        expect(JSON.stringify(values())).toBe(state);
      }
    } finally {
      await close();
    }
  },
);
it("random trials append, and new parameter chapters reset only the sample", async () => {
  const { host, close } = await mount(
    <ExplorationLab
      lesson={explorations[0]}
      open={() => {}}
      goHome={() => {}}
    />,
  );
  try {
    const click = async (text) =>
      act(() =>
        [...host.querySelectorAll("button")]
          .find((b) => b.textContent === text)
          .click(),
      );
    await click("做 10 组");
    expect(host.querySelector(".exploration-readings").textContent).toContain(
      "已完成组数10",
    );
    await click("做 100 组");
    expect(host.querySelector(".exploration-readings").textContent).toContain(
      "已完成组数110",
    );
    await act(() =>
      host.querySelectorAll('nav[aria-label="学习子主题"] button')[1].click(),
    );
    expect(host.textContent).toContain("还没有样本");
  } finally {
    await close();
  }
});
it("gas records survive chapter changes", async () => {
  const { host, close } = await mount(
    <ExplorationLab
      lesson={explorations[1]}
      open={() => {}}
      goHome={() => {}}
    />,
  );
  try {
    await act(() =>
      [...host.querySelectorAll("button")]
        .find((b) => b.textContent.includes("记录当前状态"))
        .click(),
    );
    await act(() =>
      host.querySelectorAll('nav[aria-label="学习子主题"] button')[1].click(),
    );
    expect(host.querySelectorAll("tbody tr")).toHaveLength(1);
    expect(host.querySelector("tbody").textContent).toContain("62.36");
  } finally {
    await close();
  }
});
it("RC is selected inside the same circuit workbench and remains directly navigable", async () => {
  const open = vi.fn();
  const { host, close } = await mount(
    <TopicPicker
      lesson={lessons.find((l) => l.id === "capacitor")}
      onSelect={open}
    />,
  );
  try {
    expect(host.querySelector("select").value).toBe("ohm");
    expect(host.querySelector('[aria-current="page"]').textContent).toContain(
      "RC",
    );
    await act(() => host.querySelector(".course-units button").click());
    expect(open).toHaveBeenCalledWith("ohm");
    expect(
      [...host.querySelectorAll("option")].some((x) => x.value === "capacitor"),
    ).toBe(false);
  } finally {
    await close();
  }
});
