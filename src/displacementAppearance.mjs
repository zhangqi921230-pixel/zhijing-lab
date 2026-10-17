// Qualitative display mapping, not a corrosion or particle-settling simulation.
export function displacementAppearance(metal, mass, state) {
  const molar = metal === "zinc" ? 65.38 : metal === "copper" ? 63.546 : 55.845;
  const initial = Math.max(0, mass) / molar;
  const metalFraction = initial ? Math.max(0, 1 - state.extent / initial) : 0;
  const settling = Math.max(0, Math.min(1, (0.08 - metalFraction) / 0.08));
  return { metalFraction, settling };
}
