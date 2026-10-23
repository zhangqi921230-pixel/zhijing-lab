import { expect, it } from "vitest";
import * as T from "three";
import { buildOpticalBench, opticalScale } from "../src/OpticalBench.js";

it("carrier indices read the same signed distances as the optical model across travel", () => {
  const root = new T.Group();
  buildOpticalBench(root, { u: 30, f: 10, screen: 15, rays: 1 });
  const ruler = root.getObjectByName("optical-ruler");
  for (const [u, screen] of [
    [5, 5],
    [60, 80],
    [30, 15],
  ]) {
    root.userData.update({ u, f: 10, screen, rays: 1 });
    root.updateMatrixWorld(true);
    for (const [name, expected] of [
      ["optical-object", -u],
      ["optical-lens", 0],
      ["optical-screen", screen],
    ]) {
      const index = root.getObjectByName(name).getObjectByName("optical-index");
      const tip = index.localToWorld(new T.Vector3(0, -0.2, 0));
      expect(tip.x / opticalScale).toBeCloseTo(expected, 10);
      const local = ruler.worldToLocal(tip.clone());
      const readout = ((local.x + 8.25 / 2) / 8.25) * 150 - 65;
      expect(readout).toBeCloseTo(expected, 10);
      expect(Math.abs(local.y)).toBeLessThan(0.32 / 2);
      expect(local.z).toBeGreaterThan(0);
    }
  }
});
