import { it, expect } from "vitest";
import {
  seismicLocation,
  secondIntersection,
  receivedLocationStations,
} from "../src/seismicLocation.mjs";
it("location evidence waits for S arrival and supports a B C first pair", () => {
  const p = { distance: 100, depth: 10 },
    all = seismicLocation(p).stations;
  expect(receivedLocationStations(p, 0)).toEqual([]);
  const mid = all[1].path / 3.5 + 0.01,
    ready = receivedLocationStations(p, mid);
  expect(ready.map((s) => s.name)).toEqual(["B", "C"]);
  const other = secondIntersection(ready);
  for (const s of ready)
    expect(Math.hypot(other.x - s.x, other.y - s.y)).toBeCloseTo(s.radius);
  expect(Math.hypot(other.x - all[0].x, other.y - all[0].y)).not.toBeCloseTo(
    all[0].radius,
  );
  expect(receivedLocationStations(p, all[0].path / 3.5)).toHaveLength(3);
  expect(secondIntersection([])).toBeNull();
});
