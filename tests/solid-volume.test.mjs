import { expect, it } from "vitest";
import * as T from "three";
import { accumulatedVolumes } from "../src/advancedModels.mjs";
import { createSolidVolume } from "../src/SolidVolume.js";
import { buildSolidsBench } from "../src/SolidsBench.js";

it("实际三角网格的封闭体积吻合解析式，允许圆周离散误差", () => {
  for (const cone of [false, true]) {
    const root = new T.Group(),
      update = createSolidVolume(root, cone),
      mesh = root.children[0];
    for (const f of [0.01, 0.5, 1]) {
      update(f, 1.2, 3, 0, 0, true);
      const geometry = mesh.geometry,
        pos = geometry.attributes.position,
        index = geometry.index;
      const a = new T.Vector3(),
        b = new T.Vector3(),
        c = new T.Vector3();
      let volume = 0;
      for (let i = 0; i < index.count; i += 3) {
        a.fromBufferAttribute(pos, index.getX(i));
        b.fromBufferAttribute(pos, index.getX(i + 1));
        c.fromBufferAttribute(pos, index.getX(i + 2));
        volume += a.dot(b.cross(c)) / 6;
      }
      volume = Math.abs(volume * mesh.scale.x * mesh.scale.y * mesh.scale.z);
      const exact = accumulatedVolumes(1.2, 3, f)[cone ? "cone" : "cylinder"];
      const polygonCorrection =
        (64 * Math.sin((2 * Math.PI) / 64)) / (2 * Math.PI);
      expect(volume / exact).toBeCloseTo(polygonCorrection, 6);
    }
  }
});

it("离开体积章节恢复截面，累计模型不重建", () => {
  const root = new T.Group(),
    p = { radius: 1.2, height: 2.5, slice: 50, time: 0 };
  buildSolidsBench(root, p);
  const fill = root.getObjectByName("solid-volume-cone"),
    section = root.getObjectByName("solid-section-1"),
    geometry = fill.geometry;
  expect(fill.visible).toBe(false);
  root.userData.update({ ...p, accumulation: true });
  expect(fill.visible).toBe(true);
  expect(section.visible).toBe(false);
  root.userData.update({ ...p, accumulation: false });
  expect(fill.visible).toBe(false);
  expect(section.visible).toBe(true);
  expect(fill.geometry).toBe(geometry);
});

it("累计体积的高度导数等于截面积，半高圆锥占 7/8", () => {
  for (const r of [0.5, 1.2, 2])
    for (const h of [1, 2.5, 4]) {
      const total = (Math.PI * r * r * h) / 3;
      expect(accumulatedVolumes(r, h, 0).cone).toBe(0);
      expect(accumulatedVolumes(r, h, 1).cone).toBeCloseTo(total, 12);
      expect(accumulatedVolumes(r, h, 0.5).cone / total).toBeCloseTo(7 / 8, 12);
      for (const f of [0.1, 0.5, 0.9]) {
        const d = 1e-5,
          a = accumulatedVolumes(r, h, f - d),
          b = accumulatedVolumes(r, h, f + d);
        expect((b.cone - a.cone) / (2 * d * h)).toBeCloseTo(
          Math.PI * r * r * (1 - f) ** 2,
          7,
        );
      }
    }
});

it("累计实体复用网格，边界与圆锥母线吻合且无非有限法线", () => {
  const root = new T.Group(),
    update = createSolidVolume(root, true),
    mesh = root.children[0],
    geometry = mesh.geometry;
  for (const f of [0, 0.01, 0.5, 1, 0.25]) {
    update(f, 1.2, 3, 1.9, -0.65, true);
    expect(mesh.geometry).toBe(geometry);
    expect(mesh.visible).toBe(f > 0);
    const position = geometry.attributes.position,
      normal = geometry.attributes.normal;
    for (let i = 0; i < position.count; i++) {
      const y = position.getY(i),
        radius = Math.hypot(position.getX(i), position.getZ(i));
      expect(radius).toBeLessThanOrEqual(1 - f * (y + 0.5) + 1e-6);
      expect(
        Number.isFinite(normal.getX(i) + normal.getY(i) + normal.getZ(i)),
      ).toBe(true);
    }
    expect(mesh.position.y - mesh.scale.y / 2).toBeCloseTo(-0.65, 12);
  }
  update(0.5, 1.2, 3, 1.9, -0.65, false);
  expect(mesh.visible).toBe(false);
});
