// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { it, expect } from "vitest";
import { squareDissection } from "../src/squareDissection.mjs";
import { intuitiveLessons } from "../src/intuitiveLessons.mjs";
import MotionLab from "../src/MotionLab.jsx";
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
function vertices(q) {
  const t = (q.angle * Math.PI) / 180;
  return [
    [-q.h / 2, -q.b / 2],
    [q.h / 2, -q.b / 2],
    [q.h / 2, q.b / 2],
    [-q.h / 2, q.b / 2],
  ].map(([x, y]) => [
    q.cx + x * Math.cos(t) - y * Math.sin(t),
    q.cy + x * Math.sin(t) + y * Math.cos(t),
  ]);
}
function overlaps(a, b) {
  return ![a, b].some((poly) =>
    poly.some((v, i) => {
      const next = poly[(i + 1) % poly.length],
        axis = [-(next[1] - v[1]), next[0] - v[0]],
        project = (p) => p.map((w) => w[0] * axis[0] + w[1] * axis[1]),
        pa = project(a),
        pb = project(b);
      return (
        Math.max(...pa) <= Math.min(...pb) + 1e-7 ||
        Math.max(...pb) <= Math.min(...pa) + 1e-7
      );
    }),
  );
}
it("all supported dimensions preserve rigid area and avoid the fixed block and text regions throughout motion", () => {
  for (let a = 4; a <= 8; a++)
    for (let b = 1; b <= 3; b += 0.5)
      for (let n = 0; n <= 120; n++) {
        const q = squareDissection({ a, b }, n / 20),
          points = vertices(q);
        const area =
          Math.abs(
            points.reduce((sum, v, i) => {
              const w = points[(i + 1) % 4];
              return sum + v[0] * w[1] - w[0] * v[1];
            }, 0),
          ) / 2;
        expect(area).toBeCloseTo(b * (a - b) * 38 * 38, 5);
        expect(Math.min(...points.map((p) => p[1]))).toBeGreaterThanOrEqual(
          -1e-8,
        );
        expect(Math.max(...points.map((p) => p[0])) + 85).toBeLessThan(710);
        expect(
          overlaps(points, [
            [0, q.b],
            [q.a, q.b],
            [q.a, q.a],
            [0, q.a],
          ]),
        ).toBe(false);
      }
});
it("final block joins exactly along the fixed block right edge", () => {
  for (let a = 4; a <= 8; a++)
    for (let b = 1; b <= 3; b += 0.5) {
      const q = squareDissection({ a, b }, 6),
        points = vertices(q);
      expect(Math.min(...points.map((p) => p[0]))).toBeCloseTo(q.a);
      expect(Math.max(...points.map((p) => p[0]))).toBeCloseTo(q.a + q.b);
      expect(Math.min(...points.map((p) => p[1]))).toBeCloseTo(q.b);
      expect(Math.max(...points.map((p) => p[1]))).toBeCloseTo(q.a);
    }
});
it("named steps seek to the actual geometry stages and dimensions can be hidden independently", async () => {
  const host = document.createElement("div"),
    root = createRoot(host);
  try {
    await act(() =>
      root.render(
        <MotionLab
          lesson={intuitiveLessons[0]}
          open={() => {}}
          goHome={() => {}}
        />,
      ),
    );
    for (const [name, t] of [
      ["原始面积", 0],
      ["平移完成", 2.5],
      ["旋转完成", 4],
      ["拼接完成", 6],
    ]) {
      await act(() =>
        [...host.querySelectorAll("button")]
          .find((b) => b.textContent === name)
          .click(),
      );
      expect(host.querySelector('[aria-label="演示进度"]').value).toBe(
        String(t),
      );
    }
    expect(
      host.querySelector('[data-testid="square-dimensions"]').textContent,
    ).toContain("a−b = 4");
    expect(
      host.querySelector('[data-testid="square-dimensions"]').textContent,
    ).toContain("a+b = 8");
    await act(() =>
      [...host.querySelectorAll("button")]
        .find((b) => b.textContent === "隐藏测量辅助线")
        .click(),
    );
    expect(host.querySelector('[data-testid="square-dimensions"]')).toBeNull();
    expect(host.querySelector('[aria-label="演示进度"]').value).toBe("6");
  } finally {
    await act(() => root.unmount());
  }
});
