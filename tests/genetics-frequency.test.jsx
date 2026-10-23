// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { it, expect } from "vitest";
import GeneticsFrequency from "../src/GeneticsFrequency.jsx";
import { recessiveFrequencyHistory } from "../src/geneticsSampling.mjs";
it("uses each prefix denominator and preserves temporary movement away from theory", () => {
  const samples = ["aa", "AA", "Aa", "AA", "aa"].map((genotype) => ({
    genotype,
  }));
  const history = recessiveFrequencyHistory(samples);
  expect(history.map((x) => x.frequency)).toEqual([1, 0.5, 1 / 3, 0.25, 0.4]);
  expect(history.at(-1).count).toBe(2);
  expect(recessiveFrequencyHistory([])).toEqual([]);
});
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
it("distinguishes no samples from zero recessive offspring and keeps the selected theoretical probability", async () => {
  const host = document.createElement("div"),
    root = createRoot(host);
  try {
    await act(() =>
      root.render(<GeneticsFrequency samples={[]} probability={0.25} />),
    );
    expect(host.querySelector("polyline")).toBeNull();
    expect(host.querySelector("svg").getAttribute("aria-label")).toContain(
      "尚未抽样",
    );
    await act(() =>
      root.render(
        <GeneticsFrequency samples={[{ genotype: "AA" }]} probability={0.5} />,
      ),
    );
    expect(host.querySelector("polyline")).not.toBeNull();
    expect(host.querySelector("svg").getAttribute("aria-label")).toContain(
      "当前频率0.0%，理论50%",
    );
  } finally {
    await act(() => root.unmount());
  }
});
