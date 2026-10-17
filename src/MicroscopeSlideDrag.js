import * as T from "three";

export function installMicroscopeSlideDrag({
  element,
  camera,
  root,
  controls,
  getParams,
  onChange,
}) {
  const ray = new T.Raycaster(),
    pointer = new T.Vector2(),
    point = new T.Vector3();
  let drag = null;
  function cast(event) {
    const rect = element.getBoundingClientRect();
    if (!rect.width || !rect.height) return false;
    pointer.set(
      ((event.clientX - rect.left) / rect.width) * 2 - 1,
      1 - ((event.clientY - rect.top) / rect.height) * 2,
    );
    ray.setFromCamera(pointer, camera);
    return true;
  }
  function consume(event) {
    event.preventDefault();
    event.stopImmediatePropagation();
  }
  function down(event) {
    if (drag) {
      consume(event);
      return;
    }
    if (event.button !== 0 || !cast(event)) return;
    const hit = firstVisibleHit(ray.intersectObject(root, true));
    let target = hit?.object;
    while (target && target.name !== "microscope-slide") target = target.parent;
    if (!target) return;
    const p = getParams();
    const normal = new T.Vector3(0, 1, 0).transformDirection(root.matrixWorld);
    drag = {
      id: event.pointerId,
      plane: new T.Plane().setFromNormalAndCoplanarPoint(normal, hit.point),
      origin: root.worldToLocal(hit.point.clone()),
      x: p.x,
      y: p.y,
      enabled: controls.enabled,
    };
    try {
      element.setPointerCapture(event.pointerId);
    } catch {
      drag = null;
      return;
    }
    controls.enabled = false;
    element.style.cursor = "grabbing";
    consume(event);
  }
  function move(event) {
    if (!drag || drag.id !== event.pointerId) return;
    consume(event);
    if (!cast(event) || !ray.ray.intersectPlane(drag.plane, point)) return;
    root.worldToLocal(point).sub(drag.origin);
    const clamp = (v) => Math.max(-40, Math.min(40, Math.round(v)));
    const x = clamp(drag.x + point.x / 0.008),
      y = clamp(drag.y - point.z / 0.008),
      p = getParams();
    if (x !== p.x) onChange("x", x);
    if (y !== p.y) onChange("y", y);
  }
  function finish(event) {
    if (!drag || drag.id !== event.pointerId) return;
    consume(event);
    cancelDrag();
  }
  function cancelDrag() {
    if (!drag) return;
    const current = drag;
    drag = null;
    controls.enabled = current.enabled;
    element.style.cursor = "";
    if (element.hasPointerCapture(current.id))
      element.releasePointerCapture(current.id);
  }
  const owner = element.ownerDocument,
    view = owner.defaultView;
  function visibilityChange() {
    if (owner.hidden) cancelDrag();
  }
  view?.addEventListener("blur", cancelDrag);
  owner.addEventListener("visibilitychange", visibilityChange);
  const listeners = [
    ["pointerdown", down],
    ["pointermove", move],
    ["pointerup", finish],
    ["pointercancel", finish],
    ["lostpointercapture", finish],
  ];
  for (const [type, handler] of listeners)
    element.addEventListener(type, handler, { capture: true, passive: false });
  return () => {
    for (const [type, handler] of listeners)
      element.removeEventListener(type, handler, true);
    view?.removeEventListener("blur", cancelDrag);
    owner.removeEventListener("visibilitychange", visibilityChange);
    cancelDrag();
    element.style.cursor = "";
  };
}
import { firstVisibleHit } from "./visibleSceneHit.mjs";
