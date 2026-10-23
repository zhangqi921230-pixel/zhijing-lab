import { it, expect } from "vitest";
import * as T from "three";
import { buildOpticalBench } from "../src/OpticalBench.js";

it("shares two locally generated finish maps with single disposal owners and preserves optical surfaces", () => {
  const root = new T.Group();
  buildOpticalBench(root, { u: 30, f: 10, screen: 15, rays: 1 });
  const owners = [],
    maps = new Set(),
    finishes = new Set();
  let glass = 0;
  root.traverse((o) => {
    if (o.userData.ownedTexture) owners.push(o.userData.ownedTexture);
    if (o.material?.roughnessMap) {
      maps.add(o.material.roughnessMap);
      finishes.add(o.material.name);
    }
    if (o.material?.transparent && o.material?.isMeshPhysicalMaterial) {
      glass++;
      expect(o.material.roughnessMap).toBeNull();
    }
  });
  expect(glass).toBe(1);
  expect(maps.size).toBe(2);
  expect(finishes).toEqual(
    new Set([
      "optical-machined-metal",
      "optical-coated-metal",
      "optical-rubber-grip",
    ]),
  );
  for (const map of maps) {
    expect(owners.filter((o) => o === map)).toHaveLength(1);
    expect(map.image.width).toBe(128);
    expect(map.image.height).toBe(128);
    expect(map.generateMipmaps).toBe(true);
  }
  root.userData.update({ u: 20, f: 10, screen: 20, rays: 1 });
  expect(
    root.getObjectByName("optical-brushed-resource").userData.ownedTexture,
  ).toBe(
    [...maps].find(
      (map) =>
        root.getObjectByName("optical-brushed-resource").userData
          .ownedTexture === map,
    ),
  );
});
