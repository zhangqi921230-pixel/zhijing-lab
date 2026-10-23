// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { expect, it, vi } from "vitest";
import TitrationCurve, { titrationSamples } from "../src/TitrationCurve.jsx";
import { titrationKeyboardValue } from "../src/titrationInput.mjs";

it("连续体积不被原生 step 吸附；键盘微调才按指定精度取值", async () => {
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  const host = document.createElement("div"),
    root = createRoot(host);
  const onPrepare = vi.fn();
  try {
    await act(() =>
      root.render(
        <TitrationCurve
          p={{ acid: 50, base: 49.9993, c: 0.1 }}
          onPrepare={onPrepare}
        />,
      ),
    );
    expect(Number(host.querySelector("input").value)).toBe(49.9993);
    expect(
      host.querySelector("input").getAttribute("aria-valuetext"),
    ).toContain("49.9993 mL");
    expect(host.textContent).toContain("49.9993 mL");
    await act(() =>
      host
        .querySelector("input")
        .dispatchEvent(
          new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }),
        ),
    );
    expect(onPrepare).toHaveBeenCalledWith({ base: 50.01 });
    expect(titrationKeyboardValue(100, "ArrowRight")).toBe(100);
    expect(titrationKeyboardValue(0, "ArrowLeft")).toBe(0);
    expect(titrationKeyboardValue(25, "Home")).toBe(0);
    expect(titrationKeyboardValue(25, "End")).toBe(100);
    expect(titrationKeyboardValue(25, "Tab")).toBeNull();
  } finally {
    await act(() => root.unmount());
  }
});

it("曲线包含精确中和点并解析陡峭区域，边界体积和浓度均保持有限且单调", () => {
  for (const acid of [10, 50, 99.9, 100])
    for (const c of [0.01, 0.1, 0.2]) {
      const points = titrationSamples(acid, c, 0, 100);
      expect(points.find((p) => p.volume === acid).pH).toBeCloseTo(7, 10);
      expect(
        points.every((p) => Number.isFinite(p.pH) && p.pH >= 0 && p.pH <= 14),
      ).toBe(true);
      for (let i = 1; i < points.length; i++)
        expect(points[i].pH).toBeGreaterThanOrEqual(points[i - 1].pH);
      expect(
        points.some(
          (p) =>
            Math.abs(p.volume - acid) > 0 && Math.abs(p.volume - acid) < 0.0001,
        ),
      ).toBe(true);
    }
});
it("放大不改实验状态，当前点超出范围时明确告知；滑块只准备加入量", async () => {
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  const host = document.createElement("div"),
    root = createRoot(host),
    onPrepare = vi.fn();
  document.body.append(host);
  try {
    await act(() =>
      root.render(
        <TitrationCurve
          p={{ acid: 50, base: 25, c: 0.1 }}
          onPrepare={onPrepare}
        />,
      ),
    );
    await act(() => host.querySelectorAll("button")[1].click());
    expect(onPrepare).not.toHaveBeenCalled();
    expect(host.textContent).toContain("当前点在放大范围外");
    expect(host.querySelector("svg").getAttribute("aria-label")).toContain(
      "49.5 至 50.5",
    );
    const input = host.querySelector("input");
    await act(() => {
      Object.getOwnPropertyDescriptor(
        HTMLInputElement.prototype,
        "value",
      ).set.call(input, "50");
      input.dispatchEvent(new Event("input", { bubbles: true }));
    });
    expect(onPrepare).toHaveBeenCalledWith({ base: 50 });
  } finally {
    await act(() => root.unmount());
    host.remove();
  }
});
