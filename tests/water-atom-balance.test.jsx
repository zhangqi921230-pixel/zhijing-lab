// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { it, expect, vi } from "vitest";
import WaterAtomBalance, {
  waterAtoms,
  waterAtomPosition,
} from "../src/WaterAtomBalance.jsx";
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
it("atom identities and counts persist while endpoints form the balanced molecules", () => {
  expect(waterAtoms.filter((a) => a.element === "H")).toHaveLength(4);
  expect(waterAtoms.filter((a) => a.element === "O")).toHaveLength(2);
  for (const atom of waterAtoms) {
    expect(waterAtomPosition(atom, 0)).toEqual(atom.from);
    expect(waterAtomPosition(atom, 100)[0]).toBeCloseTo(atom.to[0], 10);
    expect(waterAtomPosition(atom, 100)[1]).toBeCloseTo(atom.to[1], 10);
    for (let p = 0; p <= 100; p++) {
      const [x, y] = waterAtomPosition(atom, p);
      expect(x).toBeGreaterThan(30);
      expect(x).toBeLessThan(610);
      expect(y).toBeGreaterThan(65);
      expect(y).toBeLessThan(265);
    }
  }
});
it("step controls keep six atoms, and playback cancels on pause and unmount", async () => {
  let next = 0;
  const frames = new Map();
  vi.stubGlobal("requestAnimationFrame", (cb) => {
    frames.set(++next, cb);
    return next;
  });
  vi.stubGlobal("cancelAnimationFrame", (id) => frames.delete(id));
  const host = document.createElement("div"),
    root = createRoot(host),
    button = (name) =>
      [...host.querySelectorAll("button")].find((b) => b.textContent === name);
  try {
    await act(() => root.render(<WaterAtomBalance />));
    for (const [label, value] of [
      ["追踪原子", "50"],
      ["反应后", "100"],
      ["反应前", "0"],
    ]) {
      await act(() => button(label).click());
      expect(host.querySelector('[aria-label="原子重排进度"]').value).toBe(
        value,
      );
      expect(host.querySelectorAll("[data-atom]")).toHaveLength(6);
    }
    await act(() => button("播放原子重排").click());
    for (const time of [0, 100, 200]) {
      const entries = [...frames];
      frames.clear();
      await act(() => entries.forEach(([, cb]) => cb(time)));
    }
    expect(Number(host.querySelector("input").value)).toBe(5);
    await act(() => button("暂停原子重排").click());
    expect(frames.size).toBe(0);
  } finally {
    await act(() => root.unmount());
    vi.unstubAllGlobals();
  }
});
