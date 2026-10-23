// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { it, expect, vi } from "vitest";
import ConicGuide from "../src/ConicGuide.jsx";
it("allows pointer selection and drag, cancels cleanly and ignores secondary buttons", async () => {
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  const host = document.createElement("div"),
    root = createRoot(host),
    change = vi.fn();
  document.body.append(host);
  await act(async () =>
    root.render(
      <ConicGuide
        p={{ alpha: 30, tilt: 35, offset: 0.7, probe: 25 }}
        onChange={change}
      />,
    ),
  );
  const svg = host.querySelector("svg");
  svg.getBoundingClientRect = () => ({
    left: 0,
    top: 0,
    width: 360,
    height: 290,
  });
  const send = async (type, x, y, button = 0) =>
    act(async () =>
      svg.dispatchEvent(
        new MouseEvent(type, { bubbles: true, clientX: x, clientY: y, button }),
      ),
    );
  await send("pointerdown", 50, 100, 2);
  expect(change).not.toHaveBeenCalled();
  await send("pointerdown", 50, 100);
  expect(change).toHaveBeenCalledTimes(1);
  const first = change.mock.calls[0][1];
  await send("pointermove", 310, 200);
  expect(change.mock.calls[1][1]).not.toBe(first);
  await send("pointercancel", 310, 200);
  await send("pointermove", 180, 40);
  expect(change).toHaveBeenCalledTimes(2);
  await act(async () => root.unmount());
  host.remove();
});

it("expands the plot without changing parameters and supports bounded keyboard probing", async () => {
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  const host = document.createElement("div"),
    root = createRoot(host),
    change = vi.fn();
  document.body.append(host);
  try {
    await act(() =>
      root.render(
        <ConicGuide
          p={{ alpha: 30, tilt: 35, offset: 0.7, probe: 98 }}
          onChange={change}
        />,
      ),
    );
    const toggle = host.querySelector(".conic-plot-expand"),
      svg = host.querySelector("svg");
    await act(() => toggle.click());
    expect(toggle.getAttribute("aria-expanded")).toBe("true");
    expect(change).not.toHaveBeenCalled();
    const key = async (key, extra = {}) =>
      act(() =>
        svg.dispatchEvent(
          new KeyboardEvent("keydown", {
            key,
            bubbles: true,
            cancelable: true,
            ...extra,
          }),
        ),
      );
    await key("ArrowRight", { shiftKey: true });
    expect(change).toHaveBeenLastCalledWith("probe", 100);
    await key("Home");
    expect(change).toHaveBeenLastCalledWith("probe", 0);
    const count = change.mock.calls.length;
    await key("ArrowRight", { ctrlKey: true });
    expect(change).toHaveBeenCalledTimes(count);
    await key("Escape");
    expect(toggle.getAttribute("aria-expanded")).toBe("false");
    expect(change).toHaveBeenCalledTimes(count);
  } finally {
    await act(() => root.unmount());
    host.remove();
  }
});
