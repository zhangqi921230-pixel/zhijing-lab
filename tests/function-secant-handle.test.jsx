// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { expect, it, vi } from "vitest";
import FunctionStudio from "../src/FunctionStudio.jsx";

it("Q moves independently of P with screen conversion, shared step, bounds and cancellation", async () => {
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
        return { x: (this.x - 20) / 2, y: this.y / 2 };
      }
    },
  );
  try {
    await act(() =>
      root.render(
        <FunctionStudio
          p={{
            type: 0,
            a: 1,
            k: 1,
            b: 0,
            shift: 0,
            probe: 1,
            dx: 1,
            analysis: 1,
          }}
          onChange={change}
        />,
      ),
    );
    host.querySelector("svg").getScreenCTM = () => ({ inverse: () => ({}) });
    const handle = host.querySelector('[aria-label="拖动 Q 点调整两点间距"]');
    handle.setPointerCapture = vi.fn();
    const pointer = async (type, q, button = 0) => {
      const e = new MouseEvent(type, {
        bubbles: true,
        button,
        clientX: 20 + 2 * (310 + (q * 230) / 6),
        clientY: 300,
      });
      Object.defineProperty(e, "pointerId", { value: 1 });
      await act(() => handle.dispatchEvent(e));
    };
    await pointer("pointerdown", 2, 2);
    await pointer("pointermove", 1.5);
    expect(change).not.toHaveBeenCalled();
    await pointer("pointerdown", 2);
    await pointer("pointermove", 1.25);
    expect(change).toHaveBeenLastCalledWith("dx", 0.25);
    await pointer("pointermove", 0.95);
    expect(change).toHaveBeenLastCalledWith("dx", -0.05);
    await pointer("pointermove", 100);
    expect(change).toHaveBeenLastCalledWith("dx", 3);
    await pointer("pointercancel", 100);
    change.mockClear();
    await pointer("pointermove", 2);
    expect(change).not.toHaveBeenCalled();
    for (const [key, value] of [
      ["ArrowLeft", 0.95],
      ["Home", -3],
      ["End", 3],
    ]) {
      await act(() =>
        handle.dispatchEvent(
          new KeyboardEvent("keydown", { key, bubbles: true }),
        ),
      );
      expect(change).toHaveBeenLastCalledWith("dx", value);
    }
    expect(change.mock.calls.every(([key]) => key === "dx")).toBe(true);
  } finally {
    await act(() => root.unmount());
    vi.unstubAllGlobals();
  }
});

it("keeps the captured Q handle through undefined and offscreen positions so a drag can return", async () => {
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
        return this;
      }
    },
  );
  const render = async (dx) =>
    act(() =>
      root.render(
        <FunctionStudio
          p={{ type: 3, a: 1, k: 1, b: 0, shift: 0, probe: 1, dx, analysis: 1 }}
          onChange={change}
        />,
      ),
    );
  try {
    await render(1);
    host.querySelector("svg").getScreenCTM = () => ({ inverse: () => ({}) });
    const handle = host.querySelector('[aria-label="拖动 Q 点调整两点间距"]');
    handle.setPointerCapture = vi.fn();
    const send = async (type, x) => {
      const event = new MouseEvent(type, {
        bubbles: true,
        button: 0,
        clientX: 310 + (x * 230) / 6,
        clientY: 290,
      });
      Object.defineProperty(event, "pointerId", { value: 2 });
      await act(() => handle.dispatchEvent(event));
    };
    await send("pointerdown", 2);
    expect(change).toHaveBeenLastCalledWith("dx", 1); // Pause scanning before motion.
    for (const dx of [-1, -0.95]) {
      await render(dx); // Q at the singularity, then above the visible plot.
      expect(host.querySelector('[aria-label="拖动 Q 点调整两点间距"]')).toBe(
        handle,
      );
      expect(handle.getAttribute("visibility")).toBe("hidden");
      expect(handle.getAttribute("tabindex")).toBe("-1");
    }
    await send("pointermove", -0.5);
    expect(change).toHaveBeenLastCalledWith("dx", -1.5);
    await render(-1.5);
    expect(handle.getAttribute("visibility")).toBe("visible");
    expect(handle.getAttribute("tabindex")).toBe("0");
    await send("pointerup", -0.5);
    change.mockClear();
    await send("pointermove", 1);
    expect(change).not.toHaveBeenCalled();
  } finally {
    await act(() => root.unmount());
    vi.unstubAllGlobals();
  }
});
