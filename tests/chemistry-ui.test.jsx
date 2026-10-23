// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { it, expect, vi } from "vitest";
import ChemistryLab from "../src/ChemistryLab.jsx";
import { chemistryTopics } from "../src/chemistryTopics.mjs";
vi.mock("../src/Chemistry3D.jsx", () => ({
  default: () => <div>三维器材</div>,
}));
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
it.each(chemistryTopics.map((x) => [x.id, x]))(
  "%s chapter navigation changes and resets apparatus conditions",
  async (id, lesson) => {
    const host = document.createElement("div"),
      root = createRoot(host);
    await act(() =>
      root.render(
        <ChemistryLab lesson={lesson} open={() => {}} goHome={() => {}} />,
      ),
    );
    let previous = "";
    for (const [index, button] of [
      ...host.querySelectorAll(".microscope-chapters button"),
    ].entries()) {
      await act(() => button.click());
      expect(button.getAttribute("aria-current")).toBe("step");
      const state = JSON.stringify(
        [
          ...host.querySelectorAll(
            ".chem-notes input,.chem-notes button[aria-pressed=true]",
          ),
        ].map((e) => e.value || e.textContent),
      );
      expect(state).not.toBe(previous);
      previous = state;
      if (id === "flame" && index === 6) {
        expect(host.querySelector(".chem-apparatus")).toBeNull();
        expect(host.querySelectorAll(".photon-emission")).toHaveLength(1);
      } else {
        expect(Number(host.querySelector(".chem-playbar input").value)).toBe(
          lesson.chapters[index].time ?? 0,
        );
      }
    }
    await act(() => root.unmount());
  },
);

it("animation uses the captured frame duration even when React batches updates", async () => {
  localStorage.clear();
  let callback;
  const visibility = vi.spyOn(document, "hidden", "get").mockReturnValue(false);
  vi.stubGlobal(
    "requestAnimationFrame",
    vi.fn((cb) => {
      callback = cb;
      return 19;
    }),
  );
  vi.stubGlobal("cancelAnimationFrame", vi.fn());
  const host = document.createElement("div"),
    root = createRoot(host);
  try {
    await act(() =>
      root.render(
        <ChemistryLab
          lesson={chemistryTopics.find((x) => x.id === "distillation")}
          open={() => {}}
          goHome={() => {}}
        />,
      ),
    );
    const start = [...host.querySelectorAll("button")].find(
      (b) => b.textContent === "开始加热",
    );
    await act(() => start.click());
    await act(() => callback(0));
    await act(() => {
      callback(40);
      callback(80);
    });
    expect(Number(host.querySelector(".chem-playbar input").value)).toBeCloseTo(
      0.8,
      8,
    );
    visibility.mockReturnValue(true);
    await act(() => callback(2000));
    visibility.mockReturnValue(false);
    await act(() => callback(3000));
    expect(Number(host.querySelector(".chem-playbar input").value)).toBeCloseTo(
      0.8,
      8,
    );
  } finally {
    await act(() => root.unmount());
    visibility.mockRestore();
    vi.unstubAllGlobals();
  }
});

it("electrolysis reading stays single during repeated shared-clock seeks", async () => {
  localStorage.clear();
  const host = document.createElement("div"),
    root = createRoot(host);
  try {
    await act(() =>
      root.render(
        <ChemistryLab
          lesson={chemistryTopics.find((t) => t.id === "electrolysis")}
          open={() => {}}
          goHome={() => {}}
        />,
      ),
    );
    await act(() =>
      host.querySelectorAll(".microscope-chapters button")[5].click(),
    );
    for (const time of [0, 600, 300, 0]) {
      await act(() =>
        [...host.querySelectorAll("button")]
          .find((b) => b.textContent === `观察 ${time} 秒集气`)
          .click(),
      );
      expect(
        host.querySelectorAll('[aria-label="倒置集气管读数练习"]'),
      ).toHaveLength(1);
      expect(
        host.querySelectorAll('[aria-label="电解气体体积与质量对照"]'),
      ).toHaveLength(1);
      expect(Number(host.querySelector(".chem-playbar input").value)).toBe(
        time,
      );
    }
  } finally {
    await act(() => root.unmount());
    localStorage.clear();
  }
});
