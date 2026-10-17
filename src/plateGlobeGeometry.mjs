export function globePoint(longitude, latitude, radius = 1.8) {
  const lat = (latitude * Math.PI) / 180,
    lon = (longitude * Math.PI) / 180;
  return [
    radius * Math.cos(lat) * Math.cos(lon),
    radius * Math.sin(lat),
    -radius * Math.cos(lat) * Math.sin(lon),
  ];
}

export function boundarySegments(data, radius = 1.813) {
  const groups = { subduction: [], other: [] };
  for (const feature of data.features) {
    if (feature.geometry?.type !== "LineString") continue;
    const target =
      groups[feature.properties.Type === "subduction" ? "subduction" : "other"];
    const coordinates = feature.geometry.coordinates;
    for (let i = 1; i < coordinates.length; i++) {
      const a = globePoint(...coordinates[i - 1], radius),
        b = globePoint(...coordinates[i], radius);
      target.push(...a, ...b);
    }
  }
  return groups;
}
