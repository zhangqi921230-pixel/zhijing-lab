import { it, expect, vi } from "vitest";
import { scheduleCellMaterialWarmup } from "../src/CellMaterialWarmup.js";
it("compiles in an idle slot and cancels safely before disposal", () => {
  let callback;
  const host = {
    requestIdleCallback: (fn) => {
      callback = fn;
      return 1;
    },
    cancelIdleCallback: vi.fn(),
  };
  const renderer = { compile: vi.fn(), domElement: { dataset: {} } };
  const scene = {},
    camera = {};
  const cancel = scheduleCellMaterialWarmup(renderer, scene, camera, host);
  expect(renderer.compile).not.toHaveBeenCalled();
  callback();
  expect(renderer.compile).toHaveBeenCalledWith(scene, camera);
  expect(renderer.domElement.dataset.materialWarmup).toBe("submitted");
  cancel();
  const stop = scheduleCellMaterialWarmup(renderer, scene, camera, host);
  stop();
  callback();
  expect(renderer.compile).toHaveBeenCalledTimes(1);
});
