export function functionAxisTicks(extent, minimumStep, radians = false) {
  const unit = radians ? Math.PI / 2 : 1;
  const multiplier = radians
    ? 2 ** Math.max(0, Math.ceil(Math.log2(minimumStep / unit)))
    : Math.max(1, Math.ceil(minimumStep));
  const step = unit * multiplier;
  const count = Math.floor(extent / step);
  return Array.from({ length: count * 2 + 1 }, (_, i) => {
    const index = i - count;
    const halves = index * multiplier;
    const magnitude = Math.abs(halves);
    const numerator = magnitude % 2 ? magnitude : magnitude / 2;
    const label =
      !radians || halves === 0
        ? String(index * step)
        : `${halves < 0 ? "−" : ""}${numerator === 1 ? "" : numerator}π${magnitude % 2 ? "/2" : ""}`;
    return { value: index * step, label };
  });
}
