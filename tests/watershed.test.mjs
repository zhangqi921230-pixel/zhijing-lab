import { it, expect } from "vitest";
import * as T from "three";
import {
  buildWaterBench,
  watershedGeometry,
  watershedHeight,
  riverX,
  riverY,
  watershedGridX,
} from "../src/WaterBudgetBench.js";
import { disposeSceneResources } from "../src/disposeSceneResources.mjs";

it("河岸细节合并为三个低面数对象，并随植被开关隐藏草丛", () => {
  const root = new T.Group();
  const p = { rain: 100, infil: 40, evap: 15 };
  buildWaterBench(root, p);
  const names = [
    "watershed-bank-gravel",
    "watershed-bank-reeds",
    "watershed-wet-bank",
  ];
  const objects = names.map((n) => root.getObjectByName(n));
  const triangles = objects.reduce(
    (n, o) => n + o.geometry.attributes.position.count / 3,
    0,
  );
  expect(triangles).toBeLessThan(2500);
  const original = objects.map((o) => o.geometry);
  root.userData.update({ ...p, vegetation: 0 });
  expect(objects[1].visible).toBe(false);
  expect(objects[0].visible).toBe(true);
  root.userData.update({ ...p, vegetation: 1, rain: 200 });
  expect(objects[1].visible).toBe(true);
  expect(objects.map((o) => o.geometry)).toEqual(original);
  disposeSceneResources(root);
});

it("画质切换只改变投影开关，植被实例和资源可完整释放", () => {
  const root = new T.Group();
  buildWaterBench(root, { rain: 100, infil: 40, evap: 15 });
  const forest = root.getObjectByName("watershed-forest");
  const ground = root.getObjectByName("watershed-terrain");
  const original = forest.children.map((o) => o.geometry);
  expect(forest.children.every((o) => !o.castShadow)).toBe(true);
  root.userData.setQuality("detail");
  expect(forest.children.every((o) => o.castShadow)).toBe(true);
  expect(ground.receiveShadow).toBe(true);
  root.userData.setQuality("fluent");
  expect(ground.receiveShadow).toBe(false);
  expect(forest.children.map((o) => o.geometry)).toEqual(original);
  const geometrySet = new Set(),
    disposed = new Set();
  root.traverse((o) => {
    if (o.geometry) {
      geometrySet.add(o.geometry);
      o.geometry.addEventListener("dispose", () => disposed.add(o.geometry));
    }
  });
  expect(disposeSceneResources(root).instances).toBe(2);
  expect(disposed).toEqual(geometrySet);
});

it("河岸网格逐行沿河道排列，保持边界与无翻折的列序", () => {
  const geo = watershedGeometry(),
    pos = geo.attributes.position;
  for (let row = 0; row <= 48; row++) {
    const z = pos.getZ(row * 73);
    expect(watershedGridX(0, z)).toBeCloseTo(-3);
    expect(watershedGridX(72, z)).toBeCloseTo(3);
    for (let col = 1; col <= 72; col++)
      expect(pos.getX(row * 73 + col)).toBeGreaterThan(
        pos.getX(row * 73 + col - 1),
      );
    for (const col of [35, 36, 37])
      expect(pos.getY(row * 73 + col)).toBeLessThan(riverY(z));
    for (const col of [34, 38])
      expect(pos.getY(row * 73 + col)).toBeGreaterThan(riverY(z));
  }
});

it("河床沿出口方向下降，水面位于河床上方且不漫过两岸", () => {
  for (let z = -2; z < 2; z += 0.025) {
    expect(riverY(z + 0.01)).toBeLessThan(riverY(z));
    expect(watershedHeight(riverX(z), z)).toBeLessThan(riverY(z));
    for (const d of [-0.115, 0.115])
      expect(watershedHeight(riverX(z) + d, z)).toBeGreaterThan(riverY(z));
  }
  const g = watershedGeometry();
  expect(g.attributes.position.count).toBeLessThan(4000);
  expect([...g.attributes.normal.array].every(Number.isFinite)).toBe(true);
});
it("所有比例端点守恒，零输入隐藏水量箭头，更新复用几何与植被批次", () => {
  const root = new T.Group();
  buildWaterBench(root, { rain: 100, infil: 40, evap: 15 });
  const geometries = [];
  root.traverse((o) => {
    if (o.geometry) geometries.push(o.geometry);
  });
  for (const rain of [0, 50, 200])
    for (const infil of [0, 40, 80])
      for (const evap of [0, 15, 20]) {
        root.userData.update({ rain, infil, evap, vegetation: 0, pathways: 1 });
        const a = root.userData.amounts;
        expect(a.infil + a.evap + a.runoff).toBeCloseTo(rain);
        expect(a.runoff).toBeGreaterThanOrEqual(0);
        if (!rain)
          expect(
            root
              .getObjectByName("watershed-pathways")
              .children.every((c) => !c.visible),
          ).toBe(true);
      }
  const after = [];
  root.traverse((o) => {
    if (o.geometry) after.push(o.geometry);
  });
  expect(after).toEqual(geometries);
  const forest = root.getObjectByName("watershed-forest");
  expect(forest.visible).toBe(false);
  expect(forest.children.every((c) => c.isInstancedMesh)).toBe(true);
  expect(forest.children.length).toBe(2);
});
