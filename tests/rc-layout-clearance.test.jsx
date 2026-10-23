import { it, expect } from "vitest";
import * as T from "three";
import { buildScene } from "../src/ThreeScene.jsx";
import { disposeSceneResources } from "../src/disposeSceneResources.mjs";
it("separates the resistor body from the switch pivot and joins them with a visible lead", () => {
  const root = new T.Group(),
    p = { u: 6, r: 500, c: 4, mode: 0, trace: 0, time: 0 };
  buildScene(root, "capacitor", p);
  root.updateMatrixWorld(true);
  const resistor = root.getObjectByName("rc-resistor-assembly"),
    lead = root.getObjectByName("rc-selector-resistor-lead");
  const bounds = new T.Box3().setFromObject(resistor);
  expect(bounds.min.x - -0.7).toBeGreaterThan(0.3);
  const length = lead.geometry.parameters.height;
  const endpoints = [-1, 1]
    .map(
      (sign) => lead.localToWorld(new T.Vector3(0, (sign * length) / 2, 0)).x,
    )
    .sort((a, b) => a - b);
  expect(endpoints[0]).toBeCloseTo(-0.7, 8);
  expect(endpoints[1]).toBeCloseTo(-0.35, 8);
  for (const mode of [0, 1]) {
    root.userData.update({ ...p, mode, trace: 1 });
    expect(lead.userData.selectedBranch).toBe(true);
  }
  disposeSceneResources(root);
});
