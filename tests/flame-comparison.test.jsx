// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { it, expect, vi } from "vitest";
import FlameComparison from "../src/FlameComparison.jsx";
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
it("compares identical samples with only contamination differing and cleans through the provided action", async () => {
  const host = document.createElement("div"),
    root = createRoot(host),
    clean = vi.fn();
  const render = async (sample, contamination) =>
    act(() =>
      root.render(
        <FlameComparison p={{ sample, contamination }} onClean={clean} />,
      ),
    );
  try {
    await render("copper", 0.5);
    const paths = host.querySelectorAll('path[fill="#ffd12e"]');
    expect(paths[0].getAttribute("opacity")).toBe("0");
    expect(paths[1].getAttribute("opacity")).toBe("0.425");
    await act(() => host.querySelector("button").click());
    expect(clean).toHaveBeenCalledOnce();
    await render("copper", 0);
    expect(host.querySelector("button").disabled).toBe(true);
    expect(host.textContent).toContain("两幅参考应一致");
    await render("sodium", 0.5);
    expect(host.textContent).toContain("不能凭颜色区分");
  } finally {
    await act(() => root.unmount());
  }
});
