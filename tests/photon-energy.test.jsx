// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { it, expect, vi } from "vitest";
import { photonEnergy } from "../src/photonEnergy.mjs";
import PhotonEmission from "../src/PhotonEmission.jsx";
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
it("photon energy and frequency scale inversely with wavelength", () => {
  for (const nm of [400, 450, 530, 589, 670, 700]) {
    const q = photonEnergy(nm);
    expect(q.frequency * nm * 1e-9).toBeCloseTo(299792458, 5);
    expect(q.electronVolts * nm).toBeCloseTo(1239.841984332, 6);
  }
  expect(photonEnergy(450).joules / photonEnergy(670).joules).toBeCloseTo(
    670 / 450,
    12,
  );
});
it("sequence uses discrete states, pauses on manual steps and cleans up its timer", async () => {
  vi.useFakeTimers();
  const host = document.createElement("div"),
    root = createRoot(host);
  const click = async (text) =>
    act(() =>
      [...host.querySelectorAll("button")]
        .find((b) => b.textContent === text)
        .click(),
    );
  try {
    await act(() => root.render(<PhotonEmission />));
    const y = () =>
      Number(
        host.querySelector('[data-testid="energy-state"]').getAttribute("cy"),
      );
    expect(y()).toBe(265);
    await click("播放能级演示");
    await act(() => vi.advanceTimersByTime(1100));
    expect(y()).toBe(265);
    await act(() => vi.advanceTimersByTime(1100));
    expect(y()).toBeLessThan(265);
    await act(() => vi.advanceTimersByTime(1100));
    expect(y()).toBe(265);
    expect(host.textContent).toContain("播放能级演示");
    await click("3. 激发态");
    const before = y();
    await click("450 nm");
    expect(y()).toBe(265);
    await click("3. 激发态");
    expect(y()).toBeLessThan(before);
    await click("播放能级演示");
    await click("1. 低能级");
    await act(() => vi.advanceTimersByTime(5000));
    expect(y()).toBe(265);
    await click("播放能级演示");
  } finally {
    await act(() => root.unmount());
    expect(vi.getTimerCount()).toBe(0);
    vi.useRealTimers();
  }
});
