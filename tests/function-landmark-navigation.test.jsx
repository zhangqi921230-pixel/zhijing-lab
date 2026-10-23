// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { expect, it, vi } from "vitest";
import FunctionStudio from "../src/FunctionStudio.jsx";

it("定位顶点只改变探针，重合后保留名称，超出探针范围不截断定位", async () => {
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  const host = document.createElement("div");
  const root = createRoot(host);
  const onChange = vi.fn();
  const p = { type: 0, a: 1, b: 2, k: 1, shift: 3, probe: 1, analysis: 0 };
  const render = async (params) =>
    act(() => root.render(<FunctionStudio p={params} onChange={onChange} />));
  try {
    await render(p);
    const button = [...host.querySelectorAll("button")].find(
      (b) => b.textContent === "观察顶点",
    );
    await act(() => button.click());
    expect(onChange).toHaveBeenCalledExactlyOnceWith("probe", 3);
    await render({ ...p, probe: 3 });
    expect(
      host.querySelector('[aria-label="探针坐标读数"]').textContent,
    ).toContain("顶点 P (3, 2)");
    expect(host.querySelector('[aria-label="变换特征点读数"]')).toBeNull();
    await render({ ...p, type: 7, k: 0.1 });
    const outside = [...host.querySelectorAll("button")].find(
      (b) => b.textContent === "观察对应点",
    );
    expect(outside.disabled).toBe(true);
    expect(outside.title).toContain("超出探针");
    await act(() => outside.click());
    expect(onChange).toHaveBeenCalledTimes(1);
  } finally {
    await act(() => root.unmount());
  }
});
