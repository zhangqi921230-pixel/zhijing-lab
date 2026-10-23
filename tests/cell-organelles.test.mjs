import { expect, it } from "vitest";

it("叶绿体分层同步标注，返回全景恢复结构且复用几何", () => {
  const root = new THREE.Group();
  buildCell(root, { part: 3, cut: 100, chloroplastMode: 1 });
  root.userData.setInspection(3);
  const chlor = root.getObjectByName("chloroplast-cutaway");
  const discs = chlor.getObjectByName("chloroplast-thylakoids");
  const geometry = discs.geometry;
  expect(discs.visible).toBe(true);
  expect(chlor.getObjectByName("chloroplast-envelope").visible).toBe(false);
  expect(chlor.getObjectByName("chloroplast-stroma").visible).toBe(false);
  expect(chlor.getObjectByName("chloroplast-label-0").visible).toBe(false);
  expect(chlor.getObjectByName("chloroplast-label-4").visible).toBe(true);
  root.userData.update({ part: 3, cut: 100, chloroplastMode: 2 });
  expect(discs.visible).toBe(false);
  expect(chlor.getObjectByName("chloroplast-lamella").visible).toBe(false);
  expect(chlor.getObjectByName("chloroplast-disc-rims").visible).toBe(false);
  expect(chlor.getObjectByName("chloroplast-stroma").visible).toBe(true);
  expect(chlor.getObjectByName("chloroplast-label-4").visible).toBe(false);
  expect(chlor.getObjectByName("chloroplast-label-3").visible).toBe(true);
  root.userData.setInspection(0);
  expect(discs.visible).toBe(true);
  expect(chlor.getObjectByName("chloroplast-envelope").visible).toBe(true);
  expect(chlor.getObjectByName("chloroplast-labels").visible).toBe(false);
  expect(discs.geometry).toBe(geometry);
});
import * as THREE from "three";
import { createChloroplastTemplate } from "../src/CellOrganelles.js";
import { buildCell } from "../src/CellModel.js";
it("keeps grana within the chloroplast envelope footprint and stacks discs vertically", () => {
  const root = createChloroplastTemplate(),
    disks = root.getObjectByName("chloroplast-thylakoids"),
    m = new THREE.Matrix4(),
    point = new THREE.Vector3();
  const layers = [6, 4, 7, 5, 6];
  expect(disks.count).toBe(layers.reduce((sum, n) => sum + n, 0));
  const heights = layers.flatMap((n) =>
    Array.from({ length: n }, (_, j) => -0.045 + j * 0.018),
  );
  for (let i = 0; i < disks.count; i++) {
    disks.getMatrixAt(i, m);
    point.setFromMatrixPosition(m);
    expect(
      ((Math.abs(point.x) + 0.052) / 0.365) ** 2 +
        ((Math.abs(point.z) + 0.052) / 0.27) ** 2,
    ).toBeLessThan(1);
    expect(point.y).toBeCloseTo(heights[i], 5);
  }
});
it("batches cell particles and keeps the close-up chloroplast outside the vacuole", () => {
  const root = new THREE.Group();
  buildCell(root, { cut: 80, part: 0 });
  expect(root.getObjectByName("nuclear-pores").count).toBe(28);
  expect(root.getObjectByName("cell-ribosomes").isInstancedMesh).toBe(true);
  const chlor = root.getObjectByName("chloroplast-cutaway");
  // Conservative nearest corner of its footprint remains outside the liquid compartment.
  const x = chlor.position.x - 0.365,
    z = chlor.position.z - 0.27;
  expect(((x - 0.55) / 1.224) ** 2 + (z / 1.02) ** 2).toBeGreaterThan(1);
});

it("separates every chloroplast from the vacuole, nucleus, walls and other chloroplasts", () => {
  const root = new THREE.Group();
  buildCell(root, { cut: 80, part: 0 });
  root.updateMatrixWorld(true);
  const chloroplasts = root.children.filter(
    (o) => o.name === "chloroplast-cutaway",
  );
  // Annotation leaders extend beyond the organelle; only solid meshes occupy space.
  const boxes = chloroplasts.map((o) => {
    const box = new THREE.Box3();
    o.traverse((child) => {
      if (child.isMesh) box.union(new THREE.Box3().setFromObject(child));
    });
    return box;
  });
  expect(boxes).toHaveLength(7);
  const nearest = new THREE.Vector3();
  for (const box of boxes) {
    expect(box.min.x).toBeGreaterThan(-2.15);
    expect(box.max.x).toBeLessThan(2.15);
    expect(box.min.z).toBeGreaterThan(-1.45);
    expect(box.max.z).toBeLessThan(1.46);
    for (const [center, radii] of [
      [
        [0.55, -0.12, 0],
        [1.224, 0.7446, 1.02],
      ],
      [
        [-1.36, -0.25, 0.55],
        [0.55, 0.506, 0.55],
      ],
    ]) {
      box.clampPoint(new THREE.Vector3(...center), nearest);
      const distance = nearest
        .toArray()
        .reduce((sum, v, i) => sum + ((v - center[i]) / radii[i]) ** 2, 0);
      expect(distance).toBeGreaterThan(1);
    }
  }
  for (let i = 0; i < boxes.length; i++)
    for (let j = 0; j < i; j++)
      expect(boxes[i].intersectsBox(boxes[j])).toBe(false);
});

