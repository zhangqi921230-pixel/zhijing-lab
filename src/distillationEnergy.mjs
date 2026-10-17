import { distillationState } from "./chemistryTopics.mjs";
export function distillationEnergy(p, time) {
  const q = distillationState(p.power, time, p.cooling),
    input = Math.max(0, p.power) * Math.max(0, time);
  const warming = Math.min(input, 200 * 4.18 * 80),
    vaporizing = q.evaporated * 2257;
  return { input, warming, vaporizing, condensing: p.cooling ? vaporizing : 0 };
}
