// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { it, expect } from "vitest";
import { areaCutState } from "../src/discoveryModels.mjs";
import MotionLab from "../src/MotionLab.jsx";
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
const separated = (a, b) =>
  [a, b].some((poly) =>
    poly.some((v, i) => {
      const w = poly[(i + 1) % poly.length],
        n = [v[1] - w[1], w[0] - v[0]],
        pa = a.map((p) => p[0] * n[0] + p[1] * n[1]),
        pb = b.map((p) => p[0] * n[0] + p[1] * n[1]);
      return (
        Math.max(...pa) <= Math.min(...pb) + 1e-9 ||
        Math.max(...pb) <= Math.min(...pa) + 1e-9
      );
    }),
  );
it("pieces stay rigid and interior-disjoint through all three transport legs", () => {
  for (const base of [3, 6])
    for (const height of [1, 3])
      for (const shear of [0.25, 2]) {
        const p = { base, height, shear },
          fixed = [
            [shear, 0],
            [base, 0],
            [base + shear, -height],
            [shear, -height],
          ];
        for (let i = 0; i <= 240; i++) {
          const q = areaCutState(p, i / 40),
            moving = [
              [q.shift, q.drop],
              [q.shift + shear, q.drop],
              [q.shift + shear, q.drop - height],
            ];
          expect(separated(moving, fixed)).toBe(true);
          expect(
            Math.hypot(
              moving[2][0] - moving[0][0],
              moving[2][1] - moving[0][1],
            ),
          ).toBeCloseTo(Math.hypot(shear, height), 10);
          expect(300 + q.drop * 55).toBeLessThan(530);
        }
        expect(areaCutState(p, 6).drop).toBe(0);
        expect(areaCutState(p, 6).shift).toBe(base);
      }
});
it("named steps pause and position the actual triangle while preserving area", async () => {
  const host = document.createElement("div"),
    root = createRoot(host);
  try {
    await act(() =>
      root.render(
        <MotionLab
          lesson={{ id: "area-cut" }}
          open={() => {}}
          goHome={() => {}}
        />,
      ),
    );
    for (const [label, time] of [
      ["移出三角形", 1.5],
      ["平移到右侧", 4.5],
      ["归位成矩形", 6],
      ["原图与剪切线", 0],
    ]) {
      const button = [...host.querySelectorAll("button")].find(
        (b) => b.textContent === label,
      );
      await act(() => button.click());
      const q = areaCutState({ base: 4, height: 2, shear: 1.5 }, time);
      expect(
        host.querySelector('[data-piece="triangle"]').getAttribute("transform"),
      ).toBe(`translate(${q.shift * 55} ${q.drop * 55})`);
      expect(host.querySelector('[aria-label="演示进度"]').value).toBe(
        String(time),
      );
      expect(host.textContent).toContain("播放演示");
      expect(host.textContent).toContain("8.00");
    }
  } finally {
    await act(() => root.unmount());
  }
});

it("zero shear is identified as an existing rectangle", () => {
  for (const time of [0, 1.5, 3, 4.5, 6]) {
    const q = areaCutState({ base: 4, height: 2, shear: 0 }, time);
    expect(q.triangle).toBe(0);
    expect(q.stage).toBe("原图已是矩形");
    expect(q.area).toBe(8);
  }
});
