import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { it, expect } from "vitest";
import { functionAxisTicks } from "../src/functionAxisTicks.mjs";
import FunctionStudio from "../src/FunctionStudio.jsx";

it("radian labels represent exact axis positions and thin out without changing units", () => {
  const ticks = functionAxisTicks(7, 1, true);
  expect(ticks.map((t) => t.label)).toEqual([
    "−2π",
    "−3π/2",
    "−π",
    "−π/2",
    "0",
    "π/2",
    "π",
    "3π/2",
    "2π",
  ]);
  ticks.forEach((tick, i) =>
    expect(tick.value).toBeCloseTo(((i - 4) * Math.PI) / 2),
  );
  for (const minimum of [1, 2, 3, 4, 8]) {
    const result = functionAxisTicks(24, minimum, true);
    expect(result.every((t) => Math.abs(t.value) <= 24)).toBe(true);
    expect(result[1].value - result[0].value).toBeGreaterThanOrEqual(minimum);
    expect(result.find((t) => t.value === 0).label).toBe("0");
  }
  expect(functionAxisTicks(3, 1).map((t) => t.label)).toEqual([
    "-3",
    "-2",
    "-1",
    "0",
    "1",
    "2",
    "3",
  ]);
});

it("sine uses radian x labels even after translation, other functions keep numerical labels", () => {
  const p = {
    type: 1,
    a: 2,
    k: -2,
    b: 1,
    shift: 1,
    probe: 0,
    analysis: 0,
    dx: 1,
  };
  const sine = renderToStaticMarkup(
    <FunctionStudio p={p} onChange={() => {}} />,
  );
  expect(sine).toContain('aria-label="横轴刻度 π/2"');
  expect(sine).toContain('aria-label="横轴刻度 −π"');
  const quadratic = renderToStaticMarkup(
    <FunctionStudio p={{ ...p, type: 0 }} onChange={() => {}} />,
  );
  expect(quadratic).not.toContain('aria-label="横轴刻度 π/2"');
  expect(quadratic).toContain('aria-label="横轴刻度 1"');
});
