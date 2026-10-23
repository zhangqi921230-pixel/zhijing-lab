import { expect, it } from "vitest";
import * as THREE from "three";
import { addReactionFlocs, flocGeometry } from "../src/ReactionFlocs.js";
import { precipitate } from "../src/advancedModels.mjs";

it("uses bounded irregular aggregates and keeps every aggregate inside the calibrated beaker", () => {
  const geometry = flocGeometry(),
    a = geometry.attributes.position;
  for (let i = 0; i < a.count; i++)
    expect(Math.hypot(a.getX(i), a.getY(i), a.getZ(i))).toBeLessThanOrEqual(
      0.045001,
    );
  geometry.dispose();
  const root = new THREE.Group(),
    update = addReactionFlocs(root),
    mesh = root.children[0];
  expect(mesh.count).toBe(0);
  expect(mesh.boundingSphere.radius).toBeGreaterThan(1);
  const matrix = new THREE.Matrix4(),
    position = new THREE.Vector3(),
    rotation = new THREE.Quaternion(),
    scale = new THREE.Vector3();
  for (const copper of [10, 50, 100])
    for (const base of [0, 50, 100])
      for (const time of [0, 0.1, 4, 8, 20]) {
        const q = { copper, base, time },
          m = precipitate(q, time),
          height = ((copper + m.delivered) * 2.2) / 250;
        update(q, m, height);
        expect(mesh.count).toBe(Math.round(m.solid * 40));
        for (let i = 0; i < mesh.count; i++) {
          mesh.getMatrixAt(i, matrix);
          matrix.decompose(position, rotation, scale);
          const radius = 0.045 * scale.x;
          const vertices = mesh.geometry.attributes.position;
          const vertex = new THREE.Vector3();
          let floor = Infinity;
          for (let j = 0; j < vertices.count; j++) {
            vertex.fromBufferAttribute(vertices, j).applyMatrix4(matrix);
            floor = Math.min(floor, vertex.y);
          }
          expect(floor).toBeGreaterThanOrEqual(-0.820001);
          expect(position.y + radius).toBeLessThanOrEqual(
            -0.82 + height + 0.000001,
          );
          expect(Math.hypot(position.x, position.z) + radius).toBeLessThan(
            1.02,
          );
        }
      }
});

it("rests the actual rotated floc surface on the glass floor in both quality modes", () => {
  const root = new THREE.Group(),
    update = addReactionFlocs(root),
    mesh = root.children[0],
    matrix = new THREE.Matrix4(),
    vertex = new THREE.Vector3();
  for (const quality of ["fluent", "detail", "fluent"]) {
    root.userData.setQuality(quality);
    const q = { copper: 50, base: 75, time: 30 };
    const model = precipitate(q, q.time);
    update(q, model, ((q.copper + model.delivered) * 2.2) / 250);
    for (let i = 0; i < mesh.count; i++) {
      mesh.getMatrixAt(i, matrix);
      let floor = Infinity;
      const vertices = mesh.geometry.attributes.position;
      for (let j = 0; j < vertices.count; j++) {
        vertex.fromBufferAttribute(vertices, j).applyMatrix4(matrix);
        floor = Math.min(floor, vertex.y);
      }
      expect(floor).toBeCloseTo(-0.819, 6);
    }
  }
});
it("settles monotonically after dosing ends within the visual mesh budget", () => {
  const root = new THREE.Group(),
    update = addReactionFlocs(root),
    mesh = root.children[0];
  expect((mesh.geometry.index.count / 3) * 400).toBeLessThanOrEqual(160000);
  const matrix = new THREE.Matrix4();
  let previous;
  for (const time of [8, 10, 12, 16, 20]) {
    const p = { copper: 100, base: 100, time },
      m = precipitate(p, time);
    update(p, m, ((p.copper + m.delivered) * 2.2) / 250);
    const heights = Array.from({ length: mesh.count }, (_, i) => {
      mesh.getMatrixAt(i, matrix);
      return matrix.elements[13];
    });
    if (previous)
      heights.forEach((y, i) =>
        expect(y).toBeLessThanOrEqual(previous[i] + 1e-7),
      );
    previous = heights;
    expect(m.mass).toBeCloseTo(0.9756, 8);
  }
});

