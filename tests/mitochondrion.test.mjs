import { expect, it, vi } from "vitest";
import { disposeSceneResources } from "../src/disposeSceneResources.mjs";
import * as T from "three";
import { createMitochondrion } from "../src/Mitochondrion.js";
import { buildCell } from "../src/CellModel.js";

it("opens one representative of each energy organelle in overview and restores their shells", () => {
  const root = new T.Group();
  buildCell(root, { part: 0, cut: 100 });
  try {
    const chloroplasts = root.children.filter(
      (o) => o.name === "chloroplast-cutaway",
    );
    const mitochondria = root.children.filter(
      (o) => o.name === "mitochondrion-cutaway",
    );
    const closedChloroplast = chloroplasts[0].getObjectByName(
      "chloroplast-envelope",
    ).geometry;
    const closedMitochondrion = mitochondria[0].getObjectByName(
      "mitochondrion-outer-membrane",
    ).geometry;
    root.userData.update({ part: 0, cut: 100, organelleCutaway: 1 });
    expect(
      chloroplasts[0].getObjectByName("chloroplast-thylakoids").visible,
    ).toBe(true);
    expect(
      mitochondria[0].getObjectByName("mitochondrion-cristae").visible,
    ).toBe(true);
    expect(
      chloroplasts[0].getObjectByName("chloroplast-envelope").geometry,
    ).not.toBe(closedChloroplast);
    expect(
      mitochondria[0].getObjectByName("mitochondrion-outer-membrane").geometry,
    ).not.toBe(closedMitochondrion);
    for (const organelle of chloroplasts.slice(1))
      expect(organelle.getObjectByName("chloroplast-envelope").geometry).toBe(
        closedChloroplast,
      );
    for (const organelle of mitochondria.slice(1))
      expect(organelle.getObjectByName("mitochondrion-cristae").visible).toBe(
        false,
      );
    root.userData.update({ part: 0, cut: 100, organelleCutaway: 0 });
    expect(
      chloroplasts[0].getObjectByName("chloroplast-envelope").geometry,
    ).toBe(closedChloroplast);
    expect(
      mitochondria[0].getObjectByName("mitochondrion-outer-membrane").geometry,
    ).toBe(closedMitochondrion);
  } finally {
    disposeSceneResources(root);
  }
});

it("全景保留完整外膜，只有选中的代表实例展示剖面并可还原", () => {
  const root = new T.Group();
  buildCell(root, { part: 0, cut: 100 });
  try {
    const bodies = root.children.filter(
      (o) => o.name === "mitochondrion-cutaway",
    );
    const closed = bodies[0].getObjectByName(
      "mitochondrion-outer-membrane",
    ).geometry;
    expect(closed.parameters.thetaStart).toBe(0);
    expect(closed.parameters.thetaLength).toBe(Math.PI);
    for (const body of bodies) {
      expect(
        body.getObjectByName("mitochondrion-outer-membrane").geometry,
      ).toBe(closed);
      expect(body.getObjectByName("mitochondrion-cristae").visible).toBe(false);
    }
    root.userData.update({ part: 4, cut: 100 });
    expect(bodies[0].getObjectByName("mitochondrion-cristae").visible).toBe(
      true,
    );
    expect(
      bodies[0].getObjectByName("mitochondrion-outer-membrane").geometry
        .parameters.thetaLength,
    ).toBe(Math.PI / 2);
    for (const body of bodies.slice(1))
      expect(
        body.getObjectByName("mitochondrion-outer-membrane").geometry,
      ).toBe(closed);
    root.userData.update({ part: 0, cut: 100 });
    expect(
      bodies[0].getObjectByName("mitochondrion-outer-membrane").geometry,
    ).toBe(closed);
  } finally {
    disposeSceneResources(root);
  }
});

