import { it, expect } from "vitest";
import { buildChemistryApparatus } from "../src/ChemistryApparatus.js";
it("routes each insulated cable above the glass rim and joins its matching terminal", () => {
  const model = buildChemistryApparatus("electrolysis");
  try {
    for (const polarity of ["positive", "negative"]) {
      const cable = model.root.getObjectByName(
          `electrolysis-${polarity}-cable`,
        ),
        terminal = model.root.getObjectByName(
          `electrolysis-${polarity}-terminal`,
        ),
        path = cable.geometry.parameters.path;
      const end = path.getPoint(1);
      expect(end.x).toBeCloseTo(terminal.position.x, 10);
      expect(end.y).toBeCloseTo(terminal.position.y, 10);
      expect(end.z).toBeCloseTo(terminal.position.z + terminal.scale.y / 2, 10);
      let crossings = 0;
      for (let i = 0; i <= 2000; i++) {
        const point = path.getPoint(i / 2000),
          radius = Math.hypot(point.x, point.z);
        if (Math.abs(radius - 1.5) < 0.04) {
          crossings++;
          expect(point.y - 0.025).toBeGreaterThan(1.24);
        }
      }
      expect(crossings).toBeGreaterThan(0);
    }
  } finally {
    model.dispose();
  }
});
