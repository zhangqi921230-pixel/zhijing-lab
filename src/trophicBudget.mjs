export function trophicBudget(energy, efficiency) {
  const ratio = efficiency / 100;
  const levels = [energy, energy * ratio, energy * ratio * ratio];
  return {
    levels,
    diverted: [levels[0] - levels[1], levels[1] - levels[2]],
    retained: levels[2],
  };
}
