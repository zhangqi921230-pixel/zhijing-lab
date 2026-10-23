// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { it, expect, vi } from "vitest";
import FunctionParameterInput from "../src/FunctionParameterInput.jsx";
it("accepts exact decimals and zero, rejects out-of-range input and restores drafts", async () => {
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  const host = document.createElement("div");
  document.body.append(host);
  const root = createRoot(host),
    change = vi.fn();
  const p = { a: 1, k: 1, shift: 0, b: 0, probe: Math.PI / 6 };
  try {
    await act(() =>
      root.render(<FunctionParameterInput p={p} onChange={change} />),
    );
    const input = host.querySelector("input");
    const type = async (value) =>
      act(() => {
        Object.getOwnPropertyDescriptor(
          HTMLInputElement.prototype,
          "value",
        ).set.call(input, value);
        input.dispatchEvent(new Event("input", { bubbles: true }));
      });
    const enter = () =>
      act(() =>
        input.dispatchEvent(
          new KeyboardEvent("keydown", { key: "Enter", bubbles: true }),
        ),
      );
    await type("1.25");
    await enter();
    expect(change).toHaveBeenLastCalledWith("a", 1.25);
    await type("0");
    await enter();
    expect(change).toHaveBeenLastCalledWith("a", 0);
    change.mockClear();
    await type("4");
    await enter();
    expect(change).not.toHaveBeenCalled();
    expect(input.getAttribute("aria-invalid")).toBe("true");
    await act(() =>
      input.dispatchEvent(
        new KeyboardEvent("keydown", { key: "Escape", bubbles: true }),
      ),
    );
    expect(input.value).toBe("1");
    expect(host.querySelector('[role="alert"]')).toBeNull();
    await type("");
    await enter();
    expect(change).not.toHaveBeenCalled();
    expect(host.querySelector('[aria-label="精确输入探针 x"]').value).toBe(
      String(Math.PI / 6),
    );
  } finally {
    await act(() => root.unmount());
    host.remove();
  }
});
