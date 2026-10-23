// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { it, expect, vi } from "vitest";
import LensScreenCheck from "../src/LensScreenCheck.jsx";
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
it("screen comparisons change only screen and disable targets outside travel", async () => {
  const host = document.createElement("div"),
    root = createRoot(host),
    prepare = vi.fn();
  try {
    await act(() =>
      root.render(
        <LensScreenCheck
          p={{ u: 30, f: 10, screen: 15 }}
          onPrepare={prepare}
          screenControl={{ min: 5, max: 16 }}
        />,
      ),
    );
    const buttons = [...host.querySelectorAll("button")];
    expect(buttons[2].disabled).toBe(true);
    await act(() => buttons[0].click());
    expect(prepare.mock.calls).toEqual([[{ screen: 13 }]]);
    await act(() => buttons[1].click());
    expect(prepare).toHaveBeenLastCalledWith({ screen: 15 });
  } finally {
    await act(() => root.unmount());
  }
});
it("virtual, focal and unreachable images never offer invalid screen placement", async () => {
  const host = document.createElement("div"),
    root = createRoot(host);
  try {
    for (const u of [6, 10, 10.1]) {
      await act(() =>
        root.render(
          <LensScreenCheck
            p={{ u, f: 10, screen: 15 }}
            onPrepare={() => {}}
            screenControl={{ min: 5, max: 60 }}
          />,
        ),
      );
      expect(host.querySelectorAll("button")).toHaveLength(0);
    }
  } finally {
    await act(() => root.unmount());
  }
});
