import { expect, it } from "vitest";
import * as T from "three";
import { buildScene, pickedParameterValue } from "../src/ThreeScene.jsx";
import { firstVisibleHit } from "../src/visibleSceneHit.mjs";
import { rcSourcePoint } from "../src/rcLayout.mjs";

it("电源与开关有实体间隙，改线准确接回端子且不穿电源外壳", () => {
  const root = new T.Group();
  buildScene(root, "capacitor", { u: 6, r: 500, c: 4, mode: 0, time: 0 });
  root.updateMatrixWorld(true);
  const body = new T.Box3().setFromObject(
    root.getObjectByName("rc-source-body"),
  );
  const base = new T.Box3().setFromObject(
    root.getObjectByName("rc-selector-base"),
  );
  expect(base.min.x - body.max.x).toBeGreaterThan(0.25);
  for (const [name, endpoint, expected] of [
    ["rc-charge-lead", 0, rcSourcePoint([-2, 0, 0.55])],
    ["rc-source-return-lead", 1, rcSourcePoint([-1.65, -0.2, 0.55])],
  ]) {
    const path = root.getObjectByName(name).geometry.parameters.path;
    expect(
      path.getPoint(endpoint).distanceTo(new T.Vector3(...expected)),
    ).toBeLessThan(1e-10);
    for (let i = 0; i <= 200; i++)
      expect(body.containsPoint(path.getPoint(i / 200))).toBe(false);
  }
});

it("电压旋钮可从正面拾取并按 0.5 V 调节，刻线随参数转动", () => {
  const root = new T.Group(),
    p = { u: 6, r: 500, c: 4, mode: 0, time: 0 };
  buildScene(root, "capacitor", p);
  root.updateMatrixWorld(true);
  const ray = new T.Raycaster(
    new T.Vector3(-2.9, -0.35, 1),
    new T.Vector3(0, 0, -1),
  );
  let hit = firstVisibleHit(ray.intersectObject(root, true)).object;
  while (hit && !hit.userData.action) hit = hit.parent;
  expect(hit.name).toBe("rc-voltage-knob");
  expect(pickedParameterValue(hit.userData, 6)).toBe(6.5);
  expect(pickedParameterValue(hit.userData, 6, true)).toBe(5.5);
  expect(pickedParameterValue(hit.userData, 12)).toBe(12);
  const geometry = root.getObjectByName("rc-knob-grips").geometry;
  root.userData.update({ ...p, u: 12 });
  const max = hit.rotation.z;
  root.userData.update({ ...p, u: 1 });
  expect(hit.rotation.z).toBeCloseTo(-max, 12);
  expect(root.getObjectByName("rc-knob-grips").geometry).toBe(geometry);
});
it("电源脚垫落在台面且面板不遮挡旋钮", () => {
  const root = new T.Group();
  buildScene(root, "capacitor", { u: 6, r: 500, c: 4, mode: 0, time: 0 });
  root.updateMatrixWorld(true);
  const feet = root
    .getObjectByName("rc-source-assembly")
    .children.filter((o) => o.name === "rc-source-foot");
  expect(feet).toHaveLength(4);
  feet.forEach((o) =>
    expect(new T.Box3().setFromObject(o).min.y).toBeCloseTo(-0.925, 5),
  );
  expect(root.getObjectByName("rc-knob-grips").count).toBe(32);
  expect(root.getObjectByName("rc-panel-fasteners").count).toBe(4);
});
