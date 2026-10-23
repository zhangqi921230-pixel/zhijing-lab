// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { it, expect, vi } from "vitest";
import { daynightState, calculate } from "../src/models.mjs";
import DaylightObserver from "../src/DaylightObserver.jsx";
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
it("equinox model matches horizon crossings, noon and periodicity at all supported latitudes", () => {
  for (let lat = -70; lat <= 70; lat += 10) {
    expect(daynightState(6, lat).phase).toBe("horizon");
    expect(daynightState(18, lat).phase).toBe("horizon");
    expect(daynightState(12, lat).altitude).toBeCloseTo(90 - Math.abs(lat));
    expect(daynightState(0, lat).altitude).toBeCloseTo(
      daynightState(24, lat).altitude,
    );
    expect(daynightState(9, lat).phase).toBe("day");
    expect(daynightState(21, lat).phase).toBe("night");
  }
});
it("shortcut and keyboard share the existing hour parameter", async () => {
  const host = document.createElement("div"),
    root = createRoot(host),
    change = vi.fn();
  try {
    await act(() =>
      root.render(
        <DaylightObserver p={{ hour: 6, lat: 30 }} onChange={change} />,
      ),
    );
    expect(host.textContent).toContain("晨昏交界");
    await act(() =>
      [...host.querySelectorAll("button")]
        .find((b) => b.textContent.includes("正午"))
        .click(),
    );
    expect(change).toHaveBeenLastCalledWith("hour", 12);
    await act(() =>
      host
        .querySelector("[role=slider]")
        .dispatchEvent(
          new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }),
        ),
    );
    expect(change).toHaveBeenLastCalledWith("hour", 6.25);
  } finally {
    await act(() => root.unmount());
  }
});
