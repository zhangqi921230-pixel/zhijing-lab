import { expect, it } from "vitest";
import {
  normalizeEarthquakeCatalog,
  CATALOG_START,
  CATALOG_END,
} from "../src/earthquakeCatalog.mjs";
const fixture = () => ({
  type: "FeatureCollection",
  metadata: { count: 1 },
  features: [
    {
      id: "test-event",
      geometry: { type: "Point", coordinates: [179.9, -10, -1] },
      properties: {
        type: "earthquake",
        time: CATALOG_START,
        mag: 5.5,
        magType: "mb",
        place: "Synthetic test only",
      },
    },
  ],
});
it("preserves UTC, magnitude type, event ID and negative source depth without fabricating data", () => {
  const result = normalizeEarthquakeCatalog(fixture());
  expect(result.count).toBe(1);
  expect(result.events[0]).toMatchObject({
    depthKm: -1,
    magnitude: 5.5,
    magnitudeType: "mb",
    time: CATALOG_START,
    longitude: 179.9,
  });
});
it.each(["year", "magnitude", "coordinate", "count", "duplicate", "type"])(
  "rejects %s inconsistencies instead of showing a partial catalog",
  (fault) => {
    const data = fixture();
    if (fault === "year") data.features[0].properties.time = CATALOG_END;
    if (fault === "magnitude") data.features[0].properties.mag = 5.4;
    if (fault === "coordinate")
      data.features[0].geometry.coordinates[0] = Infinity;
    if (fault === "count") data.metadata.count = 2;
    if (fault === "duplicate") {
      data.features.push(structuredClone(data.features[0]));
      data.metadata.count = 2;
    }
    if (fault === "type") data.features[0].properties.type = "quarry blast";
    expect(() => normalizeEarthquakeCatalog(data)).toThrow();
  },
);
