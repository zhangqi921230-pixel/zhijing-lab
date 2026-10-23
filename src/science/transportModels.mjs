export function bicycleModel(value, rear = 16) {
  const p = Math.max(0, Math.min(100, value)) / 100,
    R = 80,
    r = rear * 2,
    d = 350;
  const c = (R - r) / d,
    s = Math.sqrt(1 - c * c);
  return {
    ratio: 40 / rear,
    frontTurns: p,
    rearTurns: (p * 40) / rear,
    chainTravel: p * 2 * Math.PI * R,
    chain: `M${220 + R * c} ${245 - R * s}L${570 + r * c} ${245 - r * s}A${r} ${r} 0 0 1 ${570 + r * c} ${245 + r * s}L${220 + R * c} ${245 + R * s}A${R} ${R} 0 1 1 ${220 + R * c} ${245 - R * s}Z`,
  };
}
export function brakeModel(value) {
  const p = Math.max(0, Math.min(100, value)) / 100,
    contact = p >= 0.25,
    q = Math.max(0, p - 0.25);
  return {
    gap: 18 * Math.max(0, 1 - p / 0.25),
    contact,
    heat: contact ? q / 0.75 : 0,
    angle: 720 * (contact ? 0.25 + q - (q * q) / 1.5 : p),
  };
}
export function elevatorModel(value) {
  const p = Math.max(0, Math.min(100, value)) / 100;
  return {
    car: 310 - p * 190,
    counter: 110 + p * 190,
    angle: (((-p * 190) / 55) * 180) / Math.PI,
  };
}
export function shipModel(value) {
  const load = Math.round((Math.max(0, Math.min(100, value)) / 100) * 8);
  // Submerged area of the drawing's trapezoidal section, not a full vessel volume.
  const area = 25000 + 2500 * load,
    k = 110 / 320;
  const draft = (-380 + Math.sqrt(380 * 380 + 4 * k * area)) / (2 * k);
  return { load, draft, top: 250 + draft - 160, area };
}
