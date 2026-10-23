// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { it, expect, vi } from "vitest";
import InclineMassStudy from "../src/InclineMassStudy.jsx";
import { incline } from "../src/advancedModels.mjs";
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
it("same incline yields identical motion across masses with proportional forces", () => {
  for (const mass of [0.5, 1, 2, 4, 5])
    for (const angle of [10, 35, 60])
      for (const t of [0, 0.3, 1, 8]) {
        const p = { mass, angle, mu: 0.2, muStatic: 0.3 },
          a = incline({ ...p, mass: 1 }, t),
          b = incline(p, t);
        expect(b.a).toBeCloseTo(a.a);
        expect(b.s).toBeCloseTo(a.s);
        expect(b.v).toBeCloseTo(a.v);
        expect(b.gravity).toBeCloseTo(mass * a.gravity);
        expect(b.parallel - b.friction - b.stopForce).toBeCloseTo(mass * b.a);
      }
});
it("fixed-scale bars show mass effects, synchronized tracks and shared parameter actions", async () => {
  const host = document.createElement("div"),
    root = createRoot(host),
    onMass = vi.fn();
  try {
    await act(() =>
      root.render(
        <InclineMassStudy
          p={{ mass: 4, angle: 35, mu: 0.2, muStatic: 0.3 }}
          t={0.3}
          onMass={onMass}
        />,
      ),
    );
    const bars = [
      ...host.querySelectorAll('[data-testid="mass-force-bar"]'),
    ].map((e) => +e.getAttribute("width"));
    expect(bars[1] / bars[0]).toBeCloseTo(4);
    expect(bars[3] / bars[2]).toBeCloseTo(4);
    const blocks = [
      ...host.querySelectorAll('[data-testid="mass-comparison-block"]'),
    ];
    expect(blocks[0].getAttribute("x")).toBe(blocks[1].getAttribute("x"));
    await act(() =>
      [...host.querySelectorAll("button")]
        .find((b) => b.textContent === "当前质量 2 kg")
        .click(),
    );
    expect(onMass).toHaveBeenCalledWith(2);
  } finally {
    await act(() => root.unmount());
  }
});
