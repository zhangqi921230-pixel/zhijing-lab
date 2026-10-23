import { it, expect } from "vitest";
import { vesselGraduations } from "../src/VesselGraduations.js";
import { buildChemistryApparatus } from "../src/ChemistryApparatus.js";
it("printed ticks stay outside the cylindrical wall and above the glass base", () => {
  for (const [r, h] of [
    [0.14, 0.52],
    [0.43, 0.87],
    [0.88, 2.15],
    [1.5, 1.1],
  ]) {
    const g = vesselGraduations(r, h),
      p = g.attributes.position,
      levels = new Set();
    for (let i = 0; i < p.count; i++) {
      expect(Math.hypot(p.getX(i), p.getZ(i))).toBeCloseTo(r + 0.002, 6);
      expect(p.getY(i)).toBeGreaterThan(0.09);
      expect(p.getY(i)).toBeLessThan(h);
      levels.add(p.getY(i));
    }
    expect(levels.size).toBe(15);
    expect(p.count).toBe(180);
    g.dispose();
  }
});
it("graduation batches follow the theme and dispose with the apparatus", () => {
  const m = buildChemistryApparatus("displacement"),
    lines = [];
  m.root.traverse((o) => {
    if (o.name === "vessel-graduations") lines.push(o);
  });
  expect(lines).toHaveLength(2);
  expect(lines.every((o) => o.isLineSegments)).toBe(true);
  m.setTheme(true);
  expect(lines[0].material.color.getHexString()).toBe("d5e1df");
  m.setTheme(false);
  expect(lines[0].material.color.getHexString()).toBe("38535a");
  let disposed = 0;
  lines.forEach((o) =>
    o.geometry.addEventListener("dispose", () => disposed++),
  );
  m.dispose();
  expect(disposed).toBe(2);
});
