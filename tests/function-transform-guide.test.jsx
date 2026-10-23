// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { renderToStaticMarkup } from "react-dom/server";
import { it, expect, vi } from "vitest";
import FunctionStudio from "../src/FunctionStudio.jsx";
import { functionValue } from "../src/advancedModels.mjs";
import { graphPoint } from "../src/LinearScene.jsx";

it("maps the source function point through horizontal and vertical transformations", () => {
  const host = document.createElement("div");
  for (const k of [-2, 0.5, 1]) {
    const p = {
      type: 0,
      a: -1,
      k,
      b: 2,
      shift: 1,
      probe: 2,
      analysis: 0,
      dx: 1,
    };
    host.innerHTML = renderToStaticMarkup(
      <FunctionStudio p={p} onChange={() => {}} mappingGuide />,
    );
    const mapping = host.querySelector(
      '[aria-label="原函数点与变换后点的对应关系"]',
    );
    const original = graphPoint(k, k * k, 6);
    const transformed = graphPoint(2, 2 - k * k, 6);
    expect(mapping.querySelector("path").getAttribute("d")).toBe(
      `M${original[0]} ${original[1]}L${transformed[0]} ${transformed[1]}`,
    );
    expect(mapping.textContent).toContain("原图点");
  }
  for (const p of [
    { type: 0, a: 1, k: 0, b: 0, shift: 0, probe: 1 },
    { type: 7, a: 1, k: 1, b: 2, shift: 2, probe: 1 },
  ]) {
    host.innerHTML = renderToStaticMarkup(
      <FunctionStudio p={p} onChange={() => {}} mappingGuide />,
    );
    expect(
      host.querySelector('[aria-label="原函数点与变换后点的对应关系"]'),
    ).toBeNull();
  }
});

it("reflection guide follows b and mirrored probes have equal opposite offsets", () => {
  const node = document.createElement("div");
  for (const b of [-2, 0, 2])
    for (const a of [-1, 0, 1]) {
      const p = { type: 0, a, k: 1, b, shift: 0, probe: 1, analysis: 0, dx: 1 };
      node.innerHTML = renderToStaticMarkup(
        <FunctionStudio p={p} onChange={() => {}} transformationGuide />,
      );
      const line = node.querySelector(
        '[aria-label="探针相对参照线的竖直距离"]',
      );
      const point = graphPoint(1, functionValue(p, 1), 6);
      expect(line.getAttribute("d")).toBe(
        `M${point[0]} ${graphPoint(0, b, 6)[1]}V${point[1]}`,
      );
      expect(
        functionValue(p, 1) + functionValue({ ...p, a: -a }, 1),
      ).toBeCloseTo(2 * b);
    }
  node.innerHTML = renderToStaticMarkup(
    <FunctionStudio
      p={{ type: 0, a: 1, k: 1, b: 0, shift: 0, probe: 1 }}
      onChange={() => {}}
    />,
  );
  expect(node.querySelector('[aria-label="纵向变换参照线"]')).toBeNull();
});

it("direct reflection changes only a and reverses twice without losing the setup", async () => {
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  const host = document.createElement("div"),
    root = createRoot(host);
  const initial = {
    type: 1,
    a: 2,
    k: -1,
    b: 3,
    shift: 0.5,
    probe: 1,
    analysis: 0,
    dx: 1,
  };
  let p = { ...initial };
  const onChange = vi.fn((key, value) => {
    p = { ...p, [key]: value };
  });
  const render = () =>
    act(() =>
      root.render(
        <FunctionStudio p={p} onChange={onChange} transformationGuide />,
      ),
    );
  const button = () =>
    [...host.querySelectorAll("button")].find(
      (b) => b.textContent === "当前图像翻折（a 变号）",
    );
  try {
    await render();
    await act(() => button().click());
    expect(onChange).toHaveBeenCalledExactlyOnceWith("a", -2);
    expect(p).toEqual({ ...initial, a: -2 });
    await render();
    await act(() => button().click());
    expect(p).toEqual(initial);
    p = { ...p, a: 0 };
    await render();
    expect(button().disabled).toBe(true);
  } finally {
    await act(() => root.unmount());
  }
});
