import { it, expect } from "vitest";
import * as T from "three";
import { addConicAngles, conicAnglePoints } from "../src/ConicAngles.js";
it("draws half angles from the axis and plane inclinations from horizontal", () => {
  for (const angle of [0, 15, 30, 60, 90]) {
    for (const vertical of [false, true]) {
      const points = conicAnglePoints(angle, 0.7, vertical);
      expect(points[0].angleTo(points.at(-1))).toBeCloseTo(
        T.MathUtils.degToRad(angle),
        7,
      );
      for (const point of points) {
        expect(point.length()).toBeCloseTo(0.7, 10);
        expect(point.z).toBe(0);
      }
    }
  }
});
it("anchors theta to the moving plane, reuses geometry, and follows visibility controls", () => {
  const root = new T.Group();
  const update = addConicAngles(root, 1.1);
  const theta = root.getObjectByName("conic-plane-angle");
  const geometry = theta.children[0].geometry;
  const p = { alpha: 30, tilt: 60, offset: 0.7, showGuides: 1, showPlane: 1 };
  update(p);
  expect(root.getObjectByName("conic-label-α").userData.text).toBe("α 30°");
  expect(root.getObjectByName("conic-label-θ").userData.text).toBe("θ 60°");
  root.updateMatrixWorld(true);
  const alpha = root.getObjectByName("conic-half-angle");
  const lowerDirection = new T.Vector3(0, 0.7, 0).applyQuaternion(
    alpha.quaternion,
  );
  expect(lowerDirection.y).toBeCloseTo(-0.7);
  const normal = new T.Vector3(
    -Math.sin(Math.PI / 3),
    Math.cos(Math.PI / 3),
    0,
  );
  expect(
    theta.position
      .clone()
      .sub(new T.Vector3(0, 1.1, 0))
      .dot(normal),
  ).toBeCloseTo(0.7);
  update({ ...p, offset: 1, showPlane: 0 });
  expect(theta.visible).toBe(false);
  expect(root.getObjectByName("conic-half-angle").visible).toBe(true);
  expect(theta.children[0].geometry).toBe(geometry);
  update({ ...p, alpha: 25, tilt: 35.5 });
  expect(root.getObjectByName("conic-label-α").userData.text).toBe("α 25°");
  expect(root.getObjectByName("conic-label-θ").userData.text).toBe("θ 35.5°");
  update({ ...p, showGuides: 0 });
  expect(root.children.every((group) => !group.visible)).toBe(true);
});
