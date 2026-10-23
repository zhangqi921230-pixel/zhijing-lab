// @vitest-environment jsdom
import { it, expect } from "vitest";
import * as T from "three";
import { installOpticalDrag } from "../src/OpticalDrag.js";

it.each(
  [
    ["optical-object", "u", 29, 60],
    ["optical-screen", "screen", 31, 5],
    ["optical-object", "sourceOffset", 1, -3],
  ].flatMap((row) =>
    [
      [0, 0, 5],
      [3, 3, 5],
      [0, 5, 0.1],
    ]
      .filter((view) => row[1] !== "sourceOffset" || view[2] > 1)
      .map((view) => [...row, view]),
  ),
)(
  "drags %s along the rail without rotating the camera (%j %j %j %j)",
  (name, key, expected, limit, view) => {
    const element = document.createElement("canvas");
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
    const root = new T.Group(),
      carrier = new T.Group();
    root.position.set(1, 0.2, -1);
    root.rotation.y = 0.3;
    root.scale.setScalar(1.2);
    carrier.name = name;
    root.add(carrier);
    const surface = new T.Mesh(
      new T.PlaneGeometry(1, 1),
      new T.MeshBasicMaterial({ side: T.DoubleSide }),
    );
    carrier.add(surface);
    const helper = new T.Line(
      new T.BufferGeometry().setFromPoints([
        new T.Vector3(-0.2, 0, 0),
        new T.Vector3(0.2, 0, 0),
      ]),
      new T.LineBasicMaterial(),
    );
    helper.position.copy(
      new T.Vector3(...view).normalize().multiplyScalar(0.4),
    );
    root.add(helper);
    const blocker = new T.Mesh(
      new T.SphereGeometry(0.12, 8, 6),
      new T.MeshBasicMaterial(),
    );
    blocker.position.copy(helper.position);
    blocker.visible = false;
    root.add(blocker);
    root.updateMatrixWorld(true);
    const camera = new T.PerspectiveCamera(40, 1.5, 0.1, 100);
    camera.position.copy(root.localToWorld(new T.Vector3(...view)));
    camera.lookAt(root.position);
    camera.updateMatrixWorld(true);
    const controls = { enabled: true },
      p = { u: 30, screen: 30, sourceOffset: 0 };
    let orbit = 0;
    element.addEventListener("pointerdown", () => orbit++);
    const dispose = installOpticalDrag({
      element,
      camera,
      root,
      controls,
      getParams: () => p,
      onChange: (k, v) => (p[k] = v),
    });
    function fire(type, x, shiftKey = key === "sourceOffset") {
      const point = root
        .localToWorld(
          key === "sourceOffset"
            ? new T.Vector3(0, x, 0)
            : new T.Vector3(x, 0, 0),
        )
        .project(camera);
      const e = new MouseEvent(type, {
        bubbles: true,
        cancelable: true,
        button: 0,
        shiftKey,
        clientX: (point.x + 1) * 300,
        clientY: (1 - point.y) * 200,
      });
      Object.defineProperty(e, "pointerId", { value: 1 });
      element.dispatchEvent(e);
    }
    try {
      fire("pointermove", 0);
      expect(element.style.cursor).toBe("grab");
      expect(element.title).toContain(
        key === "sourceOffset" ? "上下拖动" : "沿轨道拖动",
      );
      surface.userData = { action: "parameter", key: "light", value: 0 };
      fire("pointermove", 0);
      expect(element.style.cursor).toBe("pointer");
      fire("pointerdown", 0);
      expect(controls.enabled).toBe(true);
      expect(orbit).toBe(1);
      surface.userData = {};
      orbit = 0;
      blocker.visible = true;
      fire("pointermove", 0);
      expect(element.style.cursor).toBe("");
      fire("pointerdown", 0);
      expect(controls.enabled).toBe(true);
      expect(orbit).toBe(1);
      blocker.visible = false;
      orbit = 0;
      carrier.visible = false;
      fire("pointermove", 0);
      expect(element.style.cursor).toBe("");
      carrier.visible = true;
      fire("pointermove", 0);
      fire("pointerleave", 0);
      expect(element.title).toBe("");
      p.heightLock = 1;
      if (key === "sourceOffset") {
        fire("pointermove", 0);
        expect(element.style.cursor).toBe("not-allowed");
        fire("pointerdown", 0);
        expect(controls.enabled).toBe(true);
        expect(captured.size).toBe(0);
        expect(orbit).toBe(0);
        fire("pointermove", 0.055);
        expect(p.sourceOffset).toBe(0);
        p.heightLock = 0;
      }
      fire("pointerdown", 0);
      expect(controls.enabled).toBe(false);
      expect(orbit).toBe(0);
      fire("pointermove", 0.055, false);
      expect(p[key]).toBe(expected);
      if (key === "sourceOffset") {
        expect(p.u).toBe(30);
        expect(p.screen).toBe(30);
        fire("pointermove", 10);
        expect(p.sourceOffset).toBe(3);
      }
      fire("pointermove", -10);
      expect(p[key]).toBe(limit);
      fire("pointerup", -10);
      expect(controls.enabled).toBe(true);
      expect(captured.size).toBe(0);
      if (key === "sourceOffset") {
        fire("pointerdown", 0);
        p.heightLock = 1;
        fire("pointermove", 0.055);
        expect(controls.enabled).toBe(true);
        expect(captured.size).toBe(0);
        expect(p.sourceOffset).toBe(-3);
        p.heightLock = 0;
      }
      fire("pointerdown", 0);
      fire("pointercancel", 0);
      expect(controls.enabled).toBe(true);
      fire("pointerdown", 0);
      window.dispatchEvent(new Event("blur"));
      expect(captured.size).toBe(0);
      fire("pointerdown", 0);
      dispose();
      expect(controls.enabled).toBe(true);
      expect(captured.size).toBe(0);
    } finally {
      dispose();
      surface.geometry.dispose();
      surface.material.dispose();
      helper.geometry.dispose();
      helper.material.dispose();
      blocker.geometry.dispose();
      blocker.material.dispose();
    }
  },
);
