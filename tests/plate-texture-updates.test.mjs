// @vitest-environment jsdom
import { it, expect, vi } from "vitest";
import * as T from "three";
import { buildPlateScene } from "../src/PlateScene.js";
import { disposeSceneResources } from "../src/disposeSceneResources.mjs";
it("plate animation does not reupload the unchanged legend texture", () => {
  const context = new Proxy(
    {},
    { get: (o, k) => o[k] ?? (() => {}), set: (o, k, v) => ((o[k] = v), true) },
  );
  const spy = vi
    .spyOn(HTMLCanvasElement.prototype, "getContext")
    .mockReturnValue(context);
  const root = new T.Group();
  try {
    buildPlateScene(root, { type: 0, progress: 0 });
    const display = root.children.find((o) => o.userData.dynamicDisplay),
      texture = display.userData.ownedTexture,
      version = texture.version;
    for (const progress of [10, 30, 70, 100])
      root.userData.update({ type: 0, progress });
    expect(texture.version).toBe(version);
    root.userData.update({ type: 1, progress: 100 });
    expect(texture.version).toBe(version + 1);
  } finally {
    disposeSceneResources(root);
    spy.mockRestore();
  }
});
