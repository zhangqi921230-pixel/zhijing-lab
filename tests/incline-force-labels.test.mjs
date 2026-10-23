import { expect, it } from "vitest";
import * as T from "three";
import { buildInclineBench } from "../src/InclineBench.js";
it("keeps force leader origins on arrow tips and hides absent forces without reallocating geometry", () => {
  const root = new T.Group();
  const p = { angle: 30, mass: 2, mu: 0.2, muStatic: 0.3, time: 0, forces: 1 };
  buildInclineBench(root, p);
  const labels = [0, 1, 2, 3].map((i) =>
    root.getObjectByName(`incline-force-label-${i}`),
  );
  const geometries = labels.map((g) => g.children[0].geometry);
  for (const time of [0, 0.2, 20]) {
    root.userData.update({ ...p, time });
    root.updateMatrixWorld(true);
    ["gravity", "normal", "friction", "stop-force"].forEach((name, i) => {
      const arrow = root.getObjectByName(`incline-${name}`),
        label = labels[i];
      expect(label.visible).toBe(arrow.visible);
      if (arrow.visible) {
        const tip = arrow.localToWorld(new T.Vector3(0, 1, 0));
        const leader = label.localToWorld(
          new T.Vector3().fromBufferAttribute(
            geometries[i].attributes.position,
            0,
          ),
        );
        expect(tip.distanceTo(leader)).toBeLessThan(1e-6);
      }
      expect(label.children[0].geometry).toBe(geometries[i]);
    });
  }
  root.userData.update(p);
  const version = geometries[0].attributes.position.version;
  root.userData.update({ ...p, time: 0.2 });
  expect(geometries[0].attributes.position.version).toBe(version);
  root.userData.update({ ...p, forces: 0 });
  expect(labels.every((g) => !g.visible)).toBe(true);
});
