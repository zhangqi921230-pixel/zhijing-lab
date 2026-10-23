// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { it, expect, vi } from "vitest";
import WaterBudgetFlow from "../src/WaterBudgetFlow.jsx";
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
it("pauses offscreen and in background, respects changed motion preference, and cleans listeners", async () => {
  const host = document.createElement("div"),
    root = createRoot(host);
  let intersection, preference;
  const disconnect = vi.fn(),
    remove = vi.fn();
  const media = {
    matches: false,
    addEventListener: vi.fn((_, fn) => {
      preference = fn;
    }),
    removeEventListener: remove,
  };
  vi.stubGlobal("matchMedia", () => media);
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      constructor(fn) {
        intersection = fn;
      }
      observe() {}
      disconnect() {
        disconnect();
      }
    },
  );
  const hidden = vi.spyOn(document, "hidden", "get").mockReturnValue(false);
  const animation = () =>
    [...host.querySelectorAll(".water-flow-direction")].map(
      (e) => e.style.animationPlayState,
    );
  const toggle = () => host.querySelector(".water-flow-actions button");
  try {
    await act(() =>
      root.render(<WaterBudgetFlow p={{ rain: 100, infil: 40, evap: 10 }} />),
    );
    expect(animation()).toEqual(["paused", "paused", "paused"]);
    await act(() => {
      intersection([{ isIntersecting: true }]);
      toggle().click();
    });
    expect(animation()).toEqual(["running", "running", "running"]);
    await act(() => intersection([{ isIntersecting: false }]));
    expect(animation()).toEqual(["paused", "paused", "paused"]);
    await act(() => intersection([{ isIntersecting: true }]));
    expect(animation()[0]).toBe("running");
    await act(() => {
      hidden.mockReturnValue(true);
      document.dispatchEvent(new Event("visibilitychange"));
    });
    expect(animation()[0]).toBe("paused");
    await act(() => {
      hidden.mockReturnValue(false);
      document.dispatchEvent(new Event("visibilitychange"));
    });
    expect(animation()[0]).toBe("running");
    await act(() => {
      media.matches = true;
      preference();
    });
    expect(toggle().disabled).toBe(true);
    expect(toggle().textContent).toContain("系统已减少动态效果");
    expect(animation()[0]).toBe("paused");
    await act(() => {
      media.matches = false;
      preference();
    });
    expect(toggle().disabled).toBe(false);
    expect(animation()[0]).toBe("paused");
    await act(() =>
      root.render(<WaterBudgetFlow p={{ rain: 0, infil: 40, evap: 10 }} />),
    );
    expect(animation()).toHaveLength(0);
  } finally {
    await act(() => root.unmount());
    vi.unstubAllGlobals();
    hidden.mockRestore();
  }
  expect(disconnect).toHaveBeenCalledOnce();
  expect(remove).toHaveBeenCalledWith("change", preference);
});
