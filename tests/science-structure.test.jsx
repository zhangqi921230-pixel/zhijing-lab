// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { it, expect } from "vitest";
import { existsSync } from "node:fs";
import StructureAtlas from "../src/science/StructureAtlas.jsx";
import { structureAtlases } from "../src/science/structureAtlases.mjs";
import { scienceById } from "../src/science/catalog.mjs";
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
it("every published structure has a topic, a local image, bounded labels and traceable source", () => {
  expect(Object.keys(structureAtlases)).toHaveLength(45);
  for (const [id, a] of Object.entries(structureAtlases)) {
    expect(scienceById[id]).toBeTruthy();
    expect(existsSync("public/" + a.file)).toBe(true);
    expect(a.parts.length).toBeGreaterThanOrEqual(3);
    expect(new Set(a.parts.map((p) => p.name)).size).toBe(a.parts.length);
    expect(a.scope.length).toBeGreaterThan(15);
    expect(a.review.length).toBeGreaterThan(15);
    expect(a.sources.length).toBeGreaterThan(0);
    for (const p of a.parts) {
      expect(p.x).toBeGreaterThanOrEqual(0);
      expect(p.x).toBeLessThanOrEqual(100);
      expect(p.y).toBeGreaterThanOrEqual(0);
      expect(p.y).toBeLessThanOrEqual(100);
      expect(p.short.length).toBeGreaterThan(5);
      expect(p.detail.length).toBeGreaterThan(15);
    }
    for (const [, url] of a.sources)
      expect(new URL(url).protocol).toBe("https:");
  }
});
it("every structure selection, zoom and label toggle keeps the selected explanation accessible", async () => {
  const host = document.createElement("div"),
    root = createRoot(host);
  try {
    for (const [id, a] of Object.entries(structureAtlases)) {
      await act(() => root.render(<StructureAtlas key={id} id={id} />));
      for (let i = 0; i < a.parts.length; i++) {
        await act(() => host.querySelectorAll(".structure-note")[i].click());
        expect(host.querySelector(".structure-detail").textContent).toContain(
          a.parts[i].detail,
        );
        expect(
          host
            .querySelectorAll(".structure-pin")
            [i].getAttribute("aria-pressed"),
        ).toBe("true");
      }
      const click = async (text) =>
        act(() =>
          [...host.querySelectorAll("button")]
            .find((b) => b.textContent === text)
            .click(),
        );
      await click("放大当前结构");
      expect(host.querySelector(".structure-board").dataset.zoom).toBe("true");
      await click("下一结构");
      expect(host.querySelector(".structure-detail").textContent).toContain(
        a.parts[0].detail,
      );
      await click("隐藏结构标注");
      expect(host.querySelector(".structure-notes")).toBeNull();
      expect(host.querySelector(".structure-detail").textContent).toContain(
        a.parts[0].detail,
      );
      await click("上一结构");
      expect(host.querySelector(".structure-notes")).not.toBeNull();
      expect(host.querySelector(".structure-detail").textContent).toContain(
        a.parts.at(-1).detail,
      );
    }
  } finally {
    await act(() => root.unmount());
  }
});
it("image failure leaves structure explanations usable", async () => {
  const host = document.createElement("div"),
    root = createRoot(host);
  try {
    await act(() => root.render(<StructureAtlas id="thermos" />));
    await act(() =>
      host.querySelector("img").dispatchEvent(new Event("error")),
    );
    expect(host.textContent).toContain("图片暂未加载");
    await act(() => host.querySelectorAll(".structure-note")[2].click());
    expect(host.querySelector(".structure-detail").textContent).toContain(
      "真空",
    );
    expect(
      [...host.querySelectorAll("button")].find(
        (b) => b.textContent === "放大当前结构",
      ).disabled,
    ).toBe(true);
  } finally {
    await act(() => root.unmount());
  }
});
