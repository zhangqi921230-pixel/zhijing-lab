// @vitest-environment jsdom
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { expect, it } from "vitest";
import BisectionInterval from "../src/BisectionInterval.jsx";
import { functionBisection } from "../src/functionBisection.mjs";
const p = { type: 0, a: 1, k: 1, b: -2, shift: 0 };
it("keeps a visible half interval after thirty steps without changing numeric bounds", () => {
  const result = functionBisection(p, 0, 2, 30);
  const host = document.createElement("div");
  host.innerHTML = renderToStaticMarkup(
    <BisectionInterval result={result} left="0" right="2" />,
  );
  const d = host.querySelector('[aria-label="保留段"]').getAttribute("d");
  expect(["M40 35H300", "M300 35H560"]).toContain(d);
  expect(host.querySelector("svg").getAttribute("aria-label")).toContain(
    String(result.left),
  );
  expect(host.textContent).toContain("每一步重新适配比例");
});
it("shows a point for an exact midpoint or endpoint, not a half interval", () => {
  for (const b of [-1, 0]) {
    const result = functionBisection({ ...p, b }, 0, 2, 1);
    const host = document.createElement("div");
    host.innerHTML = renderToStaticMarkup(
      <BisectionInterval result={result} left="0" right="2" />,
    );
    const d = host.querySelector('[aria-label="保留段"]').getAttribute("d");
    expect(d).toBe(b === -1 ? "M300 35H300" : "M40 35H40");
    expect(host.innerHTML).not.toMatch(/NaN|Infinity/);
  }
});
