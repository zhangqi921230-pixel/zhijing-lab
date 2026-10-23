// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { it, expect } from "vitest";
import { geneticsCondition } from "../src/geneticsCondition.mjs";
import { genetics } from "../src/models.mjs";
import GeneticsStudio from "../src/GeneticsStudio.jsx";
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
it("conditional probability agrees with the original model for every parental combination", () => {
  for (let parent1 = 0; parent1 < 3; parent1++)
    for (let parent2 = 0; parent2 < 3; parent2++) {
      const p = { parent1, parent2 },
        q = genetics(parent1, parent2),
        c = geneticsCondition(p, true);
      expect(geneticsCondition(p, false).probability).toBeCloseTo(q.Aa);
      expect(c.denominator / 4).toBeCloseTo(q.AA + q.Aa);
      if (c.denominator)
        expect(c.probability).toBeCloseTo(q.Aa / (q.AA + q.Aa));
      else expect(c.probability).toBe(null);
    }
  expect(geneticsCondition({ parent1: 1, parent2: 1 }).probability).toBeCloseTo(
    2 / 3,
  );
});
it("chapter seven filters combinations without sampling and handles an impossible condition", async () => {
  const host = document.createElement("div"),
    root = createRoot(host);
  try {
    await act(() =>
      root.render(
        <GeneticsStudio p={{ parent1: 1, parent2: 1 }} chapter={6} />,
      ),
    );
    expect(host.textContent).toContain("2 / 4");
    await act(() =>
      [...host.querySelectorAll("button")]
        .find((b) => b.textContent === "只看显性后代")
        .click(),
    );
    expect(host.textContent).toContain("2 / 3");
    expect(host.querySelectorAll(".condition-grid .excluded").length).toBe(1);
    expect(host.textContent).not.toContain("连续抽样");
    await act(() =>
      root.render(
        <GeneticsStudio p={{ parent1: 2, parent2: 2 }} chapter={6} />,
      ),
    );
    expect(host.textContent).toContain("条件在本模型中概率为零");
    expect(host.innerHTML).not.toMatch(/NaN|Infinity/);
    expect(host.querySelectorAll(".condition-grid .excluded").length).toBe(4);
  } finally {
    await act(() => root.unmount());
  }
});
