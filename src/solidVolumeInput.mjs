// SVG xMidYMid meet includes letterboxing when CSS limits the chart height.
export function solidVolumePointer(clientX, rect) {
  const scale = Math.min(rect.width / 520, rect.height / 220);
  if (!(scale > 0)) return null;
  const x = (clientX - rect.left - (rect.width - 520 * scale) / 2) / scale;
  return Math.round(Math.max(0, Math.min(100, ((x - 48) / 420) * 100)));
}

export function solidVolumeKey(value, key) {
  if (key === "Home") return 0;
  if (key === "End") return 100;
  const delta = {
    ArrowLeft: -1,
    ArrowDown: -1,
    ArrowRight: 1,
    ArrowUp: 1,
    PageDown: -10,
    PageUp: 10,
  }[key];
  return delta === undefined
    ? null
    : Math.max(0, Math.min(100, Math.round(value) + delta));
}
