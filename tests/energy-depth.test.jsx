// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { it, expect, vi } from "vitest";
import EnergyDepthStudy, { energyAtLevel } from "../src/EnergyDepthStudy.jsx";
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
it("uses one fewer transfer than levels and preserves small terminal amounts", () => {
  expect(energyAtLevel(10000, 10, 5)).toBeCloseTo(1, 10);
  expect(energyAtLevel(10000, 20, 5)).toBeCloseTo(16, 10);
  expect(energyAtLevel(1000, 10, 5)).toBeCloseTo(0.1, 10);
  expect(energyAtLevel(5000, 15, 1)).toBe(5000);
});
it("reveals levels sequentially, stops at five, and pauses when conditions change", async () => {
  vi.useFakeTimers();
  const host = document.createElement("div"),
    root = createRoot(host);
  const render = (eff) =>
    act(() => root.render(<EnergyDepthStudy p={{ energy: 10000, eff }} />));
  const btn = (t) =>
    [...host.querySelectorAll("button")].find((b) => b.textContent === t);
  try {
    await render(10);
    await act(() => btn("逐级延长").click());
    expect(host.querySelectorAll("li")).toHaveLength(2);
    for (let i = 0; i < 3; i++) await act(() => vi.advanceTimersByTime(1600));
    expect(host.querySelectorAll("li")).toHaveLength(5);
    expect(btn("暂停延长")).toBeUndefined();
    expect(host.querySelector(".energy-depth-result strong").textContent).toBe(
      "1 kJ",
    );
    await act(() => btn("逐级延长").click());
    await render(20);
    await act(() => vi.advanceTimersByTime(5000));
    expect(host.querySelectorAll("li")).toHaveLength(2);
    await act(() => btn("5 个营养级").click());
    expect(host.querySelector(".energy-depth-result strong").textContent).toBe(
      "16 kJ",
    );
  } finally {
    await act(() => root.unmount());
    vi.useRealTimers();
  }
});
