// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { expect, it, vi } from "vitest";
import UnitCircle from "../src/UnitCircle.jsx";

it("单位圆支持键盘端点，取消或丢失捕获后不再拖动，忽略右键", async () => {
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  const host = document.createElement("div"),
    root = createRoot(host),
    change = vi.fn();
  const p = { type: 1, a: 1, k: 1, shift: 0, b: 0, probe: 0 };
  document.body.append(host);
  try {
    await act(() => root.render(<UnitCircle p={p} onChange={change} />));
    const svg = host.querySelector("svg");
    svg.getBoundingClientRect = () => ({
      left: 10,
      top: 20,
      width: 240,
      height: 240,
    });
    svg.setPointerCapture = vi.fn();
    const key = async (value, extra = {}) => {
      await act(() =>
        svg.dispatchEvent(
          new KeyboardEvent("keydown", {
            key: value,
            bubbles: true,
            cancelable: true,
            ...extra,
          }),
        ),
      );
    };
    await key("ArrowRight");
    expect(change).toHaveBeenLastCalledWith("probe", 0.1);
    await key("ArrowLeft", { shiftKey: true });
    expect(change).toHaveBeenLastCalledWith("probe", -0.5);
    await key("End");
    expect(change).toHaveBeenLastCalledWith("probe", 5);
    await key("Home");
    expect(change).toHaveBeenLastCalledWith("probe", -5);
    const pointer = async (type, x = 130, y = 60, button = 0) => {
      const event = new MouseEvent(type, {
        bubbles: true,
        clientX: x,
        clientY: y,
        button,
      });
      Object.defineProperties(event, {
        pointerId: { value: 1 },
        isPrimary: { value: true },
      });
      await act(() => svg.dispatchEvent(event));
    };
    change.mockClear();
    await pointer("pointerdown", 130, 60, 2);
    expect(change).not.toHaveBeenCalled();
    await pointer("pointerdown");
    expect(change).toHaveBeenLastCalledWith("probe", Math.PI / 2);
    await pointer("pointercancel");
    change.mockClear();
    await pointer("pointermove", 50, 140);
    expect(change).not.toHaveBeenCalled();
    await pointer("pointerdown");
    await pointer("lostpointercapture");
    change.mockClear();
    await pointer("pointermove", 50, 140);
    expect(change).not.toHaveBeenCalled();
    await act(() =>
      root.render(<UnitCircle p={{ ...p, k: 0 }} onChange={change} />),
    );
    await key("ArrowRight");
    await pointer("pointerdown");
    expect(change).not.toHaveBeenCalled();
    expect(svg.getAttribute("aria-disabled")).toBe("true");
  } finally {
    await act(() => root.unmount());
    host.remove();
  }
});
