// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { it, expect, vi } from "vitest";
import MobileLearningNav, {
  MobileChapterPicker,
} from "../src/MobileLearning.jsx";

it("selects all chapters through the same callback and jumps to real controls without starting playback", async () => {
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  const host = document.createElement("div");
  document.body.append(host);
  const root = createRoot(host),
    select = vi.fn(),
    play = vi.fn();
  try {
    await act(async () =>
      root.render(
        <>
          <MobileChapterPicker
            chapters={[{ title: "观察" }, { title: "比较" }]}
            chapter={0}
            onSelect={select}
          />
          <div className="motion-transport">
            <button onClick={play}>播放演示</button>
          </div>
          <MobileLearningNav />
        </>,
      ),
    );
    const picker = host.querySelector("select");
    await act(async () => {
      picker.value = "1";
      picker.dispatchEvent(new Event("change", { bubbles: true }));
    });
    expect(select).toHaveBeenCalledWith(1);
    const toolbar = host.querySelector(".motion-transport");
    toolbar.getClientRects = () => [{}];
    toolbar.scrollIntoView = vi.fn();
    await act(async () => host.querySelector(".mobile-play-entry").click());
    expect(toolbar.scrollIntoView).toHaveBeenCalled();
    expect(document.activeElement).toBe(toolbar.querySelector("button"));
    expect(play).not.toHaveBeenCalled();
    await act(async () => document.activeElement.click());
    expect(play).toHaveBeenCalledOnce();
  } finally {
    await act(async () => root.unmount());
    host.remove();
  }
});
