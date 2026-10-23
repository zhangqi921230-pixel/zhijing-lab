// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { expect, it } from "vitest";
import { SolubilityGuide } from "../src/SolubilityGuide.jsx";

it("distinguishes a just-saturated solution from undissolved solid and checks conservation", async () => {
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  const host = document.createElement("div"),
    root = createRoot(host);
  try {
    for (const [mass, expected, split] of [
      [20, "未饱和", "20.00 / 0.00 g"],
      [31.6, "恰好饱和，无剩余固体", "31.60 / 0.00 g"],
      [50, "饱和，有剩余固体", "31.60 / 18.40 g"],
    ]) {
      await act(() =>
        root.render(
          <SolubilityGuide
            chapter={1}
            p={{ temp: 20, water: 100, mass }}
            onSelect={() => {}}
            onPrepare={() => {}}
          />,
        ),
      );
      const values = [...host.querySelectorAll("dd")].map((e) => e.textContent);
      expect(values).toEqual([
        expected,
        "31.60 g",
        split,
        `${mass.toFixed(2)} = ${mass} g`,
      ]);
      const width = Number(
        host
          .querySelector('.solubility-mass-split rect[fill="#4c9c89"]')
          .getAttribute("width"),
      );
      expect(width).toBeCloseTo((300 * Math.min(mass, 31.6)) / mass, 8);
      expect(host.querySelector("figure").textContent).toContain(
        "不含水的质量",
      );
    }
  } finally {
    await act(() => root.unmount());
  }
});

it("locates equilibrium precisely and disables unreachable temperatures", async () => {
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  const host = document.createElement("div"),
    root = createRoot(host);
  let prepared;
  try {
    for (const mass of [50, 0, 180]) {
      await act(() =>
        root.render(
          <SolubilityGuide
            chapter={1}
            p={{ temp: 20, water: 100, mass }}
            onSelect={() => {}}
            onPrepare={(value) => {
              prepared = value;
            }}
          />,
        ),
      );
      const button = [...host.querySelectorAll("button")].find(
        (e) => e.textContent === "定位恰好饱和",
      );
      expect(button.disabled).toBe(mass !== 50);
      if (mass === 50) {
        await act(() => button.click());
        expect(prepared.temp).toBeCloseTo(31.39318885449, 10);
        expect(Object.keys(prepared)).toEqual(["temp"]);
      }
      if (mass === 0)
        expect(host.querySelector('rect[fill="#bc985a"]')).toBeNull();
    }
  } finally {
    await act(() => root.unmount());
  }
});
