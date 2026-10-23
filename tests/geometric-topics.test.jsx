// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { renderToStaticMarkup } from "react-dom/server";
import { it, expect } from "vitest";
import {
  vectorState,
  fenceState,
  geometricLessons,
} from "../src/geometricLessons.mjs";
import GeometricScene from "../src/GeometricScene.jsx";
import MotionLab from "../src/MotionLab.jsx";
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
it("vector construction obeys the cosine rule and handles zero without a direction", () => {
  for (let a = 1; a <= 4; a += 0.5)
    for (let b = 1; b <= 4; b += 0.5)
      for (let angle = 0; angle <= 180; angle += 5) {
        const q = vectorState({ a, b, angle });
        expect(q.length ** 2).toBeCloseTo(
          a * a + b * b + 2 * a * b * Math.cos((angle * Math.PI) / 180),
          10,
        );
        expect(q.length).toBeLessThanOrEqual(a + b + 1e-10);
        expect(q.length).toBeGreaterThanOrEqual(Math.abs(a - b) - 1e-10);
      }
  expect(vectorState({ a: 3, b: 4, angle: 90 }).length).toBe(5);
  expect(vectorState({ a: 3, b: 3, angle: 180 }).length).toBe(0);
});
it("the moving fence conserves perimeter, has square maximum and reciprocal symmetry", () => {
  for (let perimeter = 8; perimeter <= 24; perimeter += 2)
    for (let share = 10; share <= 90; share += 5)
      for (let t = 0; t <= 6; t += 0.5) {
        const q = fenceState({ perimeter, share }, t);
        expect(2 * (q.x + q.y)).toBeCloseTo(perimeter, 12);
        expect(q.area).toBeLessThanOrEqual(q.max + 1e-10);
        expect(q.max - q.area).toBeCloseTo((q.x - perimeter / 4) ** 2, 10);
      }
  expect(fenceState({ perimeter: 20, share: 50 }, 6).area).toBe(25);
  expect(fenceState({ perimeter: 20, share: 20 }, 6).area).toBe(
    fenceState({ perimeter: 20, share: 80 }, 6).area,
  );
});
it("all ten chapters expose distinct finite visual states", () => {
  for (const l of geometricLessons) {
    const views = l.chapters.map((c) =>
      renderToStaticMarkup(
        <GeometricScene id={l.id} p={c.preset} time={c.time} />,
      ),
    );
    expect(new Set(views).size).toBe(5);
    views.forEach((v) => expect(v).not.toMatch(/NaN|Infinity|undefined/));
  }
});
it("chapter switching, swap and optimum update the actual garden and pause at the result", async () => {
  const host = document.createElement("div"),
    root = createRoot(host);
  try {
    await act(() =>
      root.render(
        <MotionLab
          lesson={geometricLessons[1]}
          open={() => {}}
          goHome={() => {}}
        />,
      ),
    );
    await act(() =>
      host.querySelectorAll('[aria-label="学习子主题"] button')[2].click(),
    );
    const button = (text) =>
      [...host.querySelectorAll("button")].find((b) => b.textContent === text);
    expect(host.querySelector('[aria-label="横边占半周长"]').value).toBe("80");
    await act(() => button("交换目标横边与竖边").click());
    expect(host.querySelector('[aria-label="横边占半周长"]').value).toBe("20");
    expect(host.textContent).toContain("16.00 m²");
    await act(() => button("定位最大面积").click());
    expect(host.querySelector('[aria-label="横边占半周长"]').value).toBe("50");
    expect(host.textContent).toContain("25.00 m²");
    expect(host.querySelector('[aria-label="演示进度"]').value).toBe("6");
    expect(host.textContent).toContain("播放演示");
  } finally {
    await act(() => root.unmount());
  }
});
