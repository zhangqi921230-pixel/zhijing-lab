export const indicators = [
  {
    id: "phenolphthalein",
    name: "酚酞",
    low: 8,
    high: 10,
    acid: "无色",
    base: "粉红",
    from: [245, 248, 245],
    to: [223, 70, 136],
  },
  {
    id: "btb",
    name: "溴百里酚蓝",
    low: 6,
    high: 7.6,
    acid: "黄色",
    base: "蓝色",
    from: [237, 201, 54],
    to: [47, 112, 197],
  },
];
export function indicatorAppearance(indicator, pH) {
  const progress = Math.max(
    0,
    Math.min(1, (pH - indicator.low) / (indicator.high - indicator.low)),
  );
  return {
    color: `rgb(${indicator.from.map((v, i) => Math.round(v + (indicator.to[i] - v) * progress)).join(",")})`,
    label:
      progress === 0
        ? indicator.acid
        : progress === 1
          ? indicator.base
          : "变色过渡区",
  };
}
export function volumeForPH(acid, c, pH) {
  const difference = 10 ** -pH - 10 ** (pH - 14);
  if (c + difference <= 0) return null;
  const volume = (acid * (c - difference)) / (c + difference);
  return Number.isFinite(volume) && volume >= 0 && volume <= 100
    ? volume
    : null;
}
