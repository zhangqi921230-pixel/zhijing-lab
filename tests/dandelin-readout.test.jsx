// @vitest-environment jsdom
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { expect, it } from "vitest";
import DandelinReadout from "../src/DandelinReadout.jsx";
import { dandelinSpheres } from "../src/conicDandelin.mjs";
import { conicFoci, conicSegments } from "../src/conicGeometry.mjs";
import { conicProbe } from "../src/conicProbe.mjs";

it("pairs actual sphere foci and tangent lengths for ellipse, parabola and hyperbola", () => {
  for (const tilt of [25, 60, 75]) {
    const p = { alpha: 30, tilt, offset: 0.3, probe: 40 };
    const spheres = dandelinSpheres(p);
    const host = document.createElement("div");
    host.innerHTML = renderToStaticMarkup(
      <DandelinReadout
        spheres={spheres}
        foci={conicFoci(p)}
        point={conicProbe(p, conicSegments(p)).point}
      />,
    );
    const pairs = [...host.querySelectorAll(".dandelin-readout-pair")];
    expect(pairs.length).toBe(spheres.filter((s) => s.visible).length);
    for (const pair of pairs) {
      const outputs = pair.querySelectorAll("output");
      expect(outputs[0].textContent).toBe(outputs[1].textContent);
      const widths = [...pair.querySelectorAll("i")].map((node) =>
        parseFloat(node.style.width),
      );
      expect(widths[0]).toBeCloseTo(widths[1], 7);
      expect(widths[0]).toBeLessThanOrEqual(100);
    }
  }
});
it("omits proof when no finite visible sphere or observation point exists", () => {
  const spheres = dandelinSpheres({ alpha: 30, tilt: 25, offset: 0.3 });
  expect(
    renderToStaticMarkup(<DandelinReadout spheres={spheres} foci={[]} />),
  ).toBe("");
  expect(
    renderToStaticMarkup(
      <DandelinReadout spheres={[]} foci={[]} point={[1, 1, 1]} />,
    ),
  ).toBe("");
});
