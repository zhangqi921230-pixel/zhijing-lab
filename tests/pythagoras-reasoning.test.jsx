// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { it, expect, vi } from "vitest";
import PythagorasScene from "../src/PythagorasScene.jsx";
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
it("remaining-area reasoning seeks the completed arrangement and is not presented for overlapping intermediate pieces", async () => {
  const host = document.createElement("div"),
    root = createRoot(host),
    change = vi.fn();
  try {
    await act(() =>
      root.render(
        <PythagorasScene p={{ a: 3, b: 4, arrange: 50 }} onChange={change} />,
      ),
    );
    await act(() =>
      host.querySelectorAll(".proof-reasoning-steps button")[2].click(),
    );
    expect(change).toHaveBeenCalledWith("arrange", 100);
    expect(host.querySelector(".proof-reasoning").textContent).toContain(
      "四块合计 2ab=24",
    );
    await act(() =>
      root.render(
        <PythagorasScene p={{ a: 3, b: 4, arrange: 100 }} onChange={change} />,
      ),
    );
    expect(host.querySelector(".proof-reasoning").textContent).toContain(
      "49 − 24 = 25",
    );
    await act(() =>
      root.render(
        <PythagorasScene
          p={{ a: 1.5, b: 2, arrange: 100 }}
          onChange={change}
        />,
      ),
    );
    expect(host.querySelector(".proof-reasoning").textContent).toContain(
      "12.25 − 6 = 6.25",
    );
  } finally {
    await act(() => root.unmount());
  }
});
