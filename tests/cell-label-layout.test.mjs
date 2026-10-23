import { expect, it } from "vitest";
import * as THREE from "three";
import { separateCellLabels, cellLabelLayout } from "../src/CellLabelLayout.js";

it("keeps optional pixel-sized labels readable across zoom and viewport changes", () => {
  const root = new THREE.Group();
  root.userData.structureLabels = true;
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial());
  sprite.name = "label";
  sprite.scale.set(0.2, 0.08, 1);
  const line = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(),
      new THREE.Vector3(),
    ]),
  );
  line.name = sprite.name;
  root.add(sprite, line);
  const camera = new THREE.PerspectiveCamera(40, 1.5, 0.1, 100);
  const layout = cellLabelLayout(root, {
    minPixelHeight: 24,
    maxPixelHeight: 34,
  });
  for (const depth of [1, 4, 20]) {
    camera.position.z = depth;
    for (const height of [340, 600, 1000, 340]) {
      layout.update(camera, height);
      const pixels =
        (((sprite.scale.y * camera.projectionMatrix.elements[5]) / depth) *
          height) /
        2;
      expect(pixels).toBeGreaterThanOrEqual(24 - 1e-8);
      expect(pixels).toBeLessThanOrEqual(34 + 1e-8);
      expect(sprite.scale.x / sprite.scale.y).toBeCloseTo(2.5);
      const version = line.geometry.attributes.position.version;
      layout.update(camera, height);
      expect(line.geometry.attributes.position.version).toBe(version);
    }
  }
  layout.restore();
  expect(sprite.scale.toArray()).toEqual([0.2, 0.08, 1]);
});

it("respects direction-specific anchors and transformed closeup parents", () => {
  const root = new THREE.Group(),
    organelle = new THREE.Group(),
    group = new THREE.Group();
  organelle.position.set(1, 0, 0);
  organelle.scale.setScalar(0.8);
  root.add(organelle);
  organelle.add(group);
  group.userData.structureLabels = true;
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial());
  sprite.name = "detail";
  sprite.scale.set(0.2, 0.08, 1);
  sprite.userData.layoutAnchor = [0.2, 0.3, 0];
  const line = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, -0.1, 0),
      new THREE.Vector3(0.2, 0.3, 0),
    ]),
  );
  line.name = sprite.name;
  group.add(sprite, line);
  const camera = new THREE.PerspectiveCamera(40, 1.5, 0.1, 100);
  camera.position.z = 8;
  const layout = cellLabelLayout(root);
  layout.update(camera);
  expect(sprite.position.y).toBeCloseTo(0.3);
  sprite.userData.layoutAnchor = [0.2, 0, -0.195];
  layout.update(camera);
  expect(sprite.position.y).toBeCloseTo(0);
  expect(sprite.position.z).toBeCloseTo(-0.195);
  layout.restore();
  expect(sprite.position.toArray()).toEqual([0.2, 0, -0.195]);
  expect(line.geometry.attributes.position.getY(0)).toBeCloseTo(-0.1);
});

it("separates overlapping labels deterministically without changing source anchors", () => {
  const items = [0, 1, 2].map(() => ({ x: 0, y: 0, width: 0.3, height: 0.1 }));
  const result = separateCellLabels(items);
  expect(separateCellLabels(items)).toEqual(result);
  expect(items.every((item) => item.y === 0)).toBe(true);
  for (let i = 0; i < result.length; i++)
    for (let j = i + 1; j < result.length; j++)
      expect(Math.abs(result[i].y - result[j].y)).toBeGreaterThan(0.1219);
  const [large] = separateCellLabels([{ x: 8, y: 8, width: 4, height: 4 }]);
  expect(large.x).toBe(0);
  expect(large.y).toBe(0);
});

it("packs a dense edge cluster when sufficient screen space exists", () => {
  for (const edge of [-0.9, 0, 0.9]) {
    const result = separateCellLabels(
      Array.from({ length: 9 }, () => ({
        x: 0.7,
        y: edge,
        width: 0.3,
        height: 0.12,
      })),
    );
    for (let i = 0; i < result.length; i++) {
      expect(Math.abs(result[i].y) + 0.06).toBeLessThanOrEqual(0.940001);
      for (let j = i + 1; j < result.length; j++)
        expect(result[j].y - result[i].y).toBeGreaterThanOrEqual(0.14199);
    }
  }
});

it("moves only label endpoints, reuses buffers and skips unchanged camera frames", () => {
  const root = new THREE.Group(),
    group = new THREE.Group();
  group.name = "cell-overview-labels";
  root.add(group);
  for (let i = 0; i < 2; i++) {
    const sprite = new THREE.Sprite(new THREE.SpriteMaterial());
    sprite.name = `label-${i}`;
    sprite.scale.set(1, 0.3, 1);
    const line = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(i, -1, 0),
        new THREE.Vector3(),
      ]),
    );
    line.name = sprite.name;
    group.add(sprite, line);
  }
  const camera = new THREE.PerspectiveCamera(40, 1.5, 0.1, 100);
  camera.position.z = 8;
  const layout = cellLabelLayout(root);
  layout.update(camera);
  const sprite = group.children[0],
    line = group.children[1];
  const positions = line.geometry.attributes.position;
  expect(sprite.position.y).not.toBe(0);
  expect(positions.getY(0)).toBe(-1);
  expect(positions.getY(1)).toBeCloseTo(sprite.position.y);
  const version = positions.version;
  layout.update(camera);
  expect(positions.version).toBe(version);
  const baseline = group.children
    .filter((o) => o.isSprite)
    .map((o) => o.position.toArray());
  for (let i = 0; i < 20; i++) {
    layout.restore();
    camera.position.x = 2;
    camera.lookAt(0, 0, 0);
    layout.update(camera);
    camera.position.x = 0;
    camera.lookAt(0, 0, 0);
    layout.update(camera);
    group.children
      .filter((o) => o.isSprite)
      .forEach((o, index) => {
        expect(
          o.position.distanceTo(new THREE.Vector3(...baseline[index])),
        ).toBeLessThan(1e-10);
      });
  }
  layout.restore();
  expect(sprite.position.length()).toBe(0);
  expect(positions.getY(1)).toBe(0);
});
