// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { it, expect, vi } from "vitest";
import SimilarAreaTiles, { similarTiles } from "../src/SimilarAreaTiles.jsx";
import MotionLab from "../src/MotionLab.jsx";
import { comparisonLessons } from "../src/comparisonLessons.mjs";
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
const area = (poly) =>
  Math.abs(
    poly.reduce((sum, p, i) => {
      const q = poly[(i + 1) % poly.length];
      return sum + p[0] * q[1] - q[0] * p[1];
    }, 0),
  ) / 2;
const inside = (point, poly) => {
  let sign = 0;
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i],
      b = poly[(i + 1) % poly.length],
      cross =
        (b[0] - a[0]) * (point[1] - a[1]) - (b[1] - a[1]) * (point[0] - a[0]);
    if (Math.abs(cross) < 1e-8) return false;
    if (sign && Math.sign(cross) !== sign) return false;
    sign = Math.sign(cross);
  }
  return true;
};
it("tiles have equal area, stay within the target, and cover it without overlapping interiors", () => {
  for (const shape of [0, 1])
    for (const scale of [0.5, 1, 1.5, 2, 2.5, 3]) {
      const q = similarTiles(scale, shape),
        base = shape ? 4800 : 9600;
      expect(q.tiles.reduce((s, p) => s + area(p), 0)).toBeCloseTo(
        base * scale ** 2,
        10,
      );
      q.tiles.forEach((p) => {
        expect(area(p)).toBeCloseTo(base * q.partRatio, 10);
        p.forEach(([x, y]) => {
          expect(x).toBeGreaterThanOrEqual(0);
          expect(y).toBeGreaterThanOrEqual(0);
          expect(x).toBeLessThanOrEqual(q.width);
          expect(y).toBeLessThanOrEqual(q.height);
          if (shape)
            expect(x / q.width + y / q.height).toBeLessThanOrEqual(1 + 1e-12);
        });
      });
      for (let i = 0; i < 29; i++)
        for (let j = 0; j < 31; j++) {
          const point = [
              (q.width * (i + 0.317)) / 29,
              (q.height * (j + 0.219)) / 31,
            ],
            expected = !shape || point[0] / q.width + point[1] / q.height < 1;
          expect(q.tiles.filter((p) => inside(point, p)).length).toBe(
            expected ? 1 : 0,
          );
        }
    }
});
it("blocks are selectable by keyboard and hidden without changing the area", async () => {
  const host = document.createElement("div"),
    root = createRoot(host),
    seek = vi.fn();
  try {
    await act(() =>
      root.render(
        <SimilarAreaTiles
          p={{ scale: 2.5, shape: 1 }}
          time={3}
          onSeek={seek}
        />,
      ),
    );
    const tiles = () => host.querySelectorAll('polygon[role="button"]');
    expect(tiles()).toHaveLength(25);
    await act(() =>
      tiles()[24].dispatchEvent(
        new KeyboardEvent("keydown", { key: "Enter", bubbles: true }),
      ),
    );
    expect(tiles()[24].getAttribute("aria-pressed")).toBe("true");
    expect(
      [...host.querySelectorAll("button")].find(
        (b) => b.textContent === "下一块",
      ).disabled,
    ).toBe(true);
    await act(() =>
      [...host.querySelectorAll("button")]
        .find((b) => b.textContent === "隐藏分割")
        .click(),
    );
    expect(tiles()).toHaveLength(0);
    expect(host.textContent).toContain("25 块 × 0.75 cm² = 18.75 cm²");
    await act(() =>
      [...host.querySelectorAll("button")]
        .find((b) => b.textContent === "主图到达目标尺寸")
        .click(),
    );
    expect(seek).toHaveBeenCalledWith(6);
  } finally {
    await act(() => root.unmount());
  }
});
it("sixth chapter loads 25 quarter-area triangles and switches to rectangles at the same target", async () => {
  const host = document.createElement("div"),
    root = createRoot(host);
  try {
    await act(() =>
      root.render(
        <MotionLab
          lesson={comparisonLessons[0]}
          open={() => {}}
          goHome={() => {}}
        />,
      ),
    );
    await act(() =>
      host.querySelectorAll('[aria-label="学习子主题"] button')[5].click(),
    );
    expect(host.querySelector("h1").textContent).toBe("用四分之一块解释面积比");
    expect(host.querySelectorAll('polygon[role="button"]')).toHaveLength(25);
    await act(() =>
      [
        ...host
          .querySelector('[aria-label="图形选择"]')
          .querySelectorAll("button"),
      ]
        .find((b) => b.textContent === "矩形")
        .click(),
    );
    expect(host.textContent).toContain("25 块 × 1.5 cm² = 37.5 cm²");
    expect(host.querySelector('[aria-label="目标边长比 k"]').value).toBe("2.5");
    expect(host.querySelector('[aria-label="演示进度"]').value).toBe("6");
  } finally {
    await act(() => root.unmount());
  }
});
