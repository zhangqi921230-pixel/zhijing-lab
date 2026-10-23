import { it, expect } from "vitest";
import * as T from "three";
import { createChloroplastTemplate } from "../src/CellOrganelles.js";
import { disposeSceneResources } from "../src/disposeSceneResources.mjs";

it("varied grana retain separation and enclose the lamella connection ends", () => {
  const root = createChloroplastTemplate();
  try {
    const discs = root.getObjectByName("chloroplast-thylakoids");
    discs.geometry.computeBoundingBox();
    const thickness =
      discs.geometry.boundingBox.max.y - discs.geometry.boundingBox.min.y;
    const centers = [],
      m = new T.Matrix4(),
      p = new T.Vector3();
    for (let i = 0; i < discs.count; i++) {
      discs.getMatrixAt(i, m);
      centers.push(new T.Vector3().setFromMatrixPosition(m));
      const a = discs.geometry.attributes.position;
      for (let j = 0; j < a.count; j++) {
        p.fromBufferAttribute(a, j).applyMatrix4(m);
        expect((p.x / 0.35) ** 2 + (p.z / 0.258) ** 2).toBeLessThan(1);
      }
    }
    for (let i = 1; i < centers.length; i++)
      if (
        Math.hypot(
          centers[i].x - centers[i - 1].x,
          centers[i].z - centers[i - 1].z,
        ) < 0.01
      )
        expect(centers[i].y - centers[i - 1].y - thickness).toBeGreaterThan(
          0.002,
        );
    for (const [x, z] of [
      [-0.21, 0],
      [-0.105, 0.1],
      [0, -0.07],
      [0.115, 0.1],
      [0.215, -0.025],
    ]) {
      for (const y of [-0.027, -0.009]) {
        const index = centers.findIndex(
          (c) =>
            Math.abs(c.y - y) < 1e-7 && Math.hypot(c.x - x, c.z - z) < 0.003,
        );
        expect(index).toBeGreaterThanOrEqual(0);
        discs.getMatrixAt(index, m);
        m.invert();
        // The full connection-end patch fits inside each disc's central volume.
        for (const dx of [-0.011, 0.011])
          for (const dz of [-0.011, 0.011]) {
            p.set(x + dx, y, z + dz).applyMatrix4(m);
            expect(Math.hypot(p.x, p.z)).toBeLessThan(0.035);
            expect(Math.abs(p.y) + 0.0025).toBeLessThan(0.0065);
          }
      }
    }
  } finally {
    disposeSceneResources(root);
  }
});
