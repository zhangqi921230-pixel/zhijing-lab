// @vitest-environment jsdom
import { expect, it, vi } from "vitest";
import * as T from "three";
import { buildCell } from "../src/CellModel.js";
import { disposeSceneResources } from "../src/disposeSceneResources.mjs";

it("keeps rendered text and leader lines together across membrane layers, views and label toggles", () => {
  // Canvas drawing is stubbed; unlike Node-only tests this constructs the Sprite
  // and CanvasTexture objects that exist in the browser. It is not a GPU test.
  const context = new Proxy(
    {},
    {
      get: (object, key) => object[key] ?? (() => {}),
      set: (object, key, value) => ((object[key] = value), true),
    },
  );
  const mock = vi
    .spyOn(HTMLCanvasElement.prototype, "getContext")
    .mockReturnValue(context);
  const root = new T.Group();
  try {
    buildCell(root, { part: 4, cut: 100, labels: 1 });
    root.userData.setInspection(4);
    const labels = root.getObjectByName("mitochondrion-labels");
    const expectedNames = [
      "外膜",
      "内膜",
      "嵴 · 内膜褶皱",
      "基质",
      "线粒体 DNA",
      "核糖体 · 放大示意",
      "ATP 合酶 · 放大示意",
    ];
    expect(
      labels.children
        .filter((o) => o.isSprite)
        .map((o) => o.name)
        .sort(),
    ).toEqual([...expectedNames].sort());
    const textures = labels.children
      .filter((o) => o.isSprite)
      .map((o) => o.material.map);
    const versions = textures.map((t) => t.version);
    for (const mode of [0, 1, 2, 3, 0]) {
      for (const cellAngle of [0, 2, 1, 0]) {
        root.userData.update({
          part: 4,
          cut: 100,
          labels: 1,
          mitochondrionMode: mode,
          cellAngle,
        });
        for (const name of expectedNames) {
          const pair = labels.children.filter((o) => o.name === name);
          expect(pair).toHaveLength(2);
          const expected =
            mode === 3
              ? ["内膜", "基质", "线粒体 DNA", "核糖体 · 放大示意"].includes(
                  name,
                )
              : name !== "核糖体 · 放大示意" &&
                (mode === 0 ||
                  (mode === 1
                    ? name !== "外膜"
                    : ["外膜", "内膜"].includes(name)));
          expect(pair.every((o) => o.visible === expected)).toBe(true);
          const line = pair.find((o) => o.isLine),
            sprite = pair.find((o) => o.isSprite);
          expect(
            new T.Vector3()
              .fromBufferAttribute(line.geometry.attributes.position, 1)
              .distanceTo(sprite.position),
          ).toBeLessThan(1e-7);
        }
        expect(textures.map((t) => t.version)).toEqual(versions);
      }
    }
    root.userData.update({ part: 4, cut: 100, labels: 0 });
    expect(labels.visible).toBe(false);
    const visible = [];
    root.traverseVisible((o) => {
      if (o.isSprite) visible.push(o);
    });
    expect(visible).toHaveLength(0);
    for (const part of [1, 2, 3, 4, 5, 6]) {
      root.userData.setInspection(part);
      for (const cellAngle of [0, 2, 1]) {
        root.userData.update({ part, cut: 100, labels: 1, cellAngle });
        const sprites = [];
        root.traverseVisible((o) => {
          if (o.isSprite) sprites.push(o);
        });
        expect(sprites.length).toBeGreaterThan(0);
        for (const sprite of sprites) {
          const line = sprite.parent.children.find(
            (o) => o.isLine && o.name === sprite.name,
          );
          expect(line, `missing leader for ${sprite.name}`).toBeDefined();
          expect(line.visible).toBe(true);
          expect(
            new T.Vector3()
              .fromBufferAttribute(line.geometry.attributes.position, 1)
              .distanceTo(sprite.position),
          ).toBeLessThan(1e-6);
        }
      }
    }
    const spies = textures.map((t) => vi.spyOn(t, "dispose"));
    disposeSceneResources(root);
    for (const spy of spies) expect(spy).toHaveBeenCalledTimes(1);
  } finally {
    mock.mockRestore();
  }
});
