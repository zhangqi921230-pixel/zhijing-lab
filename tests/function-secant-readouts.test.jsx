// @vitest-environment jsdom
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { expect, it } from "vitest";
import FunctionSecantReadouts from "../src/FunctionSecantReadouts.jsx";
import { functionRates } from "../src/advancedModels.mjs";

it("靠近的 P/Q 标签分开，重合时合并，视野外不贴假边缘标签", () => {
  const host = document.createElement("div");
  const render = (probe, dx) => {
    host.innerHTML = renderToStaticMarkup(
      <svg>
        <FunctionSecantReadouts
          rates={functionRates({
            type: 0,
            a: 1,
            k: 1,
            b: 0,
            shift: 0,
            probe,
            dx,
          })}
          extent={6}
          xExtent={6}
          bounds={{ left: 84, right: 536, top: 64, bottom: 516 }}
          scale={1}
          curves={[]}
        />
      </svg>,
    );
  };
  render(1, 0.05);
  const rects = [...host.querySelectorAll("rect")].map((r) =>
    Object.fromEntries(
      ["x", "y", "width", "height"].map((key) => [
        key,
        Number(r.getAttribute(key)),
      ]),
    ),
  );
  expect(rects).toHaveLength(2);
  const [a, b] = rects;
  expect(
    a.x + a.width <= b.x ||
      b.x + b.width <= a.x ||
      a.y + a.height <= b.y ||
      b.y + b.height <= a.y,
  ).toBe(true);
  render(1, 0);
  expect(host.querySelectorAll("rect")).toHaveLength(1);
  expect(host.textContent).toContain("P = Q (1, 1)");
  render(5, 1);
  expect(host.querySelectorAll("rect")).toHaveLength(0);
});
