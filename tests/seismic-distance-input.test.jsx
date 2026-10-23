// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { it, expect, vi } from "vitest";
import SeismicDistanceGuide from "../src/SeismicDistanceGuide.jsx";
it("maps scaled pointers, clamps and cancels both distance handles", async () => {
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  vi.stubGlobal(
    "DOMPoint",
    class {
      constructor(x, y) {
        this.x = x;
        this.y = y;
      }
      matrixTransform() {
        return { x: this.x / 2, y: this.y / 2 };
      }
    },
  );
  const host = document.createElement("div"),
    root = createRoot(host),
    change = vi.fn();
  try {
    await act(() =>
      root.render(
        <SeismicDistanceGuide
          p={{ depth: 15, distance: 40 }}
          onChange={change}
        />,
      ),
    );
    host.querySelector("svg").getScreenCTM = () => ({ inverse: () => ({}) });
    for (const [index, key, x, y, wanted] of [
      [0, "depth", 45, 36 + 22 * 3.125, 22],
      [1, "distance", 45 + 65 * 3.125, 36, 65],
    ]) {
      const handle = host.querySelectorAll('[role="slider"]')[index];
      handle.setPointerCapture = vi.fn();
      handle.releasePointerCapture = vi.fn();
      const send = async (type, x, y) => {
        const e = new MouseEvent(type, {
          bubbles: true,
          clientX: x * 2,
          clientY: y * 2,
          button: 0,
        });
        Object.defineProperty(e, "pointerId", { value: 1 });
        await act(() => handle.dispatchEvent(e));
      };
      await send("pointerdown", x, y);
      expect(change).toHaveBeenLastCalledWith(key, wanted);
      await send("pointermove", 2000, 2000);
      expect(change).toHaveBeenLastCalledWith(key, index ? 80 : 30);
      await send("pointercancel", 0, 0);
      change.mockClear();
      await send("pointermove", 0, 0);
      expect(change).not.toHaveBeenCalled();
      await act(() =>
        handle.dispatchEvent(
          new KeyboardEvent("keydown", { bubbles: true, key: "Home" }),
        ),
      );
      expect(change).toHaveBeenLastCalledWith(key, index ? 10 : 5);
    }
  } finally {
    await act(() => root.unmount());
    vi.unstubAllGlobals();
  }
});
