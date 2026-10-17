// Curved, slightly asymmetric teaching specimen; no species identification.
export function leafSurface(t, edge, index = 0) {
  const arch = Math.sin(Math.PI * t);
  const length = 0.3 - index * 0.015;
  const width =
    0.09 * arch ** 0.85 * (1 + 0.035 * Math.sin(t * Math.PI * 13 + index));
  return [
    0.025 + t * length,
    0.025 * arch +
      t * 0.08 -
      0.018 * edge * edge * arch +
      0.006 * edge * arch * Math.sin(t * 7 + index) -
      0.018 * t ** 5,
    edge * width * (1 + 0.08 * edge * Math.sin(t * 4 + index)),
  ];
}
