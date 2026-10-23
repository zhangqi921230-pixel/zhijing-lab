import { it, expect } from "vitest";
import * as T from "three";
import { addRCMarkers } from "../src/RCMarkers.js";
import { disposeSceneResources } from "../src/disposeSceneResources.mjs";

it("orients static arrows with conventional current on both curved branches and reuses buffers", () => {
  const root = new T.Group();
  const curve = new T.CatmullRomCurve3(
    [
      [0, 0, 0],
      [1, 0, 0],
      [2, -0.3, 0],
      [2.4, 0, 1],
    ].map((p) => new T.Vector3(...p)),
  );
  const update = addRCMarkers(root, curve);
  const arrows = root.getObjectByName("rc-current-markers"),
    buffer = arrows.instanceMatrix;
  const matrix = new T.Matrix4(),
    position = new T.Vector3(),
    rotation = new T.Quaternion(),
    scale = new T.Vector3();
  try {
    for (const mode of [0, 1]) {
      update(
        { u: 6, mode, time: 0 },
        { voltage: mode ? 6 : 0, current: mode ? -0.012 : 0.012, tau: 2 },
      );
      for (let i = 0; i < 8; i++) {
        const phase = mode ? 1 - i / 8 : i / 8;
        arrows.getMatrixAt(i, matrix);
        matrix.decompose(position, rotation, scale);
        expect(
          position.distanceTo(
            curve.getPointAt(phase).add(new T.Vector3(0, 0.2, 0)),
          ),
        ).toBeLessThan(1e-6);
        const direction = new T.Vector3(0, 1, 0).applyQuaternion(rotation);
        const expected = curve
          .getTangentAt(phase)
          .multiplyScalar(mode ? -1 : 1);
        expect(direction.dot(expected)).toBeCloseTo(1, 6);
      }
      const version = buffer.version;
      update(
        { u: 6, mode, time: 0 },
        { voltage: mode ? 6 : 0, current: 0.012, tau: 2 },
      );
      expect(buffer.version).toBe(version);
      expect(arrows.instanceMatrix).toBe(buffer);
    }
    update({ u: 6, mode: 1, time: 20 }, { voltage: 0, current: 0, tau: 2 });
    expect(arrows.visible).toBe(false);
    const state = { voltage: 3, current: 0.006, tau: 2 };
    update({ u: 6, mode: 0, time: 1, currentArrows: 0 }, state);
    expect(arrows.visible).toBe(false);
    expect(root.getObjectByName("rc-positive-charge").visible).toBe(true);
    update({ u: 6, mode: 0, time: 1, currentArrows: 1 }, state);
    expect(arrows.visible).toBe(true);
    const shownVersion = buffer.version;
    update({ u: 6, mode: 0, time: 1, currentArrows: 0 }, state);
    update({ u: 6, mode: 0, time: 1, currentArrows: 1 }, state);
    expect(arrows.visible).toBe(true);
    expect(buffer.version).toBe(shownVersion);
  } finally {
    disposeSceneResources(root);
  }
});
