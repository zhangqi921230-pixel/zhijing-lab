import { it, expect } from "vitest";
import * as THREE from "three";
import { secretoryState } from "../src/SecretoryPathway.js";
import { buildCell } from "../src/CellModel.js";
import { disposeSceneResources } from "../src/disposeSceneResources.mjs";

it("stage transitions keep the tracking marker continuous and release cargo without the carrier", () => {
  for (const boundary of [35, 60, 90])
    expect(
      secretoryState(boundary - 0.00001).position.distanceTo(
        secretoryState(boundary).position,
      ),
    ).toBeLessThan(0.00001);
  expect(secretoryState(25).carrier).toBe(true);
  expect(secretoryState(50).carrier).toBe(false);
  expect(secretoryState(75).carrier).toBe(true);
  expect(secretoryState(100).carrier).toBe(false);
  expect(secretoryState(100).position.x).toBeLessThan(
    secretoryState(90).position.x,
  );
  expect(secretoryState(-20).value).toBe(0);
  expect(secretoryState(120).value).toBe(100);
});

it("inspection and closing the demonstration hide its overlay without rebuilding the cell", () => {
  const root = new THREE.Group();
  const p = { part: 0, cut: 100, secretoryMode: 1, secretoryProgress: 75 };
  buildCell(root, p);
  const group = root.getObjectByName("secretory-pathway");
  expect(group.visible).toBe(true);
  root.userData.setInspection(5);
  expect(group.visible).toBe(false);
  root.userData.setInspection(0);
  expect(group.visible).toBe(true);
  root.userData.update({ ...p, secretoryMode: 0 });
  root.userData.setInspection(0);
  expect(group.visible).toBe(false);
  expect(root.getObjectByName("secretory-pathway")).toBe(group);
  disposeSceneResources(root);
});

it("moves only the overlay while preserving geometry, and rejects structural changes", () => {
  const root = new THREE.Group();
  const p = { part: 0, cut: 100, secretoryMode: 1, secretoryProgress: 0 };
  buildCell(root, p);
  const objects = [];
  root.traverse((object) =>
    objects.push([object, object.geometry, object.material]),
  );
  const originalTraverse = root.traverse;
  root.traverse = () => {
    throw new Error("Overlay update must not traverse the cell");
  };
  expect(root.userData.updateOverlay({ ...p, secretoryProgress: 75 })).toBe(
    true,
  );
  expect(root.userData.updateOverlay({ ...p, cut: 50 })).toBe(false);
  expect(root.userData.updateOverlay({ ...p, labels: 0 })).toBe(false);
  root.traverse = originalTraverse;
  for (const [object, geometry, material] of objects) {
    expect(object.geometry).toBe(geometry);
    expect(object.material).toBe(material);
  }
  root.userData.update({ ...p, cut: 50 });
  expect(
    root.userData.updateOverlay({ ...p, cut: 50, secretoryProgress: 100 }),
  ).toBe(true);
  root.userData.setInspection(6);
  root.userData.updateOverlay({ ...p, cut: 50, secretoryProgress: 20 });
  expect(root.getObjectByName("secretory-pathway").visible).toBe(false);
  disposeSceneResources(root);
});

it("highlights only the active route and releases the tracking texture", () => {
  const root = new THREE.Group();
  buildCell(root, {
    part: 0,
    cut: 100,
    secretoryMode: 1,
    secretoryProgress: 75,
  });
  const routes = [0, 1, 2, 3].map((i) =>
    root.getObjectByName(`secretory-active-route-${i}`),
  );
  expect(routes.map((route) => route.visible)).toEqual([
    false,
    false,
    true,
    false,
  ]);
  const ring = root.getObjectByName("secretory-tracking-ring");
  let disposed = 0;
  ring.material.map.addEventListener("dispose", () => disposed++);
  root.userData.updateOverlay({
    part: 0,
    cut: 100,
    secretoryMode: 1,
    secretoryProgress: 100,
  });
  expect(routes.every((route) => !route.visible)).toBe(true);
  disposeSceneResources(root);
  expect(disposed).toBe(1);
});
