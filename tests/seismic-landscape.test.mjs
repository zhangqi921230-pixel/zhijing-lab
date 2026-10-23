import * as THREE from "three";
import { it, expect } from "vitest";
import {
  seismicPlantSites,
  addSeismicLandscape,
} from "../src/SeismicLandscape.js";
import { buildSeismicBench } from "../src/SeismicBench.js";
import { disposeSceneResources } from "../src/disposeSceneResources.mjs";

it("植被位置可复现，避开台站检修带并控制实例网格预算", () => {
  const sites = seismicPlantSites();
  expect(sites).toEqual(seismicPlantSites());
  for (const site of sites) {
    expect(Math.abs(site.x) + 0.15 * site.scale).toBeLessThan(3.5);
    expect(site.z + 0.15 * site.scale).toBeLessThan(0.78);
    expect(site.z - 0.15 * site.scale).toBeGreaterThan(-2.2);
  }
  const root = new THREE.Group();
  addSeismicLandscape(root);
  let triangles = 0;
  root.traverse((o) => {
    if (o.geometry)
      triangles +=
        ((o.geometry.index?.count ?? o.geometry.attributes.position.count) /
          3) *
        (o.isInstancedMesh ? o.count : 1);
  });
  expect(triangles).toBeLessThan(40000);
  expect(disposeSceneResources(root).instances).toBe(3);
});

it("显示切换不重建植被和几何，保持波前更新", () => {
  const root = new THREE.Group();
  buildSeismicBench(root, { depth: 15, distance: 40, time: 0 });
  const vegetation = root.getObjectByName("seismic-vegetation");
  const geometry = vegetation.children[0].geometry;
  for (const visible of [0, 1, 0, 1]) {
    root.userData.update({
      depth: 15,
      distance: 40,
      time: 5,
      vegetation: visible,
    });
    expect(root.getObjectByName("seismic-vegetation")).toBe(vegetation);
    expect(vegetation.visible).toBe(Boolean(visible));
    expect(vegetation.children[0].geometry).toBe(geometry);
  }
  disposeSceneResources(root);
});
