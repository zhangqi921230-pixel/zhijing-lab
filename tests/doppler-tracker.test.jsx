// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { it, expect, vi } from "vitest";
import MotionScene from "../src/MotionScene.jsx";
import DopplerTracker from "../src/DopplerTracker.jsx";
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
it("tracked wave retains its emitted center as radius grows with age", async () => {
  const host = document.createElement("div"),
    root = createRoot(host);
  try {
    for (const mach of [-0.75, 0, 0.75])
      for (const frequency of [0.5, 1, 2]) {
        const p = { mach, frequency },
          selectedPoint = 1,
          born = 1 / frequency;
        let previous;
        for (const age of [0, 1, 2]) {
          await act(() =>
            root.render(
              <MotionScene
                id="doppler"
                p={p}
                time={born + age}
                selectedPoint={selectedPoint}
              />,
            ),
          );
          const circle = host.querySelector(
            '[data-testid="tracked-wavefront"]',
          );
          expect(+circle.getAttribute("cx")).toBeCloseTo(
            440 + 2 * mach * born * 24,
          );
          expect(+circle.getAttribute("r")).toBeCloseTo(2 * age * 24);
          if (previous !== undefined)
            expect(circle.getAttribute("cx")).toBe(previous);
          previous = circle.getAttribute("cx");
        }
      }
  } finally {
    await act(() => root.unmount());
  }
});
it("time shortcuts stay within shared duration and handle a not-yet-emitted wave", async () => {
  const host = document.createElement("div"),
    root = createRoot(host),
    onSeek = vi.fn();
  try {
    await act(() =>
      root.render(
        <DopplerTracker
          p={{ mach: 0.4, frequency: 0.5 }}
          time={3}
          selected={3}
          onSelect={() => {}}
          onSeek={onSeek}
        />,
      ),
    );
    expect(host.textContent).toContain("尚未发射");
    const buttons = [...host.querySelectorAll("button")];
    expect(
      buttons.find((b) => b.textContent === "观察发射后 1 秒").disabled,
    ).toBe(true);
    await act(() =>
      buttons.find((b) => b.textContent === "定位发射瞬间").click(),
    );
    expect(onSeek).toHaveBeenCalledWith(6);
  } finally {
    await act(() => root.unmount());
  }
});
