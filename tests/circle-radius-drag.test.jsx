// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { expect, it, vi } from "vitest";
import CircleScene from "../src/CircleScene.jsx";

it("keeps the limit reference area equal to the circle and hides it during rearrangement", async () => {
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  const host = document.createElement("div"),
    root = createRoot(host);
  try {
    for (const radius of [1, 2.8, 5]) {
      await act(() =>
        root.render(
          <CircleScene
            p={{ r: radius, parts: 16, rearrange: 100, limitRectangle: 1 }}
            onChange={() => {}}
          />,
        ),
      );
      const rectangle = host.querySelector(".circle-limit-reference rect");
      const area =
        (Number(rectangle.getAttribute("width")) *
          Number(rectangle.getAttribute("height"))) /
        (23 * 23);
      expect(area).toBeCloseTo(Math.PI * radius * radius, 10);
      expect(host.textContent).toContain("不是当前拼图的边界");
      const cordSegments = host.querySelectorAll(".circle-cord > line"),
        diameterSegments = host.querySelectorAll(".circle-diameter-ruler rect");
      const cordLength =
        Number(cordSegments[cordSegments.length - 1].getAttribute("x2")) -
        Number(cordSegments[0].getAttribute("x1"));
      expect(diameterSegments.length).toBe(3);
      for (const segment of diameterSegments)
        expect(cordLength / Number(segment.getAttribute("width"))).toBeCloseTo(
          Math.PI,
          12,
        );
    }
    await act(() =>
      root.render(
        <CircleScene
          p={{ r: 3, parts: 16, rearrange: 50, limitRectangle: 1 }}
          onChange={() => {}}
        />,
      ),
    );
    expect(host.querySelector(".circle-limit-reference")).toBeNull();
    expect(host.textContent).toContain("拼合完成后显示极限参照");
  } finally {
    await act(() => root.unmount());
  }
});

it.each([
  [0, 12],
  [1, 23],
])(
  "maps chapter %s circle dragging to centimetres, clamps and ends cancelled input",
  async (chapter, unitScale) => {
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
          <CircleScene
            chapter={chapter}
            p={{ r: 3, parts: 16, rearrange: 50 }}
            onChange={change}
          />,
        ),
      );
      host.querySelector("svg").getScreenCTM = () => ({ inverse: () => ({}) });
      const handle = host.querySelector('[role="slider"]');
      handle.setPointerCapture = vi.fn();
      handle.releasePointerCapture = vi.fn();
      const send = async (type, x, button = 0) => {
        const event = new MouseEvent(type, {
          bubbles: true,
          clientX: x,
          button,
        });
        Object.defineProperty(event, "pointerId", { value: 1 });
        await act(() => handle.dispatchEvent(event));
      };
      await send("pointerdown", 600, 2);
      expect(change).not.toHaveBeenCalled();
      await send("pointerdown", 20 + 2 * (240 + unitScale * 4.2));
      expect(change).toHaveBeenLastCalledWith("r", 4.2);
      await send("pointermove", 2000);
      expect(change).toHaveBeenLastCalledWith("r", 5);
      await send("pointermove", 0);
      expect(change).toHaveBeenLastCalledWith("r", 1);
      await send("pointercancel", 0);
      change.mockClear();
      await send("pointermove", 700);
      expect(change).not.toHaveBeenCalled();
      for (const [key, value] of [
        ["ArrowRight", 3.1],
        ["ArrowLeft", 2.9],
        ["Home", 1],
        ["End", 5],
      ]) {
        await act(() =>
          handle.dispatchEvent(
            new KeyboardEvent("keydown", { bubbles: true, key }),
          ),
        );
        expect(change).toHaveBeenLastCalledWith("r", value);
      }
    } finally {
      await act(() => root.unmount());
      vi.unstubAllGlobals();
    }
  },
);
