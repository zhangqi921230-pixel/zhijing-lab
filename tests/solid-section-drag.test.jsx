// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { expect, it, vi } from "vitest";
import SolidAxialSection from "../src/SolidAxialSection.jsx";
import { solidAxialLayout } from "../src/solidAxialLayout.mjs";

it("maps a scaled axial diagram to section height and stops on cancellation", async () => {
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  const host = document.createElement("div"),
    root = createRoot(host),
    change = vi.fn();
  vi.stubGlobal(
    "DOMPoint",
    class {
      constructor(x, y) {
        this.x = x;
        this.y = y;
      }
      matrixTransform() {
        return { x: this.x / 2, y: (this.y - 20) / 2 };
      }
    },
  );
  try {
    await act(() =>
      root.render(
        <SolidAxialSection
          radius={1.2}
          height={2.5}
          fraction={0.5}
          onChange={change}
        />,
      ),
    );
    host.querySelector("svg").getScreenCTM = () => ({ inverse: () => ({}) });
    const handle = host.querySelector('[role="slider"]');
    handle.setPointerCapture = vi.fn();
    handle.releasePointerCapture = vi.fn();
    const send = async (type, y, button = 0) => {
      const e = new MouseEvent(type, { bubbles: true, clientY: y, button });
      Object.defineProperty(e, "pointerId", { value: 1 });
      await act(() => handle.dispatchEvent(e));
    };
    await send("pointerdown", 200, 2);
    expect(change).not.toHaveBeenCalled();
    const { h } = solidAxialLayout(1.2, 2.5, 0.5);
    await send("pointerdown", 20 + 2 * (185 - h * 0.75));
    expect(change).toHaveBeenLastCalledWith("slice", 75);
    await send("pointermove", -100);
    expect(change).toHaveBeenLastCalledWith("slice", 100);
    await send("pointercancel", -100);
    change.mockClear();
    await send("pointermove", 500);
    expect(change).not.toHaveBeenCalled();
    for (const [key, value] of [
      ["Home", 0],
      ["End", 100],
      ["ArrowUp", 51],
      ["ArrowDown", 49],
    ]) {
      await act(() =>
        handle.dispatchEvent(
          new KeyboardEvent("keydown", { key, bubbles: true }),
        ),
      );
      expect(change).toHaveBeenLastCalledWith("slice", value);
    }
  } finally {
    await act(() => root.unmount());
    vi.unstubAllGlobals();
  }
});
