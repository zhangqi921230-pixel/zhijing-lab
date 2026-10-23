import * as THREE from "three";
import { it, expect } from "vitest";
import { buildSeismicBench } from "../src/SeismicBench.js";
import { disposeSceneResources } from "../src/disposeSceneResources.mjs";
it("台站材质区分涂层、金属和混凝土，共享纹理仅释放一次", () => {
  const root = new THREE.Group();
  buildSeismicBench(root, { depth: 15, distance: 40, time: 0 });
  const station = root.getObjectByName("seismic-station"),
    materials = new Map();
  station.traverse((o) => {
    if (o.material?.name) materials.set(o.material.name, o.material);
  });
  expect(materials.get("seismic-concrete").metalness).toBe(0);
  expect(materials.get("seismic-enclosure-coating").roughness).toBeGreaterThan(
    0.5,
  );
  expect(materials.get("seismic-brushed-metal").metalness).toBeGreaterThan(0.7);
  const disposed = [];
  for (const name of ["paint", "metal", "concrete"]) {
    const texture = station.getObjectByName(`seismic-${name}-resource`).userData
      .ownedTexture;
    expect(texture.image.width).toBe(128);
    texture.addEventListener("dispose", () => disposed.push(name));
  }
  disposeSceneResources(root);
  expect(disposed.sort()).toEqual(["concrete", "metal", "paint"]);
});
it("台站设备随观测位置整体移动，不在更新时重建，并保持落地和有限网格预算", () => {
  const root = new THREE.Group();
  buildSeismicBench(root, { depth: 15, distance: 40, time: 0 });
  const station = root.getObjectByName("seismic-station"),
    equipment = root.getObjectByName("seismic-telemetry-equipment");
  let triangles = 0;
  equipment.updateMatrixWorld(true);
  const bounds = new THREE.Box3().setFromObject(equipment);
  expect(bounds.min.y).toBeCloseTo(0, 5);
  equipment.traverse((o) => {
    if (o.isMesh)
      triangles +=
        (o.geometry.index?.count ?? o.geometry.attributes.position.count) / 3;
    if (o.geometry)
      expect(
        [...o.geometry.attributes.position.array].every(Number.isFinite),
      ).toBe(true);
  });
  expect(triangles).toBeLessThan(12000);
  for (const distance of [10, 80]) {
    root.userData.update({ depth: 15, distance, time: 5 });
    expect(station.position.x).toBeCloseTo(-1.7 + distance * 0.04);
    expect(root.getObjectByName("seismic-telemetry-equipment")).toBe(equipment);
  }
});
