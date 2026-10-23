// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { expect, it, vi } from "vitest";
import PhotoResponsePlot, {
  photoAxes,
  photoPlotValue,
} from "../src/PhotoResponsePlot.jsx";

it("按图内绘图区映射指针并限制变量范围", () => {
  for (const axis of photoAxes) {
    expect(photoPlotValue(10, { left: 10, width: 720 }, axis)).toBe(axis.min);
    expect(photoPlotValue(10 + 384, { left: 10, width: 720 }, axis)).toBe(
      (axis.min + axis.max) / 2,
    );
    expect(photoPlotValue(1000, { left: 10, width: 720 }, axis)).toBe(axis.max);
  }
});
it("章节改变曲线变量，键盘只提交所选变量并保留模型读数语义", async () => {
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  const host = document.createElement("div"),
    root = createRoot(host),
    onChange = vi.fn();
  document.body.append(host);
  try {
    const p = { light: 80, co2: 70, temp: 25 };
    for (let chapter = 0; chapter < 3; chapter++) {
      await act(() =>
        root.render(
          <PhotoResponsePlot p={p} chapter={chapter} onChange={onChange} />,
        ),
      );
      const slider = host.querySelector('[role="slider"]');
      expect(slider.getAttribute("aria-label")).toContain(
        photoAxes[chapter].name,
      );
      expect(slider.getAttribute("aria-valuetext")).toContain("62.22%");
      await act(() =>
        slider.dispatchEvent(
          new KeyboardEvent("keydown", { key: "End", bubbles: true }),
        ),
      );
      expect(onChange).toHaveBeenLastCalledWith(
        photoAxes[chapter].key,
        photoAxes[chapter].max,
      );
      await act(() =>
        slider.dispatchEvent(
          new KeyboardEvent("keydown", { key: "Home", bubbles: true }),
        ),
      );
      expect(onChange).toHaveBeenLastCalledWith(
        photoAxes[chapter].key,
        photoAxes[chapter].min,
      );
    }
  } finally {
    await act(() => root.unmount());
    host.remove();
  }
});

it("compares reference and current at the same x coordinate and clears on chapter change", async () => {
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  const host = document.createElement("div"),
    root = createRoot(host);
  const render = async (p, chapter = 3) =>
    act(() =>
      root.render(
        <PhotoResponsePlot p={p} chapter={chapter} onChange={() => {}} />,
      ),
    );
  try {
    await render({ light: 80, co2: 10, temp: 25 });
    await act(() =>
      [...host.querySelectorAll("button")]
        .find((b) => b.textContent === "保留当前曲线作对照")
        .click(),
    );
    await render({ light: 80, co2: 80, temp: 25 });
    expect(host.querySelector(".photo-rate-compare").textContent).toContain(
      "参照 26.67% → 当前 64.00%",
    );
    expect(host.textContent).toContain("37.33 个百分点");
    await render({ light: 0, co2: 80, temp: 25 });
    expect(host.querySelector(".photo-rate-compare").textContent).toContain(
      "参照 0.00% → 当前 0.00%",
    );
    await render({ light: 80, co2: 80, temp: 25 }, 4);
    expect(host.querySelector(".photo-rate-compare")).toBeNull();
  } finally {
    await act(() => root.unmount());
  }
});
