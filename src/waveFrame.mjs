import { waveState } from "./visualPhysics.mjs";
// Multiples of 48 put all 49 quarter-metre markers on exact samples.
// At least 32 segments per wavelength; 144 segments keep long waves smooth.
export function waveFrame(p, t) {
  const wavelength = p.speed / p.frequency;
  const segments = Math.ceil(Math.max(144, (12 / wavelength) * 32) / 48) * 48;
  const samples = Array.from({ length: segments + 1 }, (_, i) => {
    const x = (12 * i) / segments;
    return { x, ...waveState(p, x, t) };
  });
  return {
    segments,
    samples,
    markers: Array.from({ length: 49 }, (_, i) => samples[(i * segments) / 48]),
  };
}
