import { it, expect } from "vitest";
import { Group } from "three";
import { buildTerrainEcology } from "../src/TerrainEcology.js";
it("fluent startup skips detailed forests and first demand creates reusable batches", () => {
  const root = new Group();
  buildTerrainEcology(root);
  expect(root.getObjectByName("mountain-conifer-forest")).toBeUndefined();
  expect(root.getObjectByName("valley-broadleaf-forest")).toBeUndefined();
  expect(root.getObjectByName("forest-trunks")).toBeUndefined();
  const pineLow = root.getObjectByName("forest-low-detail"),
    broadLow = root.getObjectByName("forest-low-broadleaf");
  expect(pineLow.count + broadLow.count).toBe(root.userData.forestCount);
  const initialCount = root.children.length;
  root.userData.ensureDetailedForest();
  const pine = root.getObjectByName("mountain-conifer-forest"),
    broad = root.getObjectByName("valley-broadleaf-forest"),
    trunk = root.getObjectByName("forest-trunks");
  expect(pine.count).toBe(pineLow.count);
  expect(broad.count).toBe(broadLow.count * 3);
  expect(trunk.count).toBe(root.userData.forestCount);
  expect(root.children.length).toBe(initialCount + 3);
  root.userData.ensureDetailedForest();
  expect(root.children.length).toBe(initialCount + 3);
  expect(root.getObjectByName("mountain-conifer-forest")).toBe(pine);
  root.traverse((o) => {
    o.geometry?.dispose();
    o.material?.dispose();
    o.userData.ownedTexture?.dispose();
  });
});
