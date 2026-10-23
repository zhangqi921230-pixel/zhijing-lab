import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { it, expect } from "vitest";
import { hydraulicGeometry } from "../src/hydraulicGeometry.mjs";
import DiscoveryScene from "../src/DiscoveryScene.jsx";
it("visible swept areas conserve volume and both pistons remain inside the cylinder throughout every supported stroke", () => {
  for (let ratio = 1; ratio <= 8; ratio++)
    for (let stroke = 2; stroke <= 10; stroke++)
      for (let time = 0; time <= 6; time += 0.5) {
        const g = hydraulicGeometry({ ratio, stroke, force: 40 }, time);
        expect(g.sweptInput).toBeCloseTo(g.sweptOutput, 10);
        const fluidArea =
          32 * (430 - g.inputY) + 268 * 50 + g.outputWidth * (430 - g.outputY);
        expect(fluidArea).toBeCloseTo(
          (32 + g.outputWidth) * 170 + 268 * 50,
          10,
        );
        expect(g.inputY).toBeLessThanOrEqual(360);
        expect(g.outputY).toBeGreaterThanOrEqual(160);
        // Load clears the title (82); piston bottoms stay clear of connecting pipe (380).
        expect(g.outputY - 60).toBeGreaterThan(82);
        expect(g.inputY).toBeLessThan(380);
        expect(g.sweptInput).toBeCloseTo((32 * 10 * stroke * time) / 6, 10);
      }
});
it("measurement control owns swept regions and changing progress changes their dimensions", () => {
  const p = { ratio: 4, force: 40, stroke: 8 };
  const render = (time, guides) =>
    renderToStaticMarkup(
      <DiscoveryScene id="hydraulic" p={p} time={time} guides={guides} />,
    );
  const end = render(6, true),
    start = render(0, true),
    hidden = render(6, false);
  expect(end).toContain('height="80"');
  expect(end).toContain('height="20"');
  expect(start).toContain('height="0"');
  expect(end).toContain("hydraulic-input-sweep");
  expect(end).toContain("hydraulic-output-sweep");
  expect(hidden).not.toContain("hydraulic-input-sweep");
  expect(hidden).not.toContain("hydraulic-output-sweep");
  expect(hidden).toContain("转移体积");
});
