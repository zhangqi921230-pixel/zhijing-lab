// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { it, expect, vi } from "vitest";
import { apparentDepth } from "../src/apparentDepth.mjs";
import ApparentDepth from "../src/ApparentDepth.jsx";
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
it("reverse ray intersection follows Snell and the near-axis limit", () => {
  for (const d of [0.5, 2, 4])
    for (const i of [0, 5, 20, 40]) {
      const q = apparentDepth(d, i, 1.33, 1);
      expect(q.apparent).toBeGreaterThan(0);
      expect(q.apparent).toBeLessThan(d);
      if (i > 0)
        expect(q.apparent * Math.tan((q.angle * Math.PI) / 180)).toBeCloseTo(
          q.offset,
          10,
        );
      expect(apparentDepth(d, i, 1.33, 1.33).apparent).toBeCloseTo(d, 10);
      expect(apparentDepth(2 * d, i, 1.33, 1).apparent).toBeCloseTo(
        2 * q.apparent,
        10,
      );
    }
  expect(apparentDepth(2, 0, 1.33, 1).apparent).toBeCloseTo(2 / 1.33, 10);
  expect(apparentDepth(2, 0.001, 1.33, 1).apparent).toBeCloseTo(2 / 1.33, 8);
});
it("grazing and total reflection do not present a regular transmitted image", () => {
  const critical = (Math.asin(1 / 1.33) * 180) / Math.PI;
  expect(apparentDepth(2, critical, 1.33, 1).apparent).toBeNull();
  expect(apparentDepth(2, critical + 1, 1.33, 1).tir).toBe(true);
  expect(apparentDepth(2, critical + 1, 1.33, 1).apparent).toBeNull();
});
it("angle presets share the parent controls and the full-reflection state is explicit", async () => {
  const host = document.createElement("div"),
    root = createRoot(host),
    change = vi.fn();
  try {
    await act(() =>
      root.render(
        <ApparentDepth p={{ angle: 20, n1: 1.33, n2: 1 }} onChange={change} />,
      ),
    );
    const button = [...host.querySelectorAll("button")].find(
      (b) => b.textContent === "入射角 40°",
    );
    await act(() => button.click());
    expect(change).toHaveBeenLastCalledWith("angle", 40);
    await act(() =>
      root.render(
        <ApparentDepth p={{ angle: 60, n1: 1.33, n2: 1 }} onChange={change} />,
      ),
    );
    expect(host.textContent).toContain("当前发生全反射");
    expect(
      host.querySelectorAll(".apparent-depth-readings strong")[1].textContent,
    ).toBe("不适用");
  } finally {
    await act(() => root.unmount());
  }
});
