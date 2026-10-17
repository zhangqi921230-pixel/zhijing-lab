export function scanLevel(start, elapsedMs, metresPerSecond) {
  return Math.min(
    2400,
    Math.max(
      100,
      start +
        Math.floor((Math.max(0, elapsedMs) * metresPerSecond) / 10000) * 10,
    ),
  );
}
