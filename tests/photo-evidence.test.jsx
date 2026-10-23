// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { it, expect, vi } from "vitest";
import PhotoEvidence, { changedPhotoFactors } from "../src/PhotoEvidence.jsx";
import { photo } from "../src/models.mjs";
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
it("distinguishes a controlled comparison from confounded conditions", () => {
  const a = { light: 20, co2: 70, temp: 25 };
  expect(changedPhotoFactors(a, { ...a, light: 80 })).toEqual(["光照"]);
  expect(changedPhotoFactors(a, { light: 80, co2: 20, temp: 40 })).toEqual([
    "光照",
    "CO₂ 供给",
    "温度",
  ]);
  expect(changedPhotoFactors(a, { ...a })).toEqual([]);
});
it("records immutable conditions, blocks duplicates, and identifies multiple changes", async () => {
  const host = document.createElement("div"),
    root = createRoot(host),
    stop = vi.fn();
  const render = async (p) =>
    act(() => root.render(<PhotoEvidence p={p} onRecord={stop} />));
  const record = () => host.querySelector("button");
  try {
    const a = { light: 20, co2: 70, temp: 25 };
    await render(a);
    await act(() => record().click());
    expect(stop).toHaveBeenCalledOnce();
    expect(record().disabled).toBe(true);
    const b = { ...a, light: 80 };
    await render(b);
    expect(host.querySelector('[role="status"]').textContent).toContain(
      "仅改变光照",
    );
    await act(() => record().click());
    expect(host.querySelectorAll("tbody tr")).toHaveLength(2);
    expect(host.querySelector("tbody tr").textContent).toContain(
      photo(a).toFixed(2),
    );
    await render({ ...b, temp: 40 });
    expect(host.querySelector('[role="status"]').textContent).toContain(
      "不能把速率差异单独归因",
    );
    await act(() => host.querySelectorAll("button")[1].click());
    expect(host.querySelector("table")).toBeNull();
  } finally {
    await act(() => root.unmount());
  }
});
it("bounds observations to eight and resets on chapter key change", async () => {
  const host = document.createElement("div"),
    root = createRoot(host);
  try {
    for (let i = 0; i < 9; i++) {
      await act(() =>
        root.render(
          <PhotoEvidence
            key="0"
            p={{ light: i * 10, co2: 70, temp: 25 }}
            onRecord={() => {}}
          />,
        ),
      );
      await act(() => host.querySelector("button").click());
    }
    expect(host.querySelectorAll("tbody tr")).toHaveLength(8);
    expect(host.querySelector("button").disabled).toBe(true);
    await act(() =>
      root.render(
        <PhotoEvidence
          key="1"
          p={{ light: 20, co2: 70, temp: 25 }}
          onRecord={() => {}}
        />,
      ),
    );
    expect(host.querySelector("table")).toBeNull();
  } finally {
    await act(() => root.unmount());
  }
});
