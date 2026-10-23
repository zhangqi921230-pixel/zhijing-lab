import { expect, it } from "vitest";
import * as T from "three";
import { buildCell } from "../src/CellModel.js";
import { disposeSceneResources } from "../src/disposeSceneResources.mjs";
import { cellParticleFits } from "../src/cellParticles.mjs";

it("free ribosomes remain in cytoplasm outside intact organelles across chapter changes", () => {
  const root = new T.Group();
  buildCell(root, { part: 0, cut: 100 });
  try {
    root.updateMatrixWorld(true);
    const bodies = [];
    root.traverse((o) => {
      if (
        ["chloroplast-envelope", "mitochondrion-outer-membrane"].includes(
          o.name,
        )
      )
        bodies.push(
          new T.Box3(new T.Vector3(-1, -1, -1), new T.Vector3(1, 1, 1))
            .applyMatrix4(o.matrixWorld)
            .expandByScalar(0.013),
        );
    });
    const particles = root.getObjectByName("cell-ribosomes");
    expect(particles.isInstancedMesh).toBe(true);
    expect(particles.count).toBeGreaterThan(100);
    const matrix = new T.Matrix4(),
      point = new T.Vector3(),
      scale = new T.Vector3();
    for (let i = 0; i < particles.count; i++) {
      particles.getMatrixAt(i, matrix);
      point.setFromMatrixPosition(matrix);
      scale.setFromMatrixScale(matrix);
      expect(cellParticleFits(point.toArray(), 0.013)).toBe(true);
      expect(bodies.some((box) => box.containsPoint(point))).toBe(false);
      expect(scale.x).toBeGreaterThanOrEqual(0.64);
      expect(scale.x).toBeLessThanOrEqual(1);
    }
    const version = particles.instanceMatrix.version;
    for (const part of [1, 3, 4, 0]) {
      root.userData.update({ part, cut: 100 });
      expect(root.getObjectByName("cell-ribosomes")).toBe(particles);
      expect(particles.instanceMatrix.version).toBe(version);
    }
  } finally {
    disposeSceneResources(root);
  }
});
