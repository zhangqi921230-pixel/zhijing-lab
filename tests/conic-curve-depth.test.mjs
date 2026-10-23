import { expect, it } from "vitest";
import * as THREE from "three";
import { buildConicBench } from "../src/ConicBench.js";
import { conicSegments, conicState } from "../src/conicGeometry.mjs";
it("partitions all curve segments without changing their plane, and restores solid curves when shell is hidden", () => {
  const root = new THREE.Group(),
    p = { alpha: 30, tilt: 35, offset: 0.7 },
    camera = new THREE.PerspectiveCamera();
  buildConicBench(root, p);
  const front = root.getObjectByName("conic-intersection"),
    back = root.getObjectByName("conic-back-intersection");
  const storage = front.geometry.attributes.instanceStart.data.array,
    backStorage = back.geometry.attributes.instanceStart.data.array;
  for (const eye of [
    [4, 3, 7],
    [-4, 2, -7],
  ]) {
    camera.position.set(...eye);
    camera.updateMatrixWorld();
    root.userData.beforeRender(camera);
    expect(front.geometry.instanceCount).toBeGreaterThan(0);
    expect(back.geometry.instanceCount).toBeGreaterThan(0);
    expect(front.geometry.instanceCount + back.geometry.instanceCount).toBe(
      conicSegments(p).length,
    );
    const q = conicState(p);
    for (const line of [front, back]) {
      const data = line.geometry.attributes.instanceStart.data.array;
      for (let i = 0; i < line.geometry.instanceCount * 6; i += 3)
        expect(q.c * (data[i + 1] - 1.1) - q.s * data[i]).toBeCloseTo(
          p.offset,
          5,
        );
    }
  }
  const version = front.geometry.attributes.instanceStart.data.version;
  root.userData.beforeRender(camera);
  expect(front.geometry.attributes.instanceStart.data.version).toBe(version);
  root.userData.update({ ...p, showShell: 0 });
  root.userData.beforeRender(camera);
  expect(back.geometry.instanceCount).toBe(0);
  expect(front.geometry.instanceCount).toBe(conicSegments(p).length);
  expect(front.geometry.attributes.instanceStart.data.array).toBe(storage);
  expect(back.geometry.attributes.instanceStart.data.array).toBe(backStorage);
});
