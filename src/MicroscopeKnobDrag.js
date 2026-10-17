import * as T from "three";
import { firstVisibleHit } from "./visibleSceneHit.mjs";

export function installMicroscopeKnobDrag({
  element,
  camera,
  root,
  controls,
  getParams,
  onChange,
}) {
  let drag = null;
  const ray = new T.Raycaster();
  const consume = (event) => {
    event.preventDefault();
    event.stopImmediatePropagation();
  };
  function cancel() {
    if (!drag) return;
    const saved = drag;
    drag = null;
    controls.enabled = saved.enabled;
    element.style.cursor = "";
    if (element.hasPointerCapture(saved.id))
      element.releasePointerCapture(saved.id);
  }
  function down(event) {
    if (drag) {
      consume(event);
      return;
    }
    if (event.button !== 0) return;
    const rect = element.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    ray.setFromCamera(
      new T.Vector2(
        ((event.clientX - rect.left) / rect.width) * 2 - 1,
        1 - ((event.clientY - rect.top) / rect.height) * 2,
      ),
      camera,
    );
    let target = firstVisibleHit(ray.intersectObject(root, true))?.object;
    while (target && !target.userData.action) target = target.parent;
    if (
      target?.userData.action !== "parameter" ||
      !["coarse", "focus"].includes(target.userData.key)
    )
      return;
    const key = target.userData.key;
    try {
      element.setPointerCapture(event.pointerId);
    } catch {
      return;
    }
    drag = {
      id: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      key,
      value: getParams()[key],
      delta: target.userData.delta,
      enabled: controls.enabled,
      moved: false,
    };
    controls.enabled = false;
    element.style.cursor = "grabbing";
    consume(event);
  }
  function move(event) {
    if (!drag || event.pointerId !== drag.id) return;
    consume(event);
    if (Math.hypot(event.clientX - drag.x, event.clientY - drag.y) > 5)
      drag.moved = true;
    if (!drag.moved) return;
    const pixelsPerStep = drag.key === "focus" ? 8 : 4;
    const value = Math.max(
      0,
      Math.min(
        100,
        drag.value + Math.round((drag.y - event.clientY) / pixelsPerStep),
      ),
    );
    if (value !== getParams()[drag.key]) onChange(drag.key, value);
  }
  function finish(event) {
    if (!drag || event.pointerId !== drag.id) return;
    consume(event);
    // A short tap keeps the existing click/Shift-click operation. A drag must
    // never also produce the generic scene's click increment.
    if (
      event.type === "pointerup" &&
      !drag.moved &&
      Math.hypot(event.clientX - drag.x, event.clientY - drag.y) <= 5
    ) {
      const value = Math.max(
        0,
        Math.min(
          100,
          getParams()[drag.key] + drag.delta * (event.shiftKey ? -1 : 1),
        ),
      );
      if (value !== getParams()[drag.key]) onChange(drag.key, value);
    }
    cancel();
  }
  const listeners = [
    ["pointerdown", down],
    ["pointermove", move],
    ["pointerup", finish],
    ["pointercancel", finish],
    ["lostpointercapture", finish],
  ];
  for (const [name, handler] of listeners)
    element.addEventListener(name, handler, { capture: true, passive: false });
  const doc = element.ownerDocument,
    view = doc.defaultView;
  const visibility = () => {
    if (doc.hidden) cancel();
  };
  view?.addEventListener("blur", cancel);
  doc.addEventListener("visibilitychange", visibility);
  return () => {
    for (const [name, handler] of listeners)
      element.removeEventListener(name, handler, true);
    view?.removeEventListener("blur", cancel);
    doc.removeEventListener("visibilitychange", visibility);
    cancel();
  };
}
