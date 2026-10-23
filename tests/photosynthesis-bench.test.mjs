import { it, expect } from "vitest";
import * as T from "three";
import { buildPhotosynthesisBench } from "../src/PhotosynthesisBench.js";
import { photo } from "../src/models.mjs";
import { disposeSceneResources } from "../src/disposeSceneResources.mjs";

it("器材表面纹理有明确所有者，倒角不改变外壳外廓尺寸", () => {
  const root = new T.Group();
  buildPhotosynthesisBench(root, { light: 50, co2: 70, temp: 25 });
  const housing = root.getObjectByName("photo-readout-housing");
  housing.geometry.computeBoundingBox();
  const size = housing.geometry.boundingBox.getSize(new T.Vector3());
  expect(size.x).toBeCloseTo(1.45, 5);
  expect(size.y).toBeCloseTo(0.95, 5);
  expect(size.z).toBeCloseTo(0.36, 5);
  const paint =
    root.getObjectByName("photo-paint-finish").userData.ownedTexture;
  expect(housing.material.roughnessMap).toBe(paint);
  let disposed = 0;
  paint.addEventListener("dispose", () => disposed++);
  expect(disposeSceneResources(root).textures).toBe(2);
  expect(disposed).toBe(1);
});

it("补光与总光合模型联动，黑暗值为零，调参复用标本", () => {
  const root = new T.Group(),
    p = { light: 50, co2: 70, temp: 25 };
  buildPhotosynthesisBench(root, p);
  const specimen = root.getObjectByName("photosynthesis-plant"),
    geometry = specimen.children[0].geometry;
  expect(specimen.children.length).toBe(3);
  expect(root.userData.rate).toBeCloseTo(photo(p));
  root.userData.update({ ...p, light: 0 });
  expect(root.userData.rate).toBe(0);
  expect(root.children.find((o) => o.isSpotLight).intensity).toBe(0);
  root.userData.update({ ...p, light: 80 });
  expect(root.userData.rate).toBeGreaterThan(photo(p));
  expect(specimen.children[0].geometry).toBe(geometry);
  root.traverse((o) => {
    if (o.geometry)
      expect(
        [...o.geometry.attributes.position.array].every(Number.isFinite),
      ).toBe(true);
  });
});
