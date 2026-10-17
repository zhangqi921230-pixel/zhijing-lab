export function probeRailPosition(value, left, right) {
  return left + ((value + 5) / 10) * (right - left);
}
export function probeRailValue(position, left, right) {
  return Math.max(
    -5,
    Math.min(5, -5 + ((position - left) / (right - left)) * 10),
  );
}
export function probeExtent(x, y, plotWidth) {
  return Math.ceil(
    Math.max(Math.abs(y), (Math.abs(x) * 230) / (plotWidth / 2 - 25)) + 1,
  );
}
