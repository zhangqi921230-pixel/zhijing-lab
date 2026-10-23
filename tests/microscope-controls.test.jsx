import { it, expect } from "vitest";
import * as T from "three";
import { buildScene, pickedParameterValue } from "../src/ThreeScene.jsx";
import { lessons, defaults } from "../src/lessons.mjs";
import { disposeSceneResources } from "../src/disposeSceneResources.mjs";
it("invalidates shadows for the turret final pose, including reduced motion, and then settles", () => {
  const root = new T.Group();
  const p = defaults(lessons.find((l) => l.id === "microscope"));
  buildScene(root, "microscope", p);
  root.userData.animate(performance.now(), true);
  root.userData.shadowDirty = false;
  root.userData.update({ ...p, mag: 400 });
  root.userData.animate(performance.now(), true);
  expect(root.userData.shadowDirty).toBe(true);
  root.userData.shadowDirty = false;
  root.userData.animate(performance.now(), true);
  expect(root.userData.shadowDirty).toBe(false);
  disposeSceneResources(root);
});
it("fine-focus dial follows fine adjustment while coarse adjustment leaves its angle unchanged", () => {
  const root = new T.Group();
  const p = defaults(lessons.find((l) => l.id === "microscope"));
  buildScene(root, "microscope", p);
  const dial = root.getObjectByName("fine-focus-dial-ring");
  const ticks = root.getObjectByName("fine-focus-dial-ticks");
  const knob = root.getObjectByName("fine-focus-knob");
  expect(dial.parent).toBe(knob);
  expect(ticks.parent).toBe(knob);
  expect(ticks.count).toBe(20);
  const position = new T.Vector3(),
    rotation = new T.Quaternion();
  root.userData.update({ ...p, focus: 50, coarse: 50 });
  root.updateMatrixWorld(true);
  const before = dial.getWorldQuaternion(rotation).clone();
  const origin = dial.getWorldPosition(position).clone();
  root.userData.update({ ...p, focus: 55, coarse: 50 });
  root.updateMatrixWorld(true);
  const after = dial.getWorldQuaternion(rotation).clone();
  expect(before.angleTo(after)).toBeCloseTo(Math.PI / 5);
  expect(dial.getWorldPosition(position).distanceTo(origin)).toBeLessThan(1e-9);
  root.userData.update({ ...p, focus: 55, coarse: 65 });
  root.updateMatrixWorld(true);
  expect(dial.getWorldQuaternion(rotation).angleTo(after)).toBeLessThan(1e-7);
  disposeSceneResources(root);
});

it("slide holder maintains glass contact throughout X/Y travel and focus", () => {
  const root = new T.Group();
  const p = defaults(lessons.find((l) => l.id === "microscope"));
  buildScene(root, "microscope", p);
  const slide = root.getObjectByName("microscope-slide");
  const holder = root.getObjectByName("microscope-slide-holder");
  const geometries = holder.children.map((o) => o.geometry);
  for (const x of [-40, 0, 40])
    for (const y of [-40, 0, 40])
      for (const coarse of [0, 50, 100]) {
        root.userData.update({ ...p, x, y, coarse });
        root.updateMatrixWorld(true);
        for (const side of [-1, 1]) {
          const finger = root.getObjectByName(
            `microscope-slide-finger-${side}`,
          );
          const contact = finger.localToWorld(new T.Vector3(0, -0.012, 0));
          slide.worldToLocal(contact);
          expect(contact.y).toBeCloseTo(side < 0 ? 0.018 : 0.012); // label / glass top
          expect(Math.abs(contact.x)).toBeLessThan(0.55);
          expect(Math.abs(contact.x)).toBeGreaterThan(0.16); // coverslip clearance
          expect(contact.z).toBeCloseTo(0.12);
        }
        expect(holder.children.map((o) => o.geometry)).toEqual(geometries);
      }
  disposeSceneResources(root);
});

it("mechanical handwheels preserve negative travel and share slider limits", () => {
  const root = new T.Group(),
    p = defaults(lessons.find((l) => l.id === "microscope"));
  buildScene(root, "microscope", p);
  for (const key of ["x", "y"]) {
    const wheel = root.getObjectByName(`stage-${key}-handwheel`);
    expect(pickedParameterValue(wheel.userData, -40)).toBe(-38);
    expect(pickedParameterValue(wheel.userData, 40)).toBe(40);
    expect(pickedParameterValue(wheel.userData, -40, true)).toBe(-40);
    expect(pickedParameterValue(wheel.userData, 0, true)).toBe(-2);
    root.userData.update({ ...p, [key]: -38 });
    expect(wheel.rotation.x).toBeCloseTo(-38 * 0.13);
  }
  root.traverse((o) => {
    o.geometry?.dispose();
    (Array.isArray(o.material) ? o.material : [o.material]).forEach((m) =>
      m?.dispose(),
    );
  });
});
it("stored slide picking selects only prepared specimens and preserves the instrument", () => {
  const root = new T.Group(),
    p = defaults(lessons.find((l) => l.id === "microscope"));
  buildScene(root, "microscope", p);
  root.updateMatrixWorld(true);
  const stage = root.getObjectByName("microscope-stage");
  for (let i = 0; i < 5; i++) {
    const ray = new T.Raycaster(
      new T.Vector3(-3.05, 2, -0.56 + i * 0.31),
      new T.Vector3(0, -1, 0),
    );
    const hit = ray.intersectObject(root, true)[0];
    let target = hit.object;
    while (target && !target.userData.action) target = target.parent;
    if (i < 3) {
      expect(target.userData.key).toBe("specimen");
      expect(pickedParameterValue(target.userData, p.specimen)).toBe(i);
      root.userData.update({ ...p, specimen: i });
      expect(root.getObjectByName("microscope-stage")).toBe(stage);
    } else expect(target).toBeNull();
  }
});
it("illumination switch preserves intensity and updates the physical lamp", () => {
  const root = new T.Group(),
    p = defaults(lessons.find((l) => l.id === "microscope"));
  buildScene(root, "microscope", { ...p, light: 65 });
  const lamp = root.getObjectByName("microscope-illuminator"),
    button = root.getObjectByName("microscope-power-switch");
  expect(lamp.material.emissiveIntensity).toBe(0.65);
  expect(pickedParameterValue(button.userData, 1)).toBe(0);
  root.userData.update({ ...p, light: 65, power: 0 });
  expect(lamp.material.emissiveIntensity).toBe(0);
  expect(pickedParameterValue(button.userData, 0)).toBe(1);
  root.userData.update({ ...p, light: 65, power: 1 });
  expect(lamp.material.emissiveIntensity).toBe(0.65);
});
