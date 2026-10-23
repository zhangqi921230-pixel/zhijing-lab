import { expect, it } from "vitest";
import * as T from "three";
import { buildScene } from "../src/ThreeScene.jsx";
import { molecules, moleculeGeometry } from "../src/moleculeGeometry.mjs";
import { lonePairDirections } from "../src/MoleculeLonePairs.js";
import { disposeSceneResources } from "../src/disposeSceneResources.mjs";

it("shows only central lone pairs opposite bonding directions and reuses geometry on toggles", () => {
  for (let type = 0; type < 4; type++) {
    const root = new T.Group();
    const p = { type, spread: 1, lonePairs: 1, ensemble: 0 };
    buildScene(root, "molecule", p);
    const group = root.getObjectByName("molecule-lone-pairs");
    expect(group.children).toHaveLength(molecules[type].pairs);
    const directions = lonePairDirections(type);
    const bonds = moleculeGeometry(type)
      .points.slice(1)
      .map((point) => new T.Vector3(...point).normalize());
    for (const direction of directions) {
      const axis = new T.Vector3(...direction);
      expect(axis.length()).toBeCloseTo(1, 12);
      for (const bond of bonds) expect(axis.dot(bond)).toBeLessThan(0);
    }
    const geometry = group.children[0]?.children[0].geometry;
    for (const q of [{ ...p, lonePairs: 0 }, { ...p, ensemble: 1 }, p]) {
      root.userData.update(q);
      expect(group.visible).toBe(q.lonePairs === 1 && !q.ensemble);
      expect(group.children[0]?.children[0].geometry).toBe(geometry);
    }
    disposeSceneResources(root);
  }
});

it("keeps central atom labels outside lone-pair lobes with leaders attached to the atom", () => {
  for (const type of [0, 3])
    for (const spread of [0.8, 1, 1.4]) {
      const root = new T.Group();
      const p = { type, spread, lonePairs: 1, ensemble: 0, annotations: 1 };
      buildScene(root, "molecule", p);
      const label = root.getObjectByName("molecule-atom-label-0");
      const leader = root.getObjectByName("molecule-central-atom-leader");
      const positions = leader.geometry.attributes.position;
      const start = new T.Vector3().fromBufferAttribute(positions, 0);
      const end = new T.Vector3().fromBufferAttribute(positions, 1);
      expect(start.length()).toBeCloseTo(0.57, 6);
      expect(end.distanceTo(label.position)).toBeCloseTo(0.19, 6);
      for (const time of [0, 3, 10]) {
        root.userData.update({ ...p, time });
        root.updateMatrixWorld(true);
        for (const pair of root.getObjectByName("molecule-lone-pairs")
          .children) {
          const lobe = pair.children[0];
          const labelInLobe = lobe.worldToLocal(
            label.getWorldPosition(new T.Vector3()),
          );
          expect(labelInLobe.length()).toBeGreaterThan(1.2);
        }
      }
      root.userData.update({ ...p, annotations: 0 });
      expect(label.parent.visible).toBe(false);
      expect(leader.parent).toBe(label.parent);
      disposeSceneResources(root);
    }
});
