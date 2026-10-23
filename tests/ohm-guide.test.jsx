// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { expect, it, vi } from "vitest";
import { OhmGuide } from "../src/OhmGuide.jsx";

it("distinguishes open-circuit resistor readings from the nonzero supply setting", async () => {
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  const host = document.createElement("div"),
    root = createRoot(host);
  const show = (closed) =>
    act(() =>
      root.render(
        <OhmGuide
          chapter={1}
          p={{ u: 6, r: 20, closed }}
          onSelect={() => {}}
          onPrepare={() => {}}
        />,
      ),
    );
  try {
    await show(0);
    expect([...host.querySelectorAll("dd")].map((e) => e.textContent)).toEqual([
      "断开",
      "0.000 A",
      "0.00 V",
      "0.000 W",
    ]);
    await show(1);
    expect([...host.querySelectorAll("dd")].map((e) => e.textContent)).toEqual([
      "闭合",
      "0.300 A",
      "6.00 V",
      "1.800 W",
    ]);
  } finally {
    await act(() => root.unmount());
  }
});

it("masks computed readings and offers an explicit reveal action even after changing chapters", async () => {
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  const host = document.createElement("div"),
    root = createRoot(host),
    prepare = vi.fn();
  try {
    await act(() =>
      root.render(
        <OhmGuide
          chapter={0}
          p={{ u: 6, r: 10, closed: 1, digital: 0 }}
          onSelect={() => {}}
          onPrepare={prepare}
        />,
      ),
    );
    const values = [...host.querySelectorAll("dd")].map((e) => e.textContent);
    expect(values).toEqual(["闭合", "先读指针", "先读指针", "核对时显示"]);
    const reveal = [...host.querySelectorAll("button")].find(
      (e) => e.textContent === "显示数字，核对读数",
    );
    await act(() => reveal.click());
    expect(prepare).toHaveBeenCalledWith({ digital: 1 });
  } finally {
    await act(() => root.unmount());
  }
});

it("explains zero supply and prepares voltage without resetting resistance or switch state", async () => {
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  const host = document.createElement("div"),
    root = createRoot(host),
    prepare = vi.fn();
  try {
    await act(() =>
      root.render(
        <OhmGuide
          chapter={1}
          p={{ u: 0, r: 40, closed: 1 }}
          onSelect={() => {}}
          onPrepare={prepare}
        />,
      ),
    );
    const note = host.querySelector('[role="note"]');
    expect(note.textContent).toContain("0.150 A");
    await act(() => note.querySelector("button").click());
    expect(prepare).toHaveBeenCalledWith({ u: 6 });
    await act(() =>
      root.render(
        <OhmGuide
          chapter={1}
          p={{ u: 6, r: 40, closed: 1 }}
          onSelect={() => {}}
          onPrepare={prepare}
        />,
      ),
    );
    expect(host.querySelector('[role="note"]')).toBeNull();
  } finally {
    await act(() => root.unmount());
  }
});
