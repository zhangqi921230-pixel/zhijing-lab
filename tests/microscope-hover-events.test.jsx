// @vitest-environment jsdom
import { it, expect, vi } from "vitest";
import * as T from "three";
import { installMicroscopeHover } from "../src/MicroscopeHover.js";
import { cellHoverAction, isCellPickable } from "../src/CellHover.js";

it("cell labels share hover and click targets while hidden annotations remain inactive", () => {
  let callback;
  vi.stubGlobal("requestAnimationFrame", (fn) => {
    callback = fn;
    return 1;
  });
  vi.stubGlobal("cancelAnimationFrame", () => {});
  const element = document.createElement("canvas");
  element.getBoundingClientRect = () => ({
    left: 0,
    top: 0,
    width: 100,
    height: 100,
  });
  const root = new T.Group(),
    labels = new T.Group(),
    sprite = new T.Sprite(new T.SpriteMaterial());
  sprite.userData = { action: "parameter", key: "part", value: 1 };
  labels.add(sprite);
  root.add(labels);
  root.updateMatrixWorld(true);
  const camera = new T.PerspectiveCamera(40, 1, 0.1, 50);
  camera.position.set(0, 0, 4);
  camera.lookAt(0, 0, 0);
  camera.updateMatrixWorld(true);
  const onHint = vi.fn();
  const dispose = installMicroscopeHover({
    element,
    camera,
    root,
    onHint,
    meshesOnly: true,
    pickable: isCellPickable,
    resolveAction: cellHoverAction,
  });
  try {
    const move = () => {
      element.dispatchEvent(
        new MouseEvent("pointermove", { clientX: 50, clientY: 50 }),
      );
      callback();
    };
    move();
    expect(onHint).toHaveBeenLastCalledWith("细胞核 · 点击放大观察结构");
    expect(element.style.cursor).toBe("pointer");
    labels.visible = false;
    move();
    expect(onHint).toHaveBeenLastCalledWith("");
    expect(element.style.cursor).toBe("");
  } finally {
    dispose();
    sprite.material.dispose();
    vi.unstubAllGlobals();
  }
});
it("hover coalesces pointer events and stops all work while idle", () => {
  const callbacks = new Map();
  let next = 0;
  const request = vi.fn((cb) => {
    callbacks.set(++next, cb);
    return next;
  });
  vi.stubGlobal("requestAnimationFrame", request);
  vi.stubGlobal("cancelAnimationFrame", (id) => callbacks.delete(id));
  const element = document.createElement("canvas");
  element.getBoundingClientRect = () => ({
    left: 0,
    top: 0,
    width: 100,
    height: 100,
  });
  const root = new T.Group(),
    mesh = new T.Mesh(new T.BoxGeometry(1, 1, 1), new T.MeshBasicMaterial());
  mesh.userData = { action: "parameter", key: "focus", delta: 2 };
  root.add(mesh);
  root.updateMatrixWorld(true);
  const camera = new T.PerspectiveCamera(40, 1, 0.1, 50);
  camera.position.set(0, 0, 4);
  camera.lookAt(0, 0, 0);
  camera.updateMatrixWorld(true);
  const onHint = vi.fn(),
    dispose = installMicroscopeHover({ element, camera, root, onHint });
  try {
    for (let i = 0; i < 20; i++)
      element.dispatchEvent(
        new MouseEvent("pointermove", { clientX: 50, clientY: 50 }),
      );
    expect(request).toHaveBeenCalledTimes(1);
    callbacks.get(1)();
    callbacks.delete(1);
    expect(onHint).toHaveBeenLastCalledWith(
      "细准焦螺旋 · 上拖增加、下拖减少；点击步进，Shift + 点击反向",
    );
    expect(element.style.cursor).toBe("pointer");
    expect(request).toHaveBeenCalledTimes(1);
    dispose.clear();
    expect(onHint).toHaveBeenLastCalledWith("");
    expect(element.style.cursor).toBe("");
    element.dispatchEvent(new Event("pointerleave"));
    expect(onHint).toHaveBeenLastCalledWith("");
    element.dispatchEvent(
      new MouseEvent("pointermove", { clientX: 50, clientY: 50 }),
    );
    element.dispatchEvent(new MouseEvent("pointerdown", { buttons: 1 }));
    expect(callbacks.size).toBe(0);
    expect(element.style.cursor).toBe("");
    element.dispatchEvent(
      new MouseEvent("pointermove", { clientX: 50, clientY: 50 }),
    );
    dispose();
    expect(callbacks.size).toBe(0);
  } finally {
    dispose();
    vi.unstubAllGlobals();
    mesh.geometry.dispose();
    mesh.material.dispose();
  }
});
