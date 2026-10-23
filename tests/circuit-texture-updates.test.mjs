// @vitest-environment jsdom
import { expect, it, vi } from "vitest";
import * as T from "three";
import { buildCircuitBench } from "../src/CircuitBench.js";

it("keeps meter textures across view changes and refreshes readings for voltage, resistance and switching", () => {
  const context = new Proxy(
    {},
    { get: (o, k) => o[k] ?? (() => {}), set: (o, k, v) => ((o[k] = v), true) },
  );
  const spy = vi
    .spyOn(HTMLCanvasElement.prototype, "getContext")
    .mockReturnValue(context);
  try {
    const root = new T.Group(),
      p = { u: 6, r: 20, closed: 0 };
    buildCircuitBench(root, p);
    const textures = [];
    root.traverse((o) => {
      if (o.userData.dynamicDisplay) textures.push(o.userData.ownedTexture);
    });
    expect(textures).toHaveLength(4);
    const initial = textures.map((t) => t.version);
    root.userData.update({ ...p, resetView: 3 });
    expect(textures.map((t) => t.version)).toEqual(initial);
    for (const change of [{ closed: 1 }, { u: 9 }, { r: 30 }]) {
      const before = textures.map((t) => t.version);
      Object.assign(p, change);
      root.userData.update(p);
      expect(textures.map((t) => t.version)).toEqual(before.map((v) => v + 1));
    }
  } finally {
    spy.mockRestore();
  }
});
