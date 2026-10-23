// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { it, expect, vi } from "vitest";
import { isothermalWork } from "../src/GasWorkStudy.jsx";
import { GAS_R, gasState } from "../src/explorationModels.mjs";
import ExplorationLab from "../src/ExplorationLab.jsx";
import { explorations } from "../src/explorations.mjs";
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
it("isothermal work has the proper sign, units and reversal", () => {
  const p = { temperature: 300, amount: 0.5, volume: 10 };
  expect(isothermalWork(p)).toBeCloseTo(-864.471948, 4);
  expect(isothermalWork({ ...p, volume: 20 }, 10)).toBeCloseTo(
    -isothermalWork(p),
  );
  expect(isothermalWork({ ...p, volume: 20 })).toBe(0);
  const low = 10,
    high = 20,
    steps = 10000,
    dV = (high - low) / steps;
  const integral = Array.from(
    { length: steps },
    (_, i) => gasState({ ...p, volume: low + (i + 0.5) * dV }).pressure * dV,
  ).reduce((a, b) => a + b, 0);
  expect(integral).toBeCloseTo(0.5 * GAS_R * 300 * Math.log(2), 5);
});
it("compression ends at 10 L with constant n and T, and chapter changes cancel it", async () => {
  vi.useFakeTimers();
  Object.defineProperty(document, "hidden", {
    configurable: true,
    value: false,
  });
  const host = document.createElement("div"),
    root = createRoot(host);
  const button = (name) =>
    [...host.querySelectorAll("button")].find((b) => b.textContent === name);
  try {
    await act(() =>
      root.render(
        <ExplorationLab
          lesson={explorations.find((x) => x.id === "gas")}
          open={() => {}}
          goHome={() => {}}
        />,
      ),
    );
    await act(() =>
      host.querySelectorAll('[aria-label="学习子主题"] button')[4].click(),
    );
    await act(() => button("演示 20 → 10 L 恒温压缩").click());
    await act(() => vi.advanceTimersByTime(2000));
    expect(host.querySelector('[aria-label="气体体积"]').value).toBe("15");
    await act(() => vi.advanceTimersByTime(2000));
    expect(host.querySelector('[aria-label="气体体积"]').value).toBe("10");
    expect(host.textContent).toContain("-864.5 J");
    expect(host.textContent).toContain("300 K、0.5 mol");
    await act(() => button("演示 20 → 10 L 恒温压缩").click());
    await act(() =>
      host.querySelectorAll('[aria-label="学习子主题"] button')[0].click(),
    );
    await act(() => vi.advanceTimersByTime(5000));
    expect(host.querySelector('[aria-label="气体体积"]').value).toBe("20");
  } finally {
    await act(() => root.unmount());
    expect(vi.getTimerCount()).toBe(0);
    vi.useRealTimers();
  }
});
