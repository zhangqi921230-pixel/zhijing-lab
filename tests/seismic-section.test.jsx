import { expect, it } from "vitest";
import * as THREE from "three";
import {
  addSectionWave,
  SEISMIC_SCALE,
  SECTION_Z,
} from "../src/SeismicSection.js";
import { buildSeismicBench } from "../src/SeismicBench.js";
import { seismic } from "../src/advancedModels.mjs";

it("clips circular wavefronts to rock and intersects the station at the computed arrival", () => {
  const root = new THREE.Group(),
    update = addSectionWave(root, "#ffffff");
  const line = root.children[0],
    geometry = line.geometry,
    attr = geometry.attributes.position;
  for (const depth of [5, 15, 30])
    for (const distance of [10, 40, 80]) {
      const q = seismic({ depth, distance }, 0);
      for (const [speed, arrival] of [
        [6, q.tp],
        [3.5, q.ts],
      ]) {
        const radius = speed * arrival * SEISMIC_SCALE;
        update(radius, depth);
        let closest = Infinity;
        for (let i = 0; i < geometry.drawRange.count; i++) {
          const x = attr.getX(i),
            y = attr.getY(i);
          expect(x).toBeGreaterThanOrEqual(-3.500001);
          expect(x).toBeLessThanOrEqual(3.500001);
          expect(y).toBeGreaterThanOrEqual(-1.600001);
          expect(y).toBeLessThanOrEqual(0.000001);
          expect(attr.getZ(i)).toBeCloseTo(SECTION_Z, 6);
          expect(
            Math.abs(Math.hypot(x + 1.7, y + depth * SEISMIC_SCALE) - radius),
          ).toBeLessThan(0.0001);
          closest = Math.min(
            closest,
            Math.hypot(x - (-1.7 + distance * SEISMIC_SCALE), y),
          );
        }
        expect(closest).toBeLessThan(0.001);
      }
    }
  const version = attr.version;
  update(lastRadius(), 30);
  function lastRadius() {
    return Math.hypot(30, 80) * SEISMIC_SCALE;
  }
  // Repeated identical state never creates new geometry or position storage.
  const nextVersion = attr.version;
  update(lastRadius(), 30);
  expect(attr.version).toBe(nextVersion);
  expect(attr.version).toBeGreaterThanOrEqual(version);
  expect(line.geometry).toBe(geometry);
  expect(line.geometry.attributes.position).toBe(attr);
  update(0, 30);
  expect(line.visible).toBe(false);
});

it("keeps focus, epicenter and station in one metric section while reusing objects", () => {
  const root = new THREE.Group();
  buildSeismicBench(root, { depth: 15, distance: 40, time: 0 });
  const objects = [...root.children];
  for (const depth of [5, 30])
    for (const distance of [10, 80]) {
      root.userData.update({ depth, distance, time: 8 });
      const focus = root.getObjectByName("seismic-focus").position;
      const epicenter = root.getObjectByName("seismic-epicenter").position;
      const station = root.getObjectByName("seismic-station").position;
      expect(epicenter.x).toBe(focus.x);
      expect(epicenter.y - focus.y).toBeCloseTo(depth * SEISMIC_SCALE);
      expect(station.x - epicenter.x).toBeCloseTo(distance * SEISMIC_SCALE);
      expect(station.y).toBe(0);
      expect(root.children).toEqual(objects);
    }
});
