// Drag the image, with inverse slide motion and one owning pointer.
export function installMicroscopeFieldDrag(element, getCurrent) {
  let drag = null;
  const doc = element.ownerDocument;
  const win = doc.defaultView;
  const clamp = (value) => Math.max(-40, Math.min(40, Math.round(value)));
  function end(event) {
    if (
      !drag ||
      (event?.pointerId !== undefined && event.pointerId !== drag.id)
    )
      return;
    const id = drag.id;
    drag = null;
    if (element.hasPointerCapture(id)) element.releasePointerCapture(id);
  }
  function down(event) {
    const current = getCurrent();
    if (
      drag ||
      event.button !== 0 ||
      event.isPrimary === false ||
      !current.onChange
    )
      return;
    const width = element.getBoundingClientRect().width;
    if (!(width > 0) || !(current.zoom > 0)) return;
    try {
      element.setPointerCapture(event.pointerId);
    } catch {
      return;
    }
    drag = {
      id: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      px: current.p.x,
      py: current.p.y,
      zoom: current.zoom,
      specimen: current.p.specimen,
      source: current.source,
      width,
      ratio: 280 / width / current.zoom,
    };
    element.focus({ preventScroll: true });
    event.preventDefault();
  }
  function move(event) {
    if (!drag || event.pointerId !== drag.id) return;
    const current = getCurrent();
    if (
      current.zoom !== drag.zoom ||
      current.p.specimen !== drag.specimen ||
      current.source !== drag.source ||
      element.getBoundingClientRect().width !== drag.width
    ) {
      end();
      return;
    }
    current.onChange?.(
      "x",
      clamp(drag.px - (event.clientX - drag.x) * drag.ratio),
    );
    current.onChange?.(
      "y",
      clamp(drag.py + (event.clientY - drag.y) * drag.ratio),
    );
  }
  function visibility() {
    if (doc.hidden) end();
  }
  const handlers = {
    pointerdown: down,
    pointermove: move,
    pointerup: end,
    pointercancel: end,
    lostpointercapture: end,
  };
  for (const [type, handler] of Object.entries(handlers))
    element.addEventListener(type, handler);
  win.addEventListener("blur", end);
  doc.addEventListener("visibilitychange", visibility);
  return () => {
    end();
    for (const [type, handler] of Object.entries(handlers))
      element.removeEventListener(type, handler);
    win.removeEventListener("blur", end);
    doc.removeEventListener("visibilitychange", visibility);
  };
}
