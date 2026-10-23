// @vitest-environment jsdom
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { it, expect } from "vitest";
import { mirrorRay, mirrorReference } from "../src/visualProofModels.mjs";
import VisualProofScene from "../src/VisualProofScene.jsx";
it("independent reflected rays reconstruct the same virtual position and report the degenerate case", () => {
  for (const distance of [2, 4, 6])
    for (const objectHeight of [1, 3, 5])
      for (const eyeDistance of [2, 4, 6])
        for (const eyeHeight of [1, 3, 5]) {
          const p = { distance, objectHeight, eyeDistance, eyeHeight },
            q = mirrorRay(p),
            r = mirrorReference(p);
          const m1 = (q.height - eyeHeight) / eyeDistance,
            m2 = (r.height - r.eyeHeight) / r.eyeDistance;
          if (Math.abs(m1 - m2) > 1e-8) {
            const x = (r.height - q.height) / (m1 - m2);
            expect(x).toBeCloseTo(distance, 10);
            expect(q.height + m1 * x).toBeCloseTo(objectHeight, 10);
            expect(r.coincident).toBe(false);
          } else expect(r.coincident).toBe(true);
          expect(r.incident).toBeCloseTo(r.reflected, 12);
        }
  expect(
    mirrorReference({
      distance: 2,
      objectHeight: 3,
      eyeDistance: 4,
      eyeHeight: 5,
    }).coincident,
  ).toBe(true);
});
it("prediction hides image and distance hints but preserves both real optical paths", () => {
  const p = { distance: 4, objectHeight: 2, eyeDistance: 5, eyeHeight: 1 };
  const host = document.createElement("div");
  host.innerHTML = renderToStaticMarkup(
    <VisualProofScene
      id="plane-mirror"
      p={p}
      time={6}
      chapter={5}
      trace={false}
    />,
  );
  expect(host.querySelector('[data-testid="mirror-reference"]')).not.toBeNull();
  const labels = [...host.querySelectorAll("text")].map((n) => n.textContent);
  expect(labels).not.toContain("虚像");
  expect(labels).not.toContain("4 cm");
  expect(labels).toContain("参考观察者 · 固定");
  host.innerHTML = renderToStaticMarkup(
    <VisualProofScene id="plane-mirror" p={p} time={6} chapter={5} />,
  );
  expect(
    [...host.querySelectorAll("text")].some((n) => n.textContent === "虚像"),
  ).toBe(true);
});
