export const CATALOG_START = Date.UTC(2025, 0, 1);
export const CATALOG_END = Date.UTC(2026, 0, 1);
export const CATALOG_MIN_MAGNITUDE = 5.5;
export const CATALOG_URL =
  "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2025-01-01T00:00:00&endtime=2025-12-31T23:59:59.999&minmagnitude=5.5&eventtype=earthquake&orderby=magnitude";

// Reject inconsistent snapshots as a whole; never silently drop source records.
export function normalizeEarthquakeCatalog(data) {
  if (
    data?.type !== "FeatureCollection" ||
    !Array.isArray(data.features) ||
    !data.features.length
  )
    throw new Error("目录必须是包含事件的 GeoJSON FeatureCollection。");
  if (data.metadata?.count !== data.features.length)
    throw new Error("目录记录数与来源 metadata.count 不一致。");
  const ids = new Set();
  const events = data.features.map((feature) => {
    const p = feature.properties,
      c = feature.geometry?.coordinates;
    if (!/^[a-zA-Z0-9_-]+$/.test(feature.id || "") || ids.has(feature.id))
      throw new Error("目录存在无效或重复事件 ID。");
    ids.add(feature.id);
    if (
      feature.geometry?.type !== "Point" ||
      !Array.isArray(c) ||
      c.length !== 3 ||
      !c.every(Number.isFinite)
    )
      throw new Error(`事件 ${feature.id} 的震源坐标无效。`);
    if (
      Math.abs(c[0]) > 180 ||
      Math.abs(c[1]) > 90 ||
      c[2] < -100 ||
      c[2] > 1000
    )
      throw new Error(`事件 ${feature.id} 的经纬度或深度超出目录范围。`);
    if (
      p?.type !== "earthquake" ||
      !Number.isFinite(p.time) ||
      p.time < CATALOG_START ||
      p.time >= CATALOG_END
    )
      throw new Error(`事件 ${feature.id} 不属于 2025 年 UTC 地震目录。`);
    if (!Number.isFinite(p.mag) || p.mag < CATALOG_MIN_MAGNITUDE || p.mag > 10)
      throw new Error(`事件 ${feature.id} 的震级不符合 M≥5.5 的筛选范围。`);
    return {
      id: feature.id,
      longitude: c[0],
      latitude: c[1],
      depthKm: c[2],
      magnitude: p.mag,
      magnitudeType: typeof p.magType === "string" ? p.magType : null,
      time: p.time,
      place: typeof p.place === "string" ? p.place : "",
      url: `https://earthquake.usgs.gov/earthquakes/eventpage/${feature.id}`,
    };
  });
  events.sort(
    (a, b) =>
      b.magnitude - a.magnitude || a.time - b.time || a.id.localeCompare(b.id),
  );
  return {
    source: "USGS Earthquake Catalog",
    query: CATALOG_URL,
    startUTC: "2025-01-01T00:00:00Z",
    endExclusiveUTC: "2026-01-01T00:00:00Z",
    minimumMagnitude: CATALOG_MIN_MAGNITUDE,
    count: events.length,
    events,
  };
}
