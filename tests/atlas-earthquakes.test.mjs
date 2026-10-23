import { readFileSync } from "node:fs";
import * as THREE from "three";
import { expect, it } from "vitest";
import { addAtlasEarthquakes } from "../src/AtlasEarthquakes.js";
import { globePoint } from "../src/plateGlobeGeometry.mjs";
const catalog = JSON.parse(
  readFileSync(
    new URL("../public/data/tectonics/usgs-2025-m55.json", import.meta.url),
  ),
);
it("renders each imported record once, filters magnitudes and locates its real epicenter", () => {
  const scene = new THREE.Scene(),
    update = addAtlasEarthquakes(scene, catalog.events, 1);
  const dots = scene.getObjectByName("atlas-earthquakes"),
    ring = scene.getObjectByName("atlas-selected-earthquake");
  const original = dots.geometry.attributes.position;
  expect(catalog.count).toBe(513);
  expect(new Set(catalog.events.map((event) => event.id)).size).toBe(
    catalog.count,
  );
  for (const threshold of [5.5, 6, 7]) {
    const expected = catalog.events.filter(
      (event) => event.magnitude >= threshold,
    );
    expect(update(true, threshold, expected[0].id)).toBe(expected.length);
    expect(dots.geometry.drawRange.count).toBe(expected.length);
    expected.forEach((event, i) => {
      expect(
        new THREE.Vector3()
          .fromBufferAttribute(original, i)
          .distanceTo(
            new THREE.Vector3(
              ...globePoint(event.longitude, event.latitude, 1.822),
            ),
          ),
      ).toBeLessThan(1e-6);
    });
    expect(ring.visible).toBe(true);
  }
  update(false, 7, catalog.events[0].id);
  expect(dots.visible).toBe(false);
  expect(ring.visible).toBe(false);
  expect(dots.geometry.attributes.position).toBe(original);
  expect(dots.material.depthTest).toBe(true);
});
