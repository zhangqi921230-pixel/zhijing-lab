import { expect, it } from "vitest";
import {
  lavaCooling,
  createVolcanoLavaMaterial,
} from "../src/VolcanoLavaMaterial.js";
import { volcanoLava } from "../src/VolcanoSurface.js";

it("冷却有界且时间回看恢复同一状态，不重建材质", () => {
  expect(lavaCooling(0)).toBe(0);
  expect(lavaCooling(13)).toBe(0);
  expect(lavaCooling(16.5)).toBe(0.5);
  expect(lavaCooling(20)).toBe(1);
  expect(lavaCooling(100)).toBe(1);
  const material = createVolcanoLavaMaterial();
  const shader = {
    uniforms: {},
    vertexShader: "#include <begin_vertex>",
    fragmentShader:
      "#include <color_fragment>\n#include <emissivemap_fragment>",
  };
  material.onBeforeCompile(shader);
  const original = shader.uniforms.lavaTime;
  for (const fraction of [0, 0.503, 1, 0.503, -1, 2]) {
    material.userData.updateLava(6, fraction);
    expect(shader.uniforms.lavaFront.value).toBe(
      Math.max(0, Math.min(1, fraction)),
    );
  }
  for (const t of [9, 20, 9]) {
    material.userData.updateLava(t);
    expect(shader.uniforms.lavaTime).toBe(original);
    expect(original.value).toBe(t);
    expect(shader.uniforms.lavaCooling.value).toBe(lavaCooling(t));
  }
  const uv = volcanoLava(1).attributes.uv;
  expect(uv.count).toBe(97 * 5);
  expect([...uv.array].every((v) => v >= 0 && v <= 1)).toBe(true);
  material.dispose();
});
