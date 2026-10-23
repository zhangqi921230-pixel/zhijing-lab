import { describe, it, expect } from "vitest";
import * as THREE from "three";
import { pickAtlasEarthquake } from "../src/pickAtlasEarthquake.js";

describe("earthquake screen picking", () => {
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 30);
  camera.position.set(5.6, 0, 0);
  camera.lookAt(0, 0, 0);
  camera.updateMatrixWorld();
  const viewport = { width: 800, height: 800 };
  const front = { id: "front", longitude: 0, latitude: 0, magnitude: 6 };
  const back = { id: "back", longitude: 180, latitude: 0, magnitude: 8 };
  it("selects visible point and ignores a coincident rear point", () => {
    expect(
      pickAtlasEarthquake([back, front], 5.5, camera, viewport, 400, 400)?.id,
    ).toBe("front");
    expect(
      pickAtlasEarthquake([back], 5.5, camera, viewport, 400, 400),
    ).toBeNull();
  });
  it("respects filters and fixed CSS pixel target radius", () => {
    expect(
      pickAtlasEarthquake([front], 7, camera, viewport, 400, 400),
    ).toBeNull();
    expect(
      pickAtlasEarthquake([front], 5.5, camera, viewport, 408, 400)?.id,
    ).toBe("front");
    expect(
      pickAtlasEarthquake([front], 5.5, camera, viewport, 411, 400),
    ).toBeNull();
  });
});
