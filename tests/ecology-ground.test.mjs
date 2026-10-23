import { expect, it } from "vitest";
import * as THREE from "three";
import { addEcologyGround } from "../src/EcologyGround.js";
import { habitatHeight, HABITAT_POND } from "../src/ecologyHabitat.mjs";
it("keeps merged litter above the terrain and stones outside the water", () => {
  const root = new THREE.Group();
  addEcologyGround(root);
  expect(root.children).toHaveLength(2);
  const leaves = root.getObjectByName("habitat-leaf-litter").geometry.attributes
    .position;
  for (let i = 0; i < leaves.count; i++) {
    const ground = habitatHeight(leaves.getX(i), leaves.getZ(i));
    expect(leaves.getY(i)).toBeGreaterThan(ground);
    expect(leaves.getY(i) - ground).toBeLessThan(0.02);
  }
  const stones = root.getObjectByName("habitat-ground-stones"),
    matrix = new THREE.Matrix4();
  expect(stones.count).toBe(96);
  for (let i = 0; i < stones.count; i++) {
    stones.getMatrixAt(i, matrix);
    expect(
      Math.hypot(
        matrix.elements[12] - HABITAT_POND.x,
        matrix.elements[14] - HABITAT_POND.z,
      ),
    ).toBeGreaterThan(0.93);
  }
});
