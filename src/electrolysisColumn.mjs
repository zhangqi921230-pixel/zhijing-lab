// Display geometry for equal-bore collection tubes; volume comes from Faraday's law.
export function electrolysisColumn(volume) {
  const gasHeight = Math.min(1.75, (Math.max(0, volume) / 160) * 1.75);
  const liquidHeight = 2.18 - gasHeight;
  const surface = 0.66 + liquidHeight;
  return {
    gasHeight,
    liquidHeight,
    surface,
    bubbleHeight: Math.max(0, surface - 0.75 - 0.05),
  };
}
