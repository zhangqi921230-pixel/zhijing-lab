import { it, expect } from "vitest";
import * as THREE from "three";
import {
  createEcologySpecimens,
  createButterflyTemplate,
} from "../src/EcologySpecimens.js";
import {
  HABITAT_POND,
  habitatHeight,
  habitatSites,
} from "../src/ecologyHabitat.mjs";
import { buildScene } from "../src/ThreeScene.jsx";
import { createEcologyBirdTemplate } from "../src/EcologyBird.js";
import { disposeSceneResources } from "../src/disposeSceneResources.mjs";

it("keeps the complete butterfly meshes above the swaying plant canopy", () => {
  const root = new THREE.Group();
  const p = { plants: 20, insects: 20, birds: 4, fungi: 15, time: 0 };
  buildScene(root, "biodiversity", p);
  const plants = root.children.filter((o) => o.name === "sample-plant");
  const insects = root.children.filter((o) => o.name === "sample-insect");
  const bounds = new THREE.Box3();
  for (let time = 0; time <= 20; time += 0.5) {
    root.userData.update({ ...p, time });
    root.updateMatrixWorld(true);
    let canopy = -Infinity;
    for (const plant of plants)
      canopy = Math.max(canopy, bounds.setFromObject(plant).max.y);
    for (const insect of insects)
      expect(bounds.setFromObject(insect).min.y).toBeGreaterThan(canopy);
  }
  disposeSceneResources(root);
});

it("shares fine insect structures and releases owned ecology textures once", () => {
  const makeButterfly = createButterflyTemplate();
  const specimens = createEcologySpecimens();
  const root = new THREE.Group();
  const a = makeButterfly(),
    b = makeButterfly();
  root.add(a, b, specimens.fungus(), specimens.fungus());
  for (const name of [
    "butterfly-eyes-and-antenna-tips",
    "butterfly-coiled-proboscis",
  ])
    expect(a.getObjectByName(name).geometry).toBe(
      b.getObjectByName(name).geometry,
    );
  const textures = new Set();
  root.traverse((o) => {
    if (o.userData.ownedTexture) textures.add(o.userData.ownedTexture);
  });
  expect(textures.size).toBe(3);
  let disposed = 0;
  textures.forEach((texture) =>
    texture.addEventListener("dispose", () => disposed++),
  );
  expect(disposeSceneResources(root).textures).toBe(3);
  expect(disposed).toBe(3);
});

it("shares bird feather meshes while shoulder animation stays independent", () => {
  const makeBird = createEcologyBirdTemplate(),
    a = makeBird(),
    b = makeBird();
  expect(a.getObjectByName("tail-feathers").geometry).toBe(
    b.getObjectByName("tail-feathers").geometry,
  );
  const wings = a.children.filter((o) => o.userData.wing);
  const other = b.children.filter((o) => o.userData.wing);
  expect(wings).toHaveLength(2);
  const shoulder = wings[0].position.clone();
  wings[0].rotation.z = 0.6;
  expect(wings[0].position.equals(shoulder)).toBe(true);
  expect(other[0].rotation.z).toBe(0);
  expect(wings[0].children[0].geometry).toBe(other[0].children[0].geometry);
});

it("places all terrestrial samples outside the pond and gives the water a submerged bed and dry rim", () => {
  const sites = habitatSites();
  expect(sites).toHaveLength(35);
  expect(habitatSites()).toEqual(sites);
  for (let i = 0; i < sites.length; i++) {
    const { x, z } = sites[i];
    expect(
      Math.hypot(x - HABITAT_POND.x, z - HABITAT_POND.z),
    ).toBeGreaterThanOrEqual(1);
    for (let j = 0; j < i; j++)
      expect(Math.hypot(x - sites[j].x, z - sites[j].z)).toBeGreaterThanOrEqual(
        0.48,
      );
  }
  expect(habitatHeight(HABITAT_POND.x, HABITAT_POND.z)).toBeLessThan(
    HABITAT_POND.level,
  );
  for (let i = 0; i < 32; i++) {
    const a = (i * Math.PI) / 16;
    expect(
      habitatHeight(
        HABITAT_POND.x + 0.85 * Math.cos(a),
        HABITAT_POND.z + 0.85 * Math.sin(a),
      ),
    ).toBeGreaterThan(HABITAT_POND.level);
  }
});
it("shares specimen geometry without sharing animated wing transforms", () => {
  const specimens = createEcologySpecimens(),
    a = specimens.plant(),
    b = specimens.plant();
  a.children.forEach((o, i) => expect(o.geometry).toBe(b.children[i].geometry));
  const butterfly = createButterflyTemplate(),
    x = butterfly(),
    y = butterfly();
  const wings = x.children.filter((o) => o.userData.wing),
    other = y.children.filter((o) => o.userData.wing);
  expect(wings).toHaveLength(2);
  expect(wings[0].children[0].geometry).toBe(other[0].children[0].geometry);
  wings[0].rotation.z = 1;
  expect(other[0].rotation.z).toBe(0);
});
it("points each bird along its flight tangent at changing simulation times", () => {
  const root = new THREE.Group(),
    p = { plants: 12, insects: 8, birds: 4, fungi: 6, time: 0 };
  buildScene(root, "biodiversity", p);
  for (const time of [0, 2, 8]) {
    root.userData.update({ ...p, time });
    root.children
      .filter((o) => o.name === "sample-bird")
      .forEach((bird, i) => {
        const a = time * 0.25 + i * 1.6;
        const tangent = new THREE.Vector3(
          -2.9 * Math.sin(a),
          0,
          1.7 * Math.cos(a),
        ).normalize();
        expect(
          new THREE.Vector3(0, 0, 1)
            .applyQuaternion(bird.quaternion)
            .dot(tangent),
        ).toBeCloseTo(1, 10);
      });
  }
});

it("orients butterflies along their 3D flight tangent and replays poses deterministically", () => {
  const root = new THREE.Group();
  const p = { plants: 12, insects: 20, birds: 4, fungi: 6, time: 0 };
  buildScene(root, "biodiversity", p);
  const butterflies = root.children.filter((o) => o.name === "sample-insect");
  let saved;
  for (const time of [0, 2, 8, 20, 2]) {
    root.userData.update({ ...p, time });
    butterflies.forEach((bug, i) => {
      const tangent = new THREE.Vector3(
        1.12 * Math.cos(time * 0.4 + i * 2),
        0.126 * Math.cos(time * 0.7 + i),
        -0.57 * Math.sin(time * 0.3 + i),
      ).normalize();
      expect(
        new THREE.Vector3(0, 0, 1).applyQuaternion(bug.quaternion).dot(tangent),
      ).toBeCloseTo(1, 10);
      const wings = bug.children.filter((o) => o.userData.wing);
      expect(wings[0].rotation.z).toBeCloseTo(-wings[1].rotation.z, 10);
    });
    if (time === 2) {
      const poses = butterflies.map((bug) => [
        ...bug.position.toArray(),
        ...bug.quaternion.toArray(),
      ]);
      if (saved) expect(poses).toEqual(saved);
      saved = poses;
    }
  }
});
