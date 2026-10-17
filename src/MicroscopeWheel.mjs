// Normalize trackpad, line and page scrolling without adding a render loop.
export function installMicroscopeWheel(element, getCurrent) {
  let remainder = 0,
    previousKey = "",
    previousTime = -Infinity;
  function wheel(event) {
    const { p, onChange } = getCurrent();
    if (
      !onChange ||
      event.ctrlKey ||
      event.metaKey ||
      !event.deltaY ||
      Math.abs(event.deltaX) > Math.abs(event.deltaY)
    )
      return;
    event.preventDefault();
    event.stopPropagation();
    const key = event.shiftKey ? "coarse" : "focus";
    if (key !== previousKey || event.timeStamp - previousTime > 250)
      remainder = 0;
    previousKey = key;
    previousTime = event.timeStamp;
    const pixels =
      event.deltaY *
      (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? 120 : 1);
    remainder += Math.max(-120, Math.min(120, pixels));
    const steps = Math.trunc(remainder / 40);
    if (!steps) return;
    remainder -= steps * 40;
    const value = Math.max(0, Math.min(100, p[key] - steps));
    if (value !== p[key]) onChange(key, value);
  }
  element.addEventListener("wheel", wheel, { passive: false });
  return () => element.removeEventListener("wheel", wheel);
}
