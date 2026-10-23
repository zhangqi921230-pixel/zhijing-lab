import { it, expect } from "vitest";
import * as T from "three";
import { buildOpticalBench } from "../src/OpticalBench.js";
import { disposeSceneResources } from "../src/disposeSceneResources.mjs";

it("screen observation hides teaching overlays without changing optics and restores user choices", () => {
  const root = new T.Group();
  const p = { u: 20, f: 10, screen: 20, rays: 1, light: 1 };
  buildOpticalBench(root, p);
  const marks = root.getObjectByName("optical-focal-marks");
  const labels = [0, 1, 2].map((i) =>
    root.getObjectByName(`optical-apparatus-label-${i}`),
  );
  const state = root.userData.optics;
  const rays = root.children.filter((object) => object.isLine && !object.name);
  expect(rays).toHaveLength(3);
  const positions = rays.map((ray) => [
    ...ray.geometry.attributes.position.array,
  ]);
  root.userData.setOpticalScreenView(true);
  expect(marks.visible).toBe(false);
  expect(labels.every((label) => !label.visible)).toBe(true);
  expect(root.userData.optics).toBe(state);
  expect(rays.every((ray) => ray.visible)).toBe(true);
  expect(
    rays.map((ray) => [...ray.geometry.attributes.position.array]),
  ).toEqual(positions);
  root.userData.update({ ...p, screen: 21 });
  expect(root.userData.optics.focused).toBe(false);
  expect(marks.visible).toBe(false);
  expect(labels.every((label) => !label.visible)).toBe(true);
  root.userData.setOpticalScreenView(false);
  expect(marks.visible).toBe(true);
  expect(labels.every((label) => label.visible)).toBe(true);
  root.userData.update({ ...p, rays: 0, apparatusLabels: 0 });
  root.userData.setOpticalScreenView(true);
  root.userData.setOpticalScreenView(false);
  expect(marks.visible).toBe(false);
  expect(labels.every((label) => !label.visible)).toBe(true);
  expect(rays.every((ray) => !ray.visible)).toBe(true);
  disposeSceneResources(root);
});
