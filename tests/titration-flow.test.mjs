import { expect, it } from "vitest";
import { advanceTitration, titrationFlowRate } from "../src/titrationFlow.mjs";
import * as THREE from "three";
import { addTitrationDrops } from "../src/TitrationDrops.js";

it("改变滴加速度保留累计体积，旧实验默认常速且满量停止", () => {
  expect(titrationFlowRate(undefined)).toBe(0.5);
  let base = advanceTitration(49, 2, 0.1);
  expect(base).toBeCloseTo(49.2);
  base = advanceTitration(base, 1, 1);
  expect(base).toBeCloseTo(50.2);
  expect(advanceTitration(99.95, 1, 1)).toBe(100);
  expect(advanceTitration(25, -1, 1)).toBe(25);
});

it("慢速滴落节奏降低，改变速度保持悬滴生长进度", () => {
  const root = new THREE.Group();
  const flow = addTitrationDrops(root);
  const mesh = root.getObjectByName("titration-drops");
  const matrix = new THREE.Matrix4();
  flow.setState(true, 0.8, 0.1);
  flow.animate(0);
  for (let t = 25; t <= 250; t += 25) flow.animate(t);
  expect(mesh.count).toBe(1);
  mesh.getMatrixAt(0, matrix);
  const before = new THREE.Vector3().setFromMatrixScale(matrix).x;
  flow.setState(true, 0.8, 1);
  flow.animate(250);
  mesh.getMatrixAt(0, matrix);
  expect(new THREE.Vector3().setFromMatrixScale(matrix).x).toBeCloseTo(before);
  flow.animate(275);
  flow.animate(300);
  expect(mesh.count).toBeGreaterThan(1);
});
