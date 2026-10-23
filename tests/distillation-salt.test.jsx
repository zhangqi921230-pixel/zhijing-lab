// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { it, expect, vi } from "vitest";
import { saltBalance } from "../src/DistillationSalt.jsx";
import ChemistryLab from "../src/ChemistryLab.jsx";
import { chemistryTopics } from "../src/chemistryTopics.mjs";
vi.mock("../src/Chemistry3D.jsx", () => ({
  default: () => <div>三维器材</div>,
}));
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
it("salt stays in the source while all water destinations conserve mass", () => {
  for (const power of [200, 400, 600, 800])
    for (const t of [0, 60, 120, 240]) {
      const a = saltBalance(power, t, true),
        b = saltBalance(power, t, false);
      expect(a.solution + a.collected + a.lost).toBeCloseTo(202, 10);
      expect(b.solution + b.collected + b.lost).toBeCloseTo(202, 10);
      expect(a.salt).toBe(2);
      expect(a.fraction).toBeCloseTo(b.fraction, 10);
      expect(a.collected).toBeCloseTo(b.lost, 10);
      expect(b.collected).toBe(0);
      expect(a.fraction).toBeGreaterThanOrEqual(a.initial);
    }
});
it("same-time cooling comparison preserves elapsed time and distinguishes no distillate", async () => {
  localStorage.clear();
  const host = document.createElement("div"),
    root = createRoot(host);
  try {
    await act(() =>
      root.render(
        <ChemistryLab
          lesson={chemistryTopics.find((x) => x.id === "distillation")}
          open={() => {}}
          goHome={() => {}}
        />,
      ),
    );
    const button = (t) =>
      [...host.querySelectorAll("button")].find((b) => b.textContent === t);
    await act(() =>
      host.querySelectorAll(".microscope-chapters button")[5].click(),
    );
    expect(host.querySelector(".chem-playbar input").value).toBe("240");
    await act(() => button("复位").click());
    expect(host.querySelector(".chem-playbar input").value).toBe("0");
    expect(
      host.querySelector(".distillation-salt-readings").textContent,
    ).toContain("尚无馏出液");
    await act(() => button("重做本节 · 载入观察点").click());
    expect(host.querySelector(".chem-playbar input").value).toBe("240");
    expect(
      host.querySelector(".distillation-salt-readings").textContent,
    ).toContain("0%");
    await act(() => button("同一时刻 · 关闭冷却").click());
    expect(host.querySelector(".chem-playbar input").value).toBe("240");
    expect(
      host.querySelector(".distillation-salt-readings").textContent,
    ).toContain("尚无馏出液");
    expect(host.textContent).toContain("开始加热");
    await act(() => button("同一时刻 · 开启冷却").click());
    expect(host.querySelector(".chem-playbar input").value).toBe("240");
  } finally {
    await act(() => root.unmount());
  }
});
