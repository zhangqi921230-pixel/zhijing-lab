// @vitest-environment jsdom
import React, { act } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createRoot } from "react-dom/client";
import { expect, it } from "vitest";
import InclineGuide from "../src/InclineGuide.jsx";

it("draws orthogonal gravity components whose sum is the displayed gravity vector", () => {
  const host = document.createElement("div");
  for (const angle of [5, 30, 50]) {
    host.innerHTML = renderToStaticMarkup(
      <InclineGuide
        p={{ angle, mass: 2, mu: 0.2, muStatic: 0.3 }}
        t={0.5}
        decomposition
      />,
    );
    const vector = (label) =>
      host
        .querySelector(`[aria-label="重力分解向量 ${label}"] path`)
        .getAttribute("d")
        .split("l")[1]
        .split(" ")
        .map(Number);
    const g = vector("mg"),
      along = vector("mg sinθ"),
      normal = vector("mg cosθ");
    expect(along[0] + normal[0]).toBeCloseTo(g[0], 10);
    expect(along[1] + normal[1]).toBeCloseTo(g[1], 10);
    expect(along[0] * normal[0] + along[1] * normal[1]).toBeCloseTo(0, 9);
    expect(host.querySelector('[aria-label="当前受力大小"]')).toBeNull();
  }
});
it("switches diagram interpretation without changing motion readings", async () => {
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  const host = document.createElement("div"),
    root = createRoot(host);
  try {
    await act(() =>
      root.render(
        <InclineGuide
          p={{ angle: 30, mass: 2, mu: 0.2, muStatic: 0.3 }}
          t={0.5}
          decomposition
        />,
      ),
    );
    const readings = host.querySelector(".incline-readings").textContent;
    await act(() =>
      [...host.querySelectorAll("button")]
        .find((b) => b.textContent === "实际受力")
        .click(),
    );
    expect(host.querySelector('[aria-label="当前受力大小"]')).not.toBeNull();
    expect(host.querySelector('[aria-label="重力分解平行四边形"]')).toBeNull();
    expect(host.querySelector(".incline-readings").textContent).toBe(readings);
  } finally {
    await act(() => root.unmount());
  }
});
