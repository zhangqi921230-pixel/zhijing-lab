// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { it, expect, vi } from "vitest";
import FunctionStudio from "../src/FunctionStudio.jsx";

it("drags the actual curve point in graph coordinates and cancels cleanly", async () => {
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  const host = document.createElement("div"),
    root = createRoot(host);
  const change = vi.fn();
  vi.stubGlobal(
    "DOMPoint",
    class {
      constructor(x, y) {
        this.x = x;
        this.y = y;
      }
      matrixTransform() {
        return { x: (this.x - 20) / 2, y: this.y / 2 };
      }
    },
  );
  try {
    await act(() =>
      root.render(
        <FunctionStudio
          p={{ type: 0, a: 1, k: 1, b: 0, shift: 0, probe: 1, analysis: 0 }}
          onChange={change}
        />,
      ),
    );
    const svg = host.querySelector("svg");
    svg.getScreenCTM = () => ({ inverse: () => ({}) });
    svg.setPointerCapture = vi.fn();
    const handle = host.querySelector('[aria-label="曲线上探针横坐标"]');
    handle.setPointerCapture = vi.fn();
    const pointer = async (type, x, button = 0) => {
      const event = new MouseEvent(type, {
        bubbles: true,
        clientX: x,
        clientY: 200,
        button,
      });
      Object.defineProperty(event, "pointerId", { value: 1 });
      await act(() => handle.dispatchEvent(event));
    };
    await pointer("pointerdown", 716, 2);
    await pointer("pointermove", 793);
    expect(change).not.toHaveBeenCalled();
    await pointer("pointerdown", 716);
    await pointer("pointermove", 20 + 2 * (310 + (230 * 2) / 6));
    expect(change).toHaveBeenLastCalledWith("probe", 2);
    await pointer("pointermove", 5000);
    expect(change).toHaveBeenLastCalledWith("probe", 5);
    await pointer("pointercancel", 5000);
    change.mockClear();
    await pointer("pointermove", 700);
    expect(change).not.toHaveBeenCalled();
    await act(() =>
      handle.dispatchEvent(
        new KeyboardEvent("keydown", { key: "ArrowLeft", bubbles: true }),
      ),
    );
    expect(change).toHaveBeenLastCalledWith("probe", 0.9);
    const plotPointer = async (type, x, y = 200) => {
      const event = new MouseEvent(type, {
        bubbles: true,
        clientX: x,
        clientY: y,
        button: 0,
      });
      Object.defineProperty(event, "pointerId", { value: 2 });
      await act(() => svg.dispatchEvent(event));
    };
    change.mockClear();
    await plotPointer("pointerdown", 640, 20);
    expect(change).not.toHaveBeenCalled(); // Header margin is not a plot control.
    await plotPointer("pointerdown", 20 + 2 * (310 - 230 / 6));
    expect(change).toHaveBeenLastCalledWith("probe", -1);
    await plotPointer("pointermove", 20 + 2 * (310 + 230 / 6));
    expect(change).toHaveBeenLastCalledWith("probe", 1);
    await plotPointer("pointerup", 640);
    change.mockClear();
    await plotPointer("pointermove", 800);
    expect(change).not.toHaveBeenCalled();
    await act(() =>
      root.render(
        <FunctionStudio
          p={{ type: 3, a: 1, k: 1, b: 0, shift: 0, probe: 0, analysis: 0 }}
          onChange={change}
          bisection
        />,
      ),
    );
    await plotPointer("pointerdown", 640);
    expect(change).not.toHaveBeenCalled(); // Bisection owns its own controls.
  } finally {
    await act(() => root.unmount());
    vi.unstubAllGlobals();
  }
});
