// @vitest-environment jsdom
import { it, expect, vi } from "vitest";
import { installMicroscopeHover } from "../src/MicroscopeHover.js";
import * as T from "three";
import { installMicroscopeSlideDrag } from "../src/MicroscopeSlideDrag.js";
it("direct slide dragging follows its plane, clamps travel, and restores camera controls", () => {
  const element = document.createElement("canvas");
  document.body.append(element);
  element.getBoundingClientRect = () => ({
    left: 0,
    top: 0,
    width: 600,
    height: 400,
  });
  const captured = new Set();
  element.setPointerCapture = (id) => captured.add(id);
  element.hasPointerCapture = (id) => captured.has(id);
  element.releasePointerCapture = (id) => captured.delete(id);
  const root = new T.Group();
  root.position.set(1, 0, 2);
  root.rotation.y = 0.3;
  const slide = new T.Group();
  slide.name = "microscope-slide";
  root.add(slide);
  const surface = new T.Mesh(
    new T.PlaneGeometry(1, 1),
    new T.MeshBasicMaterial({ side: T.DoubleSide }),
  );
  surface.rotation.x = -Math.PI / 2;
  slide.add(surface);
  root.updateMatrixWorld(true);
  const camera = new T.PerspectiveCamera(40, 1.5, 0.1, 100);
  camera.position.set(3, 4, 7);
  camera.lookAt(1, 0, 2);
  camera.updateMatrixWorld(true);
  const controls = { enabled: true },
    p = { x: 0, y: 0 };
  let orbitEvents = 0;
  element.addEventListener("pointerdown", () => orbitEvents++);
  const hoverFrames = new Map();
  let hoverFrameId = 0;
  vi.stubGlobal("requestAnimationFrame", (cb) => {
    hoverFrames.set(++hoverFrameId, cb);
    return hoverFrameId;
  });
  vi.stubGlobal("cancelAnimationFrame", (id) => hoverFrames.delete(id));
  const onHint = vi.fn();
  const disposeHover = installMicroscopeHover({
    element,
    camera,
    root,
    onHint,
  });
  const dispose = installMicroscopeSlideDrag({
    element,
    camera,
    root,
    controls,
    getParams: () => p,
    onChange: (k, v) => (p[k] = v),
  });
  function event(type, local, id = 1) {
    const point = root.localToWorld(new T.Vector3(...local)).project(camera);
    const e = new MouseEvent(type, {
      bubbles: true,
      cancelable: true,
      button: 0,
      clientX: (point.x + 1) * 300,
      clientY: (1 - point.y) * 200,
    });
    Object.defineProperty(e, "pointerId", { value: id });
    element.dispatchEvent(e);
  }
  try {
    event("pointermove", [0, 0, 0]);
    expect(hoverFrames.size).toBe(1);
    event("pointerdown", [0, 0, 0]);
    expect(hoverFrames.size).toBe(0);
    expect(element.style.cursor).toBe("grabbing");
    expect(controls.enabled).toBe(false);
    expect(orbitEvents).toBe(0);
    event("pointermove", [0.08, 0, -0.04]);
    expect(p).toEqual({ x: 10, y: 5 });
    event("pointermove", [1, 0, -1]);
    expect(p).toEqual({ x: 40, y: 40 });
    event("pointerup", [1, 0, -1]);
    expect(controls.enabled).toBe(true);
    expect(captured.size).toBe(0);
    event("pointerdown", [0, 0, 0]);
    event("pointercancel", [0, 0, 0]);
    expect(controls.enabled).toBe(true);
    event("pointerdown", [0, 0, 0]);
    window.dispatchEvent(new Event("blur"));
    expect(controls.enabled).toBe(true);
    expect(captured.size).toBe(0);
    const originalCapture = element.setPointerCapture;
    element.setPointerCapture = () => {
      throw new DOMException("Inactive pointer");
    };
    event("pointerdown", [0, 0, 0]);
    expect(controls.enabled).toBe(true);
    element.setPointerCapture = originalCapture;
    event("pointerdown", [3, 0, 3]);
    expect(orbitEvents).toBe(2);
    event("pointerdown", [0, 0, 0]);
    dispose();
    expect(controls.enabled).toBe(true);
    expect(captured.size).toBe(0);
  } finally {
    disposeHover();
    dispose();
    vi.unstubAllGlobals();
    element.remove();
    surface.geometry.dispose();
    surface.material.dispose();
  }
});
