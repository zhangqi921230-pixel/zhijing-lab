import { expect, it } from "vitest";
import * as THREE from "three";
import { buildScene } from "../src/ThreeScene.jsx";
import { RC_METER_TERMINALS } from "../src/RCReadout.js";

it("connects the voltmeter across the capacitor and reads both exponential responses", () => {
  const root = new THREE.Group(),
    p = { u: 6, r: 1000, c: 4, mode: 0, time: 0 };
  buildScene(root, "capacitor", p);
  const meter = root.getObjectByName("rc-voltmeter"),
    geometry = meter.geometry;
  for (const mode of [0, 1])
    for (const time of [0, 4, 20]) {
      root.userData.update({ ...p, mode, time });
      expect(meter.userData.voltage).toBeCloseTo(
        6 * (mode ? Math.exp(-time / 4) : 1 - Math.exp(-time / 4)),
        12,
      );
      expect(meter.geometry).toBe(geometry);
    }
  for (const [i, key] of ["positive", "negative"].entries()) {
    const lead = root.getObjectByName(`rc-meter-lead-${key}`);
    expect(lead.userData.terminals[0]).toEqual(i ? [2.1, 0, 0] : [1.5, 0, 0]);
    expect(lead.userData.terminals[1]).toEqual(RC_METER_TERMINALS[key]);
    const curve = lead.geometry.parameters.path;
    expect(
      curve
        .getPoint(0)
        .distanceTo(new THREE.Vector3(...lead.userData.terminals[0])),
    ).toBeLessThan(1e-10);
    expect(
      curve
        .getPoint(1)
        .distanceTo(root.getObjectByName(`rc-meter-${key}`).position),
    ).toBeLessThan(1e-10);
  }
});
