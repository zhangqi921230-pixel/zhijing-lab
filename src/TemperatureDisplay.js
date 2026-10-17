// Segment geometry gives the same legible digits on machines with different fonts.
const digits = [
  "abcdef",
  "bc",
  "abdeg",
  "abcdg",
  "bcfg",
  "acdfg",
  "acdefg",
  "abc",
  "abcdefg",
  "abcdfg",
];
const bars = {
  a: [8, 0, 30, 6],
  b: [36, 6, 6, 23],
  c: [36, 35, 6, 23],
  d: [8, 58, 30, 6],
  e: [2, 35, 6, 23],
  f: [2, 6, 6, 23],
  g: [8, 29, 30, 6],
};
export function drawTemperatureDisplay(ctx, temperature) {
  ctx.fillStyle = "#24332d";
  ctx.fillRect(0, 0, 384, 192);
  const face = ctx.createLinearGradient(0, 8, 0, 184);
  face.addColorStop(0, "#b4c3a5");
  face.addColorStop(1, "#d1d9bc");
  ctx.fillStyle = face;
  ctx.fillRect(8, 8, 368, 176);
  ctx.fillStyle = "#344737";
  ctx.textAlign = "left";
  ctx.font = '20px "Microsoft YaHei", sans-serif';
  ctx.fillText("溶液温度", 25, 37);
  ctx.font = "14px sans-serif";
  ctx.fillText("TEMP", 300, 35);
  const value = Number.isFinite(temperature) ? temperature.toFixed(1) : "---";
  const scale = 1.25;
  const width =
    [...value].reduce((sum, digit) => sum + (digit === "." ? 18 : 54), 0) *
    scale;
  let x = 284 - width;
  for (const digit of value) {
    if (digit === ".") {
      ctx.fillStyle = "#263b2c";
      ctx.fillRect(x + 3, 126, 8, 8);
      x += 18 * scale;
      continue;
    }
    const lit = digit === "-" ? "g" : digits[Number(digit)];
    for (const [name, [dx, dy, w, h]] of Object.entries(bars)) {
      ctx.fillStyle = lit.includes(name) ? "#263b2c" : "#acba9c";
      ctx.fillRect(x + dx * scale, 54 + dy * scale, w * scale, h * scale);
    }
    x += 54 * scale;
  }
  ctx.fillStyle = "#263b2c";
  ctx.font = "bold 32px Arial, sans-serif";
  ctx.fillText("°C", 300, 129);
  ctx.font = '17px "Microsoft YaHei", sans-serif';
  ctx.fillText("平衡状态示意", 25, 167);
}
