// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { it, expect, vi } from "vitest";
vi.mock("../src/SpatialPreview.jsx", () => ({
  default: ({ id, playing }) => (
    <output data-scene={id}>{playing ? "running" : "paused"}</output>
  ),
}));
import HeroTerrain from "../src/HeroTerrain.jsx";
it("autoplays the shared terrain preview when visible and lets the reader pause", async () => {
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  vi.spyOn(document, "hidden", "get").mockReturnValue(false);
  vi.stubGlobal("matchMedia", () => ({ matches: false }));
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      constructor(callback) {
        this.callback = callback;
      }
      observe() {
        this.callback([{ isIntersecting: true }]);
      }
      disconnect() {}
    },
  );
  const host = document.createElement("div"),
    root = createRoot(host);
  try {
    await act(async () => root.render(<HeroTerrain />));
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 30));
    });
    expect(host.querySelector('output[data-scene="contour"]').textContent).toBe(
      "running",
    );
    await act(async () => host.querySelector("button").click());
    expect(host.querySelector("output").textContent).toBe("paused");
  } finally {
    await act(async () => root.unmount());
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  }
});
