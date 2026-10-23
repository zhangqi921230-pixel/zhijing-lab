import { it, expect } from "vitest";
import * as T from "three";
import { terrainGeometry } from "../src/TerrainSurface.js";
import { terrainHeightAt } from "../src/models.mjs";
import { TERRAIN_SCALE } from "../src/terrainWorld.mjs";
it("picked surface elevations remain correct after scene translation and rotation", () => {
  const root = new T.Group();
  root.position.set(1, -1, 2);
  root.rotation.y = 0.42;
  const geometry = terrainGeometry(),
    material = new T.MeshBasicMaterial({ side: T.DoubleSide });
  const surface = new T.Mesh(geometry, material);
  root.add(surface);
  root.updateMatrixWorld(true);
  for (const [x, z] of [
    [0, 0],
    [0.15, 1.52],
    [-1.28, -1.25],
    [1.44, -0.42],
    [-2.7, 2.7],
  ]) {
    const origin = root.localToWorld(new T.Vector3(x, 5, z));
    const hit = new T.Raycaster(
      origin,
      new T.Vector3(0, -1, 0),
    ).intersectObject(surface, false)[0];
    expect(hit).toBeDefined();
    const point = root.worldToLocal(hit.point.clone());
    expect(point.x).toBeCloseTo(x, 5);
    expect(point.z).toBeCloseTo(z, 5);
    expect(point.y * TERRAIN_SCALE).toBeCloseTo(terrainHeightAt(x, z), 2);
  }
  geometry.dispose();
  material.dispose();
});
it("triangle slope agrees with the local elevation gradient", () => {
  const geometry = terrainGeometry(),
    material = new T.MeshBasicMaterial({ side: T.DoubleSide });
  const surface = new T.Mesh(geometry, material);
  surface.updateMatrixWorld();
  for (const [x, z] of [
    [-0.713, 0.527],
    [1.123, -0.419],
    [-1.281, -1.259],
  ]) {
    const hit = new T.Raycaster(
      new T.Vector3(x, 5, z),
      new T.Vector3(0, -1, 0),
    ).intersectObject(surface, false)[0];
    const epsilon = 1e-5;
    const dx =
      (terrainHeightAt(x + epsilon, z) - terrainHeightAt(x - epsilon, z)) /
      (2 * epsilon * TERRAIN_SCALE);
    const dz =
      (terrainHeightAt(x, z + epsilon) - terrainHeightAt(x, z - epsilon)) /
      (2 * epsilon * TERRAIN_SCALE);
    const expected = (Math.atan(Math.hypot(dx, dz)) * 180) / Math.PI;
    const actual =
      (Math.acos(Math.min(1, Math.abs(hit.face.normal.y))) * 180) / Math.PI;
    expect(actual).toBeCloseTo(expected, 2);
  }
  geometry.dispose();
  material.dispose();
});