it("opens both front and upper wall without allocating replacement geometry", () => {
  const root = new THREE.Group();
  buildCell(root, { cut: 0, part: 0 });
  const top = root.getObjectByName("cell-top-wall"),
    front = root.getObjectByName("cell-front-wall"),
    geometry = top.geometry;
  expect(top.visible).toBe(true);
  expect(top.material.opacity).toBe(0.9);
  root.userData.update({ cut: 100, part: 0 });
  expect(top.visible).toBe(false);
  expect(front.visible).toBe(false);
  root.userData.update({ cut: 0, part: 0 });
  expect(top.visible).toBe(true);
  expect(top.geometry).toBe(geometry);
});

it("shows only the selected reusable leader and hides all for overview", () => {
  const root = new THREE.Group();
  buildCell(root, { cut: 80, part: 0 });
  const focus = root.getObjectByName("cell-focus");
  const geometries = focus.children.map((g) => g.children[0].geometry);
  expect(focus.visible).toBe(false);
  for (const [part, target] of [
    [1, [-1.91, -0.25, 0.55]],
    [2, [0.55, 0.62, 0]],
    [3, [1.75, -0.48, 1.05]],
  ]) {
    root.userData.update({ cut: 80, part });
    expect(focus.visible).toBe(true);
    const detail = root.getObjectByName(`cell-focus-${part}`);
    expect(focus.children.filter((g) => g.visible)).toEqual([detail]);
    const geometry = detail.children[0].geometry;
    expect(geometry).toBe(geometries[part - 1]);
    const position = geometry.attributes.position;
    expect(position.getX(0)).toBeCloseTo(target[0]);
    expect(position.getY(0)).toBeCloseTo(target[1]);
    expect(position.getZ(0)).toBeCloseTo(target[2]);
    const version = position.version;
    root.userData.update({ cut: 70, part });
    expect(position.version).toBe(version);
  }
  root.userData.update({ cut: 80, part: 0 });
  expect(focus.visible).toBe(false);
});

it("isolates organelle inspection and restores the current cutaway without rebuilding", () => {
  const root = new THREE.Group();
  buildCell(root, { cut: 100, part: 3 });
  const chlor = root.getObjectByName("chloroplast-cutaway");
  const geometry = root.getObjectByName("cell-rear-wall").geometry;
  root.userData.setInspection(3);
  expect(root.children.filter((o) => o.visible)).toEqual([chlor]);
  root.userData.update({ cut: 0, part: 1 });
  expect(root.children.filter((o) => o.visible)).toEqual([chlor]);
  root.userData.setInspection(1);
  expect(root.getObjectByName("cell-nucleus").visible).toBe(true);
  expect(chlor.visible).toBe(false);
  root.userData.setInspection(0);
  expect(root.getObjectByName("cell-top-wall").visible).toBe(true);
  expect(root.getObjectByName("cell-rear-wall").geometry).toBe(geometry);
});

it("keeps overview organelle labels separate from inspection and closed-cell views", () => {
  const root = new THREE.Group();
  buildCell(root, { cut: 100, part: 0, labels: 1 });
  const labels = root.getObjectByName("cell-overview-labels");
  expect(labels.visible).toBe(true);
  expect(labels.children.map((child) => child.name)).toEqual([
    "细胞核",
    "中央液泡",
    "叶绿体",
    "线粒体",
    "高尔基体",
    "内质网",
  ]);
  for (const part of [1, 2, 3, 4, 5, 6]) {
    root.userData.setInspection(part);
    expect(labels.visible).toBe(false);
  }
  root.userData.setInspection(0);
  expect(labels.visible).toBe(true);
  root.userData.update({ cut: 100, part: 0, labels: 0 });
  expect(labels.visible).toBe(false);
  root.userData.update({ cut: 0, part: 0, labels: 1 });
  expect(labels.visible).toBe(false);
});
