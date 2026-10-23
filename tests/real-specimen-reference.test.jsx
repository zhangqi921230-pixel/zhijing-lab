// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { expect, it } from "vitest";
import RealSpecimenReference from "../src/RealSpecimenReference.jsx";
it("offers attributed reference links without claiming an embedded photo", async () => {
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  const node = document.createElement("div"),
    root = createRoot(node);
  try {
    await act(async () => root.render(<RealSpecimenReference />));
    expect(node.querySelector("figure")).toBeNull();
    await act(async () => node.querySelector("button").click());
    expect(node.textContent).toContain("SaraKasa");
    expect(node.textContent).toContain("尚未内置实拍预览");
    expect(node.querySelector("img")).toBeNull();
    expect(node.querySelectorAll("a")).toHaveLength(2);
    expect(
      node.querySelector(
        'a[href="https://creativecommons.org/licenses/by/4.0/"]',
      ),
    ).not.toBeNull();
    await act(async () => node.querySelector("button").click());
    expect(node.querySelector("figure")).toBeNull();
  } finally {
    await act(async () => root.unmount());
    delete globalThis.IS_REACT_ACT_ENVIRONMENT;
  }
});
