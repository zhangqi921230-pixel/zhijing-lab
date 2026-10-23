import { it, expect } from "vitest";
import * as T from "three";
import { firstVisibleHit } from "../src/visibleSceneHit.mjs";

it("ignores hidden equipment ancestors and restores picking when revealed", () => {
  const root = new T.Group(),
    equipment = new T.Group();
  root.add(equipment);
  const make = (z) => {
    const mesh = new T.Mesh(
      new T.BoxGeometry(1, 1, 0.1),
      new T.MeshBasicMaterial(),
    );
    mesh.position.z = z;
    return mesh;
  };
  const slide = make(1),
    bench = make(0);
  equipment.add(slide);
  root.add(bench);
  root.updateMatrixWorld(true);
  const ray = new T.Raycaster(new T.Vector3(0, 0, 3), new T.Vector3(0, 0, -1));
  const pick = () => firstVisibleHit(ray.intersectObject(root, true));
  expect(pick().object).toBe(slide);
  equipment.visible = false;
  expect(pick().object).toBe(bench);
  equipment.visible = true;
  expect(pick().object).toBe(slide);
  root.visible = false;
  expect(pick()).toBeUndefined();
});
