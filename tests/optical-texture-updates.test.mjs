// @vitest-environment jsdom
import { it, expect, vi } from "vitest";
import * as T from "three";
import { buildOpticalBench } from "../src/OpticalBench.js";

it("visibility reuses screen texture and ray data, while each optical variable refreshes them", () => {
  const paintedAlpha = [];
  const context = new Proxy(
    {
      fill() {
        paintedAlpha.push(this.globalAlpha);
      },
    },
    { get: (o, k) => o[k] ?? (() => {}), set: (o, k, v) => ((o[k] = v), true) },
  );
  const spy = vi
    .spyOn(HTMLCanvasElement.prototype, "getContext")
    .mockReturnValue(context);
  try {
    const root = new T.Group();
    let p = { u: 6, f: 10, screen: 15, rays: 0 };
    buildOpticalBench(root, p);
    const face = root
      .getObjectByName("optical-screen")
      .children.find((o) => o.userData.ownedTexture);
    const texture = face.userData.ownedTexture;
    const ray = root.getObjectByName("optical-virtual-extension-0");
    const position = ray.geometry.attributes.position;
    const initial = { texture: texture.version, position: position.version };
    p = { ...p, rays: 1 };
    root.userData.update(p);
    expect(ray.visible).toBe(true);
    expect(position.array[3]).toBeCloseTo(-0.825, 5);
    root.userData.update({ ...p, rays: 0, resetView: 7 });
    expect(ray.visible).toBe(false);
    expect(texture.version).toBe(initial.texture);
    expect(position.version).toBe(initial.position);
    root.userData.update({ ...p, heightLock: 1 });
    expect(root.getObjectByName("optical-height-grip").userData.value).toBe(0);
    expect(
      root.getObjectByName("optical-height-grip-ribs").userData.value,
    ).toBe(0);
    expect(texture.version).toBe(initial.texture);
    for (const change of [
      { u: 7 },
      { f: 12 },
      { screen: 18 },
      { sourceOffset: 2 },
    ]) {
      const before = texture.version;
      p = { ...p, ...change };
      root.userData.update(p);
      expect(texture.version).toBe(before + 1);
      expect(face.userData.ownedTexture).toBe(texture);
    }
    const beforePower = texture.version;
    root.userData.update({ ...p, light: 0 });
    expect(texture.version).toBe(beforePower + 1);
    expect(root.userData.optics.illuminated).toBe(false);
    expect(root.getObjectByName("optical-power-switch").userData.value).toBe(1);
    expect(
      root.getObjectByName("optical-power-indicator").material
        .emissiveIntensity,
    ).toBe(0);
    expect(ray.visible).toBe(false);
    expect(paintedAlpha.at(-1)).toBe(0);
    root.userData.update({ ...p, light: 1 });
    expect(texture.version).toBe(beforePower + 2);
    expect(root.userData.optics.illuminated).toBe(true);
    expect(root.getObjectByName("optical-power-switch").userData.value).toBe(0);
    expect(
      root.getObjectByName("optical-power-indicator").material
        .emissiveIntensity,
    ).toBeGreaterThan(0);
    expect(ray.visible).toBe(true);
    expect(paintedAlpha.at(-1)).toBeGreaterThan(0);
  } finally {
    spy.mockRestore();
  }
});
