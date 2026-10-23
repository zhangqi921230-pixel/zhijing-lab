import { expect, it } from "vitest";
import * as T from "three";
import {
  createMitochondrialMatrix,
  matrixPointFits,
} from "../src/MitochondrialMatrix.js";
import { buildCell } from "../src/CellModel.js";
import { disposeSceneResources } from "../src/disposeSceneResources.mjs";

it("matrix DNA and finite particles stay within the inner membrane and outside crista bands", () => {
  const group = createMitochondrialMatrix();
  try {
    const dna = group.getObjectByName("mitochondrion-matrix-dna").geometry
      .attributes.position;
    for (let i = 0; i < dna.count; i++) {
      expect(matrixPointFits([dna.getX(i), dna.getY(i), dna.getZ(i)])).toBe(
        true,
      );
    }
    const particles = group.getObjectByName("mitochondrion-matrix-ribosomes");
    const vertices = particles.geometry.attributes.position;
    for (let i = 0; i < vertices.count; i++)
      expect(
        Math.hypot(vertices.getX(i), vertices.getY(i), vertices.getZ(i)),
      ).toBeLessThan(0.0023);
    expect(particles.count).toBeGreaterThan(30);
    expect(particles.count).toBeLessThan(100);
    const matrix = new T.Matrix4(),
      point = new T.Vector3(),
      scale = new T.Vector3();
    for (let i = 0; i < particles.count; i++) {
      particles.getMatrixAt(i, matrix);
      point.setFromMatrixPosition(matrix);
      scale.setFromMatrixScale(matrix);
      expect(matrixPointFits(point.toArray(), 0.0023 * scale.x)).toBe(true);
    }
  } finally {
    disposeSceneResources(group);
  }
});

it("matrix detail is close-up only, follows membrane layers and reuses allocated objects", () => {
  const root = new T.Group();
  buildCell(root, { part: 4, cut: 100 });
  try {
    const bodies = root.children.filter(
      (o) => o.name === "mitochondrion-cutaway",
    );
    const detail = bodies[0].getObjectByName("mitochondrion-matrix-detail");
    expect(detail.visible).toBe(false);
    root.userData.setInspection(4);
    expect(detail.visible).toBe(true);
    for (const mode of [2, 1, 3, 0]) {
      root.userData.update({ part: 4, cut: 100, mitochondrionMode: mode });
      expect(detail.visible).toBe(mode !== 2);
      if (mode === 3) {
        expect(bodies[0].getObjectByName("mitochondrion-cristae").visible).toBe(
          false,
        );
        expect(
          bodies[0].getObjectByName("mitochondrion-outer-membrane").visible,
        ).toBe(false);
        expect(
          bodies[0].getObjectByName("mitochondrion-inner-membrane").visible,
        ).toBe(true);
      }
      expect(
        bodies
          .slice(1)
          .every(
            (o) => !o.getObjectByName("mitochondrion-matrix-detail").visible,
          ),
      ).toBe(true);
    }
    root.userData.setInspection(0);
    expect(detail.visible).toBe(false);
    root.userData.setInspection(4);
    expect(root.getObjectByName("mitochondrion-matrix-detail")).toBe(detail);
  } finally {
    disposeSceneResources(root);
  }
});
