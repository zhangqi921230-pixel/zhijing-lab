// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { it, expect, vi } from "vitest";
import BuoyancyWeighing from "../src/BuoyancyWeighing.jsx";
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
it("compares matching air and immersed readings and offers four precise observation positions", async () => {
  const host = document.createElement("div"),
    root = createRoot(host),
    onSeek = vi.fn();
  const p = { volume: 300, bodyDensity: 2000, liquidDensity: 1000 };
  try {
    await act(() =>
      root.render(<BuoyancyWeighing p={p} time={3} onSeek={onSeek} />),
    );
    expect(
      [...host.querySelectorAll(".weighing-readings strong")].map(
        (e) => e.textContent,
      ),
    ).toEqual(["5.88 N", "4.41 N", "1.47 N"]);
    expect(host.querySelector(".weighing-bar b").style.width).toBe("25%");
    for (const [i, t] of [0, 3, 4, 6].entries()) {
      await act(() => host.querySelectorAll("button")[i].click());
      expect(onSeek).toHaveBeenLastCalledWith(t);
    }
    await act(() =>
      root.render(
        <BuoyancyWeighing
          p={{ ...p, bodyDensity: 3000 }}
          time={4}
          onSeek={onSeek}
        />,
      ),
    );
    expect(
      [...host.querySelectorAll(".weighing-readings strong")].map(
        (e) => e.textContent,
      ),
    ).toEqual(["8.82 N", "5.88 N", "2.94 N"]);
  } finally {
    await act(() => root.unmount());
  }
});
