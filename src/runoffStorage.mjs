// A linear reservoir with one-hour residence time; equivalent depth units.
export function runoffStorage(total, duration, time) {
  const t = Math.max(0, time),
    d = Math.max(0.01, duration),
    rate = Math.max(0, total) / d;
  const peak = rate * -Math.expm1(-d);
  const out = t <= d ? rate * -Math.expm1(-t) : peak * Math.exp(-(t - d));
  const input = Math.max(0, total) * Math.min(1, t / d),
    storage = out;
  return {
    inputRate: t < d ? rate : 0,
    outRate: out,
    storage,
    input,
    released: Math.max(0, input - storage),
    peak,
  };
}
