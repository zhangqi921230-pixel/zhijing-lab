// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { it, expect, vi } from "vitest";
import MicroscopeFocusTrial from "../src/MicroscopeFocusTrial.jsx";
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
it("compares only the matching post-adjustment state and refuses dark comparisons", async () => {
  const host = document.createElement("div"),
    root = createRoot(host),
    change = vi.fn();
  const p = { focus: 40, coarse: 50, light: 70, mag: 100 };
  const render = (params, blur, illuminated = true) =>
    act(() =>
      root.render(
        <MicroscopeFocusTrial
          p={params}
          optics={{ blur, illuminated, apertureTransmission: 1 }}
          onPrepare={change}
        />,
      ),
    );
  try {
    await render(p, 1.35);
    await act(() => host.querySelectorAll("button")[1].click());
    expect(change).toHaveBeenLastCalledWith({ focus: 42 });
    await render({ ...p, focus: 42 }, 1.28);
    expect(host.textContent).toContain("比调整前更清晰");
    await render({ ...p, focus: 42, mag: 400 }, 2.56);
    expect(host.textContent).toContain("先观察目镜");
    await render(p, 1.35, false);
    await act(() => host.querySelectorAll("button")[1].click());
    await render({ ...p, focus: 42 }, 1.28, false);
    expect(host.textContent).toContain("照明不足");
  } finally {
    await act(() => root.unmount());
  }
});
