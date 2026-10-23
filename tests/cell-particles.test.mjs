import { expect, it } from "vitest";
import {
  cellParticleFits,
  cytoplasmicParticles,
} from "../src/cellParticles.mjs";

it("keeps finite-size particles inside the rounded cell and distributes them in depth", () => {
  const points = cytoplasmicParticles();
  expect(points.length).toBeGreaterThan(100);
  expect(points.length).toBeLessThan(560);
  for (const point of points) expect(cellParticleFits(point)).toBe(true);
  const ys = points.map((p) => p[1]);
  expect(Math.max(...ys) - Math.min(...ys)).toBeGreaterThan(0.48);
  expect(cellParticleFits([2.05, -0.72, 1.4])).toBe(false);
  expect(cytoplasmicParticles()).toEqual(points);
});
