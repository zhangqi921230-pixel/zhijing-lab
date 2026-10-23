import { expect, it } from "vitest";
import * as T from "three";
import { buildCell } from "../src/CellModel.js";
import { disposeSceneResources } from "../src/disposeSceneResources.mjs";
import { cellCloseupCamera } from "../src/cellCamera.mjs";

it("完整线粒体包膜位于细胞质内侧，不穿过弯曲细胞壁", () => {
  const root = new T.Group();
  buildCell(root, { part: 0, cut: 100 });
  root.updateMatrixWorld(true);
  try {
    const point = new T.Vector3();
    for (const body of root.children.filter(
      (o) => o.name === "mitochondrion-cutaway",
    )) {
      const shell = body.getObjectByName("mitochondrion-outer-membrane");
      const positions = shell.geometry.attributes.position;
      for (let i = 0; i < positions.count; i++) {
        point.fromBufferAttribute(positions, i).applyMatrix4(shell.matrixWorld);
        // Inside the cytoplasm's 0.965 envelope even at minimum surface ripple.
        const inset = 0.965 * 0.991;
        const inside =
          (Math.abs(point.x) / (2.48 * inset)) ** (2 / 0.47) +
          (Math.abs(point.y + 0.03) / (1.23 * 0.965)) ** (2 / 0.67) +
          (Math.abs(point.z) / (1.82 * inset)) ** (2 / 0.47);
        expect(
          inside,
          `mitochondrion at ${body.position.toArray()}`,
        ).toBeLessThan(1);
      }
    }
  } finally {
    disposeSceneResources(root);
  }
});

it("叶绿体包膜的三角面位于液泡外，高尔基体与内质网不穿入邻近叶绿体", () => {
  const root = new T.Group();
  buildCell(root, { part: 0, cut: 100 });
  root.updateMatrixWorld(true);
  try {
    const vacuole = root.children.find(
      (o) => o.userData.key === "part" && o.userData.value === 2,
    );
    const inverse = vacuole.matrixWorld.clone().invert();
    const radius = vacuole.geometry.parameters.radius;
    const origin = new T.Vector3(),
      closest = new T.Vector3();
    const triangle = new T.Triangle();
    const bounds = [];
    for (const organelle of root.children.filter(
      (o) => o.name === "chloroplast-cutaway",
    )) {
      const shell = organelle.getObjectByName("chloroplast-envelope");
      bounds.push(new T.Box3().setFromObject(shell));
      const transform = inverse.clone().multiply(shell.matrixWorld);
      const { position } = shell.geometry.attributes;
      const points = Array.from({ length: position.count }, (_, i) =>
        new T.Vector3()
          .fromBufferAttribute(position, i)
          .applyMatrix4(transform),
      );
      const indices = shell.geometry.index;
      for (let i = 0; i < indices.count; i += 3) {
        triangle.set(
          points[indices.getX(i)],
          points[indices.getX(i + 1)],
          points[indices.getX(i + 2)],
        );
        triangle.closestPointToPoint(origin, closest);
        expect(closest.length()).toBeGreaterThan(radius);
      }
    }
    const bodies = ["golgi-apparatus", "endoplasmic-reticulum"].map((name) => {
      const bound = new T.Box3();
      root.getObjectByName(name).traverseVisible((o) => {
        if (!o.isMesh) return;
        const owner = o.isInstancedMesh ? o : o.geometry;
        if (!owner.boundingBox) owner.computeBoundingBox();
        bound.union(owner.boundingBox.clone().applyMatrix4(o.matrixWorld));
      });
      return bound;
    });
    for (const body of bodies)
      for (const chloroplast of bounds)
        expect(body.intersectsBox(chloroplast)).toBe(false);
    expect(bodies[0].intersectsBox(bodies[1])).toBe(false);
  } finally {
    disposeSceneResources(root);
  }
});

it("四个线粒体与叶绿体、液泡保持独立空间，标注与近景跟随代表实例", () => {
  const root = new T.Group();
  buildCell(root, { part: 4, cut: 100 });
  root.updateMatrixWorld(true);
  try {
    const mitochondria = root.children.filter(
      (o) => o.name === "mitochondrion-cutaway",
    );
    const neighbours = root.children
      .filter((o) => o.name === "chloroplast-cutaway")
      .map((o) =>
        new T.Box3().setFromObject(o.getObjectByName("chloroplast-envelope")),
      );
    neighbours.push(
      new T.Box3().setFromObject(
        root.children.find(
          (o) => o.userData.key === "part" && o.userData.value === 2,
        ),
      ),
    );
    const bounds = mitochondria.map((o) =>
      new T.Box3().setFromObject(
        o.getObjectByName("mitochondrion-outer-membrane"),
      ),
    );
    bounds.forEach((box, i) => {
      for (const [j, other] of [
        ...neighbours,
        ...bounds.slice(i + 1),
      ].entries())
        expect(
          box.intersectsBox(other),
          `mitochondrion ${i}, neighbour ${j}`,
        ).toBe(false);
    });
    const lead =
      root.getObjectByName("cell-focus-4").children[0].geometry.attributes
        .position;
    expect(lead.getX(0)).toBeCloseTo(mitochondria[0].position.x);
    expect(lead.getZ(0)).toBeCloseTo(mitochondria[0].position.z);
    const preset = cellCloseupCamera("mitochondrion");
    expect(preset.target[0]).toBe(mitochondria[0].position.x);
    expect(preset.target[2]).toBe(mitochondria[0].position.z);
  } finally {
    disposeSceneResources(root);
  }
});

it("细胞核全景和选中引线落在可见核膜上，不指向已切去的上半球", () => {
  const root = new T.Group();
  buildCell(root, { part: 1, cut: 100 });
  root.updateMatrixWorld(true);
  try {
    const nucleus = root.getObjectByName("cell-nucleus");
    const vertices = nucleus.geometry.attributes.position;
    const surface = Array.from({ length: vertices.count }, (_, i) =>
      nucleus.localToWorld(new T.Vector3().fromBufferAttribute(vertices, i)),
    );
    const overview = root
      .getObjectByName("cell-overview-labels")
      .children.find((o) => o.isLine && o.name === "细胞核");
    const focus = root
      .getObjectByName("cell-focus-1")
      .children.find((o) => o.isLine);
    for (const [line, index] of [
      [overview, 0],
      [focus, 0],
    ]) {
      const point = line.localToWorld(
        new T.Vector3().fromBufferAttribute(
          line.geometry.attributes.position,
          index,
        ),
      );
      expect(
        Math.min(...surface.map((vertex) => vertex.distanceTo(point))),
      ).toBeLessThan(1e-6);
    }
  } finally {
    disposeSceneResources(root);
  }
});
