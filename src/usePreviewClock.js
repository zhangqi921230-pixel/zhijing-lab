import { useEffect, useState } from "react";
// One frame source for visible vector previews; no work remains after unsubscribe.
const listeners = new Set();
let frame = null,
  last = null,
  elapsed = 0;
function tick(now) {
  if (last !== null) elapsed += Math.min(0.05, (now - last) / 1000);
  last = now;
  listeners.forEach((fn) => fn(elapsed));
  frame = listeners.size ? requestAnimationFrame(tick) : null;
}
export function subscribePreviewClock(fn) {
  listeners.add(fn);
  if (frame === null) {
    last = null;
    frame = requestAnimationFrame(tick);
  }
  return () => {
    listeners.delete(fn);
    if (!listeners.size) {
      cancelAnimationFrame(frame);
      frame = null;
      last = null;
    }
  };
}
export default function usePreviewClock(playing = true) {
  const [time, setTime] = useState(0);
  useEffect(() => {
    if (!playing) return;
    return subscribePreviewClock(setTime);
  }, [playing]);
  return time;
}
