// @vitest-environment jsdom
import { it, expect, vi } from "vitest";
import * as THREE from "three";
import { addTemperatureProbe } from "../src/TemperatureProbe.js";
import { drawTemperatureDisplay } from "../src/TemperatureDisplay.js";
vi.mock("../src/TemperatureDisplay.js", async (importOriginal) => ({
  ...(await importOriginal()),
  drawTemperatureDisplay: vi.fn(
    (await importOriginal()).drawTemperatureDisplay,
  ),
}));

it("redraws the LCD only when its one-decimal reading changes", () => {
  const calls = [];
  const context = new Proxy(
    {
      createLinearGradient: () => ({ addColorStop() {} }),
      fillText: (value) => calls.push(value),
    },
    { get: (o, k) => o[k] ?? (() => {}), set: (o, k, v) => ((o[k] = v), true) },
  );
  const spy = vi
    .spyOn(HTMLCanvasElement.prototype, "getContext")
    .mockReturnValue(context);
  drawTemperatureDisplay.mockClear();
  try {
    const root = new THREE.Group(),
      update = addTemperatureProbe(root);
    update({ temp: 20 });
    const display = root.getObjectByName("solution-temperature-display");
    const texture = display.userData.ownedTexture,
      version = texture.version;
    update({ temp: 20.01 });
    expect(texture.version).toBe(version);
    update({ temp: 20.1 });
    expect(texture.version).toBe(version + 1);
    expect(drawTemperatureDisplay.mock.calls.map((call) => call[1])).toEqual([
      20, 20.1,
    ]);
    expect(calls).toContain("°C");
    expect(calls).toContain("平衡状态示意");
  } finally {
    spy.mockRestore();
  }
});
