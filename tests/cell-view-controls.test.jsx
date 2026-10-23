// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { it, expect, vi } from "vitest";
import CellViewControls from "../src/CellViewControls.jsx";

it("separates the selected object from direction with one selection per group", async () => {
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  const host = document.createElement("div"),
    root = createRoot(host);
  const onPart = vi.fn(),
    onAngle = vi.fn();
  try {
    for (const [view, angle, object, direction] of [
      ["chloroplast", 2, "叶绿体近景", "俯视"],
      ["mitochondrion", 1, "线粒体近景", "正视"],
      ["perspective", 2, "全景", "立体"],
      ["front", 0, "全景", "正视"],
      ["top", 0, "全景", "俯视"],
    ]) {
      await act(() =>
        root.render(
          <CellViewControls
            view={view}
            angle={angle}
            onPart={onPart}
            onAngle={onAngle}
          />,
        ),
      );
      for (const [name, text] of [
        ["观察对象", object],
        ["观察方向", direction],
      ]) {
        const selected = host.querySelectorAll(
          `[aria-label="${name}"] [aria-pressed="true"]`,
        );
        expect(selected).toHaveLength(1);
        expect(selected[0].textContent).toBe(text);
      }
    }
    const button = (text) =>
      [...host.querySelectorAll("button")].find((b) => b.textContent === text);
    await act(() => button("细胞核近景").click());
    expect(onPart).toHaveBeenLastCalledWith(1);
    await act(() => button("俯视").click());
    expect(onAngle).toHaveBeenLastCalledWith(2);
  } finally {
    await act(() => root.unmount());
  }
});
