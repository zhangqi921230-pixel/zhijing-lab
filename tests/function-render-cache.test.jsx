// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { it, expect, vi } from "vitest";
vi.mock("../src/advancedModels.mjs", async (importOriginal) => {
  const original = await importOriginal();
  return { ...original, functionValue: vi.fn(original.functionValue) };
});
import { functionValue } from "../src/advancedModels.mjs";
import FunctionStudio from "../src/FunctionStudio.jsx";
import { renderToStaticMarkup } from "react-dom/server";

it("退化反比例和对数的空心点覆盖后绘制的探针与辅助层", () => {
  for (const type of [3, 7]) {
    const host = document.createElement("div");
    host.innerHTML = renderToStaticMarkup(
      <FunctionStudio
        p={{
          type,
          a: 0,
          k: 1,
          b: 1,
          shift: 0,
          probe: 0.01,
          analysis: 0,
          dx: 1,
        }}
        onChange={() => {}}
      />,
    );
    const marker = host.querySelector('[aria-label="不包含的定义域端点"]');
    expect(marker).not.toBeNull();
    expect(marker.parentElement.lastElementChild).toBe(marker);
    expect(marker.getAttribute("fill")).toBe("#f5f3ee");
  }
});

it("探针改变复用采样与SVG路径，系数和视野改变仍更新曲线", async () => {
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  const host = document.createElement("div"),
    root = createRoot(host),
    onChange = () => {};
  document.body.append(host);
  const p = {
    type: 0,
    a: 1,
    k: 1,
    b: 0,
    shift: 0,
    probe: 1,
    analysis: 0,
    dx: 1,
  };
  const render = async (params) => {
    await act(() =>
      root.render(<FunctionStudio p={params} onChange={onChange} />),
    );
  };
  const curve = () =>
    host.querySelector('path[stroke="#be790b"]').getAttribute("d");
  try {
    functionValue.mockClear();
    await render(p);
    expect(functionValue.mock.calls.length).toBeGreaterThan(1000);
    const initial = curve();
    functionValue.mockClear();
    await render({ ...p, probe: 2 });
    expect(functionValue.mock.calls.length).toBeLessThan(20);
    expect(curve()).toBe(initial);
    functionValue.mockClear();
    await render({ ...p, a: 2 });
    expect(functionValue.mock.calls.length).toBeGreaterThan(800);
    expect(curve()).not.toBe(initial);
    const transformed = curve();
    functionValue.mockClear();
    const select = host.querySelector("select");
    await act(() => {
      select.value = "12";
      select.dispatchEvent(new Event("change", { bubbles: true }));
    });
    expect(functionValue.mock.calls.length).toBeGreaterThan(1000);
    expect(curve()).not.toBe(transformed);
  } finally {
    await act(() => root.unmount());
    host.remove();
  }
});
