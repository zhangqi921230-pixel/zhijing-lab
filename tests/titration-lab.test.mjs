import { expect, it } from "vitest";
import * as THREE from "three";
import { buildTitrationLab } from "../src/TitrationLab.js";
import { ph } from "../src/models.mjs";
import { firstVisibleHit } from "../src/visibleSceneHit.mjs";

it("液位变化不刷新静态阴影，旋塞变化及单步回闭会使阴影失效", () => {
  const root = new THREE.Group();
  buildTitrationLab(root, { acid: 50, base: 25, c: 0.1 });
  expect(root.getObjectByName("burette-liquid").castShadow).toBe(false);
  root.userData.shadowDirty = false;
  root.userData.update({ acid: 50, base: 26, c: 0.1 });
  expect(root.userData.shadowDirty).toBe(false);
  root.userData.emitDoseDrop();
  expect(root.userData.shadowDirty).toBe(true);
  root.userData.shadowDirty = false;
  for (let now = 0; now <= 300; now += 25) root.userData.animate(now, false);
  expect(root.userData.shadowDirty).toBe(true);
});

it("液柱只有底面，凹液面边缘闭合且不叠加水平封顶", () => {
  const root = new THREE.Group();
  buildTitrationLab(root, { acid: 50, base: 25, c: 0.1 });
  const liquid = root.getObjectByName("burette-liquid");
  const surface = root.getObjectByName("burette-meniscus");
  for (const base of [0, 25, 50, 99.9]) {
    root.userData.update({ acid: 50, base, c: 0.1 });
    root.updateMatrixWorld(true);
    const ray = new THREE.Raycaster(
      new THREE.Vector3(0.04, 6, 0),
      new THREE.Vector3(0, -1, 0),
    );
    const hits = ray.intersectObject(liquid);
    expect(hits.length).toBeGreaterThan(0);
    for (const hit of hits) expect(hit.point.y).toBeCloseTo(2.6);
    const rim = surface.geometry.attributes.position;
    const seam = Array.from({ length: rim.count }, (_, i) =>
      new THREE.Vector3().fromBufferAttribute(rim, i),
    ).filter(
      (v) =>
        Math.abs(v.y) < 1e-6 && Math.abs(Math.hypot(v.x, v.z) - 0.097) < 1e-6,
    );
    expect(seam.length).toBeGreaterThan(0);
    expect(surface.position.y).toBeCloseTo(
      liquid.position.y + 1.25 * liquid.scale.y,
    );
  }
});

it("单步滴加打开旋塞后自动关闭，不启动连续滴加或改变投料", () => {
  const root = new THREE.Group();
  const p = { acid: 50, base: 25.1, c: 0.1, dosing: false };
  buildTitrationLab(root, p);
  const valve = root.getObjectByName("burette-stopcock");
  const surface = root.getObjectByName("burette-meniscus");
  const level = surface.position.y;
  root.userData.emitDoseDrop();
  expect(valve.rotation.z).toBe(0);
  root.userData.animate(0, false);
  root.userData.animate(50, false);
  root.userData.animate(100, false);
  root.userData.animate(150, false);
  expect(valve.rotation.z).toBeGreaterThan(0);
  expect(valve.rotation.z).toBeLessThan(Math.PI / 2);
  for (let now = 200; now <= 2000; now += 50) root.userData.animate(now, false);
  expect(valve.rotation.z).toBeCloseTo(Math.PI / 2);
  expect(root.userData.animate(2050, false)).toBe(false);
  expect(surface.position.y).toBe(level);
  root.userData.emitDoseDrop();
  expect(root.userData.animate(2100, true)).toBe(false);
  expect(valve.rotation.z).toBeCloseTo(Math.PI / 2);
  root.userData.emitDoseDrop();
  root.userData.update({ ...p, dosing: true });
  root.userData.animate(2200, false);
  expect(valve.rotation.z).toBe(0);
  root.userData.update({ ...p, dosing: false });
  expect(valve.rotation.z).toBeCloseTo(Math.PI / 2);
});

it("近景标注只在对应器材视图显示，切换复用同一标注几何", () => {
  const root = new THREE.Group();
  buildTitrationLab(root, { acid: 50, base: 25, c: 0.1 });
  const meter = root.getObjectByName("titration-meter-labels"),
    electrode = root.getObjectByName("titration-electrode-labels");
  const geometry = meter.children[0].geometry;
  expect(meter.visible || electrode.visible).toBe(false);
  root.userData.setFocusAnnotations("readout");
  expect(meter.visible).toBe(true);
  expect(electrode.visible).toBe(false);
  root.userData.setFocusAnnotations("electrode");
  expect(meter.visible).toBe(false);
  expect(electrode.visible).toBe(true);
  root.userData.setFocusAnnotations("perspective");
  expect(meter.visible || electrode.visible).toBe(false);
  expect(meter.children[0].geometry).toBe(geometry);
});

