import { expect, it } from "vitest";
import * as T from "three";
import {
  addPhotoBenchDetails,
  photoSoilSites,
} from "../src/PhotoBenchDetails.js";
import { disposeSceneResources } from "../src/disposeSceneResources.mjs";

it("土粒落在盆内且避开主茎，以单批实例绘制", () => {
  const sites = photoSoilSites();
  expect(sites).toEqual(photoSoilSites());
  sites.forEach((p) => {
    const radius = Math.hypot(p.x + 0.65, p.z);
    expect(radius + p.scale).toBeLessThan(0.44);
    expect(radius - p.scale).toBeGreaterThan(0.075);
  });
  const root = new T.Group();
  addPhotoBenchDetails(root);
  const grains = root.getObjectByName("pot-soil-grains");
  expect(grains.isInstancedMesh).toBe(true);
  expect(grains.count).toBe(150);
  root.traverse((o) => {
    if (o.geometry)
      expect(
        [...o.geometry.attributes.position.array].every(Number.isFinite),
      ).toBe(true);
  });
  expect(disposeSceneResources(root).instances).toBe(1);
});
