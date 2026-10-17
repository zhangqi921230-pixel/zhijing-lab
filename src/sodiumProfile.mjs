export const SODIUM_LINES = [588.995, 589.5924];
export function sodiumResponse(wavelength, width) {
  return SODIUM_LINES.reduce(
    (sum, line, i) =>
      sum +
      (i === 0 ? 1 : 0.5) *
        Math.exp(-4 * Math.log(2) * ((wavelength - line) / width) ** 2),
    0,
  );
}
export function sodiumProfile(width) {
  const points = Array.from({ length: 481 }, (_, i) => {
    const wavelength = 588 + (i * 2.6) / 480;
    return { wavelength, value: sodiumResponse(wavelength, width) };
  });
  let peak = 0,
    peakWavelength = 588;
  // Refine each sampled local maximum, so the normalization is not limited to
  // the drawing grid. The supported minimum width .08 nm exceeds 14 grid steps.
  for (let i = 1; i < points.length - 1; i++) {
    if (
      points[i].value < points[i - 1].value ||
      points[i].value < points[i + 1].value
    )
      continue;
    let lo = points[i - 1].wavelength,
      hi = points[i + 1].wavelength;
    for (let j = 0; j < 48; j++) {
      const a = lo + (hi - lo) / 3,
        b = hi - (hi - lo) / 3;
      if (sodiumResponse(a, width) < sodiumResponse(b, width)) lo = a;
      else hi = b;
    }
    const wavelength = (lo + hi) / 2,
      value = sodiumResponse(wavelength, width);
    if (value > peak) {
      peak = value;
      peakWavelength = wavelength;
    }
  }
  points.push({ wavelength: peakWavelength, value: peak });
  points.sort((a, b) => a.wavelength - b.wavelength);
  return { points, peak, peakWavelength };
}
