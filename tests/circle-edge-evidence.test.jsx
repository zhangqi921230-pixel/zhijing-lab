// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { it, expect } from "vitest";
import { arcRise } from "../src/CircleAreaEvidence.jsx";
import { circleAreaState } from "../src/revealModels.mjs";
import { revealLessons } from "../src/revealLessons.mjs";
import MotionLab from "../src/MotionLab.jsx";
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
it("magnified edge is a circle arc with zero endpoint rise and exact sagitta", () => {
  for (const radius of [1, 2.5, 4])
    for (let sectors = 6; sectors <= 64; sectors += 2) {
      expect(arcRise(radius, sectors, -1)).toBeCloseTo(0, 12);
      expect(arcRise(radius, sectors, 1)).toBeCloseTo(0, 12);
      expect(arcRise(radius, sectors, 0)).toBeCloseTo(
        circleAreaState({ radius, sectors }).sagitta,
        12,
      );
      for (const fraction of [-0.75, -0.25, 0.25, 0.75]) {
        const x = radius * Math.sin(Math.PI / sectors) * fraction;
        const y =
          arcRise(radius, sectors, fraction) +
          radius * Math.cos(Math.PI / sectors);
        expect(x * x + y * y).toBeCloseTo(radius * radius, 12);
      }
    }
});
it("sixth chapter opens the evidence panel and comparison updates the actual main scene without changing area", async () => {
  const host = document.createElement("div"),
    root = createRoot(host);
  await act(() =>
    root.render(
      <MotionLab lesson={revealLessons[1]} open={() => {}} goHome={() => {}} />,
    ),
  );
  const click = async (text) =>
    act(() =>
      [...host.querySelectorAll("button")]
        .find((b) => b.textContent === text)
        .click(),
    );
  try {
    for (let i = 0; i < 5; i++) await click("下一节");
    const panel = () => host.querySelector(".circle-area-evidence");
    expect(panel().open).toBe(true);
    expect(panel().textContent).toContain("3.045 mm");
    const area = host.querySelector(".motion-readouts strong").textContent;
    await click("64 等分 · 起伏 0.048 mm");
    expect(host.querySelectorAll("[data-sector]")).toHaveLength(64);
    expect(host.querySelector(".motion-readouts strong").textContent).toBe(
      area,
    );
    expect(host.querySelector('[aria-label="演示进度"]').value).toBe("6");
    expect(panel().textContent).toContain("最大起伏 0.048 mm");
    await click("上一节");
    expect(panel().open).toBe(false);
  } finally {
    await act(() => root.unmount());
  }
});
