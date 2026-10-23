import { expect, it } from "vitest";
import * as THREE from "three";
import { earthquakeDepthBand, depthBands } from "../src/earthquakeDepth.mjs";
import { addAtlasEarthquakes } from "../src/AtlasEarthquakes.js";
it("classifies boundary depths without overlap", () => {
  expect([-1, 0, 69.99, 70, 300, 300.01, 650].map(earthquakeDepthBand)).toEqual(
    [0, 0, 0, 1, 1, 2, 2],
  );
});
it("changes colors without changing location, selection, or allocating geometry", () => {
  const scene = new THREE.Scene();
  const events = [10, 100, 500].map((depthKm, i) => ({
    id: String(i),
    longitude: i * 10,
    latitude: 0,
    magnitude: 6,
    depthKm,
  }));
  const update = addAtlasEarthquakes(scene, events, 1);
  const dots = scene.getObjectByName("atlas-earthquakes");
  update(true, 5.5, "1", false);
  const before = Array.from(dots.geometry.attributes.position.array),
    colors = dots.geometry.attributes.eventColor;
  update(true, 5.5, "1", true);
  expect(Array.from(dots.geometry.attributes.position.array)).toEqual(before);
  depthBands.forEach((band, i) => {
    const color = new THREE.Color(band.color);
    expect(colors.getX(i)).toBeCloseTo(color.r, 6);
    expect(colors.getY(i)).toBeCloseTo(color.g, 6);
    expect(colors.getZ(i)).toBeCloseTo(color.b, 6);
  });
  expect(scene.getObjectByName("atlas-selected-earthquake").visible).toBe(true);
  update(true, 5.5, "1", false);
  expect(dots.geometry.attributes.eventColor).toBe(colors);
  expect(colors.getX(0)).toBe(colors.getX(2));
});
