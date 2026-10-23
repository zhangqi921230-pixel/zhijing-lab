// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { expect, it, vi } from "vitest";
import SolidVolumeCurve from "../src/SolidVolumeCurve.jsx";
import { accumulatedVolumes } from "../src/advancedModels.mjs";

it("uses one cylinder-volume scale and follows accumulated volumes across heights", async () => {
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  const host = document.createElement("div"),
    root = createRoot(host);
  try {
    for (const f of [0, 0.1, 0.5, 0.9, 1]) {
      await act(() => root.render(<SolidVolumeCurve fraction={f} />));
      const volume = accumulatedVolumes(1.7, 3.2, f);
      const total = Math.PI * 1.7 ** 2 * 3.2;
      for (const series of ["cylinder", "cone"]) {
        const marker = host.querySelector(`[data-series="${series}"]`);
        expect(Number(marker.getAttribute("cx"))).toBeCloseTo(48 + 420 * f, 10);
        expect(Number(marker.getAttribute("cy"))).toBeCloseTo(
          174 - (138 * volume[series]) / total,
          10,
        );
      }
      expect(host.querySelector("svg").getAttribute("aria-label")).toContain(
        "完整圆柱",
      );
    }
  } finally {
    await act(() => root.unmount());
  }
});

it("keeps a drag owned by one pointer and stops on release or cancellation", async () => {
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  const host = document.createElement("div"),
    root = createRoot(host);
  const select = vi.fn();
  try {
    await act(() =>
      root.render(<SolidVolumeCurve fraction={0.5} onSelect={select} />),
    );
    const svg = host.querySelector("svg");
    svg.getBoundingClientRect = () => ({ left: 0, width: 520, height: 220 });
    svg.setPointerCapture = vi.fn();
    svg.releasePointerCapture = vi.fn();
    const send = async (type, id, x = 258, button = 0) => {
      const event = new MouseEvent(type, { bubbles: true, clientX: x, button });
      Object.defineProperty(event, "pointerId", { value: id });
      await act(() => svg.dispatchEvent(event));
    };
    await send("pointermove", 1);
    await send("pointerdown", 1, 258, 2);
    expect(select).not.toHaveBeenCalled();
    await send("pointerdown", 1, 48);
    await send("pointermove", 1, 258);
    expect(select.mock.calls.map(([value]) => value)).toEqual([0, 50]);
    for (const type of [
      "pointerdown",
      "pointermove",
      "pointerup",
      "pointercancel",
      "lostpointercapture",
    ]) {
      await send(type, 2, 468);
    }
    expect(select).toHaveBeenCalledTimes(2);
    await send("pointermove", 1, 600);
    expect(select).toHaveBeenLastCalledWith(100);
    await send("pointerup", 1, -100);
    expect(select).toHaveBeenLastCalledWith(0);
    expect(svg.releasePointerCapture).toHaveBeenCalledWith(1);
    const releasedCount = select.mock.calls.length;
    await send("pointermove", 1);
    expect(select).toHaveBeenCalledTimes(releasedCount);
    for (const end of ["pointercancel", "lostpointercapture"]) {
      await send("pointerdown", 3, 258);
      const count = select.mock.calls.length;
      await send(end, 3);
      await send("pointermove", 3, 468);
      await send("pointerup", 3, 468);
      expect(select).toHaveBeenCalledTimes(count);
    }
    expect(svg.releasePointerCapture).toHaveBeenCalledTimes(1);
  } finally {
    await act(() => root.unmount());
  }
});
