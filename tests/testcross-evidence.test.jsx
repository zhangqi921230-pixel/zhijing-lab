// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { it, expect, vi } from "vitest";
import TestCrossEvidence, {
  noRecessiveProbability,
} from "../src/TestCrossEvidence.jsx";
import GeneticsStudio from "../src/GeneticsStudio.jsx";
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
it("all-dominant likelihood is independent repeated probability, never a posterior", () => {
  expect(noRecessiveProbability(1)).toBe(0.5);
  expect(noRecessiveProbability(4)).toBe(1 / 16);
  expect(noRecessiveProbability(20)).toBe(1 / 1048576);
});
it("classification merges the same sample without redrawing", async () => {
  const random = vi.spyOn(Math, "random").mockReturnValue(0.1),
    host = document.createElement("div"),
    root = createRoot(host);
  try {
    await act(() =>
      root.render(
        <GeneticsStudio p={{ parent1: 1, parent2: 1 }} chapter={1} />,
      ),
    );
    const button = (text) =>
      [...host.querySelectorAll("button")].find((b) => b.textContent === text);
    await act(() => button("抽样 20 个").click());
    const draws = random.mock.calls.length;
    await act(() => button("按显隐性性状统计").click());
    expect(host.querySelector(".genetics-distribution").textContent).toContain(
      "理论 75%",
    );
    expect(host.querySelector(".genetics-distribution").textContent).toContain(
      "抽样 20 个",
    );
    expect(random.mock.calls.length).toBe(draws);
    expect(
      host.querySelector(".genetics-population-title").textContent,
    ).toContain("20 / 1000");
    await act(() => button("按基因型统计").click());
    expect(host.querySelector(".genetics-distribution").textContent).toContain(
      "理论 50%",
    );
  } finally {
    await act(() => root.unmount());
    random.mockRestore();
  }
});
it("hypothetical size stays separate from samples and explains positive and absent evidence", async () => {
  const host = document.createElement("div"),
    root = createRoot(host),
    p = { parent1: 1, parent2: 2 };
  try {
    await act(() => root.render(<TestCrossEvidence p={p} samples={[]} />));
    expect(host.textContent).toContain("6.25%");
    await act(() =>
      [...host.querySelectorAll("button")]
        .find((b) => b.textContent === "对照 20 个")
        .click(),
    );
    expect(host.textContent).toContain("0.0001%");
    expect(host.textContent).toContain("还没有抽样");
    await act(() =>
      root.render(<TestCrossEvidence p={p} samples={[{ genotype: "Aa" }]} />),
    );
    expect(host.textContent).toContain("不能据此直接证明 AA");
    await act(() =>
      root.render(<TestCrossEvidence p={p} samples={[{ genotype: "aa" }]} />),
    );
    expect(host.textContent).toContain("可排除待测亲本为 AA");
    await act(() =>
      root.render(
        <TestCrossEvidence p={{ parent1: 1, parent2: 1 }} samples={[]} />,
      ),
    );
    expect(host.textContent).toContain("不属于");
  } finally {
    await act(() => root.unmount());
  }
});
