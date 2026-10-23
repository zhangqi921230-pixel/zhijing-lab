// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { it, expect } from "vitest";
import FlameComparison from "../src/FlameComparison.jsx";
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
it("holds sample and pollution independently, identifies confounding and clears at chapter change", async () => {
  const host = document.createElement("div"),
    root = createRoot(host);
  const render = (sample, contamination, key = 0) =>
    act(() =>
      root.render(
        <FlameComparison
          key={key}
          p={{ sample, contamination }}
          onClean={() => {}}
        />,
      ),
    );
  const click = (text) =>
    act(() =>
      Array.from(host.querySelectorAll("button"))
        .find((b) => b.textContent === text)
        .click(),
    );
  try {
    await render("sodium", 0);
    await click("保留当前观察作参考");
    await render("potassium", 0);
    expect(host.querySelector('[role="status"]').textContent).toContain(
      "仅改变样品",
    );
    expect(
      host.querySelectorAll("svg")[0].getAttribute("aria-label"),
    ).toContain("钠");
    await render("potassium", 0.5);
    expect(host.querySelector('[role="status"]').textContent).toContain(
      "都改变了",
    );
    await click("用当前观察更新参考");
    await render("potassium", 0);
    expect(host.querySelector('[role="status"]').textContent).toContain(
      "仅改变污染程度",
    );
    expect(
      host.querySelectorAll('path[fill="#ffd12e"]')[0].getAttribute("opacity"),
    ).toBe("0.425");
    await click("恢复同一样品清洁对照");
    expect(host.querySelector('[role="status"]')).toBeNull();
    await click("保留当前观察作参考");
    await render("copper", 0, 1);
    expect(host.querySelector('[role="status"]')).toBeNull();
    expect(
      host.querySelectorAll("svg")[0].getAttribute("aria-label"),
    ).toContain("清洁参考");
  } finally {
    await act(() => root.unmount());
  }
});
