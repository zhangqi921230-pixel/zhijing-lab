// Keep the native range value equal to the continuously integrated model value.
// Quantize only deliberate keyboard/pointer edits, never each animation frame.
export function titrationVolumeLabel(value, acid) {
  return Math.abs(value - acid) > 0 && Math.abs(value - acid) < 0.005
    ? value.toFixed(6).replace(/0+$/, "").replace(/\.$/, "")
    : value.toFixed(2);
}
export function titrationKeyboardValue(value, key, step = 0.01) {
  if (key === "Home") return 0;
  if (key === "End") return 100;
  const direction = ["ArrowRight", "ArrowUp"].includes(key)
    ? 1
    : ["ArrowLeft", "ArrowDown"].includes(key)
      ? -1
      : 0;
  if (!direction) return null;
  return Math.max(
    0,
    Math.min(100, Number((value + direction * step).toFixed(2))),
  );
}
