import { expect, it } from "vitest";
import * as T from "three";
import { addInclineWeights } from "../src/InclineWeights.js";

it("retains all selectable loads on the plate without changing instance buffers", () => {
  const block = new T.Group(),
    update = addInclineWeights(block);
  const weights = block.getObjectByName("incline-added-weights"),
    clamp = block.getObjectByName("incline-weight-clamp");
  const buffer = weights.instanceMatrix,
    version = buffer.version;
  weights.geometry.computeBoundingBox();
  const matrix = new T.Matrix4();
  for (let n = 0; n <= 9; n++) {
    update(0.5 + n * 0.5);
    expect(weights.count).toBe(n);
    expect(weights.visible).toBe(n > 0);
    expect(clamp.position.y - 0.0125).toBeCloseTo(0.3 + n * 0.032);
    for (let i = 0; i < n; i++) {
      weights.getMatrixAt(i, matrix);
      const bounds = weights.geometry.boundingBox.clone().applyMatrix4(matrix);
      expect(bounds.min.y).toBeCloseTo(0.3 + i * 0.032, 6);
      expect(bounds.max.y).toBeCloseTo(0.3 + (i + 1) * 0.032, 6);
      expect(
        Math.max(Math.abs(bounds.min.x), Math.abs(bounds.max.x)),
      ).toBeLessThan(0.175);
    }
    expect(weights.instanceMatrix).toBe(buffer);
    expect(buffer.version).toBe(version);
  }
  update(5);
  block.updateMatrixWorld(true);
  const ray = new T.Raycaster(new T.Vector3(0, 1, 0), new T.Vector3(0, -1, 0));
  expect(ray.intersectObject(weights)).toHaveLength(0); // Central post fits the through-holes.
  ray.ray.origin.x = 0.08;
  expect(ray.intersectObject(weights).length).toBeGreaterThan(0);
});
