export const depthBands = [
  { label: "浅源 · <70 km", color: "#ff8f78" },
  { label: "中源 · 70–300 km", color: "#f2d169" },
  { label: "深源 · >300 km", color: "#ae9cff" },
];
export function earthquakeDepthBand(depth) {
  return depth < 70 ? 0 : depth <= 300 ? 1 : 2;
}
