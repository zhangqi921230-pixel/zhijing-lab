// @vitest-environment jsdom
import { expect, it, vi } from "vitest";
import { installSceneClick } from "../src/sceneClick.mjs";
it("accepts only complete primary clicks and rejects cancelled, secondary and out-and-back drags", () => {
  const el = document.createElement("canvas"),
    click = vi.fn(),
    dispose = installSceneClick(el, click);
  const send = (name, extra = {}) => {
    const event = new Event(name);
    Object.assign(event, {
      pointerId: 1,
      button: 0,
      isPrimary: true,
      clientX: 10,
      clientY: 10,
      ...extra,
    });
    el.dispatchEvent(event);
  };
  send("pointerdown");
  send("pointerup", { clientX: 14 });
  expect(click).toHaveBeenCalledTimes(1);
  send("pointerup");
  expect(click).toHaveBeenCalledTimes(1);
  for (const extra of [{ button: 2 }, { isPrimary: false }]) {
    send("pointerdown", extra);
    send("pointerup", extra);
  }
  send("pointerdown");
  send("pointermove", { clientX: 30 });
  send("pointermove");
  send("pointerup");
  for (const event of ["pointercancel", "lostpointercapture", "pointerleave"]) {
    send("pointerdown");
    send(event);
    send("pointerup");
  }
  send("pointerdown");
  window.dispatchEvent(new Event("blur"));
  send("pointerup");
  send("pointerdown");
  send("pointerup", { pointerId: 2 });
  send("pointerup");
  send("pointerdown");
  send("pointerdown", { pointerId: 2, isPrimary: false });
  send("pointerup");
  expect(click).toHaveBeenCalledTimes(1);
  send("pointerdown");
  send("pointerup");
  expect(click).toHaveBeenCalledTimes(2);
  dispose();
  send("pointerdown");
  send("pointerup");
  expect(click).toHaveBeenCalledTimes(2);
});
