import { expect, it, vi } from "vitest";
import * as THREE from "three";
import { disposeSceneResources } from "../src/disposeSceneResources.mjs";

it("releases each shared resource once and releases every instance buffer owner", () => {
  const root = new THREE.Group(),
    geometry = new THREE.BoxGeometry(),
    cachedTexture = new THREE.Texture(),
    ownedTexture = new THREE.Texture();
  const material = new THREE.MeshStandardMaterial({ map: cachedTexture });
  const geometryDisposed = vi.fn(),
    materialDisposed = vi.fn(),
    ownedDisposed = vi.fn(),
    cachedDisposed = vi.fn(),
    instanceDisposed = vi.fn();
  geometry.addEventListener("dispose", geometryDisposed);
  material.addEventListener("dispose", materialDisposed);
  ownedTexture.addEventListener("dispose", ownedDisposed);
  cachedTexture.addEventListener("dispose", cachedDisposed);
  for (let i = 0; i < 3; i++) {
    const mesh = new THREE.InstancedMesh(geometry, material, 5);
    mesh.userData.ownedTexture = ownedTexture;
    mesh.addEventListener("dispose", instanceDisposed);
    root.add(mesh);
  }
  root.add(new THREE.Mesh(geometry, [material, material]));
  expect(disposeSceneResources(root)).toEqual({
    geometries: 1,
    materials: 1,
    textures: 1,
    instances: 3,
  });
  expect(geometryDisposed).toHaveBeenCalledTimes(1);
  expect(materialDisposed).toHaveBeenCalledTimes(1);
  expect(ownedDisposed).toHaveBeenCalledTimes(1);
  expect(cachedDisposed).not.toHaveBeenCalled();
  expect(instanceDisposed).toHaveBeenCalledTimes(3);
});
