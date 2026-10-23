import { it, expect } from "vitest";
import { sectionState } from "../src/sectionLessons.mjs";
it("integrated cone slices conserve volume and obey radius squared and height scaling", () => {
  for (const radius of [1, 2, 3])
    for (const height of [3, 6]) {
      const p = { radius, height },
        q = sectionState("solid-volume", p, 3);
      expect(q.sliceArea / q.base).toBeCloseTo(0.25);
      let volume = 0;
      const n = 1000;
      for (let i = 0; i < n; i++)
        volume +=
          (sectionState("solid-volume", p, (6 * (i + 0.5)) / n).sliceArea *
            height) /
          n;
      expect(volume).toBeCloseTo(q.cone, 3);
      expect(q.cylinder / q.cone).toBeCloseTo(3);
      expect(
        sectionState("solid-volume", { radius: radius * 2, height }).cone /
          q.cone,
      ).toBeCloseTo(4);
      expect(
        sectionState("solid-volume", { radius, height: height * 2 }).cone /
          q.cone,
      ).toBeCloseTo(2);
    }
});
it("distributed pressure integrates to dam force and its center of pressure", () => {
  for (const depth of [1, 2, 5])
    for (const density of [800, 1000, 1200]) {
      const p = { depth, density },
        q = sectionState("water-pressure", p, 6);
      let force = 0,
        moment = 0;
      const n = 1000;
      for (let i = 0; i < n; i++) {
        const z = (depth * (i + 0.5)) / n,
          f = (density * 9.8 * z * depth) / n;
        force += f;
        moment += f * z;
      }
      expect(force).toBeCloseTo(q.force, 6);
      expect(moment / force).toBeCloseTo(q.center, 5);
      expect(sectionState("water-pressure", p, 0).pressure).toBe(0);
      expect(
        sectionState("water-pressure", p, 3).pressure / q.bottom,
      ).toBeCloseTo(0.5);
      expect(
        sectionState("water-pressure", { depth: depth * 2, density }, 6).force /
          q.force,
      ).toBeCloseTo(4);
    }
});
