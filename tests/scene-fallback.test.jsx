// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { it, expect, vi } from "vitest";
vi.mock("three", async (importOriginal) => ({
  ...(await importOriginal()),
  WebGLRenderer: class {
    constructor() {
      throw new Error("WebGL unavailable");
    }
  },
}));
import ThreeScene from "../src/ThreeScene.jsx";

it("WebGL 初始化失败后提供可用的原理图入口，并能安全卸载", async () => {
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  const host = document.createElement("div"),
    root = createRoot(host);
  const fallback = vi.fn();
  document.body.append(host);
  try {
    await act(() =>
      root.render(<ThreeScene id="water" p={{}} onUseDiagram={fallback} />),
    );
    expect(host.querySelector('[role="alert"]').textContent).toContain(
      "参数与记录仍然保留",
    );
    expect(host.querySelector('[aria-label="三维场景缩放"]')).toBeNull();
    const button = [...host.querySelectorAll("button")].find(
      (b) => b.textContent === "切换原理图，继续实验",
    );
    await act(() => button.click());
    expect(fallback).toHaveBeenCalledTimes(1);
    await act(() => root.render(<ThreeScene id="cell" p={{}} />));
    expect(host.textContent).not.toContain("切换原理图，继续实验");
    expect(host.textContent).toContain("重新加载三维场景");
  } finally {
    await act(() => root.unmount());
    host.remove();
  }
});
