// Teaching scenarios, not calibrated runoff coefficients. Storage change is zero.
export const surfaceInfiltration = (pervious) => 10 + 0.6 * pervious;
export const perviousShare = (infil) => (infil - 10) / 0.6;
export function surfaceBudget(rain, evap, pervious) {
  const infil = surfaceInfiltration(pervious);
  return {
    infil: (rain * infil) / 100,
    evap: (rain * evap) / 100,
    runoff: (rain * (100 - evap - infil)) / 100,
  };
}
export function surfaceTarget(rain, evap, target = 30) {
  if (rain === 0) return { possible: true, required: 0 };
  const required = Math.max(
    0,
    ((100 - evap - (target / rain) * 100 - 10) / 60) * 100,
  );
  return { possible: required <= 100 + 1e-9, required };
}
