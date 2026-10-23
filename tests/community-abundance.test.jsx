// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { it, expect } from "vitest";
import CommunityComparison from "../src/CommunityComparison.jsx";
import { abundanceRows } from "../src/CommunityAbundance.jsx";
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
const groups = [
  ["plants", "植物"],
  ["insects", "昆虫"],
  ["birds", "鸟类"],
  ["fungi", "真菌"],
];
const a = { plants: 4, insects: 4, birds: 4, fungi: 4 },
  b = { plants: 8, insects: 8, birds: 8, fungi: 8 };
it("doubling every count doubles count bars but preserves independently normalized proportions", () => {
  const countsA = abundanceRows(a, groups, "count"),
    countsB = abundanceRows(b, groups, "count");
  countsA.forEach((row, i) => expect(countsB[i].width).toBe(2 * row.width));
  expect(abundanceRows(a, groups, "percent").map((x) => x.width)).toEqual(
    abundanceRows(b, groups, "percent").map((x) => x.width),
  );
});
it("switching representation preserves the captured reference and current sample", async () => {
  const host = document.createElement("div"),
    root = createRoot(host);
  const click = async (text) =>
    act(() =>
      [...host.querySelectorAll("button")]
        .find((x) => x.textContent === text)
        .click(),
    );
  try {
    await act(() => root.render(<CommunityComparison p={a} />));
    await click("保存当前为 A 对照");
    await act(() => root.render(<CommunityComparison p={b} />));
    expect(
      Number(
        host.querySelector('[data-abundance="b-plants"]').getAttribute("width"),
      ),
    ).toBe(
      2 *
        Number(
          host
            .querySelector('[data-abundance="a-plants"]')
            .getAttribute("width"),
        ),
    );
    await click("按占比比较");
    expect(
      host.querySelector('[data-abundance="b-plants"]').getAttribute("width"),
    ).toBe(
      host.querySelector('[data-abundance="a-plants"]').getAttribute("width"),
    );
    expect(host.textContent).toContain("A · 保留对照");
    await click("移除 A 对照");
    expect(host.querySelector('[data-abundance="a-plants"]')).toBeNull();
  } finally {
    await act(() => root.unmount());
  }
});
