// @vitest-environment jsdom
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { it, expect, vi } from "vitest";
import { SciencePreviewFrame } from "../src/SciencePreview.jsx";
import {
  spatialPreviewIds,
  sciencePreviewIds,
  previewParameters,
} from "../src/previewCatalog.mjs";
import { nativeMotionPreviewIds } from "../src/motionTopics.mjs";
import { workbenches } from "../src/courseCatalog.mjs";
import { subscribePreviewClock } from "../src/usePreviewClock.js";
it("every homepage card routes to a native renderer", () => {
  const ids = [...nativeMotionPreviewIds, ...sciencePreviewIds];
  for (const l of workbenches) expect(ids).toContain(l.id);
  expect(new Set(ids).size).toBe(ids.length);
});
it("all migrated vector previews render finite changing states", () => {
  for (const id of sciencePreviewIds.filter(
    (id) => !spatialPreviewIds.includes(id),
  )) {
    const views = [0, 1.7, 4.2].map((time) =>
      renderToStaticMarkup(<SciencePreviewFrame id={id} time={time} />),
    );
    for (const view of views)
      expect(view, id).not.toMatch(/NaN|Infinity|undefined/);
    expect(new Set(views).size, id).toBeGreaterThan(1);
  }
});
it("a shared frame loop stops when its last visible subscriber leaves", () => {
  const callbacks = new Map();
  let n = 0;
  vi.stubGlobal(
    "requestAnimationFrame",
    vi.fn((fn) => {
      callbacks.set(++n, fn);
      return n;
    }),
  );
  vi.stubGlobal("cancelAnimationFrame", vi.fn());
  try {
    const a = vi.fn(),
      b = vi.fn(),
      offA = subscribePreviewClock(a),
      offB = subscribePreviewClock(b);
    expect(requestAnimationFrame).toHaveBeenCalledTimes(1);
    callbacks.get(1)(100);
    expect(a).toHaveBeenCalledWith(0);
    expect(b).toHaveBeenCalledWith(0);
    offA();
    offB();
    expect(cancelAnimationFrame).toHaveBeenCalledTimes(1);
  } finally {
    vi.unstubAllGlobals();
  }
});
it("the optical preview keeps the screen at the calculated image distance", () => {
  for (let t = 0; t < 10; t += 0.1) {
    const p = previewParameters("lens", {}, t);
    expect(1 / p.u + 1 / p.screen).toBeCloseTo(0.1, 12);
  }
});
