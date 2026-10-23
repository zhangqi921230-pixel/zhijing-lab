// @vitest-environment jsdom
import { it, expect, vi } from "vitest";
import * as T from "three";
import { installMicroscopeKnobDrag } from "../src/MicroscopeKnobDrag.js";
it("drags focus without duplicate clicks, bounds travel, and always releases orbit controls", () => {
  const element = document.createElement("canvas");
  element.getBoundingClientRect = () => ({
    left: 0,
    top: 0,
    width: 400,
    height: 400,
  });
  const captured = new Set();
  element.setPointerCapture = (id) => captured.add(id);
  element.hasPointerCapture = (id) => captured.has(id);
  element.releasePointerCapture = (id) => captured.delete(id);
  const root = new T.Group(),
    knob = new T.Mesh(new T.BoxGeometry(1, 1, 1), new T.MeshBasicMaterial());
  knob.userData = { action: "parameter", key: "focus", delta: 2 };
  root.add(knob);
  root.updateMatrixWorld(true);
  const camera = new T.PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.z = 5;
  camera.updateMatrixWorld(true);
  const controls = { enabled: true },
    p = { focus: 50 };
  const onChange = vi.fn((k, v) => (p[k] = v)),
    sceneClick = vi.fn();
  const dispose = installMicroscopeKnobDrag({
    element,
    camera,
    root,
    controls,
    getParams: () => p,
    onChange,
  });
  element.addEventListener("pointerup", sceneClick);
  const fire = (type, y = 200, extra = {}) => {
    const e = new MouseEvent(type, {
      clientX: 200,
      clientY: y,
      button: 0,
      bubbles: true,
      cancelable: true,
      ...extra,
    });
    Object.defineProperty(e, "pointerId", { value: 1 });
    element.dispatchEvent(e);
  };
  fire("pointerdown");
  expect(controls.enabled).toBe(false);
  fire("pointermove", 160);
  expect(p.focus).toBe(55);
  fire("pointerup", 160);
  expect(p.focus).toBe(55);
  expect(sceneClick).not.toHaveBeenCalled();
  expect(controls.enabled).toBe(true);
  expect(captured.size).toBe(0);
  fire("pointerdown");
  fire("pointerup", 200, { shiftKey: true });
  expect(p.focus).toBe(53);
  fire("pointerdown");
  fire("pointermove", -1000);
  expect(p.focus).toBe(100);
  fire("pointercancel", -1000);
  expect(controls.enabled).toBe(true);
  fire("pointerdown");
  fire("pointermove", 2000);
  expect(p.focus).toBe(0);
  fire("lostpointercapture", 2000);
  expect(controls.enabled).toBe(true);
  fire("pointerdown");
  window.dispatchEvent(new Event("blur"));
  expect(controls.enabled).toBe(true);
  fire("pointerdown");
  dispose();
  expect(controls.enabled).toBe(true);
  expect(captured.size).toBe(0);
});
