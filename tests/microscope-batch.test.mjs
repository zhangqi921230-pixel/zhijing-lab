import { it, expect } from "vitest";
import * as T from "three";
import { repeatedBoxes } from "../src/MicroscopeBatch.js";
import { box } from "../src/CircuitBench.js";
it("short dial ticks use instance scale without leaking scale into the next mark", () => {
  const batch = repeatedBoxes(
    new T.Group(),
    [0.003, 0.021, 0.004],
    "#24343b",
    0,
    [{ position: [0, 0, 0], scale: [1, 0.55, 1] }, { position: [0, 1, 0] }],
    "ticks",
  );
  const matrix = new T.Matrix4(),
    scale = new T.Vector3();
  batch.getMatrixAt(0, matrix);
  scale.setFromMatrixScale(matrix);
  expect(scale.y).toBeCloseTo(0.55);
  batch.getMatrixAt(1, matrix);
  scale.setFromMatrixScale(matrix);
  expect(scale.toArray()).toEqual([1, 1, 1]);
});
it("small-detail bevels retain envelope and ray picking with fewer triangles", () => {
  const poses = [{ position: [0, 0, 0] }];
  const detailed = repeatedBoxes(
    new T.Group(),
    [0.15, 0.018, 0.025],
    "#657074",
    0.003,
    poses,
    "detail",
  );
  const reduced = repeatedBoxes(
    new T.Group(),
    [0.15, 0.018, 0.025],
    "#657074",
    0.003,
    poses,
    "reduced",
    1,
  );
  detailed.geometry.computeBoundingBox();
  reduced.geometry.computeBoundingBox();
  expect(
    reduced.geometry.boundingBox.min.distanceTo(
      detailed.geometry.boundingBox.min,
    ),
  ).toBeLessThan(1e-7);
  expect(
    reduced.geometry.boundingBox.max.distanceTo(
      detailed.geometry.boundingBox.max,
    ),
  ).toBeLessThan(1e-7);
  expect(reduced.geometry.attributes.position.count).toBeLessThan(
    detailed.geometry.attributes.position.count / 2,
  );
  reduced.updateMatrixWorld(true);
  const hit = new T.Raycaster(
    new T.Vector3(0, 0, 1),
    new T.Vector3(0, 0, -1),
  ).intersectObject(reduced);
  expect(hit[0].instanceId).toBe(0);
});
it("batched details preserve world bounds and picking after parent motion", () => {
  const parent = new T.Group(),
    original = new T.Group();
  parent.userData = { action: "parameter", key: "focus" };
  const poses = [
    { position: [0, 0, 0], rotation: [0, 0, 0] },
    { position: [0, 2, 0], rotation: [0, 0, 0.3] },
  ];
  const batch = repeatedBoxes(
    parent,
    [0.2, 0.1, 0.3],
    "#657074",
    0.002,
    poses,
    "ribs",
  );
  for (const pose of poses) {
    const part = box(
      original,
      [0.2, 0.1, 0.3],
      "#657074",
      pose.position,
      0.002,
    );
    part.rotation.set(...pose.rotation);
  }
  for (const angle of [0, 0.7, 2.5]) {
    for (const group of [parent, original]) {
      group.position.set(2, -1, 3);
      group.rotation.set(angle, angle / 2, 0);
      group.updateMatrixWorld(true);
    }
    const a = new T.Box3().setFromObject(parent),
      b = new T.Box3().setFromObject(original);
    // Instanced bounds are conservative under parent rotation. Check each
    // transformed source vertex instead of comparing enclosing AABBs.
    const matrix = new T.Matrix4(),
      point = new T.Vector3();
    for (let i = 0; i < poses.length; i++) {
      batch.getMatrixAt(i, matrix);
      matrix.premultiply(batch.matrixWorld);
      const mesh = original.children[i],
        attr = mesh.geometry.attributes.position;
      for (let j = 0; j < attr.count; j++) {
        point.fromBufferAttribute(attr, j).applyMatrix4(matrix);
        expect(
          point.distanceTo(
            new T.Vector3()
              .fromBufferAttribute(attr, j)
              .applyMatrix4(mesh.matrixWorld),
          ),
        ).toBeLessThan(1e-6);
      }
    }
    expect(a.containsBox(b)).toBe(true);
    const center = parent.localToWorld(new T.Vector3());
    const normal = new T.Vector3(0, 0, 1).transformDirection(
      parent.matrixWorld,
    );
    const ray = new T.Raycaster(
      center.clone().addScaledVector(normal, 2),
      normal.clone().negate(),
    );
    const hit = ray.intersectObject(parent, true)[0];
    expect(hit.object).toBe(batch);
    expect(hit.instanceId).toBe(0);
    expect(hit.object.parent.userData.key).toBe("focus");
  }
});