it("forms a localized plume below the droplet impact before spreading laterally", () => {
  const root = new THREE.Group(),
    update = addReactionFlocs(root),
    mesh = root.children[0],
    matrix = new THREE.Matrix4();
  const positionAt = (time) => {
    const p = { copper: 100, base: 100, time };
    const model = precipitate(p, time);
    update(p, model, ((p.copper + model.delivered) * 2.2) / 250);
    mesh.getMatrixAt(0, matrix);
    return new THREE.Vector3().setFromMatrixPosition(matrix);
  };
  const birth = positionAt(0.52);
  expect(Math.hypot(birth.x, birth.z + 0.15)).toBeLessThan(0.04);
  const later = positionAt(2);
  expect(later.y).toBeLessThan(birth.y);
  expect(Math.hypot(later.x - birth.x, later.z - birth.z)).toBeGreaterThan(
    0.04,
  );
  expect(positionAt(0.52).distanceTo(birth)).toBeLessThan(1e-8);
});
it("settled flocs stop orbiting, rewind deterministically and reuse their GPU storage", () => {
  const root = new THREE.Group(),
    update = addReactionFlocs(root),
    mesh = root.children[0],
    buffer = mesh.instanceMatrix.array;
  const run = (time) => {
    const q = { copper: 50, base: 50, time },
      m = precipitate(q, time);
    update(q, m, ((q.copper + m.delivered) * 2.2) / 250);
  };
  run(20);
  const settled = Array.from(buffer);
  run(30);
  expect(Array.from(buffer)).toEqual(settled);
  run(3);
  const active = Array.from(buffer);
  run(8);
  run(3);
  expect(Array.from(buffer).slice(0, mesh.count * 16)).toEqual(
    active.slice(0, mesh.count * 16),
  );
  const version = mesh.instanceMatrix.version;
  run(3);
  expect(mesh.instanceMatrix.version).toBe(version);
  expect(mesh.instanceMatrix.array).toBe(buffer);
});

it("new flocs emerge gradually without changing stoichiometric counts and retain rewind determinism", () => {
  const root = new THREE.Group(),
    update = addReactionFlocs(root),
    mesh = root.children[0];
  const matrix = new THREE.Matrix4();
  const sizeAt = (time) => {
    const q = { copper: 100, base: 100, time },
      model = precipitate(q, time);
    update(q, model, ((q.copper + model.delivered) * 2.2) / 250);
    expect(mesh.count).toBe(Math.round(model.solid * 40));
    mesh.getMatrixAt(0, matrix);
    return new THREE.Vector3().setFromMatrixScale(matrix).x;
  };
  const seed = sizeAt(0.52),
    middle = sizeAt(0.7),
    mature = sizeAt(0.9);
  expect(seed).toBeGreaterThan(0);
  expect(seed).toBeLessThan(middle * 0.03);
  expect(middle).toBeCloseTo(mature * 0.5, 6);
  expect(sizeAt(1.3)).toBeCloseTo(mature, 6);
  expect(sizeAt(0.7)).toBeCloseTo(middle, 6);
});

it("switches cached floc detail without changing particle state, then releases both meshes", async () => {
  const { disposeSceneResources } =
    await import("../src/disposeSceneResources.mjs");
  const root = new THREE.Group(),
    update = addReactionFlocs(root),
    mesh = root.children[0];
  const q = { copper: 100, base: 100, time: 20 },
    model = precipitate(q, 20);
  update(q, model, ((q.copper + model.delivered) * 2.2) / 250);
  const positions = Array.from(mesh.instanceMatrix.array),
    storage = mesh.instanceMatrix.array;
  const fluent = mesh.geometry,
    count = mesh.count;
  expect((fluent.index.count / 3) * count).toBe(40000);
  root.userData.setQuality("detail");
  const detailed = mesh.geometry;
  expect((detailed.index.count / 3) * count).toBe(160000);
  expect(mesh.count).toBe(count);
  expect(Array.from(mesh.instanceMatrix.array)).toEqual(positions);
  expect(mesh.instanceMatrix.array).toBe(storage);
  root.userData.setQuality("fluent");
  expect(mesh.geometry).toBe(fluent);
  root.userData.setQuality("detail");
  expect(mesh.geometry).toBe(detailed);
  let disposed = 0;
  fluent.addEventListener("dispose", () => disposed++);
  detailed.addEventListener("dispose", () => disposed++);
  disposeSceneResources(root);
  expect(disposed).toBe(2);
});
