// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { it, expect, vi } from "vitest";
import MoonCycle from "../src/MoonCycle.jsx";
import { moonState } from "../src/explorationModels.mjs";
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
it("opposite quarters share illumination but not waxing direction", () => {
  expect(moonState(90).fraction).toBeCloseTo(0.5);
  expect(moonState(270).fraction).toBeCloseTo(0.5);
  expect(moonState(90).name).not.toBe(moonState(270).name);
});
it("all eight phase buttons seek the shared angle parameter and cycle endpoint is new moon", async () => {
  const host = document.createElement("div"),
    root = createRoot(host),
    change = vi.fn();
  try {
    await act(() => root.render(<MoonCycle angle={360} onChange={change} />));
    expect(
      host.querySelector("button[aria-pressed=true]").textContent,
    ).toContain("新月");
    expect(host.textContent).toContain("新一轮起点");
    const buttons = [...host.querySelectorAll("button")];
    expect(buttons).toHaveLength(8);
    for (let i = 0; i < 8; i++) {
      await act(() => buttons[i].click());
      expect(change).toHaveBeenLastCalledWith("angle", i * 45);
    }
  } finally {
    await act(() => root.unmount());
  }
});
