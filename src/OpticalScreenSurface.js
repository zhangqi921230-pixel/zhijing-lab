// A single silhouette is blurred as one image: the arrow's neck is not a seam.
export function drawProjectedArrow(
  context,
  height,
  shaftWidth,
  headWidth,
  shaftFraction,
) {
  const neck = -height * shaftFraction;
  context.beginPath();
  context.moveTo(-shaftWidth / 2, 0);
  context.lineTo(shaftWidth / 2, 0);
  context.lineTo(shaftWidth / 2, neck);
  context.lineTo(headWidth / 2, neck);
  context.lineTo(0, -height);
  context.lineTo(-headWidth / 2, neck);
  context.lineTo(-shaftWidth / 2, neck);
  context.closePath();
  context.fill();
}

export function createScreenSurface() {
  if (typeof document === "undefined") return () => {};
  const grain = document.createElement("canvas");
  grain.width = grain.height = 64;
  const g = grain.getContext("2d");
  let seed = 937;
  for (let y = 0; y < 64; y++)
    for (let x = 0; x < 64; x++) {
      seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
      const value = 220 + (seed >>> 27);
      g.fillStyle = `rgb(${value},${value},${value})`;
      g.fillRect(x, y, 1, 1);
    }
  let pattern;
  return (context) => {
    // Created once per screen; only optical parameter changes redraw the texture.
    pattern ??= context.createPattern(grain, "repeat");
    context.save();
    context.filter = "none";
    context.globalCompositeOperation = "multiply";
    context.globalAlpha = 0.28;
    context.fillStyle = pattern;
    context.fillRect(0, 0, 512, 512);
    context.restore();
  };
}
