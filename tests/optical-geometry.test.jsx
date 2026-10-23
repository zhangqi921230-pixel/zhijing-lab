// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { renderToStaticMarkup } from "react-dom/server";
import { it, expect } from "vitest";
import {
  pinholeState,
  circleAngleState,
} from "../src/opticalGeometryModels.mjs";
import { opticalGeometryLessons } from "../src/opticalGeometryLessons.mjs";
import OpticalGeometryScene from "../src/OpticalGeometryScene.jsx";
import MotionLab from "../src/MotionLab.jsx";
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
it("pinhole rays intersect at the aperture and obey similar triangles across bounds", () => {
  for (const object of [10, 20, 30])
    for (const screen of [5, 10, 20])
      for (const height of [2, 6, 8]) {
        const q = pinholeState({ object, screen, height });
        expect(q.imageHeight / screen).toBeCloseTo(height / object, 12);
        const fraction = object / (object + screen);
        expect(height + (-q.imageHeight - height) * fraction).toBeCloseTo(
          0,
          12,
        );
        expect(q.imageHeight).toBeLessThanOrEqual(16);
      }
});
it("all moving circle vertices stay on the circle and subtend half the central angle", () => {
  for (let central = 40; central <= 180; central += 5)
    for (const position of [10, 25, 50, 75, 90])
      for (let t = 0; t <= 6; t += 0.25) {
        const q = circleAngleState({ central, position }, t);
        expect(Math.hypot(...q.P)).toBeCloseTo(1, 12);
        expect(q.angle).toBeCloseTo(central / 2, 9);
        expect(q.position).toBeGreaterThan(0);
        expect(q.position).toBeLessThan(100);
      }
});
it.each(opticalGeometryLessons)(
  "$id changes each chapter scene and resets playback on parameter changes",
  async (lesson) => {
    const frames = lesson.chapters.map((c, chapter) =>
      renderToStaticMarkup(
        <OpticalGeometryScene
          id={lesson.id}
          p={c.preset}
          time={c.time}
          chapter={chapter}
        />,
      ),
    );
    expect(new Set(frames).size).toBe(lesson.chapters.length);
    frames.forEach((frame) =>
      expect(frame).not.toMatch(/NaN|Infinity|undefined/),
    );
    const host = document.createElement("div"),
      root = createRoot(host);
    await act(() =>
      root.render(
        <MotionLab lesson={lesson} open={() => {}} goHome={() => {}} />,
      ),
    );
    try {
      for (let i = 0; i < lesson.chapters.length; i++) {
        expect(host.querySelector("h1").textContent).toBe(
          lesson.chapters[i].title,
        );
        expect(
          Number(host.querySelector('[aria-label="演示进度"]').value),
        ).toBe(lesson.chapters[i].time);
        if (i < lesson.chapters.length - 1)
          await act(() =>
            [...host.querySelectorAll("button")]
              .find((b) => b.textContent === "下一节")
              .click(),
          );
      }
      const field = host.querySelector(
        `[aria-label="${lesson.params[0].label}"]`,
      );
      await act(() => {
        Object.getOwnPropertyDescriptor(
          HTMLInputElement.prototype,
          "value",
        ).set.call(field, String(lesson.params[0].max));
        field.dispatchEvent(new Event("input", { bubbles: true }));
        field.dispatchEvent(new Event("change", { bubbles: true }));
      });
      expect(host.querySelector('[aria-label="演示进度"]').value).toBe("0");
      expect(host.querySelector(".motion-diagram").outerHTML).not.toMatch(
        /NaN|Infinity/,
      );
      expect(
        [...host.querySelectorAll("button")].some(
          (b) => b.textContent === "播放演示",
        ),
      ).toBe(true);
    } finally {
      await act(() => root.unmount());
    }
  },
);

it("pinhole point selection highlights its ray and chapter changes restore the overview", async () => {
  const host = document.createElement("div"),
    root = createRoot(host);
  await act(() =>
    root.render(
      <MotionLab
        lesson={{ id: "pinhole" }}
        open={() => {}}
        goHome={() => {}}
      />,
    ),
  );
  const click = async (text) =>
    act(() =>
      [...host.querySelectorAll("button")]
        .find((b) => b.textContent === text)
        .click(),
    );
  try {
    await click("中点 B");
    expect(
      host
        .querySelector('[data-testid="pinhole-ray-1"]')
        .getAttribute("opacity"),
    ).toBe("1");
    expect(
      host
        .querySelector('[data-testid="pinhole-ray-2"]')
        .getAttribute("opacity"),
    ).toBe("0.18");
    expect(host.textContent).toContain("像上距轴线的距离为 1.50 cm");
    await click("下一节");
    expect(
      [...host.querySelectorAll("button")]
        .find((b) => b.textContent === "全部光路")
        .getAttribute("aria-pressed"),
    ).toBe("true");
    await click("下一节");
    await click("下一节");
    await click("下一节");
    expect(host.textContent).toContain(
      "对应边之比：5.00 / 5.00 = 15 / 15 = 1.00",
    );
  } finally {
    await act(() => root.unmount());
  }
});

it("opposite arcs yield supplementary inscribed angles throughout animation", () => {
  for (let central = 40; central <= 180; central += 5)
    for (const position of [10, 50, 90])
      for (let t = 0; t <= 6; t += 0.25) {
        const a = circleAngleState({ central, position }, t),
          b = circleAngleState({ central, position, side: 1 }, t);
        expect(a.angle + b.angle).toBeCloseTo(180, 8);
        expect(b.angle * 2).toBeCloseTo(b.intercepted, 8);
        expect(Math.hypot(...b.P)).toBeCloseTo(1, 12);
      }
});
it("switching arcs changes the highlighted arc and readouts, then leaving restores the original model", async () => {
  const host = document.createElement("div"),
    root = createRoot(host);
  await act(() =>
    root.render(
      <MotionLab
        lesson={{ id: "inscribed-angle" }}
        open={() => {}}
        goHome={() => {}}
      />,
    ),
  );
  const click = async (text) =>
    act(() =>
      [...host.querySelectorAll("button")]
        .find((b) => b.textContent === text)
        .click(),
    );
  try {
    for (let i = 0; i < 5; i++) await click("下一节");
    expect(host.textContent).toContain("140.0° + 40.0° = 180°");
    const long = host
      .querySelector('[data-testid="intercepted-arc"]')
      .getAttribute("d");
    await click("P 与 Q 在同一侧弧");
    expect(host.textContent).toContain("两个角都为 40.0°");
    expect(
      host.querySelector('[data-testid="intercepted-arc"]').getAttribute("d"),
    ).not.toBe(long);
    await click("P 换到另一侧弧");
    expect(host.querySelector('[aria-label="演示进度"]').value).toBe("0");
    await click("上一节");
    expect(host.textContent).toContain("55.0°");
    expect(host.textContent).not.toContain("P 换到另一侧弧");
  } finally {
    await act(() => root.unmount());
  }
});
