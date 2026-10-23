// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { it, expect, vi } from "vitest";
import LongitudeTime, { longitudeTime } from "../src/LongitudeTime.jsx";
import { daynightState } from "../src/models.mjs";
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
it("east is ahead and midnight carries a relative date without treating 24 as the same date as 0", () => {
  expect(longitudeTime(9, 45)).toEqual({ hour: 12, label: "12:00", day: 0 });
  expect(longitudeTime(23, 45)).toEqual({ hour: 2, label: "02:00", day: 1 });
  expect(longitudeTime(1, -45)).toEqual({ hour: 22, label: "22:00", day: -1 });
  expect(longitudeTime(24, 45)).toEqual({ hour: 3, label: "03:00", day: 0 });
  expect(longitudeTime(24, -45)).toEqual({ hour: 21, label: "21:00", day: -1 });
  for (const hour of [0, 6, 12, 18, 24])
    for (const lon of [-180, -90, 0, 45, 180]) {
      const q = longitudeTime(hour, lon);
      expect(q.hour).toBeGreaterThanOrEqual(0);
      expect(q.hour).toBeLessThan(24);
      expect(daynightState(q.hour, 30).altitude).toBeCloseTo(
        daynightState(hour + lon / 15, 30).altitude,
        10,
      );
    }
});
it("longitude choices pause through shared change and B-noon updates the reference time", async () => {
  const host = document.createElement("div"),
    root = createRoot(host),
    change = vi.fn();
  try {
    await act(() =>
      root.render(<LongitudeTime p={{ hour: 9, lat: 30 }} onChange={change} />),
    );
    const btn = (t) =>
      [...host.querySelectorAll("button")].find((b) => b.textContent === t);
    expect(
      host.querySelectorAll(".longitude-clocks strong")[1].textContent,
    ).toBe("12:00");
    await act(() => btn("向西 90°").click());
    expect(change).toHaveBeenLastCalledWith("hour", 9);
    expect(
      host.querySelectorAll(".longitude-clocks strong")[1].textContent,
    ).toBe("03:00");
    await act(() => btn("让 B 到正午").click());
    expect(change).toHaveBeenLastCalledWith("hour", 18);
    await act(() => btn("同一经线").click());
    expect(host.querySelector("svg").textContent).toContain("A=B");
  } finally {
    await act(() => root.unmount());
  }
});
