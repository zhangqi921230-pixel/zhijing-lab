// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { it, expect, vi } from "vitest";
import { photoNet } from "../src/photoNet.mjs";
import { photo } from "../src/models.mjs";
import PhotoNetStudy from "../src/PhotoNetStudy.jsx";
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
const p = { light: 5, co2: 70, temp: 25 };
it("net balances gross and respiration; valid compensation solves the original model", () => {
  for (const co2 of [0, 2, 20, 70, 100])
    for (const temp of [5, 25, 45])
      for (const respiration of [0, 10, 30]) {
        const state = photoNet({ ...p, co2, temp }, respiration);
        expect(state.net + respiration).toBeCloseTo(state.gross);
        if (state.compensation !== null) {
          expect(state.compensation).toBeGreaterThanOrEqual(0);
          expect(state.compensation).toBeLessThanOrEqual(100);
          expect(photo({ light: state.compensation, co2, temp })).toBeCloseTo(
            respiration,
            8,
          );
        } else
          expect(photo({ light: 100, co2, temp })).toBeLessThan(respiration);
      }
  expect(photoNet({ ...p, light: 0 }, 10).net).toBe(-10);
  expect(photoNet({ ...p, light: 80 }, 10).net).toBeGreaterThan(0);
  expect(photoNet({ ...p, co2: 2 }, 10).compensation).toBeNull();
});
it("compensation shortcut pauses scanning and changes only light; impossible compensation is disabled", async () => {
  const host = document.createElement("div"),
    root = createRoot(host),
    change = vi.fn(),
    pause = vi.fn();
  try {
    await act(() =>
      root.render(<PhotoNetStudy p={p} onChange={change} onPause={pause} />),
    );
    await act(() =>
      [...host.querySelectorAll("button")]
        .find((b) => b.textContent === "定位补偿点")
        .click(),
    );
    expect(pause).toHaveBeenCalledOnce();
    expect(change.mock.calls[0][0]).toBe("light");
    expect(photo({ ...p, light: change.mock.calls[0][1] })).toBeCloseTo(10, 8);
    await act(() =>
      root.render(
        <PhotoNetStudy
          p={{ ...p, co2: 2 }}
          onChange={change}
          onPause={pause}
        />,
      ),
    );
    expect(
      [...host.querySelectorAll("button")].find(
        (b) => b.textContent === "定位补偿点",
      ).disabled,
    ).toBe(true);
    expect(host.textContent).toContain("没有补偿点");
  } finally {
    await act(() => root.unmount());
  }
});
