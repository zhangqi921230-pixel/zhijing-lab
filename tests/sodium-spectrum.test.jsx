// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { it, expect } from "vitest";
import SodiumSpectrum, {
  SODIUM_LINES,
  sodiumResponse,
} from "../src/SodiumSpectrum.jsx";
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
it("resolved narrow peaks stay at reference wavelengths while broad response merges them", () => {
  const peaks = (width) => {
    const values = Array.from({ length: 2601 }, (_, i) =>
      sodiumResponse(588 + i * 0.001, width),
    );
    return values.flatMap((v, i) =>
      i > 0 && i < 2600 && v > values[i - 1] && v > values[i + 1]
        ? [588 + i * 0.001]
        : [],
    );
  };
  expect(SODIUM_LINES[1] - SODIUM_LINES[0]).toBeCloseTo(0.5974, 8);
  expect(peaks(0.9)).toHaveLength(1);
  const resolved = peaks(0.12);
  expect(resolved).toHaveLength(2);
  resolved.forEach((w, i) => expect(w).toBeCloseTo(SODIUM_LINES[i], 2));
  expect(sodiumResponse(SODIUM_LINES[0] + 0.12 / 2, 0.12)).toBeCloseTo(0.5, 7);
});
it("resolution presets update the curve and announce selection", async () => {
  const host = document.createElement("div"),
    root = createRoot(host);
  try {
    await act(() => root.render(<SodiumSpectrum />));
    const before = host
      .querySelector('path[stroke="var(--ui-gold)"]')
      .getAttribute("d");
    const button = [...host.querySelectorAll("button")].find(
      (b) => b.textContent === "清晰分开",
    );
    await act(() => button.click());
    expect(button.getAttribute("aria-pressed")).toBe("true");
    expect(host.querySelector("input").value).toBe("0.12");
    expect(
      host.querySelector('path[stroke="var(--ui-gold)"]').getAttribute("d"),
    ).not.toBe(before);
    expect(host.textContent).toContain("588.9950 nm");
  } finally {
    await act(() => root.unmount());
  }
});

it("probe remains at the midpoint when changing line width", async () => {
  const host = document.createElement("div"),
    root = createRoot(host);
  try {
    await act(() => root.render(<SodiumSpectrum />));
    const click = (name) =>
      act(() =>
        [...host.querySelectorAll("button")]
          .find((b) => b.textContent === name)
          .click(),
      );
    await click("两线中点");
    const point = () => host.querySelector('[data-testid="sodium-probe"]');
    const x = point().getAttribute("cx"),
      y = point().getAttribute("cy");
    expect(host.querySelector('[aria-label="观察波长"]').value).toBe(
      "589.2937",
    );
    await click("清晰分开");
    expect(point().getAttribute("cx")).toBe(x);
    expect(Number(point().getAttribute("cy"))).toBeGreaterThan(Number(y));
    expect(
      host.querySelector('[aria-label="波长探针读数"]').textContent,
    ).toContain("0.000");
  } finally {
    await act(() => root.unmount());
  }
});
