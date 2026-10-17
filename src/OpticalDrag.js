import * as T from "three";
import { opticalScale } from "./opticalModel.mjs";

export function installOpticalDrag({
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
  const originalTitle = element.title;
  function carrierAtPointer() {
    // Teaching rays have a wide line-picking tolerance and must never block apparatus.
    // Keep all meshes so solid objects in front still occlude a draggable carrier.
    const hit = firstVisibleHit(
      ray.intersectObject(root, true).filter((hit) => hit.object.isMesh),
    );
    let target = hit?.object;
    let action = hit?.object;
    while (action && !action.userData.action) action = action.parent;
    while (
      target &&
      !["optical-object", "optical-screen"].includes(target.name)
    )
      target = target.parent;
    return { hit, target, action };
  }
  function clearHover() {
    if (drag) return;
    element.style.cursor = "";
    element.title = originalTitle;
  }
  function dragNormal(vertical = false) {
    const axis = new T.Vector3(
      vertical ? 0 : 1,
      vertical ? 1 : 0,
      0,
    ).transformDirection(root.matrixWorld);
    const normal = camera.getWorldDirection(new T.Vector3());
    normal.addScaledVector(axis, -normal.dot(axis));
    return normal.lengthSq() < 0.001 ? null : normal.normalize();
  }
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
    const { hit, target, action } = carrierAtPointer();
    if (action) return;
    if (!target) return;
    const p = getParams();
    const vertical = target.name === "optical-object" && event.shiftKey;
    if (vertical && p.heightLock === 1) {
      element.style.cursor = "not-allowed";
      element.title = "光源高度已锁紧，请先松开升降旋钮";
      consume(event);
      return;
    }
    // Looking along the movement axis cannot resolve a drag in screen space.
    const normal = dragNormal(vertical);
    if (!normal) {
      clearHover();
      return;
    }
    const key = vertical
      ? "sourceOffset"
      : target.name === "optical-object"
        ? "u"
        : "screen";
    drag = {
      id: event.pointerId,
      plane: new T.Plane().setFromNormalAndCoplanarPoint(normal, hit.point),
      origin: root.worldToLocal(hit.point.clone()),
      key,
      value: p[key] ?? 0,
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
    element.title = originalTitle;
    consume(event);
  }
  function move(event) {
    if (!drag) {
      if (event.buttons || event.pointerType === "touch" || !cast(event)) {
        clearHover();
        return;
      }
      const picked = carrierAtPointer();
      if (picked.action?.userData.key === "heightLock") {
        element.style.cursor = "pointer";
        element.title =
          getParams().heightLock === 1
            ? "点击松开光源升降旋钮"
            : "点击锁紧光源高度";
        return;
      }
      if (picked.action?.userData.key === "light") {
        element.style.cursor = "pointer";
        element.title = "点击切换光源电源";
        return;
      }
      const vertical =
        picked.target?.name === "optical-object" && event.shiftKey;
      if (vertical && getParams().heightLock === 1) {
        element.style.cursor = "not-allowed";
        element.title = "光源高度已锁紧，请先松开升降旋钮";
        return;
      }
      const target = dragNormal(vertical) ? picked.target : null;
      element.style.cursor = target ? "grab" : "";
      element.title = target
        ? target.name === "optical-object"
          ? vertical
            ? "光源：上下拖动调节高度，松手结束"
            : "物体：沿轨道拖动；按住 Shift 拖动调节高度，右侧滑块可精调"
          : "光屏：沿轨道拖动，右侧滑块可精调"
        : originalTitle;
      return;
    }
    if (drag.id !== event.pointerId) return;
    consume(event);
    if (drag.key === "sourceOffset" && getParams().heightLock === 1) {
      cancelDrag();
      return;
    }
    if (!cast(event) || !ray.ray.intersectPlane(drag.plane, point)) return;
    root.worldToLocal(point).sub(drag.origin);
    const vertical = drag.key === "sourceOffset",
      object = drag.key === "u",
      step = object ? 1 : 0.1;
    const raw =
      drag.value +
      ((vertical ? point.y : point.x) / opticalScale) * (object ? -1 : 1);
    const value = Number(
      Math.max(
        vertical ? -3 : 5,
        Math.min(
          vertical ? 3 : object ? 60 : 80,
          Math.round(raw / step) * step,
        ),
      ).toFixed(1),
    );
    if (value !== getParams()[drag.key]) onChange(drag.key, value);
  }
  function finish(event) {
    if (!drag || drag.id !== event.pointerId) return;
    consume(event);
    cancelDrag();
  }
  function cancelDrag() {
    if (!drag) {
      clearHover();
      return;
    }
    const current = drag;
    drag = null;
    controls.enabled = current.enabled;
    element.style.cursor = "";
    element.title = originalTitle;
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
    ["pointerleave", clearHover],
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
    element.title = originalTitle;
  };
}
import { firstVisibleHit } from "./visibleSceneHit.mjs";
