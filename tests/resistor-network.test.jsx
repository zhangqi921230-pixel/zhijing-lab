// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { it, expect } from "vitest";
import { networkLesson, networkState } from "../src/networkLesson.mjs";
import { groupFor } from "../src/courseCatalog.mjs";
import MotionLab from "../src/MotionLab.jsx";
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
it("series and parallel networks obey current, voltage and power conservation over parameter bounds", () => {
  for (const mode of [0, 1])
    for (const closed of [0, 1])
      for (const u of [0, 6, 12])
        for (const r1 of [5, 20, 60])
          for (const r2 of [5, 30, 60]) {
            const q = networkState({ mode, closed, u, r1, r2 });
            expect(q.power1 + q.power2).toBeCloseTo(q.power, 10);
            expect(q.u1).toBeCloseTo(q.i1 * r1, 10);
            expect(q.u2).toBeCloseTo(q.i2 * r2, 10);
            if (mode === 0) {
              expect(q.i1).toBe(q.i2);
              expect(q.u1 + q.u2).toBeCloseTo(closed ? u : 0, 10);
              expect(q.resistance).toBeGreaterThan(Math.max(r1, r2));
            } else {
              expect(q.i1 + q.i2).toBeCloseTo(q.current, 10);
              expect(q.u1).toBeCloseTo(closed ? u : 0, 10);
              expect(q.u2).toBeCloseTo(closed ? u : 0, 10);
              expect(q.resistance).toBeLessThan(Math.min(r1, r2));
            }
          }
});
it("network is integrated in the existing circuit workbench and all chapters and switch actions change the scene", async () => {
  expect(groupFor("resistor-network").id).toBe("ohm");
  const host = document.createElement("div"),
    root = createRoot(host);
  await act(() =>
    root.render(
      <MotionLab lesson={networkLesson} open={() => {}} goHome={() => {}} />,
    ),
  );
  const click = async (text) =>
    act(() =>
      [...host.querySelectorAll("button")]
        .find((b) => b.textContent === text)
        .click(),
    );
  try {
    const scenes = [];
    for (let i = 0; i < networkLesson.chapters.length; i++) {
      expect(host.querySelector("h1").textContent).toBe(
        networkLesson.chapters[i].title,
      );
      scenes.push(host.querySelector(".motion-diagram").outerHTML);
      if (i < networkLesson.chapters.length - 1) await click("下一节");
    }
    expect(new Set(scenes).size).toBe(networkLesson.chapters.length);
    await click("并联");
    expect(
      host.querySelector(".motion-diagram").getAttribute("aria-label"),
    ).toContain("并联");
    expect(host.querySelector(".motion-readouts").textContent).toContain(
      "0.900 A",
    );
    await click("断开总开关");
    expect(host.querySelector(".motion-readouts").textContent).toContain(
      "0.000 A",
    );
    expect(host.querySelector(".network-evidence").textContent).toContain(
      "电源显示值仍存在",
    );
    expect(host.querySelector(".motion-diagram").outerHTML).not.toMatch(
      /NaN|Infinity/,
    );
    await click("闭合总开关");
    expect(host.querySelector(".motion-readouts").textContent).toContain(
      "0.900 A",
    );
  } finally {
    await act(() => root.unmount());
  }
});

it("opening only R2 preserves R1 while reducing source current and assigns voltage to the open switch", () => {
  for (const u of [0, 6, 12])
    for (const r1 of [5, 10, 60])
      for (const r2 of [5, 20, 60]) {
        const p = { u, r1, r2, mode: 1, closed: 1 };
        const joined = networkState(p),
          opened = networkState({ ...p, branch2: 0 });
        expect(opened.i1).toBe(joined.i1);
        expect(opened.i2).toBe(0);
        expect(opened.u2).toBe(0);
        expect(opened.current).toBeCloseTo(joined.current - joined.i2, 12);
        expect(opened.resistance).toBe(r1);
        expect(opened.switchVoltage).toBe(u);
        expect(opened.power1 + opened.power2).toBeCloseTo(opened.power, 12);
        expect(
          networkState({ ...p, closed: 0, branch2: 0 }).switchVoltage,
        ).toBe(0);
      }
});
it("branch switch toggles actual geometry and resets when changing connection", async () => {
  const host = document.createElement("div"),
    root = createRoot(host);
  await act(() =>
    root.render(
      <MotionLab lesson={networkLesson} open={() => {}} goHome={() => {}} />,
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
    const opened = host
      .querySelector('[data-testid="branch-switch"]')
      .getAttribute("d");
    expect(host.querySelector(".network-evidence").textContent).toContain(
      "6.00 V",
    );
    expect(host.querySelector(".motion-readouts").textContent).toContain(
      "0.600 A",
    );
    await click("闭合 R₂ 支路");
    expect(
      host.querySelector('[data-testid="branch-switch"]').getAttribute("d"),
    ).not.toBe(opened);
    expect(host.querySelector(".motion-readouts").textContent).toContain(
      "0.900 A",
    );
    await click("断开 R₂ 支路");
    await click("串联");
    await click("并联");
    expect(host.textContent).toContain("断开 R₂ 支路");
    expect(host.querySelector(".motion-readouts").textContent).toContain(
      "0.900 A",
    );
  } finally {
    await act(() => root.unmount());
  }
});
