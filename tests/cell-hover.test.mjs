import { expect, it } from "vitest";
import * as T from "three";
import { cellHoverAction } from "../src/CellHover.js";
import { buildCell } from "../src/CellModel.js";
import { disposeSceneResources } from "../src/disposeSceneResources.mjs";
import { firstVisibleHit } from "../src/visibleSceneHit.mjs";

it("识别细胞器及核内部件，共用点击语义且不命中隐藏结构", () => {
  const root = new T.Group();
  buildCell(root, { part: 0, cut: 100 });
  try {
    for (const name of [
      "cell-nucleus",
      "cell-nucleolus",
      "cell-chromatin",
      "nuclear-pores",
    ]) {
      const object = root.getObjectByName(name);
      expect(cellHoverAction(object).text).toBe("细胞核 · 点击放大观察结构");
      expect(object.userData.value).toBe(1);
    }
    const cristae = root.getObjectByName("mitochondrion-cristae");
    expect(cellHoverAction(cristae).text).toContain("线粒体");
    expect(cellHoverAction(cristae, 4)).toEqual({
      text: "线粒体 · 当前观察结构，拖动可旋转",
      cursor: "grab",
    });
    root.userData.setInspection(1);
    expect(firstVisibleHit([{ object: cristae }])).toBeUndefined();
    expect(cellHoverAction(root.getObjectByName("cell-rear-wall"))).toBeNull();
    expect(cellHoverAction(undefined)).toBeNull();
  } finally {
    disposeSceneResources(root);
  }
});
