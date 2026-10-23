// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { it, expect, vi } from "vitest";
import SeasonCalendar, { seasonDayAt } from "../src/SeasonCalendar.jsx";
import { solar } from "../src/models.mjs";
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
it("symmetric latitude daylight sums to one day throughout the orbit", () => {
  for (let d = 0; d <= 365; d += 5)
    for (const lat of [0, 30, 60, 70, 80])
      expect(solar(d, lat).daylight + solar(d, -lat).daylight).toBeCloseTo(
        24,
        10,
      );
  expect(solar(0, 60).daylight).toBeCloseTo(12);
  expect(solar(0, 60).noon).toBeCloseTo(30);
});
it("maps plot edges to valid days", () => {
  expect(seasonDayAt(-100, { left: 0, width: 400 })).toBe(0);
  expect(seasonDayAt(1000, { left: 0, width: 400 })).toBe(365);
  expect(seasonDayAt(211, { left: 0, width: 400 })).toBe(183);
});
it("keyboard changes orbital day and polar-night explanation matches the model", async () => {
  const host = document.createElement("div"),
    root = createRoot(host),
    change = vi.fn();
  try {
    await act(() =>
      root.render(
        <SeasonCalendar p={{ day: 274, lat: 80 }} onChange={change} />,
      ),
    );
    const bars = host.querySelectorAll(".season-daybar i");
    expect(bars).toHaveLength(2);
    expect(bars[0].style.width).toBe("0%");
    expect(bars[1].style.width).toBe("100%");
    expect(host.textContent).toContain("极夜");
    expect(host.textContent).toContain("地平线以下");
    await act(() =>
      host
        .querySelector("[role=slider]")
        .dispatchEvent(
          new KeyboardEvent("keydown", { key: "Home", bubbles: true }),
        ),
    );
    expect(change).toHaveBeenLastCalledWith("day", 0);
  } finally {
    await act(() => root.unmount());
  }
});
