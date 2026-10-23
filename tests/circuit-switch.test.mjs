import { it, expect } from "vitest";
import * as T from "three";
import { buildCircuitBench } from "../src/CircuitBench.js";
import { disposeSceneResources } from "../src/disposeSceneResources.mjs";
it("seats the closed knife in the output jaws and lifts clear around a fixed pivot", () => {
  const root = new T.Group();
  const p = { u: 6, r: 20, closed: 1 };
  buildCircuitBench(root, p);
  const hinge = root.getObjectByName("circuit-switch-hinge");
  const output = new T.Vector3(0.3, 0.12, -1.3);
  root.updateMatrixWorld(true);
  const tip = hinge.localToWorld(new T.Vector3(1.05, 0, 0));
  expect(tip.distanceTo(output)).toBeLessThan(1e-6);
  root.userData.update({ ...p, closed: 0 });
  root.updateMatrixWorld(true);
  const raised = hinge.localToWorld(new T.Vector3(1.05, 0, 0));
  expect(raised.y).toBeGreaterThan(0.8);
  expect(raised.distanceTo(output)).toBeGreaterThan(0.7);
  expect(hinge.getWorldPosition(new T.Vector3()).toArray()).toEqual([
    -0.75, 0.12, -1.3,
  ]);
  disposeSceneResources(root);
});
