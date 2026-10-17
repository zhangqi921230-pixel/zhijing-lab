const segments = [
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

// Canvas drawn once per changed reading; no digit meshes or animation uploads.
export function drawBalanceDisplay(ctx, mass) {
  ctx.fillStyle = "#182927";
  ctx.fillRect(0, 0, 768, 80);
  const face = ctx.createLinearGradient(0, 4, 0, 76);
  face.addColorStop(0, "#aebfa1");
  face.addColorStop(1, "#c8d3b2");
  ctx.fillStyle = face;
  ctx.fillRect(8, 5, 752, 70);
  ctx.fillStyle = "#304835";
  ctx.textAlign = "left";
  ctx.font = '20px "Microsoft YaHei", sans-serif';
  ctx.fillText("净质量", 28, 32);
  ctx.font = "15px sans-serif";
  ctx.fillText("NET  ·  g", 28, 59);
  const value = Number.isFinite(mass) ? mass.toFixed(1) : "";
  let x = 590 - value.length * 56;
  for (const digit of value) {
    if (digit === ".") {
      ctx.fillStyle = "#263e2d";
      ctx.fillRect(x + 3, 64, 7, 7);
      x += 19;
      continue;
    }
    for (const [name, [dx, dy, width, height]] of Object.entries(bars)) {
      ctx.fillStyle = segments[Number(digit)]?.includes(name)
        ? "#263e2d"
        : "#b2c0a3";
      ctx.beginPath();
      const bevel = 2;
      ctx.moveTo(x + dx + bevel, dy + 8);
      ctx.lineTo(x + dx + width - bevel, dy + 8);
      ctx.lineTo(x + dx + width, dy + 8 + bevel);
      ctx.lineTo(x + dx + width, dy + 8 + height - bevel);
      ctx.lineTo(x + dx + width - bevel, dy + 8 + height);
      ctx.lineTo(x + dx + bevel, dy + 8 + height);
      ctx.lineTo(x + dx, dy + 8 + height - bevel);
      ctx.lineTo(x + dx, dy + 8 + bevel);
      ctx.closePath();
      ctx.fill();
    }
    x += 56;
  }
  ctx.font = "bold 36px sans-serif";
  ctx.fillStyle = "#263e2d";
  ctx.fillText("g", 628, 62);
}
