// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { it, expect, vi } from "vitest";
import MotionLab from "../src/MotionLab.jsx";
import MotionPreview from "../src/MotionPreview.jsx";
import { natureTopics } from "../src/natureTopics.mjs";
import { motionTopics } from "../src/motionLessons.mjs";
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
it("every chapter loads its own conditions, pauses, and exposes seek and keyboard range controls", async () => {
  const host = document.createElement("div"),
    root = createRoot(host);
  try {
    for (const topic of motionTopics) {
      await act(() =>
        root.render(
          <MotionLab
            key={topic.id}
            lesson={topic}
            open={() => {}}
            goHome={() => {}}
          />,
        ),
      );
      const chapters = host.querySelectorAll(
        '[aria-label="学习子主题"] button',
      );
      for (let i = 0; i < topic.chapters.length; i++) {
        await act(() => chapters[i].click());
        expect(host.querySelector("h1").textContent).toBe(
          topic.chapters[i].title,
        );
        for (const field of topic.params.filter(
          (f) =>
            f.key !== "insert" &&
            f.key !== "direction" &&
            f.key !== "shape" &&
            (!["symmetry", "pulley"].includes(topic.id) ||
              (f.key !== "mode" &&
                (f.key !== "axis" || topic.chapters[i].preset.mode === 0) &&
                (f.key !== "turn" || topic.chapters[i].preset.mode === 1))) &&
            (f.key !== "petals" || topic.chapters[i].preset.shape === 2),
        )) {
          if (
            natureTopics.some((x) => x.id === topic.id) &&
            field.min === 0 &&
            field.max === 1
          ) {
            const group = host.querySelector(
              `[role="group"][aria-label="${field.label.split("：")[0]}"]`,
            );
            const buttons = [...group.querySelectorAll("button")];
            expect(buttons.length).toBe(2);
            expect(
              buttons.findIndex(
                (b) => b.getAttribute("aria-pressed") === "true",
              ),
            ).toBe(topic.chapters[i].preset[field.key]);
          } else
            expect(
              Number(host.querySelector(`[aria-label="${field.label}"]`).value),
            ).toBe(topic.chapters[i].preset[field.key]);
        }
        expect(
          Number(host.querySelector('[aria-label="演示进度"]').value),
        ).toBe(topic.chapters[i].time);
        if (topic.id === "polygon-turn")
          expect(
            host.querySelector('[aria-label="行走方向"] [aria-pressed="true"]')
              .textContent,
          ).toBe(
            topic.chapters[i].preset.direction === 1 ? "逆时针" : "顺时针",
          );
        expect(host.textContent).toContain("播放演示");
      }
      const start = [...host.querySelectorAll("button")].find(
        (b) => b.textContent === "回到起点",
      );
      await act(() => start.click());
      expect(host.querySelector('[aria-label="演示进度"]').value).toBe("0");
    }
  } finally {
    await act(() => root.unmount());
  }
}, 20000);
it.each([
  "similar-area",
  "polarization",
  "radian-arc",
  "beat-frequency",
  "square-difference",
  "ripple-interference",
  "gear-drive",
  "buoyancy-lift",
  "cylinder-net",
  "additive-light",
  "solid-volume",
  "water-pressure",
  "shadow-height",
  "circular-motion",
  "doppler",
  "lissajous",
  "standing",
  "polar",
  "ballistics",
  "symmetry",
  "pulley",
])(
  "native homepage preview %s advances actual geometry and cancels its frame loop on unmount",
  async (id) => {
    let callback;
    vi.stubGlobal(
      "requestAnimationFrame",
      vi.fn((cb) => {
        callback = cb;
        return 42;
      }),
    );
    vi.stubGlobal("cancelAnimationFrame", vi.fn());
    const host = document.createElement("div"),
      root = createRoot(host);
    try {
      await act(() => root.render(<MotionPreview id={id} />));
      const before = host.innerHTML;
      await act(() => callback(0));
      await act(() => callback(50));
      expect(host.innerHTML).not.toBe(before);
      await act(() => root.unmount());
      expect(cancelAnimationFrame).toHaveBeenCalledWith(42);
    } finally {
      vi.unstubAllGlobals();
    }
  },
);
