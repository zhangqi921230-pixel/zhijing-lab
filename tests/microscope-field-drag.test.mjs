// @vitest-environment jsdom
import { it, expect, vi } from "vitest";
import { installMicroscopeFieldDrag } from "../src/MicroscopeFieldDrag.mjs";

it("image dragging owns one pointer, preserves inverse motion and cancels interrupted gestures", () => {
  const canvas = document.createElement("canvas");
  document.body.append(canvas);
  let width = 280;
  canvas.getBoundingClientRect = () => ({ width });
  const captured = new Set();
  canvas.setPointerCapture = (id) => captured.add(id);
  canvas.hasPointerCapture = (id) => captured.has(id);
  canvas.releasePointerCapture = (id) => captured.delete(id);
  const onChange = vi.fn();
  const current = {
    p: { x: 0, y: 0, specimen: 1 },
    zoom: 1,
    source: null,
    onChange,
  };
  const dispose = installMicroscopeFieldDrag(canvas, () => current);
  const event = (type, id = 1, x = 0, y = 0, button = 0) => {
    const e = new MouseEvent(type, {
      clientX: x,
      clientY: y,
      button,
      cancelable: true,
    });
    Object.defineProperty(e, "pointerId", { value: id });
    canvas.dispatchEvent(e);
  };
  try {
    event("pointerdown", 1, 0, 0, 2);
    event("pointermove", 1, 20, 10);
    expect(onChange).not.toHaveBeenCalled();
    event("pointerdown");
    event("pointerdown", 2, 100, 100);
    event("pointermove", 2, 200, 200);
    event("pointercancel", 2);
    expect(onChange).not.toHaveBeenCalled();
    event("pointermove", 1, 20, 10);
    expect(onChange.mock.calls).toEqual([
      ["x", -20],
      ["y", 10],
    ]);
    event("pointermove", 1, 500, -500);
    expect(onChange.mock.calls.slice(-2)).toEqual([
      ["x", -40],
      ["y", -40],
    ]);
    event("pointerup");
    expect(captured.size).toBe(0);
    for (const stop of [
      () => event("pointercancel"),
      () => event("lostpointercapture"),
      () => window.dispatchEvent(new Event("blur")),
      () => {
        current.zoom = 4;
      },
      () => {
        current.p.specimen = 2;
      },
      () => {
        current.source = {};
      },
      () => {
        width = 420;
      },
    ]) {
      event("pointerdown");
      stop();
      onChange.mockClear();
      event("pointermove", 1, 30, 30);
      expect(onChange).not.toHaveBeenCalled();
      expect(captured.size).toBe(0);
    }
    // Fourfold magnification reduces the slide displacement needed for a drag.
    width = 280;
    event("pointerdown");
    event("pointermove", 1, 20, 12);
    expect(onChange.mock.calls).toEqual([
      ["x", -5],
      ["y", 3],
    ]);
    dispose();
    onChange.mockClear();
    event("pointermove", 1, 100, 100);
    event("pointerdown");
    expect(onChange).not.toHaveBeenCalled();
    expect(captured.size).toBe(0);
  } finally {
    dispose();
    canvas.remove();
  }
});