it("confines cristae within the inner membrane and attaches both folded edges to it", () => {
  const model = createMitochondrion();
  const p = model.getObjectByName("mitochondrion-cristae").geometry.attributes
    .position;
  for (let i = 0; i < p.count; i++) {
    const distance =
      (p.getX(i) / 0.252) ** 2 +
      (p.getY(i) / 0.098) ** 2 +
      (p.getZ(i) / 0.127) ** 2;
    expect(distance).toBeLessThanOrEqual(1.000001);
    expect(p.getY(i)).toBeLessThanOrEqual(0);
    if (i % 25 === 0 || i % 25 === 24) expect(distance).toBeCloseTo(1, 5);
  }
});

it("isolates one mitochondrion, restores the full cell and reuses organelle geometry", () => {
  const root = new T.Group();
  buildCell(root, { cut: 100, part: 4 });
  const organelles = root.children.filter(
    (o) => o.name === "mitochondrion-cutaway",
  );
  expect(organelles).toHaveLength(4);
  const geometry = organelles[0].getObjectByName(
    "mitochondrion-cristae",
  ).geometry;
  expect(organelles[1].getObjectByName("mitochondrion-cristae").geometry).toBe(
    geometry,
  );
  root.userData.setInspection(4);
  expect(root.children.filter((o) => o.visible)).toEqual([organelles[0]]);
  expect(root.getObjectByName("mitochondrion-labels").visible).toBe(true);
  const outer = organelles[0].getObjectByName("mitochondrion-outer-membrane");
  const inner = organelles[0].getObjectByName("mitochondrion-inner-membrane");
  const cristae = organelles[0].getObjectByName("mitochondrion-cristae");
  const detailedGeometry = cristae.geometry;
  expect(detailedGeometry.index.count).toBeGreaterThan(
    geometry.index.count * 4,
  );
  for (const mode of [1, 2, 0]) {
    root.userData.update({ cut: 100, part: 4, mitochondrionMode: mode });
    expect(outer.visible).toBe(mode !== 1);
    expect(inner.visible).toBe(true);
    expect(cristae.visible).toBe(mode !== 2);
    expect(cristae.geometry).toBe(detailedGeometry);
    expect(
      organelles[0].getObjectByName("mitochondrion-inner-membrane-rim").visible,
    ).toBe(true);
  }
  root.userData.setInspection(0);
  expect(organelles.every((o) => o.visible)).toBe(true);
  expect(root.getObjectByName("mitochondrion-labels").visible).toBe(false);
  expect(
    organelles[0].getObjectByName("mitochondrion-inner-membrane-rim").visible,
  ).toBe(false);
  expect(organelles[0].getObjectByName("mitochondrion-cristae").geometry).toBe(
    geometry,
  );
});

it("reduces overview triangles while preserving detailed meshes and disposing both levels", () => {
  const root = new T.Group();
  buildCell(root, { part: 0, cut: 100 });
  const triangles = () => {
    let total = 0;
    root.traverseVisible((o) => {
      if (o.isMesh)
        total +=
          ((o.geometry.index?.count ?? o.geometry.attributes.position.count) /
            3) *
          (o.isInstancedMesh ? o.count : 1);
    });
    return total;
  };
  expect(triangles()).toBeLessThan(255000);
  root.userData.setInspection(4);
  // Detailed membranes plus bounded matrix particles and DNA symbols.
  expect(triangles()).toBeGreaterThan(21120);
  expect(triangles()).toBeLessThan(32000);
  const geometry = root.getObjectByName("mitochondrion-cristae").geometry;
  for (let i = 0; i < 5; i++) {
    root.userData.setInspection(0);
    root.userData.setInspection(4);
    expect(root.getObjectByName("mitochondrion-cristae").geometry).toBe(
      geometry,
    );
  }
  const spies = root.userData.ownedGeometries.map((g) =>
    vi.spyOn(g, "dispose"),
  );
  disposeSceneResources(root);
  for (const spy of spies) expect(spy).toHaveBeenCalledTimes(1);
});
