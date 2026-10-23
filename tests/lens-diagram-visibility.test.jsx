// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { it, expect } from "vitest";
import SvgScene from "../src/SvgScene.jsx";

it("hides helper rays independently of the image, and extinguishes both with power off", async () => {
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  const host = document.createElement("div"),
    root = createRoot(host);
  const layer = (name) => host.querySelector(`[data-optical-layer="${name}"]`);
  const show = async (overrides) =>
    act(() =>
      root.render(
        <SvgScene
          id="lens"
          p={{ u: 6, f: 10, screen: 15, rays: 1, light: 1, ...overrides }}
        />,
      ),
    );
  try {
    await show({});
    expect(layer("actual-rays")).not.toBeNull();
    expect(layer("virtual-rays")).not.toBeNull();
    await show({ rays: 0 });
    expect(layer("actual-rays")).toBeNull();
    expect(layer("virtual-rays")).toBeNull();
    expect(layer("image")).not.toBeNull();
    expect(layer("illumination").getAttribute("visibility")).toBe("visible");
    await show({ light: 0 });
    expect(layer("illumination").getAttribute("visibility")).toBe("hidden");
    expect(host.textContent).toContain("光源已关闭");
    await show({ u: 20, rays: 0 });
    expect(layer("image")).not.toBeNull();
    expect(layer("actual-rays")).toBeNull();
    await show({ u: 10 });
    expect(layer("image")).toBeNull();
    expect(layer("actual-rays")).not.toBeNull();
  } finally {
    await act(() => root.unmount());
  }
});
