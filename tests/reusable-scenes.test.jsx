import { expect, it } from "vitest";
import * as THREE from "three";
import { buildScene } from "../src/ThreeScene.jsx";
import { defaults, lessons } from "../src/lessons.mjs";

it.each(["cell", "seasons", "daynight"])(
  "%s reuses prebuilt geometry and restores its object tree after updates",
  (id) => {
    const root = new THREE.Group(),
      p = defaults(lessons.find((item) => item.id === id));
    buildScene(root, id, p);
    const initial = [];
    root.traverse((object) =>
      initial.push([object, object.geometry, object.material]),
    );
    const prebuilt = new Set([
      ...initial.map((entry) => entry[1]),
      ...(root.userData.ownedGeometries ?? []),
    ]);
    for (let i = 0; i < 60; i++) {
      root.userData.update({
        ...p,
        cut: (i * 100) / 59,
        part: i % 4,
        day: i * 6,
        hour: (i * 24) / 59,
        lat: i - 30,
      });
      root.traverse((object) => {
        expect(prebuilt.has(object.geometry)).toBe(true);
      });
    }
    root.userData.update(p);
    const final = [];
    root.traverse((object) =>
      final.push([object, object.geometry, object.material]),
    );
    expect(final.length).toBe(initial.length);
    final.forEach((entry, i) =>
      entry.forEach((value, j) => expect(value).toBe(initial[i][j])),
    );
    expect(
      root.children.every((object) => Number.isFinite(object.position.x)),
    ).toBe(true);
  },
);
