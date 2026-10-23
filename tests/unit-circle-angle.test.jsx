import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { it, expect } from "vitest";
import { unitCircleAngle } from "../src/unitCircleAngle.mjs";
import UnitCircle from "../src/UnitCircle.jsx";

it("directed angle arcs preserve signed turns and the radius endpoint", () => {
  for (const theta of [
    0,
    Math.PI / 6,
    Math.PI / 2,
    -Math.PI / 2,
    1.5 * Math.PI,
    -1.5 * Math.PI,
    2 * Math.PI,
    -4 * Math.PI,
    5 * Math.PI,
    -5 * Math.PI,
  ]) {
    const q = unitCircleAngle(theta);
    expect(q.turns * 2 * Math.PI + q.remainder).toBeCloseTo(theta);
    expect(Math.abs(q.remainder)).toBeLessThan(2 * Math.PI);
    if (!q.remainder) expect(q.path).toBe("");
    else {
      const parts = q.path.split(" ");
      expect(Number(parts.at(-2))).toBeCloseTo(120 + 28 * Math.cos(theta));
      expect(Number(parts.at(-1))).toBeCloseTo(120 - 28 * Math.sin(theta));
      expect(Number(parts.at(-3))).toBe(theta > 0 ? 0 : 1);
      expect(Number(parts.at(-4))).toBe(
        Math.abs(q.remainder) > Math.PI ? 1 : 0,
      );
    }
  }
});
it("shows common angles, selected state, and full turns separately from the remaining arc", () => {
  const p = { type: 1, a: 1, b: 0, k: 1, shift: 0, probe: Math.PI / 6 };
  const html = renderToStaticMarkup(<UnitCircle p={p} onChange={() => {}} />);
  expect(html).toContain('aria-pressed="true">π/6');
  expect(html).toContain("输入角方向弧");
  const turns = renderToStaticMarkup(
    <UnitCircle p={{ ...p, k: -3, probe: Math.PI }} onChange={() => {}} />,
  );
  expect(turns).toContain("顺时针");
  expect(turns).toContain("余角 -3.142 rad");
});
