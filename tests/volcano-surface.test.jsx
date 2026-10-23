import { expect, it } from "vitest";
import * as THREE from "three";
import {
  volcanoPoint,
  volcanoShell,
  volcanoCutFace,
  volcanoLava,
} from "../src/VolcanoSurface.js";
import { buildScene } from "../src/ThreeScene.jsx";

it("shares the cut boundary with the relief and closes the angular seam", () => {
  for (const angle of [0.15 * Math.PI, 1.7 * Math.PI]) {
    const face = volcanoCutFace(angle).getAttribute("position");
    for (let i = 0; i <= 80; i++) {
      const point = volcanoPoint(0.16 + (2.94 * i) / 80, angle);
      expect(
        new THREE.Vector3().fromBufferAttribute(face, i * 2).distanceTo(point),
      ).toBeLessThan(1e-6);
      expect(
        volcanoPoint(0.16 + (2.94 * i) / 80, angle + Math.PI * 2).distanceTo(
          point,
        ),
      ).toBeLessThan(1e-10);
    }
  }
  const shell = volcanoShell(0, Math.PI * 2),
    normals = shell.getAttribute("normal");
  for (let i = 0; i < normals.count; i++)
    expect(normals.getY(i)).toBeGreaterThan(0);
});

it("places lava vertices on the same relief and reveals them progressively without reallocating", () => {
  const angle = 1,
    geometry = volcanoLava(angle),
    positions = geometry.getAttribute("position");
  for (let i = 0; i <= 96; i++)
    for (let j = 0; j < 5; j++) {
      const r = 0.7 + (2.35 * i) / 96,
        center = angle + Math.sin(i * 0.08) * 0.025,
        width = 0.052 * (1 + 0.22 * Math.sin(i * 0.19));
      const p = volcanoPoint(r, center + (j - 2) * width);
      p.y += 0.045;
      expect(
        new THREE.Vector3()
          .fromBufferAttribute(positions, i * 5 + j)
          .distanceTo(p),
      ).toBeLessThan(1e-6);
    }
  const root = new THREE.Group(),
    p = { type: 0, intensity: 3, cut: 0, time: 0 };
  buildScene(root, "volcano", p);
  const flow = root.getObjectByName("volcano-lava-ribbon"),
    original = flow.geometry;
  root.userData.update({ ...p, time: 3 });
  expect(flow.geometry.drawRange.count).toBe(0);
  const shader = {
    uniforms: {},
    vertexShader: "#include <begin_vertex>",
    fragmentShader:
      "#include <color_fragment>\n#include <emissivemap_fragment>",
  };
  flow.material.onBeforeCompile(shader);
  root.userData.update({ ...p, time: 3.01 });
  expect(flow.geometry.drawRange.count).toBe(24);
  expect(shader.uniforms.lavaFront.value).toBeCloseTo(0.01 / 6, 10);
  root.userData.update({ ...p, time: 3.02 });
  expect(flow.geometry.drawRange.count).toBe(24);
  expect(shader.uniforms.lavaFront.value).toBeCloseTo(0.02 / 6, 10);
  root.userData.update({ ...p, time: 6 });
  expect(flow.geometry.drawRange.count).toBe((96 * 24) / 2);
  root.userData.update({ ...p, time: 10 });
  expect(flow.geometry.drawRange.count).toBe(flow.geometry.index.count);
  expect(flow.geometry).toBe(original);
  root.userData.update({ ...p, time: 10, showLava: 0 });
  expect(flow.visible).toBe(false);
  root.userData.update({ ...p, time: 10, showLava: 1 });
  expect(flow.visible).toBe(true);
  const slopeDebris = root.getObjectByName("volcano-slope-debris"),
    cutDebris = root.getObjectByName("volcano-cutaway-debris");
  expect(slopeDebris.count + cutDebris.count).toBeGreaterThan(350);
  expect(slopeDebris.count + cutDebris.count).toBeLessThanOrEqual(520);
  expect(slopeDebris.geometry).toBe(cutDebris.geometry);
  const rockPosition = new THREE.Vector3(),
    rockScale = new THREE.Vector3(),
    rockRotation = new THREE.Quaternion(),
    rockMatrix = new THREE.Matrix4(),
    elevations = [],
    sizes = [];
  for (const batch of [slopeDebris, cutDebris])
    for (let i = 0; i < batch.count; i++) {
      batch.getMatrixAt(i, rockMatrix);
      rockMatrix.decompose(rockPosition, rockRotation, rockScale);
      elevations.push(rockPosition.y);
      sizes.push(rockScale.y);
      const normal = new THREE.Vector3(0, 1, 0).applyQuaternion(rockRotation);
      expect(normal.y).toBeGreaterThan(0);
      expect(
        normal.dot(new THREE.Vector3(rockPosition.x, 0, rockPosition.z)),
      ).toBeGreaterThan(0);
    }
  expect(elevations.filter((y) => y > 0.6).length).toBeGreaterThan(20);
  expect(elevations.filter((y) => y < 0).length).toBeGreaterThan(100);
  expect(Math.max(...sizes) / Math.min(...sizes)).toBeGreaterThan(4);
  root.userData.update({ ...p, cut: 1, time: 10 });
  expect(cutDebris.visible).toBe(false);
  expect(slopeDebris.visible).toBe(true);
  root.userData.update({ ...p, cut: 0, time: 10 });
  expect(cutDebris.visible).toBe(true);
  const annotations = root.getObjectByName("volcano-structure-labels");
  expect(annotations.visible).toBe(false);
  root.userData.update({ ...p, cut: 1, labels: 1, time: 10 });
  expect(annotations.visible).toBe(true);
  expect(annotations.children.filter((o) => o.isLine).length).toBe(3);
  annotations.traverse((o) => {
    if (o.material) expect(o.material.depthTest).toBe(true);
  });
  root.userData.update({ ...p, cut: 1, labels: 0, time: 10 });
  expect(annotations.visible).toBe(false);
  expect(root.getObjectByName("volcano-structure-labels")).toBe(annotations);
});
