import { it, expect } from "vitest";
import { terrainHeightAt, contourSegments } from "../src/models.mjs";
import { TEACHING_BASIN as b, riverHeight } from "../src/terrainWorld.mjs";
it("the inland basin has a closed higher rim and inward-descending contours", () => {
  const floor = terrainHeightAt(b.x, b.z);
  expect(floor).toBeGreaterThan(riverHeight(b.z) + 50);
  expect(floor).toBeLessThan(240);
  let minimumRim = Infinity;
  for (let i = 0; i < 360; i++) {
    const angle = (i * Math.PI) / 180,
      x = b.x + b.rx * 0.9 * Math.cos(angle),
      z = b.z + b.rz * 0.9 * Math.sin(angle);
    minimumRim = Math.min(minimumRim, terrainHeightAt(x, z));
  }
  expect(minimumRim - floor).toBeGreaterThan(100);
  for (const level of [300, 350, 400]) {
    const segments = contourSegments(level).filter(([a, c]) =>
      [a, c].every(
        (p) => Math.hypot((p[0] - b.x) / b.rx, (p[2] - b.z) / b.rz) < 0.9,
      ),
    );
    expect(segments.length).toBeGreaterThan(30);
    const degree = new Map();
    for (const segment of segments)
      for (const p of segment) {
        const key = p.map((v) => v.toFixed(7)).join(",");
        degree.set(key, (degree.get(key) || 0) + 1);
      }
    for (const d of degree.values()) expect(d).toBe(2);
  }
});
