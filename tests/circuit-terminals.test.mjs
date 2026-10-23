import { expect, it } from "vitest";
import * as THREE from "three";
import { addCircuitTerminals } from "../src/CircuitTerminals.js";
import { terminals } from "../src/CircuitBench.js";

it("detailed connector hardware preserves all lead nodes with three instanced draws", () => {
  const root = new THREE.Group();
  addCircuitTerminals(root, terminals);
  const batches = root.children.filter((object) => object.isInstancedMesh);
  expect(batches).toHaveLength(3);
  for (const batch of batches) {
    expect(batch.count).toBe(10);
    expect(
      Array.from(batch.geometry.attributes.position.array).every(
        Number.isFinite,
      ),
    ).toBe(true);
  }
  for (const [name, position] of Object.entries(terminals)) {
    expect(root.getObjectByName(name).position.toArray()).toEqual(position);
  }
  const insulators = root.getObjectByName("circuit-terminal-insulators");
  const names = Object.keys(terminals);
  const first = new THREE.Color(),
    second = new THREE.Color();
  insulators.getColorAt(names.indexOf("R+"), first);
  insulators.getColorAt(names.indexOf("R-"), second);
  expect(first.equals(second)).toBe(true);
  insulators.getColorAt(names.indexOf("source+"), first);
  insulators.getColorAt(names.indexOf("source-"), second);
  expect(first.equals(second)).toBe(false);
});
