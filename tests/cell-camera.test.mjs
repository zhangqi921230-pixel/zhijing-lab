import { expect, it } from "vitest";
import { cellCloseupCamera } from "../src/cellCamera.mjs";
import { cellViews } from "../src/cellNavigation.mjs";
import { buildCell } from "../src/CellModel.js";
import * as T from "three";
import { addStructureLabels } from "../src/ChloroplastLabels.js";

it("俯视标注仅移动标签端点，结构端点不变并复用缓冲", () => {
  const root = new T.Group();
  const labels = addStructureLabels(root, "test", [
    ["结构", [0.1, 0.2, 0.3], [0.5, 0.4, 0.1]],
  ]);
  const line = labels.children[0];
  const positions = line.geometry.attributes.position;
  const origin = [...positions.array].slice(0, 3);
  labels.userData.setViewAngle(2);
  expect([...positions.array].slice(0, 3)).toEqual(origin);
  expect(positions.getZ(1)).toBeCloseTo(-0.16);
  expect(positions.getY(1)).toBe(0);
  labels.userData.setViewAngle(0);
  expect(positions.getZ(1)).toBeCloseTo(0.1);
  expect(line.geometry.attributes.position).toBe(positions);
});

it("每个细胞器三个预设保持相同目标与观察距离，俯视避开上向量奇点", () => {
  for (const view of cellViews.slice(1)) {
    const presets = [0, 1, 2].map((angle) => cellCloseupCamera(view, angle));
    const distances = presets.map(({ position, target }) =>
      Math.hypot(...position.map((v, i) => v - target[i])),
    );
    expect(distances[1]).toBeCloseTo(distances[0], 10);
    expect(distances[2]).toBeCloseTo(distances[0], 10);
    for (const preset of presets) {
      expect(preset.target).toEqual(presets[0].target);
      expect(preset.minDistance).toBeLessThan(distances[0]);
      const camera = new T.PerspectiveCamera(38, 1.5, 0.01, 100);
      camera.position.set(...preset.position);
      camera.lookAt(...preset.target);
      camera.updateMatrixWorld();
      expect([...camera.matrixWorld.elements].every(Number.isFinite)).toBe(
        true,
      );
    }
    expect(presets[1].position[0]).toBe(presets[1].target[0]);
    expect(presets[1].position[1]).toBe(presets[1].target[1]);
    expect(presets[2].position[2]).not.toBe(presets[2].target[2]);
  }
  expect(cellCloseupCamera("perspective", 1)).toBeNull();
});

it("观察方向不改变分层模型或几何资源", () => {
  const root = new T.Group();
  buildCell(root, { part: 5, cut: 100, golgiMode: 2 });
  root.userData.setInspection(5);
  const golgi = root.getObjectByName("golgi-apparatus");
  const geometry = golgi.getObjectByName("golgi-vesicles").geometry;
  for (const angle of [1, 2, 0]) {
    root.userData.update({ part: 5, cut: 100, golgiMode: 2, cellAngle: angle });
    expect(golgi.getObjectByName("golgi-vesicles").geometry).toBe(geometry);
    expect(golgi.getObjectByName("golgi-cisterna-0").visible).toBe(false);
    expect(root.children.filter((c) => c.visible)).toEqual([golgi]);
  }
});
