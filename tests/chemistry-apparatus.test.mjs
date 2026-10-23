import { describe, it, expect } from "vitest";
import { buildChemistryApparatus } from "../src/ChemistryApparatus.js";
import { chemistryTopics } from "../src/chemistryTopics.mjs";
describe("lightweight chemistry apparatus", () => {
  it.each(chemistryTopics)(
    "$id keeps bounded geometry and reuses it across chapters",
    (topic) => {
      const model = buildChemistryApparatus(topic.id);
      const geometries = new Set(),
        materials = new Set();
      let triangles = 0,
        meshes = 0;
      model.root.traverse((o) => {
        if (o.isMesh) {
          geometries.add(o.geometry);
          materials.add(o.material);
          triangles +=
            ((o.geometry.index?.count || o.geometry.attributes.position.count) /
              3) *
            (o.count || 1);
          meshes++;
        }
      });
      expect(triangles).toBeLessThan(18000);
      expect(meshes).toBeLessThan(80);
      for (const chapter of topic.chapters)
        for (const time of [0, 30, 120, 240, 600]) {
          model.update(chapter.preset, time, true);
          model.root.traverse((o) => {
            if (o.isMesh) {
              expect(geometries.has(o.geometry)).toBe(true);
              expect(o.position.toArray().every(Number.isFinite)).toBe(true);
              expect(o.scale.toArray().every(Number.isFinite)).toBe(true);
            }
          });
        }
      let disposed = 0;
      geometries.forEach((g) =>
        g.addEventListener("dispose", () => disposed++),
      );
      model.dispose();
      expect(disposed).toBe(geometries.size);
    },
  );
});