it("旋塞近景中心射线命中可操作阀柄，开关两个姿态均可再次点击", () => {
  const root = new THREE.Group();
  buildTitrationLab(root, { acid: 50, base: 25, c: 0.1 });
  for (const dosing of [false, true]) {
    root.userData.update({ acid: 50, base: 25, c: 0.1, dosing });
    root.updateMatrixWorld(true);
    const ray = new THREE.Raycaster(
      new THREE.Vector3(0, 2.5, 1.7),
      new THREE.Vector3(0, 0, -1),
    );
    let target = firstVisibleHit(ray.intersectObject(root, true))?.object;
    while (target && !target.userData.action) target = target.parent;
    expect(target?.userData.action).toBe("titration-valve");
  }
});

it("lowers burette liquid from the zero mark as cumulative delivery increases", () => {
  const root = new THREE.Group();
  buildTitrationLab(root, { acid: 50, base: 0, c: 0.1 });
  const liquid = root.getObjectByName("burette-liquid"),
    geometry = liquid.geometry;
  for (const base of [0, 25, 50, 100]) {
    root.userData.update({ acid: 50, base, c: 0.1 });
    expect(liquid.position.y + 1.25 * liquid.scale.y).toBeCloseTo(
      5.1 - base * 0.025,
      3,
    );
    expect(liquid.visible).toBe(base < 100);
    expect(liquid.geometry).toBe(geometry);
  }
  expect(ph(50, 49, 0.1)).toBeLessThan(7);
  expect(ph(50, 50, 0.1)).toBeCloseTo(7);
  expect(ph(50, 51, 0.1)).toBeGreaterThan(7);
});
it("弯月面最低点与读数一致，旋塞跟随滴加状态且空管关闭", () => {
  const root = new THREE.Group();
  buildTitrationLab(root, { acid: 50, base: 25, c: 0.1 });
  const surface = root.getObjectByName("burette-meniscus"),
    valve = root.getObjectByName("burette-stopcock"),
    geometry = surface.geometry;
  geometry.computeBoundingBox();
  expect(geometry.boundingBox.min.y).toBeCloseTo(0);
  expect(geometry.boundingBox.max.y).toBeCloseTo(0.015);
  for (const base of [0, 25, 49.9, 50, 99.9, 100]) {
    root.userData.update({ acid: 50, base, c: 0.1, dosing: true });
    expect(surface.position.y + geometry.boundingBox.min.y).toBeCloseTo(
      5.1 - 0.025 * base,
    );
    expect(surface.visible).toBe(base < 100);
    expect(surface.geometry).toBe(geometry);
    expect(valve.rotation.z).toBeCloseTo(base < 100 ? 0 : Math.PI / 2);
  }
  root.userData.update({ acid: 50, base: 25, c: 0.1, dosing: false });
  expect(valve.rotation.z).toBeCloseTo(Math.PI / 2);
  const tip = root.getObjectByName("burette-tip").geometry.attributes.position;
  const outlet = Array.from({ length: tip.count }, (_, i) => [
    tip.getX(i),
    tip.getY(i),
    tip.getZ(i),
  ]).filter((v) => Math.abs(v[1] - 2.18) < 1e-5);
  expect(outlet.length).toBeGreaterThan(0);
  expect(Math.min(...outlet.map((v) => Math.hypot(v[0], v[2])))).toBeCloseTo(
    0.012,
  );
});
it("keeps the electrode bulb above the bottom and submerged even at minimum volume", () => {
  const root = new THREE.Group();
  buildTitrationLab(root, { acid: 10, base: 0, c: 0.1 });
  root.updateMatrixWorld(true);
  const bulb = new THREE.Box3().setFromObject(
    root.getObjectByName("ph-electrode-bulb"),
  );
  let surface;
  root.traverse((o) => {
    if (o.name === "beaker-liquid-surface") surface = o;
  });
  expect(bulb.min.y).toBeGreaterThan(-0.4725 + 0.07);
  expect(bulb.max.y).toBeLessThan(
    surface.getWorldPosition(new THREE.Vector3()).y,
  );
  expect(Math.hypot(-0.5, -0.2) + 0.045).toBeLessThan(0.79);
});
