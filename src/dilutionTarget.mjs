export function planDilution(solute, water, targetPercent, limit = 300) {
  if (
    !Number.isFinite(targetPercent) ||
    targetPercent <= 0 ||
    targetPercent > 100
  )
    return { status: "invalid" };
  const initialMass = solute + water;
  const totalMass = (100 * solute) / targetPercent;
  const added = totalMass - initialMass;
  if (added < -1e-8) return { status: "higher" };
  return {
    status: added > limit + 1e-8 ? "outside" : "ready",
    added: Math.max(0, added),
    totalMass,
  };
}
