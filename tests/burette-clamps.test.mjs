import * as THREE from "three";
import { expect, it } from "vitest";
import { addBuretteClamps } from "../src/BuretteClamps.js";

it("夹爪不穿过玻璃、前部读数窗口开放，细节保持四次绘制", () => {
  const root = new THREE.Group();
  addBuretteClamps(root, new THREE.MeshStandardMaterial());
  root.updateMatrixWorld(true);
  const jaws = root.children.filter((o) => o.name === "burette-open-clamp");
  expect(jaws).toHaveLength(2);
  expect(jaws[0].geometry).toBe(jaws[1].geometry);
  expect(root.children).toHaveLength(4);
  const positions = jaws[0].geometry.attributes.position;
  for (let i = 0; i < positions.count; i++)
    expect(Math.hypot(positions.getX(i), positions.getZ(i))).toBeGreaterThan(
      0.12,
    );
  for (const y of [3.3, 4.65]) {
    const hits = new THREE.Raycaster(
      new THREE.Vector3(0, y, 1),
      new THREE.Vector3(0, 0, -1),
    ).intersectObject(root, true);
    expect(hits.every((hit) => hit.point.z < 0)).toBe(true);
  }
  for (const object of root.children) {
    const data = object.geometry.attributes.position.array;
    expect([...data].every(Number.isFinite)).toBe(true);
  }
});
