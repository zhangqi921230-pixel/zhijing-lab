import { expect, it } from "vitest";
import * as THREE from "three";
import { addConicOutline } from "../src/ConicOutline.js";
import { buildConicBench } from "../src/ConicBench.js";
it("keeps dashed rim phase continuous and anchored to the ring through camera changes", () => {
  const root = new THREE.Group(),
    outline = addConicOutline(root, 1.1);
  const camera = new THREE.PerspectiveCamera();
  const back = root.getObjectByName("conic-back-outline");
  const observed = new Map();
  for (const x of [4, -4, 0]) {
    camera.position.set(x, 3, 7);
    camera.updateMatrixWorld();
    outline.update(camera, Math.tan(Math.PI / 6));
    const pos = back.geometry.attributes.position;
    const distance = back.geometry.attributes.lineDistance;
    let hasGap = false;
    for (let i = 0; i < back.geometry.drawRange.count; i += 2) {
      const a = new THREE.Vector3().fromBufferAttribute(pos, i);
      const b = new THREE.Vector3().fromBufferAttribute(pos, i + 1);
      const start = distance.getX(i),
        end = distance.getX(i + 1);
      expect(end - start).toBeCloseTo(a.distanceTo(b), 5);
      if (start % 0.13 > 0.075) hasGap = true;
      const key = a.toArray().join("/");
      if (observed.has(key)) expect(start).toBe(observed.get(key));
      observed.set(key, start);
      if (i > 0) {
        const previous = new THREE.Vector3().fromBufferAttribute(pos, i - 1);
        if (previous.distanceTo(a) < 1e-6)
          expect(start).toBeCloseTo(distance.getX(i - 1), 5);
      }
    }
    expect(hasGap).toBe(true);
  }
});
it("keeps the object silhouette when guides are hidden and hides it with the shell", () => {
  const root = new THREE.Group();
  const p = {
    alpha: 30,
    tilt: 25,
    offset: 0.45,
    showSpheres: 1,
    showGuides: 0,
    showShell: 1,
  };
  buildConicBench(root, p);
  const outline = root.getObjectByName("conic-construction-lines");
  const axis = root.getObjectByName("conic-axis-guide");
  expect(outline.visible).toBe(true);
  expect(axis.visible).toBe(false);
  root.userData.update({ ...p, showShell: 0, showGuides: 1 });
  expect(outline.visible).toBe(false);
  expect(axis.visible).toBe(true);
  expect(axis.geometry.drawRange.count).toBe(2);
});
it("uses camera-tangent generators and separates front/back rims without reallocating", () => {
  const root = new THREE.Group(),
    outline = addConicOutline(root, 1.1),
    camera = new THREE.PerspectiveCamera();
  const front = root.getObjectByName("conic-visible-outline"),
    back = root.getObjectByName("conic-back-outline");
  const buffer = front.geometry.attributes.position.array;
  for (const eye of [
    [4, 3, 7],
    [-5, 2, -3],
    [0, 8, 0],
  ]) {
    camera.position.set(...eye);
    camera.updateMatrixWorld();
    outline.update(camera, Math.tan(Math.PI / 6));
    const pos = front.geometry.attributes.position,
      cy = eye[1] - 1.1,
      k = Math.tan(Math.PI / 6);
    for (let i = 0; i < front.geometry.drawRange.count; i += 2) {
      const a = new THREE.Vector3().fromBufferAttribute(pos, i),
        b = new THREE.Vector3().fromBufferAttribute(pos, i + 1);
      expect([...a, ...b].every(Number.isFinite)).toBe(true);
      if (Math.hypot(a.x, a.y - 1.1, a.z) < 1e-6) {
        const y = b.y - 1.1;
        expect(b.x * eye[0] + b.z * eye[2] - k * k * y * cy).toBeCloseTo(0, 5);
      } else {
        const m = a.clone().add(b).multiplyScalar(0.5),
          sign = Math.sign(m.y - 1.1),
          angle = Math.atan2(m.z, m.x);
        expect(
          eye[0] * Math.cos(angle) + eye[2] * Math.sin(angle) - sign * k * cy,
        ).toBeGreaterThanOrEqual(-1e-5);
      }
    }
    expect(front.geometry.attributes.position.array).toBe(buffer);
    expect(
      front.geometry.drawRange.count + back.geometry.drawRange.count,
    ).toBeLessThanOrEqual(394);
    const version = pos.version;
    outline.update(camera, k);
    expect(pos.version).toBe(version);
  }
});
