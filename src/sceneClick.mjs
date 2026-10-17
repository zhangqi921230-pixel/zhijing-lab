// A click must stay within the movement threshold for its entire gesture.
// Do not capture the pointer here: OrbitControls and instrument drags own it.
export function installSceneClick(element, onClick) {
  let start = null;
  const cancel = () => {
    start = null;
  };
  const down = (event) => {
    if (event.button !== 0 || event.isPrimary === false || start) {
      cancel();
      return;
    }
    start = { id: event.pointerId, x: event.clientX, y: event.clientY };
  };
  const move = (event) => {
    if (
      start &&
      event.pointerId === start.id &&
      Math.hypot(event.clientX - start.x, event.clientY - start.y) > 5
    )
      cancel();
  };
  const up = (event) => {
    const press = start;
    cancel();
    if (
      !press ||
      event.button !== 0 ||
      event.isPrimary === false ||
      event.pointerId !== press.id ||
      Math.hypot(event.clientX - press.x, event.clientY - press.y) > 5
    )
      return;
    onClick(event);
  };
  const events = {
    pointerdown: down,
    pointermove: move,
    pointerup: up,
    pointercancel: cancel,
    lostpointercapture: cancel,
    pointerleave: cancel,
  };
  for (const [name, handler] of Object.entries(events))
    element.addEventListener(name, handler);
  const view = element.ownerDocument?.defaultView;
  view?.addEventListener("blur", cancel);
  return () => {
    cancel();
    for (const [name, handler] of Object.entries(events))
      element.removeEventListener(name, handler);
    view?.removeEventListener("blur", cancel);
  };
}
