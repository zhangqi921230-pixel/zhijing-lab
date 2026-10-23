// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { it, expect } from "vitest";
import WaterBudgetGuide from "../src/WaterBudgetGuide.jsx";
import { topicChapters } from "../src/topicChapters.mjs";
import { calculate } from "../src/models.mjs";
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
it("keeps the reference fixed and exposes balanced transfer between infiltration and runoff", async () => {
  const host = document.createElement("div"),
    root = createRoot(host);
  try {
    await act(() =>
      root.render(
        <WaterBudgetGuide
          p={{ rain: 100, infil: 20, evap: 10 }}
          onChange={() => {}}
        />,
      ),
    );
    await act(() => host.querySelector(".water-comparison button").click());
    await act(() =>
      root.render(
        <WaterBudgetGuide
          p={{ rain: 100, infil: 70, evap: 10 }}
          onChange={() => {}}
        />,
      ),
    );
    const rows = [...host.querySelectorAll("tbody tr")].map((r) =>
      [...r.querySelectorAll("td")].map((c) => c.textContent),
    );
    expect(rows).toEqual([
      ["70", "20", "-50"],
      ["20", "70", "+50"],
      ["10", "10", "0"],
    ]);
    await act(() =>
      root.render(
        <WaterBudgetGuide
          p={{ rain: 0, infil: 70, evap: 10 }}
          onChange={() => {}}
        />,
      ),
    );
    expect(host.querySelectorAll("tbody tr")[0].textContent).toContain(
      "700-70",
    );
    expect(host.querySelector(".water-budget-bar").children).toHaveLength(0);
  } finally {
    await act(() => root.unmount());
  }
});
it("every water lesson scenario preserves nonnegative water mass and the new lessons isolate a variable", () => {
  for (const chapter of topicChapters.water)
    for (const scenario of chapter.scenarios) {
      const q = calculate("water", scenario.p).map((x) => x.value);
      expect(q.every((x) => x >= 0)).toBe(true);
      expect(q.reduce((a, b) => a + b, 0)).toBeCloseTo(scenario.p.rain);
    }
  const [a, b] = topicChapters.water[4].scenarios.map((s) =>
    calculate("water", s.p),
  );
  a.forEach((v, i) => expect(b[i].value).toBeCloseTo(v.value * 2));
});
