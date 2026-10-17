import { opticalScale, opticalScreen } from "./opticalModel.mjs";

// One centimetre on the screen uses exactly the same world scale as the rail.
export function screenScaleTicks(pixels = 512) {
  const extent = Math.floor(opticalScreen.height / (2 * opticalScale));
  return Array.from({ length: extent * 2 + 1 }, (_, i) => {
    const cm = i - extent;
    return {
      cm,
      y: pixels * (0.5 - (cm * opticalScale) / opticalScreen.height),
    };
  });
}

export function drawScreenScale(context) {
  context.save();
  context.fillStyle = "#c3c9b9";
  context.font = "13px sans-serif";
  context.textAlign = "right";
  context.textBaseline = "middle";
  for (const { cm, y } of screenScaleTicks()) {
    const major = cm % 2 === 0;
    context.fillRect(10, y - 0.5, major ? 15 : 8, 1);
    context.fillRect(major ? 487 : 494, y - 0.5, major ? 15 : 8, 1);
    if (major) context.fillText(String(cm), 484, y);
  }
  context.textAlign = "left";
  context.fillText("cm", 30, 20);
  context.restore();
}
