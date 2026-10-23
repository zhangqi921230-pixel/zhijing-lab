// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { renderToStaticMarkup } from "react-dom/server";
import { it, expect } from "vitest";
import {
  prismState,
  circleAreaState,
  visiblePrismRays,
} from "../src/revealModels.mjs";
import { revealLessons } from "../src/revealLessons.mjs";
import { allExperiments } from "../src/courseCatalog.mjs";
import RevealScene from "../src/RevealScene.jsx";
import MotionLab from "../src/MotionLab.jsx";
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
it("prism rays satisfy Snell's law at both interfaces and meet the actual prism face", () => {
  const sin = (degree) => Math.sin((degree * Math.PI) / 180);
  for (let angle = 30; angle <= 65; angle += 0.5)
    for (const index of [1.45, 1.52, 1.65]) {
      const rays = prismState({ angle, index });
      expect(rays[4].index).toBeGreaterThan(rays[0].index);
      for (const v of rays) {
        expect(v.index * sin(v.r1)).toBeCloseTo(sin(angle), 12);
        expect(v.r1 + v.i2).toBeCloseTo(60, 12);
        expect(v.exit[1]).toBeCloseTo(
          110 + Math.sqrt(3) * (v.exit[0] - 450),
          10,
        );
        expect(v.exit[0]).toBeGreaterThan(450);
        expect(v.exit[0]).toBeLessThan(630);
        expect(v.end.every(Number.isFinite)).toBe(true);
        if (!v.tir) expect(sin(v.r2)).toBeCloseTo(v.index * sin(v.i2), 12);
        else {
          expect(v.index * sin(v.i2)).toBeGreaterThan(1);
          expect(v.r2).toBeNull();
          const inside = Math.atan2(
            v.exit[1] - v.entry[1],
            v.exit[0] - v.entry[0],
          );
          const reflected = Math.atan2(
            v.end[1] - v.exit[1],
            v.end[0] - v.exit[0],
          );
          expect(inside + reflected).toBeCloseTo((2 * Math.PI) / 3, 10);
        }
      }
    }
});
it("circle subdivision preserves summed area and converges in edge sagitta", () => {
  for (const radius of [1, 2, 4]) {
    let previous = Infinity;
    for (let sectors = 6; sectors <= 64; sectors += 2) {
      const q = circleAreaState({ radius, sectors });
      expect(q.sectorAngle * sectors).toBeCloseTo(360, 12);
      expect(
        sectors * 0.5 * radius ** 2 * ((2 * Math.PI) / sectors),
      ).toBeCloseTo(q.area, 12);
      expect(q.sagitta).toBeLessThan(previous);
      previous = q.sagitta;
    }
  }
  expect(
    circleAreaState({ radius: 4, sectors: 32 }).area /
      circleAreaState({ radius: 2, sectors: 32 }).area,
  ).toBe(4);
});
it("new themes do not duplicate existing catalogue routes", () => {
  const ids = allExperiments.map((x) => x.id);
  expect(new Set(ids).size).toBe(ids.length);
  expect(ids).toContain("prism");
  expect(ids).toContain("refraction");
  expect(visiblePrismRays({ angle: 50, index: 1.52, color: 4 })).toHaveLength(
    2,
  );
});
it.each(revealLessons)(
  "$id changes all chapter demonstrations and has working comparison/reset",
  async (lesson) => {
    const frames = lesson.chapters.map((c) =>
      renderToStaticMarkup(
        <RevealScene id={lesson.id} p={c.preset} time={c.time} />,
      ),
    );
    expect(new Set(frames).size).toBe(lesson.chapters.length);
    frames.forEach((f) => expect(f).not.toMatch(/NaN|Infinity|undefined/));
    const host = document.createElement("div"),
      root = createRoot(host);
    await act(() =>
      root.render(
        <MotionLab lesson={lesson} open={() => {}} goHome={() => {}} />,
      ),
    );
    const click = async (text) =>
      act(() =>
        [...host.querySelectorAll("button")]
          .find((b) => b.textContent === text)
          .click(),
      );
    try {
      for (let i = 0; i < lesson.chapters.length; i++) {
        expect(host.querySelector("h1").textContent).toBe(
          lesson.chapters[i].title,
        );
        if (i < lesson.chapters.length - 1) await click("下一节");
      }
      if (lesson.id === "prism") {
        await click("红光");
        expect(host.querySelectorAll("[data-ray]")).toHaveLength(3);
        await click("白光");
        expect(host.querySelectorAll("[data-ray]")).toHaveLength(11);
        expect(host.querySelector(".motion-diagram").textContent).toContain(
          "全反射",
        );
      } else {
        await click("8 等分");
        expect(host.querySelectorAll("[data-sector]")).toHaveLength(8);
        await click("64 等分");
        expect(host.querySelectorAll("[data-sector]")).toHaveLength(64);
      }
      await click("回到起点");
      expect(host.querySelector('[aria-label="演示进度"]').value).toBe("0");
      await click("前进一步");
      expect(host.querySelector('[aria-label="演示进度"]').value).toBe("0.25");
      const field = host.querySelector(
        `[aria-label="${lesson.params[0].label}"]`,
      );
      await act(() => {
        Object.getOwnPropertyDescriptor(
          HTMLInputElement.prototype,
          "value",
        ).set.call(
          field,
          String(
            Number(field.value) === lesson.params[0].max
              ? lesson.params[0].min
              : lesson.params[0].max,
          ),
        );
        field.dispatchEvent(new Event("input", { bubbles: true }));
        field.dispatchEvent(new Event("change", { bubbles: true }));
      });
      expect(host.querySelector('[aria-label="演示进度"]').value).toBe("0");
    } finally {
      await act(() => root.unmount());
    }
  },
);

it("prism interface controls seek exact arrival times and retain the selected light", async () => {
  const host = document.createElement("div"),
    root = createRoot(host);
  await act(() =>
    root.render(
      <MotionLab lesson={revealLessons[0]} open={() => {}} goHome={() => {}} />,
    ),
  );
  const click = async (text) =>
    act(() =>
      [...host.querySelectorAll("button")]
        .find((b) => b.textContent === text)
        .click(),
    );
  try {
    await click("紫光");
    expect(host.querySelector(".prism-interfaces").textContent).toContain(
      "当前用紫光",
    );
    for (const [label, time] of [
      ["定位第一界面", 2],
      ["定位第二界面", 4],
      ["查看完整光路", 6],
    ]) {
      await click(label);
      expect(Number(host.querySelector('[aria-label="演示进度"]').value)).toBe(
        time,
      );
      expect(host.querySelector(".prism-interfaces").textContent).toContain(
        "当前用紫光",
      );
    }
    for (let i = 0; i < 4; i++) await click("下一节");
    expect(
      host.querySelector('[aria-label="第二界面角度检查"]').textContent,
    ).toContain("大于临界角，发生全反射");
    expect(
      host.querySelector('[aria-label="第二界面的折射或全反射角"]').textContent,
    ).toContain("反射");
  } finally {
    await act(() => root.unmount());
  }
});
