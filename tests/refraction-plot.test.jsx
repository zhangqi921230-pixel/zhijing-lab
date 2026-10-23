// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { it, expect, vi } from "vitest";
import RefractionPlot, { refractionCurve } from "../src/RefractionPlot.jsx";
import { refraction, rad } from "../src/models.mjs";
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
it("ends the curve at the critical angle and preserves Snell law throughout", () => {
  for (const [n1, n2] of [
    [1, 1.5],
    [1.5, 1],
    [1.33, 1.33],
  ]) {
    const points = refractionCurve(n1, n2);
    for (const p of points) {
      expect(Number.isFinite(p.value)).toBe(true);
      expect(n1 * Math.sin(rad(p.angle))).toBeCloseTo(
        n2 * Math.sin(rad(p.value)),
        10,
      );
    }
    if (n1 > n2) {
      expect(points.at(-1).value).toBe(90);
      expect(points.at(-1).angle).toBeCloseTo(
        refraction(0, n1, n2).critical,
        12,
      );
    }
  }
});
it("critical shortcuts distinguish grazing from TIR and the graph remains keyboard adjustable", async () => {
  const host = document.createElement("div"),
    root = createRoot(host),
    change = vi.fn();
  const render = async (p) =>
    act(() => root.render(<RefractionPlot p={p} onChange={change} />));
  try {
    await render({ n1: 1.5, n2: 1, angle: 30 });
    const buttons = host.querySelectorAll("button");
    await act(() => buttons[1].click());
    const critical = change.mock.lastCall[1];
    expect(refraction(critical, 1.5, 1).angle).toBe(90);
    await act(() => buttons[2].click());
    expect(refraction(change.mock.lastCall[1], 1.5, 1).tir).toBe(true);
    await render({ n1: 1.5, n2: 1, angle: 50 });
    expect(host.querySelector("circle")).toBeNull();
    await act(() =>
      host
        .querySelector("svg")
        .dispatchEvent(
          new KeyboardEvent("keydown", { key: "Home", bubbles: true }),
        ),
    );
    expect(change).toHaveBeenLastCalledWith("angle", 0);
    await render({ n1: 1, n2: 1.5, angle: 30 });
    expect([...host.querySelectorAll("button")].every((b) => b.disabled)).toBe(
      true,
    );
  } finally {
    await act(() => root.unmount());
  }
});
