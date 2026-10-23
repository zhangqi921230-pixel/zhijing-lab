import { expect, it } from "vitest";
import * as T from "three";
import {
  createEndoplasmicReticulum,
  erSurface,
  erOutline,
  erNetworkPaths,
} from "../src/EndoplasmicReticulum.js";
import { buildCell } from "../src/CellModel.js";
import { disposeSceneResources } from "../src/disposeSceneResources.mjs";
import { mergeVertices } from "three/addons/utils/BufferGeometryUtils.js";

it("烘焙管网的表面闭合且所有三角形属于同一连通体", () => {
  const er = createEndoplasmicReticulum();
  const source = er.getObjectByName("er-smooth-network").geometry.clone();
  source.deleteAttribute("normal");
  source.deleteAttribute("uv");
  const geometry = mergeVertices(source, 1e-7);
  const edges = new Map(),
    adjacency = new Map();
  const ids = geometry.index.array;
  for (let i = 0; i < ids.length; i += 3) {
    for (let j = 0; j < 3; j++) {
      const a = ids[i + j],
        b = ids[i + ((j + 1) % 3)];
      const key = a < b ? `${a}:${b}` : `${b}:${a}`;
      edges.set(key, (edges.get(key) ?? 0) + 1);
      if (!adjacency.has(a)) adjacency.set(a, new Set());
      adjacency.get(a).add(b);
    }
  }
  expect([...edges.values()].every((count) => count === 2)).toBe(true);
  const visited = new Set(),
    pending = [ids[0]];
  while (pending.length) {
    const node = pending.pop();
    if (visited.has(node)) continue;
    visited.add(node);
    pending.push(...adjacency.get(node));
  }
  expect(visited.size).toBe(adjacency.size);
  source.dispose();
  geometry.dispose();
  disposeSceneResources(er);
});

it("分支端点接入主干，三层通过桥连成一个网络且网格预算有界", () => {
  const paths = erNetworkPaths();
  const trunks = paths.slice(0, 3);
  const key = (point) => point.join(",");
  const nodes = new Set(trunks.flat().map(key));
  const adjacency = new Map();
  for (const path of paths) {
    for (let i = 1; i < path.length; i++) {
      const a = key(path[i - 1]),
        b = key(path[i]);
      if (!adjacency.has(a)) adjacency.set(a, new Set());
      if (!adjacency.has(b)) adjacency.set(b, new Set());
      adjacency.get(a).add(b);
      adjacency.get(b).add(a);
    }
  }
  for (const path of paths.slice(3)) {
    expect(nodes.has(key(path[0]))).toBe(true);
    expect(nodes.has(key(path.at(-1)))).toBe(true);
  }
  const visited = new Set(),
    queue = [key(paths[0][0])];
  while (queue.length) {
    const node = queue.pop();
    if (visited.has(node)) continue;
    visited.add(node);
    queue.push(...adjacency.get(node));
  }
  expect(visited.size).toBe(adjacency.size);
  trunks.forEach((path, layer) => {
    for (const [x, y, z] of [path[0], path.at(-1)]) {
      expect(y).toBeGreaterThan(erSurface(x, z, layer, -1));
      expect(y).toBeLessThan(erSurface(x, z, layer));
    }
  });
  const er = createEndoplasmicReticulum();
  const geometry = er.getObjectByName("er-smooth-network").geometry;
  // A welded implicit surface replaces the intersecting tube meshes.
  expect(geometry.attributes.position.count).toBeLessThan(20000);
  expect(geometry.index.count / 3).toBeLessThan(32000);
  expect([...geometry.attributes.normal.array].every(Number.isFinite)).toBe(
    true,
  );
});

it("双亚基颗粒保留单次实例绘制，所有表面顶点位于膜外", () => {
  const er = createEndoplasmicReticulum(),
    particles = er.getObjectByName("er-attached-ribosomes");
  const matrix = new T.Matrix4(),
    point = new T.Vector3(),
    vertices = particles.geometry.attributes.position;
  expect(particles.isInstancedMesh).toBe(true);
  expect(particles.geometry.attributes.color.count).toBe(vertices.count);
  let clearance = Infinity;
  for (let i = 0; i < particles.count; i++) {
    particles.getMatrixAt(i, matrix);
    for (let j = 0; j < vertices.count; j++) {
      point.fromBufferAttribute(vertices, j).applyMatrix4(matrix);
      clearance = Math.min(
        clearance,
        point.y - erSurface(point.x, point.z, Math.floor(i / 48)),
      );
    }
  }
  expect(clearance).toBeGreaterThan(0.00009);
});

