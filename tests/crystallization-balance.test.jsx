// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { it, expect, vi } from "vitest";
import CrystallizationBalance, {
  crystallizationBalance,
} from "../src/CrystallizationBalance.jsx";
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
it("separates initial undissolved solid from additional crystals and conserves mass", () => {
  const q = crystallizationBalance({ mass: 180, water: 100, temp: 20 }, 60);
  expect(q.initialSolid).toBe(70);
  expect(q.solid).toBeCloseTo(148.4);
  expect(q.change).toBeCloseTo(78.4);
  expect(q.dissolved + q.solid).toBe(180);
  expect(q.initialDissolved - q.dissolved).toBeCloseTo(q.change);
  const hot = crystallizationBalance({ mass: 180, water: 100, temp: 60 }, 20);
  expect(hot.change).toBeCloseTo(-q.change);
  expect(
    crystallizationBalance({ mass: 10, water: 100, temp: 20 }, 60).change,
  ).toBe(0);
});
it("captures a state, pauses through the existing callback, and retains it during temperature changes", async () => {
  const host = document.createElement("div"),
    root = createRoot(host),
    change = vi.fn();
  const render = (p) =>
    act(() =>
      root.render(
        <CrystallizationBalance
          key={`${p.mass}-${p.water}`}
          p={p}
          onChange={change}
        />,
      ),
    );
  try {
    await render({ mass: 180, water: 100, temp: 60 });
    await act(() => host.querySelector("button").click());
    expect(change).toHaveBeenCalledWith("temp", 60);
    await render({ mass: 180, water: 100, temp: 20 });
    expect(host.textContent).toContain("78.40 g");
    expect(host.textContent).toContain("70.00 + 78.40 = 148.40 g");
    await render({ mass: 180, water: 200, temp: 20 });
    expect(host.textContent).toContain("尚未设置起点");
    await render({ mass: 0, water: 100, temp: 20 });
    await act(() => host.querySelector("button").click());
    expect(host.textContent).toContain("两条质量条为空");
  } finally {
    await act(() => root.unmount());
  }
});
