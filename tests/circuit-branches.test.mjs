import { expect, it } from "vitest";
import * as THREE from "three";
import { buildCircuitBench } from "../src/CircuitBench.js";

it("branch emphasis selects the correct leads without moving or hiding any connection", () => {
  const root = new THREE.Group(),
    p = { u: 6, r: 20, closed: 0 };
  buildCircuitBench(root, p);
  const wires = root.children.filter((o) => o.name.startsWith("lead:"));
  const colors = wires.map((w) => w.material.color.getHexString());
  const geometry = wires.map((w) => w.geometry);
  for (const trace of [1, 2]) {
    root.userData.update({ ...p, trace });
    const highlighted = wires.filter(
      (w) => w.material.color.getHexString() === "e8a632",
    );
    expect(highlighted).toHaveLength(trace === 1 ? 4 : 2);
    expect(
      highlighted.every((w) => w.name.startsWith("lead:V") === (trace === 2)),
    ).toBe(true);
    wires.forEach((wire, i) => {
      expect(wire.geometry).toBe(geometry[i]);
      expect(wire.visible).toBe(true);
    });
  }
  root.userData.update({ ...p, trace: 0 });
  expect(wires.map((w) => w.material.color.getHexString())).toEqual(colors);
  expect(wires.every((w) => w.material.emissiveIntensity === 0)).toBe(true);
});
