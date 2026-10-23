// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { it, expect, vi } from "vitest";
import LatitudeDayBands, { latitudeBands } from "../src/LatitudeDayBands.jsx";
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
it("bands retain equatorial twelve hours and opposite seasonal polar extremes", () => {
  for (const day of [0, 91, 183, 274, 365]) {
    const r = latitudeBands(day);
    expect(r[2].daylight).toBeCloseTo(12);
    expect(r[0].daylight + r[4].daylight).toBeCloseTo(24);
    expect(r[1].daylight + r[3].daylight).toBeCloseTo(24);
  }
  expect(latitudeBands(91)[0].daylight).toBe(24);
  expect(latitudeBands(91)[4].daylight).toBe(0);
  expect(latitudeBands(274)[0].daylight).toBe(0);
});
it("date and latitude buttons only change the requested shared parameter", async () => {
  const host = document.createElement("div"),
    root = createRoot(host),
    change = vi.fn();
  try {
    await act(() =>
      root.render(
        <LatitudeDayBands p={{ day: 91, lat: 70 }} onChange={change} />,
      ),
    );
    const button = (t) =>
      [...host.querySelectorAll("button")].find((b) => b.textContent === t);
    await act(() => button("观察南纬70°").click());
    expect(change).toHaveBeenLastCalledWith("lat", -70);
    await act(() => button("北半球冬至附近").click());
    expect(change).toHaveBeenLastCalledWith("day", 274);
    expect(host.textContent).toContain("极昼");
    expect(host.textContent).toContain("极夜");
  } finally {
    await act(() => root.unmount());
  }
});
