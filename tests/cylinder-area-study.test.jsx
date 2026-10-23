// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { it, expect, vi } from "vitest";
import CylinderAreaStudy from "../src/CylinderAreaStudy.jsx";
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
it("pins a reference independently, doubles one dimension, and bounds shortcuts", async () => {
  const host = document.createElement("div"),
    root = createRoot(host),
    change = vi.fn(),
    pause = vi.fn();
  const render = (p) =>
    act(() =>
      root.render(
        <CylinderAreaStudy p={p} onChange={change} onPause={pause} />,
      ),
    );
  try {
    await render({ radius: 1, height: 2 });
    await act(() => host.querySelectorAll("button")[2].click());
    expect(change).toHaveBeenLastCalledWith({ radius: 2, height: 2 });
    await render({ radius: 2, height: 2 });
    expect(host.textContent).toContain("侧面积 2.00 倍；底面积 4.00 倍");
    await act(() => host.querySelectorAll("button")[0].click());
    expect(pause).toHaveBeenCalled();
    expect(host.querySelectorAll("button")[2].disabled).toBe(true);
    await render({ radius: 2, height: 4 });
    expect(host.textContent).toContain("侧面积 2.00 倍；底面积 1.00 倍");
    await act(() => host.querySelectorAll("button")[1].click());
    expect(change).toHaveBeenLastCalledWith({ radius: 2, height: 2 });
  } finally {
    await act(() => root.unmount());
  }
});
