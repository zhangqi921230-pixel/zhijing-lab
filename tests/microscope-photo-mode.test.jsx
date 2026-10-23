// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { it, expect, vi } from "vitest";
import MicroscopeField from "../src/MicroscopeField.jsx";
it("explicit slide selection exits photo mode, keeps focus edits, and cancels pending decode", async () => {
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  const gradient = { addColorStop() {} };
  const paintedText = vi.fn();
  const context = new Proxy(
    { fillText: paintedText },
    {
      get: (o, k) =>
        o[k] ?? (k.startsWith("create") ? () => gradient : () => {}),
      set: (o, k, v) => ((o[k] = v), true),
    },
  );
  const contexts = vi
    .spyOn(HTMLCanvasElement.prototype, "getContext")
    .mockReturnValue(context);
  const encode = vi
    .spyOn(HTMLCanvasElement.prototype, "toDataURL")
    .mockReturnValue("data:image/png;base64,frozen");
  const decoded = [];
  vi.stubGlobal(
    "Image",
    class {
      naturalWidth = 200;
      naturalHeight = 200;
      set src(value) {
        decoded.push(this);
      }
    },
  );
  const create = vi.fn(() => "blob:test"),
    revoke = vi.fn();
  vi.stubGlobal("URL", { createObjectURL: create, revokeObjectURL: revoke });
  const node = document.createElement("div");
  document.body.append(node);
  const root = createRoot(node);
  const p = {
    mag: 100,
    coarse: 50,
    focus: 50,
    x: 0,
    y: 0,
    light: 70,
    specimen: 1,
  };
  const onChange = vi.fn();
  const render = async (params, selection) =>
    act(async () =>
      root.render(
        <MicroscopeField
          p={params}
          t={0}
          specimenSelection={selection}
          onChange={onChange}
        />,
      ),
    );
  const load = async () => {
    const input = node.querySelector('input[type="file"]');
    Object.defineProperty(input, "files", {
      configurable: true,
      value: [
        {
          name: "test.png",
          size: 100,
          slice: () => ({
            arrayBuffer: async () =>
              new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10]).buffer,
          }),
        },
      ],
    });
    await act(async () =>
      input.dispatchEvent(new Event("change", { bubbles: true })),
    );
  };
  try {
    await render({ ...p, specimen: 2, power: 0 }, 0);
    expect(contexts).toHaveBeenCalledTimes(1); // Only the viewport; no onion cache.
    await render({ ...p, specimen: 2 }, 0);
    expect(contexts).toHaveBeenCalledTimes(2);
    await render(p, 0);
    expect(contexts).toHaveBeenCalledTimes(4); // Viewport plus first onion cache.
    await render({ ...p, focus: 51 }, 0);
    expect(contexts).toHaveBeenCalledTimes(5); // Reuse the cached slide.
    await render(p, 0);
    const objectives = node.querySelector('[aria-label="目镜旁切换物镜"]');
    expect(
      objectives.querySelector('[aria-pressed="true"]').textContent,
    ).toContain("总 100×");
    await act(async () =>
      objectives.querySelector('[aria-label="40倍物镜，总倍率400倍"]').click(),
    );
    expect(onChange.mock.calls).toEqual([["mag", 400]]);
    await act(async () =>
      node.querySelector('[aria-label="关闭显微镜光源"]').click(),
    );
    expect(onChange).toHaveBeenLastCalledWith("power", 0);
    await render({ ...p, power: 0 }, 0);
    expect(node.querySelector('[aria-label="目镜照明亮度"]').disabled).toBe(
      true,
    );
    await act(async () =>
      node.querySelector('[aria-label="开启显微镜光源"]').click(),
    );
    expect(onChange).toHaveBeenLastCalledWith("power", 1);
    await render(p, 0);
    await load();
    await act(async () => decoded.at(-1).onload());
    expect(node.querySelector("header").textContent).toContain("照片数字观察");
    expect(node.querySelector('[aria-label="目镜旁切换物镜"]')).toBeNull();
    expect(node.querySelector('[aria-label="目镜旁照明控制"]')).toBeNull();
    const button = (text) =>
      [...node.querySelectorAll("button")].find((b) => b.textContent === text);
    await act(async () => button("固定当前视野作对照").click());
    const frozen = node.querySelector(".microscope-pinned-field img");
    expect(frozen.alt).toContain("数字缩放 1× · 未标定尺度");
    expect(frozen.alt).toContain("细准焦 50");
    expect(frozen.alt).toContain("来源文件：test.png");
    let exportHeight = 0;
    vi.spyOn(HTMLCanvasElement.prototype, "toBlob").mockImplementation(
      function (done) {
        exportHeight = this.height;
        done(new Blob(["test-png"], { type: "image/png" }));
      },
    );
    const download = vi
      .spyOn(HTMLAnchorElement.prototype, "click")
      .mockImplementation(() => {});
    const timer = vi
      .spyOn(globalThis, "setTimeout")
      .mockImplementation(() => 0);
    paintedText.mockClear();
    await act(async () => button("保存当前观察图 PNG").click());
    timer.mockRestore();
    expect(download).toHaveBeenCalledTimes(1);
    expect(
      paintedText.mock.calls.some(([text]) => text === "来源文件：test.png"),
    ).toBe(true);
    expect(paintedText.mock.calls.every(([, , y]) => y < exportHeight)).toBe(
      true,
    );
    expect(node.textContent).toContain("已生成 PNG");
    node
      .querySelector("canvas")
      .dispatchEvent(
        new WheelEvent("wheel", { deltaY: -40, cancelable: true }),
      );
    expect(onChange).toHaveBeenLastCalledWith("focus", 51);
    await render({ ...p, focus: 51 }, 0);
    expect(node.querySelector("header").textContent).toContain("照片数字观察");
    expect(node.querySelector(".microscope-pinned-field img").alt).toBe(
      frozen.alt,
    );
    expect(encode).toHaveBeenCalledTimes(1);
    await render(p, 1);
    expect(node.querySelector("header").textContent).toContain("目镜视野");
    expect(node.textContent).toContain("已切换到洋葱表皮");
    expect(node.querySelector(".microscope-pinned-field img").alt).toContain(
      "本地照片",
    );
    expect(node.querySelector(".microscope-pinned-field img").alt).toContain(
      "来源文件：test.png",
    );
    await act(async () => button("用当前视野更新对照").click());
    expect(node.querySelector(".microscope-pinned-field img").alt).toContain(
      "洋葱表皮",
    );
    expect(
      node.querySelector(".microscope-pinned-field img").alt,
    ).not.toContain("test.png");
    const pinnedOnion = node.querySelector(
      ".microscope-pinned-field",
    ).textContent;
    await render({ ...p, specimen: 2, mag: 400, focus: 53, x: 12 }, 2);
    const current = node.querySelector(".microscope-live-field");
    expect(current.textContent).toContain("池塘微生物观察");
    expect(current.textContent).toContain("总倍率 400×");
    expect(current.textContent).toContain("细准焦 53");
    expect(current.textContent).toContain("玻片位移 X 12 / Y 0");
    expect(node.querySelector(".microscope-pinned-field").textContent).toBe(
      pinnedOnion,
    );
    await act(async () => button("清除对照图").click());
    expect(node.querySelector(".microscope-pinned-field")).toBeNull();
    await render({ ...p, mag: 400, x: 40, y: -40 }, 1);
    expect(node.querySelector("canvas").getAttribute("aria-label")).toContain(
      "400倍",
    );
    await load();
    await act(async () => decoded.at(-1).onload());
    await render({ ...p, specimen: 2 }, 1);
    expect(node.textContent).toContain("已切换到池塘微生物");
    await load();
    const pending = decoded.at(-1);
    await render({ ...p, specimen: 0 }, 2);
    await act(async () => pending.onload());
    expect(node.querySelector("header").textContent).toContain("目镜视野");
    expect(node.textContent).toContain("已切换到字母 e");
    expect(revoke).toHaveBeenCalledTimes(3);
  } finally {
    await act(async () => root.unmount());
    node.remove();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    delete globalThis.IS_REACT_ACT_ENVIRONMENT;
  }
});
