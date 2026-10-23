// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { it, expect } from "vitest";
import HomePaths, { pathLessons } from "../src/science/HomePaths.jsx";
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
for (const id of Object.keys(pathLessons))
  it(`${id}: each observation changes the diagram and resets comparison`, () => {
    const el = document.createElement("div"),
      root = createRoot(el),
      topic = { id, title: id };
    act(() => root.render(<HomePaths topic={topic} chapter="one" />));
    const buttons = () => [...el.querySelectorAll("button")];
    let before = el.querySelector("svg").outerHTML;
    for (let i = 1; i < 4; i++) {
      act(() =>
        buttons()
          .find((b) => b.textContent === `${i + 1} ${pathLessons[id][i][0]}`)
          .click(),
      );
      expect(el.querySelector('[role="status"]').textContent).toContain(
        pathLessons[id][i][1],
      );
      expect(el.querySelector("svg").outerHTML).not.toBe(before);
      before = el.querySelector("svg").outerHTML;
    }
    act(() =>
      buttons()
        .find((b) => b.textContent === "恢复初始状态")
        .click(),
    );
    expect(el.querySelector('[role="status"]').textContent).toContain(
      pathLessons[id][0][1],
    );
    if (id !== "air-filter") {
      const comparison = buttons().find((b) =>
        /比较积尘|换成冷饮|开启主动加热/.test(b.textContent),
      );
      const initial = el.querySelector("svg").outerHTML;
      act(() => comparison.click());
      expect(el.querySelector("svg").outerHTML).not.toBe(initial);
      act(() => root.render(<HomePaths topic={topic} chapter="two" />));
      expect(el.querySelector("svg").outerHTML).toBe(initial);
    }
    act(() => root.unmount());
  });
