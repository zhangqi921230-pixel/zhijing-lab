// @vitest-environment jsdom
import React, { act, useState } from "react";
import { createRoot } from "react-dom/client";
import { it, expect, vi } from "vitest";
import {
  ThemeProvider,
  ThemeSwitch,
  THEME_KEY,
  panelHeading,
} from "../src/Theme.jsx";
import { usePreviewPlayback } from "../src/AnimatedPreview.jsx";
import { workbenches } from "../src/courseCatalog.mjs";
import {
  nativeMotionPreviewIds,
  motionPosterPath,
} from "../src/motionTopics.mjs";
import { readFileSync, existsSync } from "node:fs";
import { applySceneTheme } from "../src/sceneTheme.mjs";
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
it("keeps lesson state when switching appearance and restores saved choice", async () => {
  localStorage.clear();
  let root = createRoot(document.createElement("div"));
  let host = document.createElement("div");
  root = createRoot(host);
  function Lesson() {
    const [n, set] = useState(7);
    return (
      <>
        <ThemeSwitch />
        <button onClick={() => set(n + 1)}>{n}</button>
      </>
    );
  }
  await act(() =>
    root.render(
      <ThemeProvider>
        <Lesson />
      </ThemeProvider>,
    ),
  );
  await act(() => host.querySelectorAll("button")[2].click());
  await act(() => host.querySelectorAll("button")[1].click());
  expect(document.documentElement.dataset.theme).toBe("dark");
  expect(localStorage.getItem(THEME_KEY)).toBe("dark");
  expect(host.querySelectorAll("button")[2].textContent).toBe("8");
  await act(() => root.unmount());
  root = createRoot(host);
  await act(() =>
    root.render(
      <ThemeProvider>
        <ThemeSwitch />
      </ThemeProvider>,
    ),
  );
  expect(host.querySelectorAll("button")[1].getAttribute("aria-pressed")).toBe(
    "true",
  );
  await act(() => root.unmount());
});
it("uses subject appropriate headings", () => {
  expect(panelHeading("math")).toBe("图形与变量");
  expect(panelHeading("geography")).toBe("观察与设置");
  expect(panelHeading("chemistry")).toBe("实验条件");
});
it("every homepage workbench has a native animation or a multi-state gif, and a poster", () => {
  const manifest = JSON.parse(
    readFileSync("public/previews/motion/manifest.json"),
  );
  expect(manifest.map((x) => x.id).sort()).toEqual(
    workbenches
      .filter((x) => !nativeMotionPreviewIds.includes(x.id))
      .map((x) => x.id)
      .sort(),
  );
  for (const id of nativeMotionPreviewIds)
    expect(
      existsSync(`public/${motionPosterPath(id).replace(/^\.\//, "")}`),
    ).toBe(true);
  for (const x of manifest) {
    expect(x.uniqueCapturedFrames).toBeGreaterThan(1);
    expect(
      readFileSync(`public/previews/motion/${x.id}.gif`)
        .subarray(0, 6)
        .toString(),
    ).toBe("GIF89a");
    expect(existsSync(`public/previews/motion/${x.id}.webp`)).toBe(true);
    const gif = readFileSync(`public/previews/motion/${x.id}.gif`);
    const loop = gif.indexOf(Buffer.from("NETSCAPE2.0"));
    expect(loop).toBeGreaterThan(0);
    expect([...gif.subarray(loop + 11, loop + 16)]).toEqual([3, 1, 0, 0, 0]);
  }
});
it("autoplays all visible previews together and preserves pause/offscreen behavior", async () => {
  let model;
  window.matchMedia = vi.fn(() => ({ matches: true }));
  function Harness() {
    model = usePreviewPlayback();
    return null;
  }
  const root = createRoot(document.createElement("div"));
  await act(() => root.render(<Harness />));
  expect(model.enabled).toBe(true);
  await act(() => {
    model.visibility("cell", true);
    model.visibility("ohm", true);
  });
  expect(model.isPlaying("cell")).toBe(true);
  expect(model.isPlaying("ohm")).toBe(true);
  await act(() => model.visibility("cell", false));
  expect(model.isPlaying("cell")).toBe(false);
  expect(model.isPlaying("ohm")).toBe(true);
  await act(() => model.setEnabled(false));
  expect(model.isPlaying("ohm")).toBe(false);
  await act(() => model.setEnabled(true));
  expect(model.isPlaying("ohm")).toBe(true);
  await act(() => root.unmount());
});
it("updates scene colors without replacing geometry or material", () => {
  const floor = { material: { color: { set: vi.fn() } } };
  const scene = { background: { set: vi.fn() }, getObjectByName: () => floor };
  applySceneTheme(scene, "dark");
  expect(scene.background.set).toHaveBeenCalledWith("#101a23");
  expect(floor.material.color.set).toHaveBeenCalledWith("#14222b");
});
