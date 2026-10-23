// @vitest-environment jsdom
import { it, expect, vi } from "vitest";
import * as T from "three";
import { addOpticalApparatusLabels } from "../src/OpticalApparatusLabels.js";
import { disposeSceneResources } from "../src/disposeSceneResources.mjs";

it("apparatus labels follow carriers, toggle independently and reuse their textures", () => {
  const context = new Proxy({}, { get: () => () => {} });
  const spy = vi
    .spyOn(HTMLCanvasElement.prototype, "getContext")
    .mockReturnValue(context);
  try {
    const root = new T.Group();
    const carriers = [new T.Group(), new T.Group(), new T.Group()];
    carriers.forEach((carrier) => root.add(carrier));
    const update = addOpticalApparatusLabels(carriers);
    const labels = carriers.map((carrier) => carrier.children[0].children[0]);
    const versions = labels.map((label) => label.material.map.version);
    const releases = labels.map((label) =>
      vi.spyOn(label.material.map, "dispose"),
    );
    for (const distance of [0.275, 1.65, 3.3]) {
      carriers[0].position.x = -distance;
      carriers[2].position.x = distance;
      root.updateMatrixWorld(true);
      expect(labels[0].getWorldPosition(new T.Vector3()).x).toBeCloseTo(
        -distance,
      );
      expect(labels[2].getWorldPosition(new T.Vector3()).x).toBeCloseTo(
        distance,
      );
      for (let frame = 0; frame < 60; frame++) update({ rays: 0, light: 0 });
      expect(labels.map((label) => label.material.map.version)).toEqual(
        versions,
      );
      expect(carriers.every((carrier) => carrier.children[0].visible)).toBe(
        true,
      );
    }
    update({ apparatusLabels: 0, rays: 1, light: 1 });
    expect(carriers.every((carrier) => !carrier.children[0].visible)).toBe(
      true,
    );
    disposeSceneResources(root);
    releases.forEach((release) => expect(release).toHaveBeenCalledTimes(1));
  } finally {
    spy.mockRestore();
  }
});
