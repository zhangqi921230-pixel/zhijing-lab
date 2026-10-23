// @vitest-environment jsdom
import React, { act, useState } from "react";
import { createRoot } from "react-dom/client";
import { it, expect, vi } from "vitest";
import PhotoResponsePlot from "../src/PhotoResponsePlot.jsx";
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
it("scans one variable, preserves reference conditions and stops on external adjustment", async () => {
  let id = 0,
    now = 0,
    hidden = false;
  const frames = new Map();
  vi.stubGlobal("requestAnimationFrame", (fn) => {
    frames.set(++id, fn);
    return id;
  });
  vi.stubGlobal("cancelAnimationFrame", (id) => frames.delete(id));
  vi.spyOn(document, "hidden", "get").mockImplementation(() => hidden);
  const step = async (ms) => {
    now += ms;
    const callbacks = [...frames.values()];
    frames.clear();
    await act(() => callbacks.forEach((fn) => fn(now)));
  };
  const host = document.createElement("div"),
    root = createRoot(host);
  let set;
  function Harness() {
    const [p, update] = useState({ light: 80, co2: 10, temp: 25 });
    set = update;
    return (
      <PhotoResponsePlot
        p={p}
        chapter={3}
        onChange={(key, value) => update((old) => ({ ...old, [key]: value }))}
      />
    );
  }
  try {
    await act(() => root.render(<Harness />));
    const button = (text) =>
      [...host.querySelectorAll("button")].find((b) => b.textContent === text);
    await act(() => button("保留当前曲线作对照").click());
    const path = host.querySelector("[data-reference-curve]").getAttribute("d");
    await act(() => set((old) => ({ ...old, co2: 80 })));
    expect(host.querySelector("[data-reference-curve]").getAttribute("d")).toBe(
      path,
    );
    await act(() => button("扫描本节变量").click());
    expect(
      host.querySelector("[role=slider]").getAttribute("aria-valuenow"),
    ).toBe("0");
    await step(0);
    await step(40);
    expect(
      Number(host.querySelector("[role=slider]").getAttribute("aria-valuenow")),
    ).toBeCloseTo(0.67, 2);
    hidden = true;
    await act(() => document.dispatchEvent(new Event("visibilitychange")));
    expect(frames.size).toBe(0);
    await step(5000);
    hidden = false;
    await act(() => document.dispatchEvent(new Event("visibilitychange")));
    await step(0);
    await step(40);
    await step(40);
    expect(
      host.querySelector("[role=slider]").getAttribute("aria-valuenow"),
    ).toBe("2");
    await act(() => set((old) => ({ ...old, temp: 30 })));
    expect(button("扫描本节变量")).toBeTruthy();
    expect(frames.size).toBe(0);
    await step(500);
    expect(
      host.querySelector("[role=slider]").getAttribute("aria-valuenow"),
    ).toBe("2");
    await act(() => button("扫描本节变量").click());
    await step(0);
    await step(40);
    await act(() => button("CO₂ 设为 80%").click());
    expect(frames.size).toBe(0);
    expect(button("扫描本节变量")).toBeTruthy();
    expect(host.querySelector("[data-reference-curve]").getAttribute("d")).toBe(
      path,
    );
    await act(() => button("扫描本节变量").click());
    await step(0);
    for (let i = 0; i < 60; i++) await step(100);
    expect(
      host.querySelector("[role=slider]").getAttribute("aria-valuenow"),
    ).toBe("100");
    expect(frames.size).toBe(0);
    expect(button("扫描本节变量")).toBeTruthy();
  } finally {
    await act(() => root.unmount());
    expect(frames.size).toBe(0);
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  }
});
