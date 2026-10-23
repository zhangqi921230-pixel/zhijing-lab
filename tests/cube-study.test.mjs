import { it, expect } from "vitest";
import * as THREE from "three";
import { cubeStudy } from "../src/cubeStudy.mjs";
import { buildCube } from "../src/CubeModel.js";
it("subdivision conserves surface area and volume and counts complete layers", () => {
  for (const edge of [1, 2.7, 4])
    for (const divisions of [2, 3, 4, 5, 6]) {
      const q = cubeStudy({ edge, divisions, fill: 100 });
      expect(q.total * q.cellVolume).toBeCloseTo(edge ** 3, 10);
      expect(6 * q.perLayer * q.cellArea).toBeCloseTo(6 * edge ** 2, 10);
      for (let layer = 0; layer <= divisions; layer++) {
        const partial = cubeStudy({
          edge,
          divisions,
          fill: (100 * layer) / divisions,
        });
        expect(partial.count).toBe(layer * divisions ** 2);
        expect(partial.partial).toBe(0);
      }
    }
});
it("creates a bounded shared instanced lattice lazily and reuses its geometry while filling", () => {
  const root = new THREE.Group(),
    p = { edge: 3, divisions: 3, detail: 0, fold: 100, fill: 0 };
  buildCube(root, p);
  expect(root.getObjectByName("cube-volume-cells")).toBeUndefined();
  root.userData.update({ ...p, detail: 2 });
  const cells = root.getObjectByName("cube-volume-cells"),
    geometry = cells.geometry,
    mat = new THREE.Matrix4(),
    position = new THREE.Vector3();
  expect(cells.count).toBe(0);
  for (let layer = 1; layer <= 3; layer++) {
    root.userData.update({ ...p, detail: 2, fill: (layer / 3) * 100 });
    expect(cells.count).toBe(layer * 9);
    expect(cells.geometry).toBe(geometry);
  }
  for (let i = 0; i < 27; i++) {
    cells.getMatrixAt(i, mat);
    position.setFromMatrixPosition(mat);
    expect(Math.abs(position.x)).toBeLessThan(1);
    expect(Math.abs(position.z)).toBeLessThan(1);
    expect(position.y).toBeGreaterThan(0);
    expect(position.y).toBeLessThan(2);
  }
  root.userData.update({ ...p, detail: 1, divisions: 6 });
  expect(root.getObjectByName("cube-volume-study").visible).toBe(false);
  let grids = 0;
  root.traverse((o) => {
    if (o.name === "face-area-grid") {
      grids++;
      expect(o.visible).toBe(true);
      expect(o.geometry.drawRange.count).toBe(40);
    }
  });
  expect(grids).toBe(6);
  root.traverse((o) => {
    o.geometry?.dispose();
    for (const m of Array.isArray(o.material) ? o.material : [o.material])
      m?.dispose();
  });
});
