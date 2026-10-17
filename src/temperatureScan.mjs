export const TEMPERATURE_SCAN_RATE = 4;
// A parameter scan through equilibrium states, not a heat-transfer model.
export function advanceTemperatureScan(temp, direction, dt) {
  const next = Math.max(
    0,
    Math.min(80, temp + direction * TEMPERATURE_SCAN_RATE * Math.max(0, dt)),
  );
  return { temp: next, done: direction > 0 ? next >= 80 : next <= 0 };
}
