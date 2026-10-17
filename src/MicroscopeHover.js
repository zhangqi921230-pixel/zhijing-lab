import * as T from "three";

export function microscopeHoverAction(object) {
  for (let target = object; target; target = target.parent) {
    if (target.name === "microscope-slide")
      return { text: "拖动玻片 · 物像沿相反方向移动", cursor: "grab" };
    const m = target.userData;
    if (m?.action !== "parameter") continue;
    let text;
    if (m.key === "mag")
      text = `${m.value / 10}× 物镜 · 点击切换至总倍率 ${m.value}×`;
    if (m.key === "specimen")
      text = `${["字母 e", "洋葱表皮", "池塘微生物"][m.value]} · 点击换片`;
    if (m.key === "aperture")
      text = "孔径光阑拨杆 · 点击开大，Shift + 点击收小";
    if (m.key === "power")
      text = m.value === 1 ? "点击开启光源" : "点击关闭光源";
    if (m.key === "coarse" || m.key === "focus")
      text = `${m.key === "coarse" ? "粗" : "细"}准焦螺旋 · 上拖增加、下拖减少；点击步进，Shift + 点击反向`;
    if (m.key === "x" || m.key === "y")
      text = `玻片 ${m.key.toUpperCase()} 轴手轮 · 点击移动，Shift + 点击反向`;
    return text ? { text, cursor: "pointer" } : null;
  }
  return null;
}

export function installMicroscopeHover({
  element,
  camera,
  root,
  onHint,
  resolveAction = microscopeHoverAction,
  meshesOnly = false,
  pickable,
}) {
  const ray = new T.Raycaster(),
    point = new T.Vector2();
  let frame = null,
    pending = null,
    previous = "";
  function show(action) {
    const text = action?.text || "";
    if (text !== previous) {
      previous = text;
      onHint(text);
    }
    if (element.style.cursor !== "grabbing")
      element.style.cursor = action?.cursor || "";
  }
  function update() {
    frame = null;
    if (!pending) return;
    const r = element.getBoundingClientRect();
    if (!r.width || !r.height) return;
    point.set(
      ((pending.x - r.left) / r.width) * 2 - 1,
      1 - ((pending.y - r.top) / r.height) * 2,
    );
    ray.setFromCamera(point, camera);
    const hits = ray.intersectObject(root, true);
    show(
      resolveAction(
        firstVisibleHit(
          pickable
            ? hits.filter((hit) => pickable(hit.object))
            : meshesOnly
              ? hits.filter((hit) => hit.object.isMesh)
              : hits,
        )?.object,
      ),
    );
  }
  function move(event) {
    if (event.pointerType === "touch" || event.buttons) return;
    pending = { x: event.clientX, y: event.clientY };
    if (frame === null) frame = requestAnimationFrame(update);
  }
  function leave() {
    if (frame !== null) cancelAnimationFrame(frame);
    frame = null;
    pending = null;
    show(null);
  }
  // Register before drag capture handlers so a queued hover cannot overwrite
  // drag feedback after pointerdown stops event propagation.
  element.addEventListener("pointerdown", leave, true);
  element.addEventListener("pointerup", leave, true);
  element.addEventListener("pointercancel", leave, true);
  element.addEventListener("pointermove", move);
  element.addEventListener("pointerleave", leave);
  const dispose = () => {
    leave();
    element.removeEventListener("pointerdown", leave, true);
    element.removeEventListener("pointerup", leave, true);
    element.removeEventListener("pointercancel", leave, true);
    element.removeEventListener("pointermove", move);
    element.removeEventListener("pointerleave", leave);
  };
  dispose.clear = leave;
  return dispose;
}
import { firstVisibleHit } from "./visibleSceneHit.mjs";
