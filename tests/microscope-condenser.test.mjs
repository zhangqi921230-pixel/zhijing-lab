import { expect, it } from "vitest";
import * as T from "three";
import {
  microscopeCondenser,
  condenserOpening,
} from "../src/MicroscopeCondenser.js";
import { microscopeOptics } from "../src/MicroscopeField.jsx";
import { pickedParameterValue } from "../src/ThreeScene.jsx";
import { buildScene } from "../src/ThreeScene.jsx";
import { lessons, defaults } from "../src/lessons.mjs";
import { firstVisibleHit } from "../src/visibleSceneHit.mjs";
import { microscopeParts } from "../src/microscopeParts.mjs";

it("keeps a clear optical axis through the housing and reuses the adjustable iris", () => {
  const stage = new T.Group();
  const update = microscopeCondenser(stage);
  const group = stage.getObjectByName("microscope-condenser");
  const housing = stage.getObjectByName("hollow-condenser-housing");
  const iris = stage.getObjectByName("condenser-aperture-iris");
  const geometry = iris.geometry;
  for (const value of [20, 40, 70, 100]) {
    update(value);
    stage.updateMatrixWorld(true);
    const center = group.getWorldPosition(new T.Vector3());
    for (const sign of [-1, 1]) {
      const sideHit = new T.Raycaster(
        center.clone().add(new T.Vector3(sign, -0.1, 0)),
        new T.Vector3(-sign, 0, 0),
      ).intersectObject(housing)[0];
      expect(sign * (sideHit.point.x - center.x)).toBeCloseTo(0.33, 5);
      expect(sideHit.face.normal.x * sign).toBeGreaterThan(0);
    }
    const ray = new T.Raycaster(
      center.clone().add(new T.Vector3(0, -1, 0)),
      new T.Vector3(0, 1, 0),
    );
    expect(ray.intersectObject(housing)).toHaveLength(0);
    expect(ray.intersectObject(iris)).toHaveLength(0);
    const p = geometry.attributes.position;
    for (let i = 0; i <= 7; i++)
      expect(Math.hypot(p.getX(i), p.getZ(i))).toBeCloseTo(
        condenserOpening(value),
        7,
      );
    expect(iris.geometry).toBe(geometry);
    expect(Array.from(p.array).every(Number.isFinite)).toBe(true);
  }
  const lever = stage.getObjectByName("condenser-aperture-lever");
  expect(pickedParameterValue(lever.userData, 100)).toBe(100);
  expect(pickedParameterValue(lever.userData, 20, true)).toBe(20);
  expect(pickedParameterValue(lever.userData, 70, true)).toBe(60);
});

it("dims illumination while preserving field extent, focus and magnification", () => {
  const p = { mag: 100, coarse: 50, focus: 50, x: 0, y: 0, power: 1 };
  const original = microscopeOptics(p);
  expect(original.apertureTransmission).toBe(1);
  for (const aperture of [20, 40, 70, 100]) {
    const result = microscopeOptics({ ...p, aperture });
    expect(result.fieldDiameter).toBe(original.fieldDiameter);
    expect(result.zoom).toBe(original.zoom);
    expect(result.blur).toBe(original.blur);
    expect(result.apertureTransmission).toBeCloseTo(
      Math.min(1, (aperture / 70) ** 2),
    );
  }
});

it("allows the aperture handle to be picked from its close-up without decorative-line interception", () => {
  const root = new T.Group();
  const p = defaults(lessons.find((l) => l.id === "microscope"));
  buildScene(root, "microscope", p);
  const part = microscopeParts.find((p) => p.node === "microscope-condenser");
  const node = root.getObjectByName(part.node);
  const lever = root.getObjectByName("condenser-aperture-lever");
  for (const aperture of [20, 40, 70, 100]) {
    root.userData.update({ ...p, aperture });
    root.updateMatrixWorld(true);
    const target = node.localToWorld(new T.Vector3(...part.point));
    const camera = target.clone().add(new T.Vector3(...part.cameraOffset));
    const grip = lever.localToWorld(new T.Vector3(0.58, 0, 0));
    const ray = new T.Raycaster(camera, grip.clone().sub(camera).normalize());
    let hit = firstVisibleHit(ray.intersectObject(root, true))?.object;
    while (hit && !hit.userData.action) hit = hit.parent;
    expect(hit).toBe(lever);
  }
});
