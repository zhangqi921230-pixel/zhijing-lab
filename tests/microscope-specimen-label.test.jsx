// @vitest-environment jsdom
import { it, expect, vi } from "vitest";
import * as T from "three";
import { microscopeSpecimenMark } from "../src/MicroscopeDetails.js";
import { disposeSceneResources } from "../src/disposeSceneResources.mjs";

it("slide identification follows specimen changes without per-frame texture uploads", () => {
  const text = vi.fn();
  const context = new Proxy(
    { fillText: text },
    {
      get: (target, key) => target[key] ?? (() => {}),
    },
  );
  const spy = vi
    .spyOn(HTMLCanvasElement.prototype, "getContext")
    .mockReturnValue(context);
  const slide = new T.Group();
  const update = microscopeSpecimenMark(slide);
  const label = slide.getObjectByName("microscope-specimen-label");
  const texture = label.material.map;
  const geometry = label.geometry;
  for (const [specimen, title] of [
    [0, "字母 e"],
    [1, "洋葱表皮"],
    [2, "池塘水样"],
    [0, "字母 e"],
  ]) {
    text.mockClear();
    const version = texture.version;
    update(specimen);
    expect(text).toHaveBeenCalledWith(title, 16, 70);
    expect(texture.version).toBe(version + 1);
    for (let frame = 0; frame < 60; frame++) update(specimen);
    expect(texture.version).toBe(version + 1);
    expect(label.geometry).toBe(geometry);
    expect(label.material.map).toBe(texture);
  }
  slide.updateMatrixWorld(true);
  const bounds = new T.Box3().setFromObject(label);
  expect(bounds.min.x).toBeCloseTo(-0.52);
  expect(bounds.max.x).toBeCloseTo(-0.34);
  expect(bounds.min.z).toBeCloseTo(-0.18);
  expect(bounds.max.z).toBeCloseTo(0.18);
  expect(bounds.min.y).toBeGreaterThan(0.018);
  const release = vi.spyOn(texture, "dispose");
  disposeSceneResources(slide);
  expect(release).toHaveBeenCalledTimes(1);
  spy.mockRestore();
});
