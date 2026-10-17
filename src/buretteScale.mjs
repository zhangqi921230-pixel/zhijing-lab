// Calibration shared by the physical liquid level and printed graduation.
export function buretteReadingHeight(volume) {
  return 5.1 - 0.025 * volume;
}

export const buretteGraduations = Array.from({ length: 501 }, (_, i) => ({
  volume: i / 5,
  fraction: i / 500,
  kind: i % 25 === 0 ? "numbered" : i % 5 === 0 ? "unit" : "minor",
}));
