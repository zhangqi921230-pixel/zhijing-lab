import { it, expect } from "vitest";
import * as THREE from "three";
import { buildScene } from "../src/ThreeScene.jsx";
import { cubePairs } from "../src/CubeModel.js";
function dispose(root) {
  root.traverse((o) => {
    o.geometry?.dispose();
    (Array.isArray(o.material) ? o.material : [o.material]).forEach((m) =>
      m?.dispose(),
    );
  });
}
it("正方体五条铰接边在整个折叠过程保持连接，动画不重建六面", () => {
  const root = new THREE.Group();
  buildScene(root, "cube", { fold: 0, edge: 2, pair: 0 });
  const faces = "ABCDEF"
      .split("")
      .map((letter) => root.getObjectByName(`cube-face-${letter}`)),
    geometries = faces.map((face) => face.geometry);
  for (let fold = 0; fold <= 100; fold++) {
    root.userData.update({ fold, pair: 1 });
    root.updateMatrixWorld(true);
    const corners = faces.map((face) =>
      [
        [-1, 0, -1],
        [-1, 0, 1],
        [1, 0, 1],
        [1, 0, -1],
      ].map((point) => face.localToWorld(new THREE.Vector3(...point))),
    );
    for (const [a, b] of [
      [0, 1],
      [0, 2],
      [0, 3],
      [0, 4],
      [1, 5],
    ])
      expect(
        corners[a].filter((point) =>
          corners[b].some((other) => point.distanceTo(other) < 1e-9),
        ).length,
      ).toBeGreaterThanOrEqual(2);
    faces.forEach((face, i) => expect(face.geometry).toBe(geometries[i]));
  }
  dispose(root);
});
it("相对面与 UI 编号一致，闭合后法线相反且中心间距为棱长", () => {
  const root = new THREE.Group();
  buildScene(root, "cube", { fold: 100, edge: 2, pair: 2 });
  root.updateMatrixWorld(true);
  const faces = "ABCDEF"
    .split("")
    .map((letter) => root.getObjectByName(`cube-face-${letter}`));
  for (const [a, b] of cubePairs) {
    const normal = (face) =>
      new THREE.Vector3(0, 1, 0).applyQuaternion(
        face.getWorldQuaternion(new THREE.Quaternion()),
      );
    expect(normal(faces[a]).dot(normal(faces[b]))).toBeCloseTo(-1, 12);
    expect(
      faces[a]
        .getWorldPosition(new THREE.Vector3())
        .distanceTo(faces[b].getWorldPosition(new THREE.Vector3())),
    ).toBeCloseTo(2, 12);
  }
  dispose(root);
});
it("正方体完全折叠后六面中心及相对法线正确", () => {
  const root = new THREE.Group();
  buildScene(root, "cube", { fold: 100, edge: 2 });
  root.updateMatrixWorld(true);
  const centers = [],
    normals = [];
  root.traverse((o) => {
    if (o.isMesh) {
      centers.push(o.getWorldPosition(new THREE.Vector3()));
      normals.push(
        new THREE.Vector3(0, 1, 0).applyQuaternion(
          o.getWorldQuaternion(new THREE.Quaternion()),
        ),
      );
    }
  });
  expect(centers).toHaveLength(6);
  const mid = new THREE.Vector3(0, 0.3, 0);
  centers.forEach((c) => expect(c.distanceTo(mid)).toBeCloseTo(1, 10));
  for (let i = 0; i < 6; i++)
    expect(
      centers.filter((c, j) => i !== j && c.distanceTo(centers[i]) < 1e-6),
    ).toHaveLength(0);
  expect(normals.filter((n) => Math.abs(n.y) > 0.999)).toHaveLength(2);
  dispose(root);
});
it("展开图六面共面且没有重复中心", () => {
  const root = new THREE.Group();
  buildScene(root, "cube", { fold: 0, edge: 2 });
  root.updateMatrixWorld(true);
  const centers = [];
  root.traverse((o) => {
    if (o.isMesh) centers.push(o.getWorldPosition(new THREE.Vector3()));
  });
  expect(centers).toHaveLength(6);
  expect(
    new Set(centers.map((c) => `${c.x.toFixed(6)},${c.z.toFixed(6)}`)).size,
  ).toBe(6);
  centers.forEach((c) => expect(c.y).toBeCloseTo(-0.7, 10));
  dispose(root);
});
it("分子实际球心几何：水104.5度、CO2直线、甲烷四面体", () => {
  for (let type = 0; type < 3; type++) {
    const root = new THREE.Group();
    buildScene(root, "molecule", { type, spread: 1 });
    const atoms = root.children.filter(
      (o) => o.geometry?.type === "SphereGeometry",
    );
    const angle =
      (atoms[1].position
        .clone()
        .sub(atoms[0].position)
        .angleTo(atoms[2].position.clone().sub(atoms[0].position)) *
        180) /
      Math.PI;
    expect(angle).toBeCloseTo([104.5, 180, 109.471220634][type], 8);
    dispose(root);
  }
});
