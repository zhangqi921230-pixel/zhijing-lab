import { it, expect, vi } from "vitest";
import * as T from "three";
import {
  captureOrbit,
  createCellCameraTransition,
  reduceCellCameraMotion,
} from "../src/CellCameraTransition.js";

it("defaults to system preference and allows an explicit page-level choice", () => {
  for (const system of [false, true]) {
    expect(reduceCellCameraMotion(0, system)).toBe(system);
    expect(reduceCellCameraMotion(undefined, system)).toBe(system);
    expect(reduceCellCameraMotion(1, system)).toBe(false);
    expect(reduceCellCameraMotion(2, system)).toBe(true);
  }
});

it("moves around the observation target, settles exactly and stops scheduling", () => {
  const camera = new T.PerspectiveCamera(28);
  camera.position.set(0, 0, 8);
  const controls = { target: new T.Vector3(), minDistance: 4 };
  const from = captureOrbit(camera, controls);
  const to = {
    position: new T.Vector3(1, 2, 0),
    target: new T.Vector3(1, 0, 0),
    fov: 35,
    minDistance: 0.6,
  };
  const move = createCellCameraTransition(camera, controls);
  move.begin(from, to, 100);
  move.painted(100);
  expect(move.sample(310)).toBe(true);
  expect(camera.position.distanceTo(controls.target)).toBeCloseTo(5);
  expect(controls.target.x).toBeCloseTo(0.5);
  expect(camera.fov).toBeCloseTo(31.5);
  expect(move.sample(520)).toBe(false);
  expect(camera.position.distanceTo(to.position)).toBeLessThan(1e-12);
  expect(controls.target.equals(to.target)).toBe(true);
  expect(controls.minDistance).toBe(0.6);
  expect(move.sample(600)).toBe(false);
  move.begin(from, to, 700);
  move.painted(700);
  move.sample(800);
  const beforeResize = camera.position.clone();
  move.refit(() => {
    camera.fov = 48;
  }, 800);
  expect(camera.position.distanceTo(beforeResize)).toBeLessThan(1e-12);
  move.painted(800);
  expect(move.sample(1220)).toBe(false);
  expect(camera.fov).toBe(48);
  expect(camera.position.distanceTo(to.position)).toBeLessThan(1e-12);
});

it("retains context until arrival or cancellation and preserves callbacks across resize", () => {
  const camera = new T.PerspectiveCamera(28);
  camera.position.set(0, 0, 8);
  const controls = { target: new T.Vector3(), minDistance: 4 };
  const from = captureOrbit(camera, controls);
  const to = { ...from, position: new T.Vector3(0, 2, 2), minDistance: 0.6 };
  const move = createCellCameraTransition(camera, controls);
  const events = [];
  const settle = vi.fn(() => events.push("settle"));
  move.begin(from, to, 0, {
    settle,
    beforeFit: () => events.push("destination"),
    afterFit: () => events.push("context"),
  });
  move.sample(100);
  expect(settle).not.toHaveBeenCalled();
  move.refit(() => events.push("fit"), 100);
  expect(events).toEqual(["destination", "fit", "context"]);
  move.painted(100);
  move.sample(520);
  move.sample(600);
  move.cancel();
  expect(settle).toHaveBeenCalledTimes(1);
  move.begin(from, to, 700, { settle });
  move.cancel();
  expect(settle).toHaveBeenCalledTimes(2);
});

it("respects reduced motion and lets user input interrupt without a delayed snap", () => {
  const camera = new T.PerspectiveCamera(28);
  camera.position.set(0, 1, 8);
  const controls = { target: new T.Vector3(), minDistance: 4 };
  const from = captureOrbit(camera, controls);
  const to = {
    ...from,
    position: new T.Vector3(2, 1, 3),
    fov: 32,
    minDistance: 0.5,
  };
  const move = createCellCameraTransition(camera, controls);
  move.begin(from, to, 0);
  move.painted(0);
  move.sample(100);
  move.cancel();
  const interrupted = camera.position.clone();
  expect(move.sample(500)).toBe(false);
  expect(camera.position.equals(interrupted)).toBe(true);
  move.begin(captureOrbit(camera, controls), to, 500);
  expect(move.sample(500, true)).toBe(false);
  expect(camera.position.distanceTo(to.position)).toBeLessThan(1e-12);
});

it("does not spend animation time waiting for the first scene render", () => {
  const camera = new T.PerspectiveCamera(28);
  camera.position.set(0, 0, 8);
  const controls = { target: new T.Vector3(), minDistance: 4 };
  const from = captureOrbit(camera, controls);
  const to = { ...from, position: new T.Vector3(0, 0, 2), minDistance: 0.5 };
  const move = createCellCameraTransition(camera, controls);
  move.begin(from, to, 0);
  expect(move.sample(900)).toBe(true);
  expect(camera.position.equals(from.position)).toBe(true);
  expect(move.painted(1000)).toBe(1000);
  expect(move.painted(1100)).toBeNull();
  expect(move.sample(1210)).toBe(true);
  expect(camera.position.z).toBeCloseTo(5);
  expect(move.sample(1420)).toBe(false);
});
