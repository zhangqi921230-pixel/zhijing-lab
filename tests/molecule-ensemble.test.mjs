import { it, expect, vi } from "vitest";
import * as T from "three";
import { createMoleculeEnsemble } from "../src/MoleculeEnsemble.js";
import { disposeSceneResources } from "../src/disposeSceneResources.mjs";

it("matches cloned hierarchy transforms, skips unchanged uploads and releases shared resources once", () => {
  const root = new T.Group();
  const template = new T.Mesh(
    new T.CylinderGeometry(0.1, 0.1, 1, 12),
    new T.MeshStandardMaterial(),
  );
  template.position.set(0.6, 0.8, -0.2);
  template.rotation.set(0.4, 0.8, 0.2);
  template.scale.set(1, 1.6, 1);
  root.add(template);
  const update = createMoleculeEnsemble(root, [template]);
  const mesh = root.getObjectByName("molecule-ensemble-part-0");
  const actual = new T.Matrix4();
  for (const time of [0, 3.4, 20]) {
    update(true, time);
    for (let i = 0; i < 7; i++) {
      const oldGroup = new T.Group(),
        clone = template.clone();
      oldGroup.add(clone);
      oldGroup.scale.setScalar(0.3);
      const a = i * 2.39996 + time * 0.15;
      oldGroup.position.set(
        Math.cos(a) * 2.2,
        Math.sin(i * 1.7 + time * 0.35) * 0.9 + 0.35,
        Math.sin(a) * 1.7,
      );
      oldGroup.rotation.set(i + time * 0.5, i * 0.7 + time * 0.3, i * 0.2);
      oldGroup.updateMatrixWorld(true);
      mesh.getMatrixAt(i, actual);
      actual.elements.forEach((value, index) =>
        expect(value).toBeCloseTo(clone.matrixWorld.elements[index], 6),
      );
      expect(
        mesh.boundingSphere.containsPoint(
          new T.Vector3().setFromMatrixPosition(actual),
        ),
      ).toBe(true);
    }
    const version = mesh.instanceMatrix.version;
    update(true, time);
    update(false, time + 1);
    expect(mesh.instanceMatrix.version).toBe(version);
    expect(mesh.parent.visible).toBe(false);
  }
  const geometryDispose = vi.spyOn(template.geometry, "dispose");
  const materialDispose = vi.spyOn(template.material, "dispose");
  const result = disposeSceneResources(root);
  expect(result.instances).toBe(1);
  expect(geometryDispose).toHaveBeenCalledTimes(1);
  expect(materialDispose).toHaveBeenCalledTimes(1);
});
