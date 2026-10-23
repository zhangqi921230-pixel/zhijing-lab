// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { it, expect } from "vitest";
import MotionLab from "../src/MotionLab.jsx";
import { triangleAngles, triangleAngleRadius } from "../src/insightModels.mjs";
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
it("the three angles at C partition a straight angle for all parameter extremes", () => {
  for (const base of [4, 8])
    for (const offset of [1, 3])
      for (const height of [1, 4]) {
        const q = triangleAngles({ base, offset, height });
        const intervals = [
          [0, q.b],
          [q.b, Math.PI - q.a],
          [Math.PI - q.a, Math.PI],
        ];
        expect(intervals[1][1] - intervals[1][0]).toBeCloseTo(q.c, 12);
        expect(intervals.reduce((sum, [a, b]) => sum + b - a, 0)).toBeCloseTo(
          Math.PI,
          12,
        );
      }
});
it("proof steps reveal matching angles without changing main conditions and reset when leaving the chapter", async () => {
  const host = document.createElement("div"),
    root = createRoot(host);
  await act(() =>
    root.render(
      <MotionLab
        lesson={{ id: "triangle-angles" }}
        open={() => {}}
        goHome={() => {}}
      />,
    ),
  );
  try {
    const click = async (text) =>
      act(() =>
        [...host.querySelectorAll("button")]
          .find((b) => b.textContent.includes(text))
          .click(),
      );
    await click("用平行线说明为什么");
    expect(host.querySelector('[data-angle="A-copy"]')).toBeNull();
    await click("2 对照 ∠A");
    expect(host.querySelector('[data-angle="A-copy"]')).not.toBeNull();
    expect(host.querySelector('[data-angle="B-copy"]')).toBeNull();
    await click("3 对照 ∠B");
    expect(host.querySelector('[data-angle="B-copy"]')).not.toBeNull();
    await click("4 得出结论");
    expect(
      host.querySelector(".triangle-proof-explanation").textContent,
    ).toContain("180°");
    expect(host.querySelector('input[aria-label="演示进度"]').value).toBe(
      "1.5",
    );
    expect(host.querySelector('input[aria-label="顶点高度"]').value).toBe("3");
    await click("认识三个内角");
    expect(host.querySelector(".triangle-proof")).toBeNull();
    await click("用平行线说明为什么");
    expect(host.querySelector('[data-angle="A-copy"]')).toBeNull();
  } finally {
    await act(() => root.unmount());
  }
});

it("angle markers fit without overlapping along the shortest triangle edge", () => {
  for (const base of [4, 8])
    for (const offset of [1, 3])
      for (const height of [1, 4])
        for (const scale of [38, 42]) {
          const p = { base, offset, height },
            r = triangleAngleRadius(p, scale, 64),
            shortest =
              scale *
              Math.min(
                base,
                Math.hypot(offset, height),
                Math.hypot(base - offset, height),
              );
          expect(r).toBeGreaterThan(0);
          expect(2 * r).toBeLessThan(shortest);
        }
});
