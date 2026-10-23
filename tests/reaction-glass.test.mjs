import { it, expect } from "vitest";
import * as THREE from "three";
import {
  beakerSpoutPoint,
  reactionNozzleGeometry,
  reactionFunnelGeometry,
} from "../src/ReactionGlass.js";

it("倒液口不改变250mL刻度以下的有效圆柱区", () => {
  for (const y of [-0.82, 0, 0.94, 1.38])
    for (let i = 0; i < 48; i++) {
      const x = 1.025 * Math.cos((i / 48) * Math.PI * 2),
        z = 1.025 * Math.sin((i / 48) * Math.PI * 2);
      expect(beakerSpoutPoint(x, y, z)).toEqual([x, y, z]);
    }
  const tip = beakerSpoutPoint(0, 1.44, 1.05);
  expect(tip[2]).toBeCloseTo(1.22);
  expect(tip[1]).toBeGreaterThan(1.38);
  expect(beakerSpoutPoint(0, 1.44, -1.05)[2]).toBeCloseTo(-1.05);
});

it("空心漏斗保持口部开放，内壁不侵入标定液体体积", () => {
  const bottom = 2.32,
    height = 2;
  const geometry = reactionFunnelGeometry(bottom, height);
  const mesh = new THREE.Mesh(
    geometry,
    new THREE.MeshBasicMaterial({ side: THREE.DoubleSide }),
  );
  const ray = new THREE.Raycaster();
  ray.set(
    new THREE.Vector3(0, bottom + height + 1, 0),
    new THREE.Vector3(0, -1, 0),
  );
  expect(ray.intersectObject(mesh)).toHaveLength(0);
  for (let i = 1; i < 100; i++) {
    const y = bottom - 0.4 + ((height + 0.4) * i) / 100;
    ray.set(new THREE.Vector3(0, y, 0), new THREE.Vector3(1, 0, 0));
    const hits = ray.intersectObject(mesh);
    const liquidRadius =
      y < bottom ? (0.65 * (y - bottom + 0.42)) / 0.42 : 0.65;
    expect(hits.length).toBeGreaterThanOrEqual(2);
    expect(hits[0].distance).toBeGreaterThan(liquidRadius);
    expect(hits.at(-1).distance).toBeGreaterThan(hits[0].distance + 0.015);
  }
  expect([...geometry.attributes.normal.array].every(Number.isFinite)).toBe(
    true,
  );
  geometry.dispose();
  mesh.material.dispose();
});
it("滴液嘴具有贯通孔径，玻璃壁法线和坐标有限", () => {
  const geometry = reactionNozzleGeometry(),
    pos = geometry.attributes.position;
  let inner = Infinity,
    outer = 0;
  for (let i = 0; i < pos.count; i++) {
    const radius = Math.hypot(pos.getX(i), pos.getZ(i));
    expect(radius).toBeGreaterThan(0.0089);
    if (Math.abs(pos.getY(i) - 1.67) < 1e-5) {
      inner = Math.min(inner, radius);
      outer = Math.max(outer, radius);
    }
  }
  expect(inner).toBeCloseTo(0.009, 5);
  expect(outer).toBeCloseTo(0.02, 5);
  expect([...geometry.attributes.normal.array].every(Number.isFinite)).toBe(
    true,
  );
});
