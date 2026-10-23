import { it, expect } from "vitest";
import * as T from "three";
import { addRCField } from "../src/RCField.js";
import { disposeSceneResources } from "../src/disposeSceneResources.mjs";
it("keeps field in the dielectric, pointing positive to negative in charge and discharge", () => {
  const root = new T.Group();
  const update = addRCField(root);
  const group = root.getObjectByName("rc-electric-field");
  for (const mode of [0, 1]) {
    update({ u: 6, mode, fieldLines: 1 }, { voltage: 3 });
    expect(group.visible).toBe(true);
    expect(group.children[0].material.opacity).toBe(0.5);
    for (const mesh of group.children) {
      for (let j = 0; j < mesh.count; j++) {
        const matrix = new T.Matrix4();
        mesh.getMatrixAt(j, matrix);
        const pos = mesh.geometry.attributes.position;
        for (let i = 0; i < pos.count; i++) {
          const point = new T.Vector3()
            .fromBufferAttribute(pos, i)
            .applyMatrix4(matrix);
          expect(point.x).toBeGreaterThan(1.58);
          expect(point.x).toBeLessThan(2.02);
        }
      }
    }
    const geo = group.children[1].geometry;
    geo.computeBoundingBox();
    expect(geo.boundingBox.max.x).toBeCloseTo(0.0375);
  }
  update({ u: 6, fieldLines: 1 }, { voltage: 0 });
  expect(group.visible).toBe(false);
  update({ u: 6, fieldLines: 0 }, { voltage: 6 });
  expect(group.visible).toBe(false);
  disposeSceneResources(root);
});
