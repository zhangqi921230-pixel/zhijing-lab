import { expect, it } from "vitest";
import * as T from "three";
import { buildCircuitBench, terminals } from "../src/CircuitBench.js";
import { pickedParameterValue } from "../src/ThreeScene.jsx";
import { circuitHoverAction } from "../src/CircuitHover.js";

it("describes the next switch action and discovers the voltage action through child meshes", () => {
  const root = new T.Group();
  buildCircuitBench(root, { u: 6, r: 20, closed: 1 });
  const grip = root.getObjectByName("circuit-switch-grip");
  expect(circuitHoverAction(grip, { closed: 1 }).text).toContain("断开");
  expect(circuitHoverAction(grip, { closed: 0 }).text).toContain("闭合");
  const dial = root.getObjectByName("circuit-voltage-dial");
  expect(circuitHoverAction(dial, { u: 6.5 }).text).toContain("6.5 V");
  expect(circuitHoverAction(dial, { u: 12 }).text).toContain("已到上限");
  expect(circuitHoverAction(dial, { u: 0 }).text).toContain("已到下限");
  expect(circuitHoverAction(root, { u: 6 })).toBeNull();
});

it("the supply dial follows voltage and its picked action respects limits in either direction", () => {
  const root = new T.Group();
  buildCircuitBench(root, { u: 6, r: 20, closed: 1 });
  const control = root.getObjectByName("circuit-voltage-control");
  const dial = root.getObjectByName("circuit-voltage-dial");
  root.updateMatrixWorld(true);
  const origin = new T.Vector3(-1, 3.2, 2.2);
  const aim = control.localToWorld(new T.Vector3(0, 0, 0.112));
  const hit = new T.Raycaster(origin, aim.sub(origin).normalize())
    .intersectObject(root, true)
    .find((h) => h.object.isMesh);
  let picked = hit.object;
  while (picked && !picked.userData.action) picked = picked.parent;
  expect(picked?.name).toBe("circuit-voltage-control");
  expect(pickedParameterValue(control.userData, 6)).toBe(6.5);
  expect(pickedParameterValue(control.userData, 6, true)).toBe(5.5);
  expect(pickedParameterValue(control.userData, 12)).toBe(12);
  expect(pickedParameterValue(control.userData, 0, true)).toBe(0);
  for (const [u, angle] of [
    [0, 135],
    [6, 0],
    [12, -135],
  ]) {
    root.userData.update({ u, r: 20, closed: 1 });
    expect(dial.rotation.z).toBeCloseTo((angle * Math.PI) / 180);
  }
});

it("polarity markings identify instrument terminals without implying a polarized resistor", () => {
  const root = new T.Group();
  buildCircuitBench(root, { u: 6, r: 20, closed: 1 });
  for (const name of ["source+", "source-", "A+", "A-", "V+", "V-"]) {
    const label = root.getObjectByName(`circuit-polarity-${name}`);
    expect(label.userData.terminal).toBe(name);
    expect(label.position.x).toBe(terminals[name][0]);
    expect(label.position.y).toBeGreaterThan(terminals[name][1]);
  }
  expect(root.getObjectByName("circuit-polarity-R+")).toBeUndefined();
});

it("keeps the knife-switch grip and supply control pickable from the actual overview in both circuit states", async () => {
  const { circuitOverview, circuitViews } =
    await import("../src/circuitViews.mjs");
  const root = new T.Group();
  buildCircuitBench(root, { u: 6, r: 20, closed: 1 });
  for (const closed of [0, 1]) {
    root.userData.update({ u: 6, r: 20, closed });
    root.updateMatrixWorld(true);
    for (const name of ["circuit-switch-grip", "circuit-voltage-control"]) {
      const object = root.getObjectByName(name);
      const origin = new T.Vector3(...circuitOverview.position),
        aim = object.localToWorld(
          new T.Vector3(0, 0, name === "circuit-voltage-control" ? 0.112 : 0),
        );
      const hits = new T.Raycaster(origin, aim.sub(origin).normalize())
        .intersectObject(root, true)
        .filter((h) => h.object.isMesh);
      let picked = hits[0]?.object;
      while (picked && !picked.userData.action) picked = picked.parent;
      expect(picked?.name).toBe(name);
    }
  }
  const control = root.getObjectByName("circuit-voltage-control");
  const origin = new T.Vector3(...circuitViews.supply.position),
    aim = control.localToWorld(new T.Vector3(0, 0, 0.112));
  let picked = new T.Raycaster(origin, aim.sub(origin).normalize())
    .intersectObject(root, true)
    .find((h) => h.object.isMesh)?.object;
  while (picked && !picked.userData.action) picked = picked.parent;
  expect(picked?.name).toBe("circuit-voltage-control");
  // The low-front inspection camera must also leave every numbered label clear.
  for (const value of [0, 3, 6, 9, 12]) {
    const angle = ((135 - value * 22.5) * Math.PI) / 180;
    const labelCenter = control.localToWorld(
      new T.Vector3(-Math.sin(angle) * 0.253, Math.cos(angle) * 0.253, 0.004),
    );
    const direction = labelCenter.clone().sub(origin);
    const blockers = new T.Raycaster(
      origin,
      direction.clone().normalize(),
      0,
      direction.length() - 0.002,
    )
      .intersectObject(root, true)
      .filter((hit) => hit.object.isMesh);
    expect(blockers, `voltage label ${value}`).toHaveLength(0);
  }
});
