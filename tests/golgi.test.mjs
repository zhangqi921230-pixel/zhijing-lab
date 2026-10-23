import { expect, it } from "vitest";
import * as T from "three";
import { createGolgiApparatus } from "../src/GolgiApparatus.js";
import { buildCell } from "../src/CellModel.js";

it("膜囊各层不相交且囊泡批量绘制，表面坐标与法线有限", () => {
  const group = createGolgiApparatus();
  group.updateMatrixWorld(true);
  expect(group.getObjectByName("golgi-vesicles").count).toBe(12);
  const maxHalfThickness = Math.max(
    ...Array.from({ length: 1001 }, (_, i) => {
      const r = i / 1000;
      return Math.sqrt(1 - r * r) * (0.012 + 0.039 * r ** 5);
    }),
  );
  // Minimum gap allows also for differing widths, ripple phases and lateral offsets.
  expect(0.075 - 2 * maxHalfThickness).toBeGreaterThan(0.035);
  for (let i = 0; i < 6; i++) {
    const mesh = group.getObjectByName(`golgi-cisterna-${i}`);
    for (const attr of [
      mesh.geometry.attributes.position,
      mesh.geometry.attributes.normal,
    ])
      expect(Array.from(attr.array).every(Number.isFinite)).toBe(true);
    // Compare vertically corresponding vertices; the curved sacs need not have disjoint AABBs.
    if (i > 0) {
      const below = group.getObjectByName(`golgi-cisterna-${i - 1}`);
      for (let j = 0; j < mesh.geometry.attributes.position.count; j++)
        expect(
          mesh.geometry.attributes.position.getY(j) +
            mesh.position.y -
            (below.geometry.attributes.position.getY(j) + below.position.y),
        ).toBeGreaterThan(0.07);
    }
  }
});
it("近景仅显示高尔基体，返回全景保留结构且关闭细标注", () => {
  const root = new T.Group();
  buildCell(root, { part: 5, cut: 100 });
  const golgi = root.getObjectByName("golgi-apparatus");
  root.userData.setInspection(5);
  expect(root.children.filter((c) => c.visible)).toEqual([golgi]);
  expect(root.getObjectByName("golgi-labels").visible).toBe(true);
  root.userData.setInspection(0);
  expect(golgi.visible).toBe(true);
  expect(root.getObjectByName("golgi-labels").visible).toBe(false);
  expect(golgi.userData).toMatchObject({ key: "part", value: 5 });
});

it("出芽共用几何且根部在对应膜囊边缘，分层不重建或遗留标注", () => {
  const root = new T.Group();
  buildCell(root, { part: 5, cut: 100, golgiMode: 0 });
  root.userData.setInspection(5);
  const golgi = root.getObjectByName("golgi-apparatus");
  const buds = golgi.getObjectByName("golgi-buds");
  const geometry = buds.children[0].geometry;
  for (const bud of buds.children) {
    expect(bud.geometry).toBe(geometry);
    const layer = bud.userData.layer;
    const sac = golgi.getObjectByName(`golgi-cisterna-${layer}`);
    const pos = sac.geometry.attributes.position;
    let nearest = Infinity;
    const v = new T.Vector3();
    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i).add(sac.position);
      nearest = Math.min(nearest, v.distanceTo(bud.position));
    }
    expect(nearest).toBeLessThan(0.012);
    expect([...geometry.attributes.normal.array].every(Number.isFinite)).toBe(
      true,
    );
  }
  root.userData.update({ part: 5, cut: 100, golgiMode: 1 });
  expect(buds.visible).toBe(false);
  expect(golgi.getObjectByName("golgi-vesicles").visible).toBe(false);
  expect(golgi.getObjectByName("golgi-label-4").visible).toBe(false);
  root.userData.update({ part: 5, cut: 100, golgiMode: 2 });
  expect(buds.visible).toBe(true);
  const context = golgi.getObjectByName("golgi-attachment-rims");
  expect(context.visible).toBe(true);
  expect(context.children).toHaveLength(2);
  for (const bud of buds.children) {
    const rim = golgi.getObjectByName(
      `golgi-attachment-rim-${bud.userData.layer}`,
    );
    const positions = rim.geometry.attributes.position;
    const point = new T.Vector3();
    let distance = Infinity;
    for (let i = 0; i < positions.count; i++)
      distance = Math.min(
        distance,
        point.fromBufferAttribute(positions, i).distanceTo(bud.position),
      );
    expect(distance).toBeLessThan(0.008);
  }
  expect(golgi.getObjectByName("golgi-cisterna-0").visible).toBe(false);
  expect(golgi.getObjectByName("golgi-label-0").visible).toBe(false);
  expect(golgi.getObjectByName("golgi-label-4").visible).toBe(true);
  root.userData.setInspection(0);
  expect(context.visible).toBe(false);
  expect(golgi.getObjectByName("golgi-cisterna-0").visible).toBe(true);
  expect(golgi.getObjectByName("golgi-labels").visible).toBe(false);
  expect(buds.children[0].geometry).toBe(geometry);
});
