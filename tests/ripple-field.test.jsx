// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { it, expect, vi } from "vitest";
import { rippleFieldBands, rippleSection } from "../src/rippleField.mjs";
import { rippleState, intuitiveLessons } from "../src/intuitiveLessons.mjs";
import RippleSectionStudy from "../src/RippleSectionStudy.jsx";
import MotionLab from "../src/MotionLab.jsx";
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
const p = { separation: 16, wavelength: 16, phase: 0, probeX: 4, probeY: 0 };
it("the spatial curve agrees with analytic constructive and destructive positions", () => {
  const points = rippleSection(p),
    at = (x) => points.find((s) => Math.abs(s.x - x) < 1e-8).amplitude;
  expect(at(0)).toBeCloseTo(2);
  expect(at(4)).toBeCloseTo(0);
  expect(at(-4)).toBeCloseTo(0);
  expect(at(16)).toBeCloseTo(2);
  for (const phase of [0, 30, 90, 180])
    for (const s of rippleSection({ ...p, phase, probeY: 8 })) {
      const q = rippleState({ ...p, phase, probeX: s.x, probeY: 8 }, 0.31);
      expect(s.amplitude).toBeCloseTo(q.amplitude);
      expect(Math.abs(q.total)).toBeLessThanOrEqual(s.amplitude + 1e-12);
    }
});
it("amplitude field is independent of probe position and has a bounded SVG node budget", () => {
  const a = rippleFieldBands(p),
    b = rippleFieldBands({ ...p, probeX: -12, probeY: 8 });
  expect(a).toEqual(b);
  expect(a).toHaveLength(16);
  expect(a.map((x) => x.d).join("").length).toBeLessThan(150000);
  expect(rippleFieldBands({ ...p, phase: 180 })).not.toEqual(a);
  expect(a.map((x) => x.d).join("")).not.toMatch(/NaN|Infinity/);
});
it("scan buttons preserve source conditions and reject moves beyond the visible range", async () => {
  const host = document.createElement("div"),
    root = createRoot(host),
    change = vi.fn();
  try {
    await act(() =>
      root.render(<RippleSectionStudy p={p} onChange={change} />),
    );
    await act(() =>
      [...host.querySelectorAll("button")]
        .find((b) => b.textContent === "向右 1 cm")
        .click(),
    );
    expect(change).toHaveBeenCalledWith({ ...p, probeX: 5 });
    await act(() =>
      root.render(
        <RippleSectionStudy p={{ ...p, probeX: 24 }} onChange={change} />,
      ),
    );
    expect(
      [...host.querySelectorAll("button")].find(
        (b) => b.textContent === "向右 1 cm",
      ).disabled,
    ).toBe(true);
    await act(() =>
      [...host.querySelectorAll("button")]
        .find((b) => b.textContent === "回到中线")
        .click(),
    );
    expect(change).toHaveBeenLastCalledWith({ ...p, probeX: 0 });
  } finally {
    await act(() => root.unmount());
  }
});
it("field toggle does not change time or probe; scanning pauses and keeps current time", async () => {
  const host = document.createElement("div"),
    root = createRoot(host);
  try {
    await act(() =>
      root.render(
        <MotionLab
          lesson={intuitiveLessons[1]}
          open={() => {}}
          goHome={() => {}}
        />,
      ),
    );
    await act(() =>
      host.querySelectorAll('[aria-label="学习子主题"] button')[5].click(),
    );
    expect(host.querySelector('[aria-label="演示进度"]').value).toBe("2");
    expect(
      host.querySelector('[data-testid="ripple-amplitude-field"]'),
    ).not.toBeNull();
    await act(() =>
      [...host.querySelectorAll("button")]
        .find((b) => b.textContent === "隐藏合振幅底图")
        .click(),
    );
    expect(
      host.querySelector('[data-testid="ripple-amplitude-field"]'),
    ).toBeNull();
    await act(() =>
      [...host.querySelectorAll("button")]
        .find((b) => b.textContent === "向右 1 cm")
        .click(),
    );
    expect(host.querySelector('[aria-label="观察点横坐标"]').value).toBe("1");
    expect(host.querySelector('[aria-label="演示进度"]').value).toBe("2");
    expect(host.textContent).toContain("播放演示");
  } finally {
    await act(() => root.unmount());
  }
});
