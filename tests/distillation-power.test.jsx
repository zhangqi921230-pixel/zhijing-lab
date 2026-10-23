// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { it, expect } from "vitest";
import DistillationStudy, { boilingTime } from "../src/DistillationStudy.jsx";
import { distillationState } from "../src/chemistryTopics.mjs";
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
it("power alters heating duration but not the temperature plateau", () => {
  expect(boilingTime(800) * 2).toBeCloseTo(boilingTime(400));
  for (const power of [400, 600, 800]) {
    expect(
      distillationState(power, boilingTime(power), 1).temperature,
    ).toBeCloseTo(100);
    expect(distillationState(power, 240, 1).temperature).toBeCloseTo(100);
  }
});
it("reference remains fixed across current power changes and can be hidden", async () => {
  const host = document.createElement("div"),
    root = createRoot(host);
  try {
    await act(() =>
      root.render(
        <DistillationStudy
          p={{ power: 800, cooling: 1 }}
          time={120}
          onSeek={() => {}}
        />,
      ),
    );
    await act(() =>
      [...host.querySelectorAll("button")]
        .find((b) => b.textContent === "对照400 W升温曲线")
        .click(),
    );
    const path = host
      .querySelector('[data-testid="distillation-power-reference"]')
      .getAttribute("d");
    await act(() =>
      root.render(
        <DistillationStudy
          p={{ power: 400, cooling: 1 }}
          time={120}
          onSeek={() => {}}
        />,
      ),
    );
    expect(
      host
        .querySelector('[data-testid="distillation-power-reference"]')
        .getAttribute("d"),
    ).toBe(path);
    expect(host.textContent).toContain("两线重合");
    await act(() =>
      [...host.querySelectorAll("button")]
        .find((b) => b.textContent === "隐藏400 W参照曲线")
        .click(),
    );
    expect(
      host.querySelector('[data-testid="distillation-power-reference"]'),
    ).toBeNull();
  } finally {
    await act(() => root.unmount());
  }
});