it("共享膜纹理有明确所有者，场景退出时只释放一次", () => {
  const er = createEndoplasmicReticulum();
  const sheet = er.getObjectByName("er-sheet-0"),
    network = er.getObjectByName("er-smooth-network"),
    texture = sheet.material.bumpMap;
  expect(network.material.roughnessMap).toBe(texture);
  expect(texture.image.width).toBe(128);
  let disposed = 0;
  texture.addEventListener("dispose", () => disposed++);
  disposeSceneResources(er);
  expect(disposed).toBe(1);
});

it("核糖体在膜囊的细胞质侧，使用实例批量绘制", () => {
  const er = createEndoplasmicReticulum();
  const ribosomes = er.getObjectByName("er-attached-ribosomes");
  expect(ribosomes.count).toBe(144);
  const matrix = new T.Matrix4(),
    point = new T.Vector3();
  for (let i = 0; i < 144; i++) {
    ribosomes.getMatrixAt(i, matrix);
    point.setFromMatrixPosition(matrix);
    const offset = point.y - erSurface(point.x, point.z, Math.floor(i / 48));
    expect(offset).toBeGreaterThan(0.00799);
    // Steeper folds require a larger vertical offset to keep the rotated
    // two-subunit silhouette outside the membrane (verified vertex by vertex).
    expect(offset).toBeLessThan(0.012);
    expect((point.x / 0.23) ** 2 + (point.z / 0.135) ** 2).toBeLessThan(0.75);
  }
  expect(
    er.getObjectByName("er-smooth-network").geometry.attributes.position.count,
  ).toBeGreaterThan(1000);
});

it("膜囊具有不同起伏轮廓，连续上下表面不互穿", () => {
  const er = createEndoplasmicReticulum();
  expect(erOutline(0.4, 0)).not.toBe(erOutline(0.4, 2));
  for (let layer = 0; layer < 3; layer++) {
    const geometry = er.getObjectByName(`er-sheet-${layer}`).geometry;
    expect([...geometry.attributes.normal.array].every(Number.isFinite)).toBe(
      true,
    );
    const pos = geometry.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i),
        z = pos.getZ(i);
      const bottom = erSurface(x, z, layer, -1),
        top = erSurface(x, z, layer);
      expect(top).toBeGreaterThanOrEqual(bottom);
      expect(
        Math.min(Math.abs(pos.getY(i) - bottom), Math.abs(pos.getY(i) - top)),
      ).toBeLessThan(0.00002);
      if (layer < 2)
        expect(erSurface(x, z, layer + 1, -1) - top).toBeGreaterThan(0.03);
    }
  }
});

it("局部网络不穿入液泡或高尔基体，近景切换不重建模型", () => {
  const root = new T.Group();
  buildCell(root, { part: 6, cut: 100 });
  root.updateMatrixWorld(true);
  const er = root.getObjectByName("endoplasmic-reticulum"),
    box = new T.Box3();
  er.traverse((o) => {
    if (o.isMesh) box.union(new T.Box3().setFromObject(o));
  });
  expect(box.max.x).toBeLessThan(0.55 - 1.224);
  const golgiBox = new T.Box3();
  root.getObjectByName("golgi-apparatus").traverse((o) => {
    if (o.isMesh) golgiBox.union(new T.Box3().setFromObject(o));
  });
  expect(box.intersectsBox(golgiBox)).toBe(false);
  const geometry = er.getObjectByName("er-smooth-network").geometry;
  root.userData.setInspection(6);
  expect(root.children.filter((o) => o.visible)).toEqual([er]);
  expect(root.getObjectByName("er-labels").visible).toBe(true);
  root.userData.setInspection(0);
  expect(root.getObjectByName("er-labels").visible).toBe(false);
  expect(er.getObjectByName("er-smooth-network").geometry).toBe(geometry);
});

it("分层只在内质网近景生效，隐藏结构时不留下悬空标注", () => {
  const root = new T.Group();
  buildCell(root, { part: 6, cut: 100, erMode: 2 });
  const er = root.getObjectByName("endoplasmic-reticulum");
  const sheet = er.getObjectByName("er-sheet-0"),
    network = er.getObjectByName("er-smooth-network"),
    ribosomes = er.getObjectByName("er-attached-ribosomes");
  expect(sheet.visible).toBe(true);
  root.userData.setInspection(6);
  expect(sheet.visible).toBe(false);
  expect(ribosomes.visible).toBe(false);
  expect(network.visible).toBe(true);
  expect(er.getObjectByName("er-label-0").visible).toBe(false);
  expect(er.getObjectByName("er-label-2").visible).toBe(true);
  root.userData.update({ part: 6, cut: 100, erMode: 1 });
  expect(sheet.visible).toBe(true);
  expect(ribosomes.visible).toBe(true);
  expect(network.visible).toBe(false);
  expect(er.getObjectByName("er-label-2").visible).toBe(false);
  root.userData.setInspection(0);
  expect(network.visible).toBe(true);
  expect(sheet.visible).toBe(true);
  root.userData.setInspection(6);
  expect(network.visible).toBe(false);
});
