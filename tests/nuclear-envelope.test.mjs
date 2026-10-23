import { it, expect, vi } from "vitest";
import * as THREE from "three";
import { addNuclearPores } from "../src/NuclearPores.js";
import { addNuclearEnvelope } from "../src/NuclearEnvelope.js";
import { disposeSceneResources } from "../src/disposeSceneResources.mjs";

it("preserves perforations and inherits shell visibility and position", () => {
  const root = new THREE.Group();
  const shell = new THREE.Mesh(
    new THREE.SphereGeometry(
      0.55,
      128,
      64,
      0,
      Math.PI * 2,
      Math.PI / 2,
      Math.PI / 2,
    ),
    new THREE.MeshStandardMaterial(),
  );
  shell.scale.set(1, 0.92, 1);
  shell.position.set(-1.36, -0.25, 0.55);
  root.add(shell);
  const originalCount = shell.geometry.index.count;
  const poreRims = addNuclearPores(root, shell, [[-1.36, -0.756, 0.55]]);
  const inner = addNuclearEnvelope(shell, poreRims);
  const innerRims = shell.getObjectByName("nuclear-inner-pore-rims");
  expect(innerRims.geometry).toBe(poreRims.geometry);
  expect(innerRims.count).toBe(poreRims.count);
  expect(inner.geometry).toBe(shell.geometry);
  expect(inner.geometry.index.count).toBeLessThan(originalCount);
  expect(inner.scale.x).toBe(0.976);
  expect(inner.parent).toBe(shell);
  expect(
    shell.children.filter((o) => o.name === "nuclear-cut-membrane-rim"),
  ).toHaveLength(2);
  root.updateMatrixWorld(true);
  expect(inner.getWorldPosition(new THREE.Vector3()).toArray()).toEqual(
    shell.position.toArray(),
  );
  // The same angular aperture remains empty in both concentric membranes.
  const ray = new THREE.Raycaster(
    new THREE.Vector3(-1.36, -2, 0.55),
    new THREE.Vector3(0, 1, 0),
  );
  expect(ray.intersectObject(inner, false)).toHaveLength(0);
  const membraneDispose = vi.spyOn(shell.geometry, "dispose");
  const poreDispose = vi.spyOn(poreRims.geometry, "dispose");
  const poreMaterialDispose = vi.spyOn(poreRims.material, "dispose");
  const innerInstanceDispose = vi.spyOn(innerRims, "dispose");
  const outerInstanceDispose = vi.spyOn(poreRims, "dispose");
  disposeSceneResources(root);
  for (const dispose of [
    membraneDispose,
    poreDispose,
    poreMaterialDispose,
    innerInstanceDispose,
    outerInstanceDispose,
  ])
    expect(dispose).toHaveBeenCalledTimes(1);
});
