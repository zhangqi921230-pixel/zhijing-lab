import { it, expect } from "vitest";
import * as T from "three";
import { solidsState } from "../src/advancedModels.mjs";
import { buildSolidsBench, rulerTextureY } from "../src/SolidsBench.js";
it("底面、半高和顶点截面与真实场景几何一致", () => {
  for (const radius of [0.5, 1.2, 2])
    for (const height of [1, 2.5, 4]) {
      const root = new T.Group();
      buildSolidsBench(root, { radius, height, slice: 0, time: 0 });
      for (const slice of [0, 25, 50, 75, 100]) {
        const p = { radius, height, slice, time: 0 },
          q = solidsState(p);
        root.userData.update(p);
        const cone = root.getObjectByName("solid-section-1"),
          cylinder = root.getObjectByName("solid-section-0");
        expect(cone.scale.x).toBeCloseTo(radius * (1 - slice / 100) * 0.7, 12);
        expect(cylinder.scale.x).toBeCloseTo(radius * 0.7, 12);
        expect(cone.position.y).toBeCloseTo(
          -0.65 + ((height * slice) / 100) * 0.7,
          12,
        );
        expect(q.coneArea / q.cylinderArea).toBeCloseTo(
          (1 - slice / 100) ** 2,
          12,
        );
        expect(cone.visible).toBe(slice !== 100);
        expect(q.cylinderVolume / q.coneVolume).toBeCloseTo(3, 12);
      }
      root.traverse((o) => {
        o.geometry?.dispose();
        (Array.isArray(o.material) ? o.material : [o.material]).forEach((m) =>
          m?.dispose(),
        );
      });
    }
});
it("扫描时间与截面选择统一且尺子刻度映射到同一厘米比例", () => {
  const p = { radius: 2, height: 4, slice: 45 };
  expect(solidsState(p, 10).sectionRadius).toBe(1);
  expect(solidsState(p, 20).sectionRadius).toBe(0);
  expect(solidsState(p, 0).z).toBe(1.8);
  for (const cm of Array.from({ length: 41 }, (_, i) => i / 10)) {
    const worldY = -0.65 + 1.4 + (0.5 - rulerTextureY(cm) / 384) * 4.2 * 0.7;
    expect(worldY).toBeCloseTo(-0.65 + cm * 0.7, 12);
  }
});

it("keeps radius and height indicators calibrated while scanning without re-uploading generators", () => {
  const root = new T.Group();
  const p = { radius: 1.6, height: 3.2, slice: 0, time: 0 };
  buildSolidsBench(root, p);
  const versions = [0, 1].map(
    (i) =>
      root.getObjectByName(`solid-generators-${i}`).geometry.attributes.position
        .version,
  );
  for (const slice of [0, 25, 50, 75, 100]) {
    root.userData.update({ ...p, slice });
    for (let i = 0; i < 2; i++) {
      const measurement = root.getObjectByName(`solid-measurement-${i}`)
        .geometry.attributes.position;
      const radius = p.radius * 0.7 * (i ? 1 - slice / 100 : 1);
      expect(measurement.getX(1) - measurement.getX(0)).toBeCloseTo(radius, 5);
      expect(measurement.getY(4)).toBeCloseTo(
        -0.65 + (p.height * 0.7 * slice) / 100,
        5,
      );
      const cursor = root.getObjectByName(`solid-ruler-cursor-${i}`);
      const axis = root.getObjectByName(`solid-axis-${i}`);
      expect(cursor.position.y).toBeCloseTo(measurement.getY(4), 5);
      expect(cursor.position.x).toBeCloseTo(measurement.getX(3), 5);
      expect(axis.position.x).toBeCloseTo(measurement.getX(0), 5);
      expect(
        axis.position.y + axis.geometry.attributes.position.getY(1),
      ).toBeCloseTo(-0.65 + p.height * 0.7, 5);
      expect(measurement.getX(8)).toBeCloseTo(measurement.getX(1), 5);
      if (i && slice === 100) expect(Math.abs(measurement.getZ(8))).toBe(0);
      expect(
        root.getObjectByName(`solid-generators-${i}`).geometry.attributes
          .position.version,
      ).toBe(versions[i]);
    }
  }
  const axis = root.getObjectByName("solid-axis-1"),
    geometry = axis.geometry;
  root.userData.update({ ...p, height: 4 });
  expect(axis.geometry).toBe(geometry);
  expect(geometry.attributes.lineDistance.getX(1)).toBeCloseTo(4 * 0.7, 5);
});

it("places readout plaques outside the largest solid footprint and below its base", () => {
  for (const radius of [0.5, 2])
    for (const height of [1, 4]) {
      const root = new T.Group();
      buildSolidsBench(root, { radius, height, slice: 50, time: 0 });
      root.updateMatrixWorld(true);
      for (let i = 0; i < 2; i++) {
        const plaque = new T.Box3().setFromObject(
          root.getObjectByName(`solid-readout-plinth-${i}`),
        );
        const solid = new T.Box3().setFromObject(
          root.getObjectByName(i ? "solid-cone" : "solid-cylinder"),
        );
        expect(plaque.intersectsBox(solid)).toBe(false);
        expect(plaque.max.y).toBeLessThan(solid.min.y);
        expect(plaque.min.z).toBeGreaterThan(solid.max.z);
      }
    }
});
