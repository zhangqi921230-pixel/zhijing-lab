// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { it, expect, vi } from "vitest";
import { CommunityProvider, CommunityTicker } from "../src/Community.jsx";
it("rotates summaries, pauses during reading, and exposes complete requirements", async () => {
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  vi.useFakeTimers();
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      constructor(cb) {
        this.cb = cb;
      }
      observe() {
        this.cb([{ isIntersecting: true }]);
      }
      disconnect() {}
    },
  );
  vi.stubGlobal("matchMedia", () => ({
    matches: false,
    addEventListener() {},
    removeEventListener() {},
  }));
  const entries = [1, 2].map((n) => ({
    id: String(n),
    kind: n === 1 ? "wish" : "suggestion",
    title: `课堂想法${n}`,
    requirements: `要求${n}`,
    effect: `效果${n}`,
    status: "待评估",
    author: "老师",
    created: "2026-10-17",
  }));
  vi.stubGlobal(
    "fetch",
    vi.fn(async () => ({
      ok: true,
      json: async () => ({ likes: {}, entries }),
    })),
  );
  const host = document.createElement("div");
  document.body.append(host);
  const root = createRoot(host);
  try {
    await act(async () =>
      root.render(
        <CommunityProvider>
          <CommunityTicker open={() => {}} />
        </CommunityProvider>,
      ),
    );
    expect(
      host.querySelector(".community-ticker-summary").textContent,
    ).toContain("课堂想法1");
    await act(async () => vi.advanceTimersByTime(6000));
    expect(
      host.querySelector(".community-ticker-summary").textContent,
    ).toContain("课堂想法2");
    await act(() => host.querySelector(".community-ticker-summary").click());
    await act(async () => vi.advanceTimersByTime(12000));
    expect(
      host.querySelector(".community-ticker-detail").textContent,
    ).toContain("效果2");
    expect(
      host.querySelector(".community-ticker-summary").textContent,
    ).toContain("课堂想法2");
    await act(() =>
      host.querySelector('[aria-label="下一条建议或许愿"]').click(),
    );
    expect(
      host.querySelector(".community-ticker-summary").textContent,
    ).toContain("课堂想法1");
    expect(host.querySelector(".community-ticker-detail")).toBeNull();
  } finally {
    await act(() => root.unmount());
    host.remove();
    vi.useRealTimers();
    vi.unstubAllGlobals();
  }
});
