import { lens } from "./models.mjs";
export const opticalScale = 0.055,
  opticalAxis = 0.4,
  objectHeight = 0.4,
  aperture = 0.45;
export const objectArrow = {
  shaftWidth: 0.045,
  headWidth: 0.19,
  headHeight: 0.1,
};
export const opticalScreen = { width: 1.64, height: 1.6 };
export function opticalState(p) {
  const q = lens(p.u, p.f),
    s = p.screen ?? 15,
    sourceOffset = (p.sourceOffset ?? 0) * opticalScale,
    apertureRatio = Math.max(0.25, Math.min(1, (p.aperture ?? 100) / 100));
  return {
    ...q,
    screen: s,
    illuminated: p.light !== 0,
    apertureRatio,
    relativeLight: apertureRatio ** 2,
    spread: aperture * apertureRatio * Math.abs(1 + s / p.u - s / p.f),
    sourceOffset,
    base: (-s / p.u) * sourceOffset,
    tip: (-s / p.u) * (objectHeight + sourceOffset),
    projectedShaftWidth: (s / p.u) * objectArrow.shaftWidth,
    projectedHeadWidth: (s / p.u) * objectArrow.headWidth,
    imageFitsScreen:
      q.v !== null &&
      q.v > 0 &&
      Math.max(
        Math.abs(q.m * sourceOffset),
        Math.abs(q.m * (sourceOffset + objectHeight)),
      ) <=
        opticalScreen.height / 2 + 1e-9 &&
      Math.abs(q.m) * objectArrow.headWidth <= opticalScreen.width + 1e-9,
    focused: q.v !== null && q.v > 0 && Math.abs(s - q.v) < 0.35,
  };
}
