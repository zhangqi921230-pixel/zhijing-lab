import { expect, it } from "vitest";
import * as THREE from "three";
import { seismicLabel } from "../src/SeismicLabel.js";
import { addSeismicDepthGuide } from "../src/SeismicDepthGuide.js";
import { SEISMIC_SCALE } from "../src/SeismicSection.js";

it("measures vertical focal depth and reuses the ruler when time alone changes", () => {
  const root = new THREE.Group(),
    update = addSeismicDepthGuide(root);
  const guide = root.getObjectByName("seismic-depth-guide"),
    attr = guide.children[0].geometry.attributes.position,
    label = guide.children[1];
  for (const depth of [5, 15, 30]) {
    update(depth);
    expect(attr.getY(0)).toBe(0);
    expect(attr.getY(1)).toBeCloseTo(-depth * SEISMIC_SCALE);
    expect(label.position.y).toBeCloseTo((-depth * SEISMIC_SCALE) / 2);
    expect(label.userData.text).toBe(`h = ${depth} km`);
    const version = attr.version;
    update(depth);
    expect(attr.version).toBe(version);
  }
});

it("keeps seismic captions at a readable CSS height while retaining rock occlusion", () => {
  const root = new THREE.Group(),
    label = seismicLabel(root, "震源", [0, 0, 0]);
  for (const height of [360, 720, 1080])
    for (const fov of [35, 60]) {
      const camera = new THREE.PerspectiveCamera(fov, 1.5, 0.1, 100);
      camera.position.z = 15;
      label.onBeforeRender(
        { getSize: (v) => v.set(height * 1.5, height) },
        null,
        camera,
      );
      const pixelHeight =
        (label.scale.y * camera.projectionMatrix.elements[5] * height) / 2;
      expect(pixelHeight).toBeCloseTo(24);
    }
  expect(label.isSprite).toBe(true);
  expect(label.material.sizeAttenuation).toBe(false);
  expect(label.material.depthTest).toBe(true);
  expect(label.material.depthWrite).toBe(false);
});
