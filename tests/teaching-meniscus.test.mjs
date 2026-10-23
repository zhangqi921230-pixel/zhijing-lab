import { it, expect } from "vitest";
import { teachingMeniscusGeometry } from "../src/TeachingMeniscus.js";
import { buildChemistryApparatus } from "../src/ChemistryApparatus.js";
it("concave surface has zero area-weighted displacement and upward normals", () => {
  const g = teachingMeniscusGeometry(),
    p = g.attributes.position,
    ix = g.index;
  let volume = 0,
    area = 0;
  for (let i = 0; i < ix.count; i += 3) {
    const [a, b, c] = [0, 1, 2].map((j) => ix.getX(i + j));
    const weight =
      Math.abs(
        (p.getX(b) - p.getX(a)) * (p.getZ(c) - p.getZ(a)) -
          (p.getX(c) - p.getX(a)) * (p.getZ(b) - p.getZ(a)),
      ) / 2;
    volume += (weight * (p.getY(a) + p.getY(b) + p.getY(c))) / 3;
    area += weight;
  }
  expect(volume / area).toBeCloseTo(0, 7);
  expect(p.getY(p.count - 1)).toBeGreaterThan(p.getY(0));
  for (let i = 0; i < p.count; i++)
    expect(g.attributes.normal.getY(i)).toBeGreaterThan(0);
  g.dispose();
});
it("receiver starts empty, rests above the glass base, and reuses geometry as liquid collects", () => {
  const model = buildChemistryApparatus("distillation"),
    body = model.root.getObjectByName("distillation-collected-liquid"),
    surface = body.userData.surface;
  const geometry = surface.geometry;
  model.update({ power: 800, cooling: true }, 0, false);
  expect(body.visible).toBe(false);
  expect(surface.visible).toBe(false);
  model.update({ power: 800, cooling: true }, 600, false);
  expect(body.visible).toBe(true);
  expect(body.userData.nominalHeight).toBeCloseTo(0.55);
  expect(body.position.y - body.scale.y / 2).toBeCloseTo(0.21);
  expect(surface.position.y).toBeCloseTo(0.76);
  expect(surface.geometry).toBe(geometry);
  expect(
    surface.position.y + surface.scale.y * geometry.userData.edgeHeight,
  ).toBeCloseTo(body.position.y + body.scale.y / 2);
  model.update({ power: 800, cooling: false }, 600, false);
  expect(body.visible).toBe(false);
  expect(surface.visible).toBe(false);
  model.dispose();
});
