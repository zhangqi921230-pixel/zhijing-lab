import { expect, it } from "vitest";
import * as THREE from "three";
import { addVolcanoPlume } from "../src/VolcanoPlume.js";
import { createVolcanoEjecta, ejectaGlow } from "../src/VolcanoEjecta.js";

it("keeps irregular fragments inside their collision radius and dims glow with age", () => {
  const fragments = createVolcanoEjecta(140),
    vertices = fragments.geometry.getAttribute("position"),
    point = new THREE.Vector3(),
    radii = [];
  for (let i = 0; i < vertices.count; i++) {
    point.fromBufferAttribute(vertices, i);
    radii.push(point.length());
    expect(point.length()).toBeLessThanOrEqual(0.035);
  }
  expect(Math.max(...radii) - Math.min(...radii)).toBeGreaterThan(0.006);
  expect(ejectaGlow(0)).toBe(1);
  expect(ejectaGlow(2)).toBeLessThan(ejectaGlow(1));
  expect(ejectaGlow(4)).toBeGreaterThan(0);
  expect(fragments.geometry.getAttribute("ejectaGlow").count).toBe(140);
});

it("reuses bounded buffers and reproduces the same plume when scrubbing backward", () => {
  const root = new THREE.Group(),
    update = addVolcanoPlume(root),
    p = { type: 1, intensity: 3, time: 0 };
  const cloud = root.getObjectByName("volcano-ash-plume"),
    fragments = root.getObjectByName("volcano-ejecta");
  update(p);
  expect(cloud.visible).toBe(false);
  expect(fragments.count).toBe(0);
  update({ ...p, time: 8 });
  expect(cloud.visible).toBe(true);
  expect(fragments.count).toBeGreaterThan(0);
  expect(fragments.count).toBeLessThanOrEqual(140);
  const positions = cloud.geometry.attributes.position,
    snapshot = Array.from(positions.array),
    glow = fragments.geometry.getAttribute("ejectaGlow"),
    glowSnapshot = Array.from(glow.array.slice(0, fragments.count)),
    version = positions.version;
  expect(Math.max(...glowSnapshot)).toBeGreaterThan(Math.min(...glowSnapshot));
  update({ ...p, time: 8 });
  expect(positions.version).toBe(version);
  update({ ...p, time: 17 });
  expect(cloud.visible).toBe(true);
  expect(fragments.count).toBe(0);
  update({ ...p, time: 20 });
  expect(cloud.visible).toBe(false);
  expect(fragments.count).toBe(0);
  update({ ...p, time: 8 });
  expect(Array.from(positions.array)).toEqual(snapshot);
  expect(Array.from(glow.array.slice(0, fragments.count))).toEqual(
    glowSnapshot,
  );
  expect(fragments.geometry.getAttribute("ejectaGlow")).toBe(glow);
  expect(cloud.geometry.attributes.position).toBe(positions);
  expect(root.children.length).toBe(2);
  const count = fragments.count;
  update({ ...p, time: 8, showAsh: 0, showEjecta: 0 });
  expect(cloud.visible).toBe(false);
  expect(fragments.count).toBe(0);
  update({ ...p, time: 8, showAsh: 1, showEjecta: 1 });
  expect(cloud.visible).toBe(true);
  expect(fragments.count).toBe(count);
  expect(Array.from(glow.array.slice(0, count))).toEqual(glowSnapshot);
});

it("does not show an ash column for the effusive teaching mode and keeps fade values bounded", () => {
  const root = new THREE.Group(),
    update = addVolcanoPlume(root);
  const cloud = root.getObjectByName("volcano-ash-plume");
  for (let t = 0; t <= 20; t += 0.2) {
    update({ type: 1, intensity: 5, time: t });
    for (const alpha of cloud.geometry.attributes.puffOpacity.array) {
      expect(alpha).toBeGreaterThanOrEqual(0);
      expect(alpha).toBeLessThanOrEqual(1);
    }
  }
  update({ type: 0, intensity: 5, time: 8 });
  expect(cloud.visible).toBe(false);
  expect(cloud.material.depthTest).toBe(true);
  expect(cloud.material.depthWrite).toBe(false);
});

it("skips hidden particle buffer updates and restores the current time without replaying", () => {
  const root = new THREE.Group(),
    update = addVolcanoPlume(root),
    referenceRoot = new THREE.Group(),
    referenceUpdate = addVolcanoPlume(referenceRoot),
    p = { type: 1, intensity: 3, time: 8 };
  update(p);
  const cloud = root.getObjectByName("volcano-ash-plume"),
    fragments = root.getObjectByName("volcano-ejecta"),
    attributes = [
      ...Object.values(cloud.geometry.attributes),
      fragments.instanceMatrix,
      fragments.geometry.getAttribute("ejectaGlow"),
    ],
    versions = attributes.map((a) => a.version);
  for (let time = 8.1; time <= 10; time += 0.1)
    update({ ...p, time, showAsh: 0, showEjecta: 0 });
  expect(attributes.map((a) => a.version)).toEqual(versions);
  expect(cloud.visible).toBe(false);
  expect(fragments.count).toBe(0);
  update({ ...p, time: 10, showAsh: 1, showEjecta: 1 });
  referenceUpdate({ ...p, time: 10 });
  const referenceFragments = referenceRoot.getObjectByName("volcano-ejecta");
  expect(fragments.count).toBe(referenceFragments.count);
  expect(
    Array.from(fragments.instanceMatrix.array.slice(0, fragments.count * 16)),
  ).toEqual(
    Array.from(
      referenceFragments.instanceMatrix.array.slice(0, fragments.count * 16),
    ),
  );
  expect(Array.from(cloud.geometry.attributes.position.array)).toEqual(
    Array.from(
      referenceRoot.getObjectByName("volcano-ash-plume").geometry.attributes
        .position.array,
    ),
  );
  const ashVersion = cloud.geometry.attributes.position.version;
  update({ ...p, time: 11, type: 0 });
  expect(cloud.geometry.attributes.position.version).toBe(ashVersion);
});
