// @vitest-environment jsdom
import { expect, it, vi } from "vitest";
import * as T from "three";
import { buildGlassLab } from "../src/GlassLab.js";
import { drawBalanceDisplay } from "../src/BalanceDisplay.js";
vi.mock("../src/BalanceDisplay.js", async (importOriginal) => {
  const original = await importOriginal();
  return { drawBalanceDisplay: vi.fn(original.drawBalanceDisplay) };
});

it("displays net solution mass and avoids refreshing textures for view-only changes", () => {
  const text = [];
  drawBalanceDisplay.mockClear();
  const context = new Proxy(
    {
      fillText: (value) => text.push(value),
      createLinearGradient: () => ({ addColorStop() {} }),
    },
    { get: (o, k) => o[k] ?? (() => {}), set: (o, k, v) => ((o[k] = v), true) },
  );
  const spy = vi
    .spyOn(HTMLCanvasElement.prototype, "getContext")
    .mockReturnValue(context);
  try {
    const root = new T.Group(),
      p = { solute: 10, water: 90, add: 100 };
    buildGlassLab(root, "dilution", p);
    expect(drawBalanceDisplay.mock.calls.map((call) => call[1])).toEqual([
      100, 200,
    ]);
    const textures = [];
    root.traverse((o) => {
      if (o.userData.dynamicDisplay && o.name !== "water-valve-status")
        textures.push(o.userData.ownedTexture);
    });
    const versions = textures.map((t) => t.version);
    expect(textures).toHaveLength(2);
    root.userData.update({ ...p, resetView: 1 });
    expect(textures.map((t) => t.version)).toEqual(versions);
    root.userData.update({ ...p, add: 300 });
    expect(drawBalanceDisplay.mock.calls.map((call) => call[1])).toEqual([
      100, 200, 400,
    ]);
    expect(textures.map((t) => t.version)).toEqual([
      versions[0],
      versions[1] + 1,
    ]);
    root.updateMatrixWorld(true);
    const feet = root.getObjectByName("glass-table-feet");
    const bounds = new T.Box3().setFromObject(feet);
    expect(bounds.min.y).toBeCloseTo(-1.45);
    expect(bounds.max.y).toBeCloseTo(-1.035);
  } finally {
    spy.mockRestore();
  }
});
