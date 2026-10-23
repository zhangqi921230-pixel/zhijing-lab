// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { it, expect } from "vitest";
import CommunityComparison from "../src/CommunityComparison.jsx";
import { biodiversity } from "../src/advancedModels.mjs";
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
it("equal totals isolate evenness and scaling all counts preserves Shannon", () => {
  const uniform = { plants: 8, insects: 8, birds: 8, fungi: 8 },
    uneven = { plants: 20, insects: 4, birds: 4, fungi: 4 },
    half = { plants: 4, insects: 4, birds: 4, fungi: 4 };
  expect(biodiversity(uniform).total).toBe(biodiversity(uneven).total);
  expect(biodiversity(uniform).diversity).toBeGreaterThan(
    biodiversity(uneven).diversity,
  );
  expect(biodiversity(uniform).diversity).toBe(biodiversity(half).diversity);
});
it("reference stores a snapshot while current composition changes", async () => {
  const host = document.createElement("div"),
    root = createRoot(host),
    a = { plants: 8, insects: 8, birds: 8, fungi: 8 };
  try {
    await act(() => root.render(<CommunityComparison p={a} />));
    await act(() => host.querySelector("button").click());
    await act(() =>
      root.render(
        <CommunityComparison
          p={{ plants: 20, insects: 4, birds: 4, fungi: 4 }}
        />,
      ),
    );
    const samples = host.querySelectorAll(".community-sample");
    expect(samples).toHaveLength(2);
    expect(samples[0].querySelector("strong").textContent).toContain("A");
    expect(samples[0].querySelector("dd").textContent).toContain("8");
    expect(samples[1].querySelector("dd").textContent).toContain("20");
    expect(host.querySelector(".community-difference").textContent).toContain(
      "计数 +0",
    );
  } finally {
    await act(() => root.unmount());
  }
});

it("empty samples explain undefined proportions without drawing a full bar", async () => {
  const host = document.createElement("div"),
    root = createRoot(host);
  try {
    await act(() =>
      root.render(
        <CommunityComparison
          p={{ plants: 0, insects: 0, birds: 0, fungi: 0 }}
        />,
      ),
    );
    expect(host.textContent).toContain("比例尚未定义");
    host
      .querySelectorAll(".community-stripe span")
      .forEach((el) => expect(el.style.width).toBe("0%"));
  } finally {
    await act(() => root.unmount());
  }
});
