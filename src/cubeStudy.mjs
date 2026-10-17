export function cubeStudy(p) {
  const n = Math.max(2, Math.min(6, Math.round(p.divisions ?? 3)));
  const count = Math.min(
    n ** 3,
    Math.floor((n ** 3 * (p.fill ?? 100)) / 100 + 1e-9),
  );
  return {
    n,
    count,
    total: n ** 3,
    perLayer: n * n,
    fullLayers: Math.floor(count / (n * n)),
    partial: count % (n * n),
    side: p.edge / n,
    cellArea: (p.edge / n) ** 2,
    cellVolume: (p.edge / n) ** 3,
    filledVolume: count * (p.edge / n) ** 3,
  };
}
