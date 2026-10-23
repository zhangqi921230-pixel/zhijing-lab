import { it, expect } from "vitest";
import * as THREE from "three";
import { circuitHoverAction } from "../src/CircuitHover.js";
it("explains the actual next RC switch action and traverses child meshes", () => {
  const parent = new THREE.Group(),
    child = new THREE.Mesh();
  parent.add(child);
  parent.userData = { action: "parameter", key: "mode" };
  expect(circuitHoverAction(child, { mode: 0 }).text).toContain("点击切到放电");
  expect(circuitHoverAction(child, { mode: 1 }).text).toContain("点击切到充电");
  expect(circuitHoverAction(child, { mode: 1 }).text).toContain(
    "保留当前电容电压",
  );
  expect(circuitHoverAction(undefined, {})).toBeNull();
});
