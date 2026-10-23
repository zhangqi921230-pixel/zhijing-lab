// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { it, expect, vi } from "vitest";
import GameteJourney, { journeyAlleles } from "../src/GameteJourney.jsx";
import GeneticsStudio from "../src/GeneticsStudio.jsx";
import { genetics } from "../src/models.mjs";
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
it("each traced combination agrees with the Punnett cell for all parental crosses", () => {
  for (let parent1 = 0; parent1 < 3; parent1++)
    for (let parent2 = 0; parent2 < 3; parent2++)
      for (let selected = 0; selected < 4; selected++)
        expect(
          journeyAlleles({ parent1, parent2 }, selected).sort().join(""),
        ).toBe(genetics(parent1, parent2).cells[selected]);
});
it("seek preserves sampled offspring and selection synchronizes the Punnett grid", async () => {
  const host = document.createElement("div"),
    root = createRoot(host);
  const button = (t) =>
    [...host.querySelectorAll("button")].find((b) => b.textContent === t);
  try {
    await act(() =>
      root.render(
        <GeneticsStudio p={{ parent1: 1, parent2: 1 }} chapter={5} />,
      ),
    );
    await act(() => button("抽样 20 个").click());
    expect(host.querySelector('[aria-label="测交证据与样本量"]')).toBeNull();
    const before = host.querySelector(".genetics-seeds").textContent;
    await act(() => button("组合 4：a ＋ a").click());
    await act(() => button("查看子代").click());
    expect(host.querySelector(".genetics-seeds").textContent).toBe(before);
    expect(
      host.querySelector('.genetics-grid [aria-pressed="true"]').textContent,
    ).toContain("aa");
    expect(host.querySelector(".gamete-journey svg").textContent).toContain(
      "结合后恢复成对：aa",
    );
    await act(() => button("配子已形成").click());
    expect(host.querySelector('[aria-label="配子结合进度"]').value).toBe("2");
  } finally {
    await act(() => root.unmount());
  }
});
it("explicit animation advances, pauses and releases the frame callback", async () => {
  let callback;
  const visibility = vi.spyOn(document, "hidden", "get").mockReturnValue(false);
  vi.stubGlobal(
    "requestAnimationFrame",
    vi.fn((cb) => {
      callback = cb;
      return 17;
    }),
  );
  vi.stubGlobal("cancelAnimationFrame", vi.fn());
  const host = document.createElement("div"),
    root = createRoot(host),
    pause = vi.fn();
  try {
    await act(() =>
      root.render(
        <GameteJourney
          p={{ parent1: 0, parent2: 2 }}
          selected={0}
          onSelect={() => {}}
          onPauseSampling={pause}
        />,
      ),
    );
    const button = (t) =>
      [...host.querySelectorAll("button")].find((b) => b.textContent === t);
    expect(host.textContent).toContain("配子 A：100%");
    expect(host.textContent).toContain("配子 a：100%");
    await act(() => button("播放结合过程").click());
    expect(pause).toHaveBeenCalled();
    await act(() => callback(0));
    await act(() => callback(50));
    expect(Number(host.querySelector("input").value)).toBeGreaterThan(0);
    await act(() => button("暂停结合过程").click());
    expect(cancelAnimationFrame).toHaveBeenCalledWith(17);
  } finally {
    await act(() => root.unmount());
    vi.unstubAllGlobals();
    visibility.mockRestore();
  }
});
