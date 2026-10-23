import { it, expect, vi } from "vitest";
import * as THREE from "three";
import { forestDetailLevel, updateForestLod } from "../src/ForestLod.js";
it("uses hysteresis and respects fluent and hidden preferences", () => {
  expect(forestDetailLevel("simple", "detail", true, 10)).toBe("simple");
  expect(forestDetailLevel("detailed", "detail", true, 10)).toBe("detailed");
  expect(forestDetailLevel("simple", "detail", true, 13)).toBe("detailed");
  expect(forestDetailLevel("detailed", "detail", true, 8)).toBe("simple");
  expect(forestDetailLevel("detailed", "fluent", true, 20)).toBe("simple");
  expect(forestDetailLevel("detailed", "detail", false, 20)).toBe("hidden");
});
it("allocates detailed trees only on approach and reuses them on return", () => {
  const root = new THREE.Group(),
    camera = new THREE.PerspectiveCamera(45),
    target = new THREE.Vector3();
  for (const name of ["forest-low-detail", "forest-low-broadleaf"]) {
    const mesh = new THREE.Group();
    mesh.name = name;
    root.add(mesh);
  }
  root.userData.ensureDetailedForest = vi.fn(() => {
    if (root.getObjectByName("forest-trunks")) return;
    for (const name of [
      "mountain-conifer-forest",
      "valley-broadleaf-forest",
      "forest-trunks",
    ]) {
      const o = new THREE.Group();
      o.name = name;
      root.add(o);
    }
  });
  const p = { quality: "detail", trees: true };
  camera.position.z = 20;
  expect(updateForestLod(root, camera, target, 600, p)).toBe("simple");
  expect(root.userData.ensureDetailedForest).not.toHaveBeenCalled();
  camera.position.z = 5;
  expect(updateForestLod(root, camera, target, 600, p)).toBe("detailed");
  const trunk = root.getObjectByName("forest-trunks");
  expect(trunk.visible).toBe(true);
  camera.position.z = 20;
  updateForestLod(root, camera, target, 600, p);
  expect(trunk.visible).toBe(false);
  camera.position.z = 5;
  updateForestLod(root, camera, target, 600, p);
  expect(root.getObjectByName("forest-trunks")).toBe(trunk);
  updateForestLod(root, camera, target, 600, { ...p, trees: false });
  expect(root.children.every((o) => !o.visible)).toBe(true);
});
