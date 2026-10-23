// @vitest-environment jsdom
import { expect, it, vi } from "vitest";
import { installMicroscopeWheel } from "../src/MicroscopeWheel.mjs";

it("accumulates trackpad motion, uses current settings, bounds focus and releases listeners", () => {
  const canvas = document.createElement("canvas");
  const p = { focus: 50, coarse: 50 };
  const onChange = vi.fn((key, value) => {
    p[key] = value;
  });
  const dispose = installMicroscopeWheel(canvas, () => ({ p, onChange }));
  const wheel = (options) => {
    const event = new WheelEvent("wheel", { cancelable: true, ...options });
    canvas.dispatchEvent(event);
    return event;
  };
  for (let i = 0; i < 3; i++) wheel({ deltaY: -10 });
  expect(onChange).not.toHaveBeenCalled();
  expect(wheel({ deltaY: -10 }).defaultPrevented).toBe(true);
  expect(p.focus).toBe(51);
  wheel({ deltaY: -40 });
  expect(p.focus).toBe(52);
  wheel({ deltaY: 3, deltaMode: 1, shiftKey: true });
  expect(p.coarse).toBe(49);
  p.focus = 99;
  wheel({ deltaY: -10000 });
  expect(p.focus).toBe(100);
  p.coarse = 1;
  wheel({ deltaY: 1, deltaMode: 2, shiftKey: true });
  expect(p.coarse).toBe(0);
  onChange.mockClear();
  wheel({ deltaY: 120, shiftKey: true });
  expect(onChange).not.toHaveBeenCalled();
  for (const options of [
    { ctrlKey: true },
    { metaKey: true },
    { deltaX: 200 },
  ]) {
    expect(wheel({ deltaY: 40, ...options }).defaultPrevented).toBe(false);
  }
  expect(onChange).not.toHaveBeenCalled();
  dispose();
  expect(wheel({ deltaY: -40 }).defaultPrevented).toBe(false);
  expect(onChange).not.toHaveBeenCalled();
});
