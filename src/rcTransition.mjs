import { rc } from "./advancedModels.mjs";
export function switchRCMode(p, t, mode) {
  if (mode === p.mode) return p;
  const ratio = Math.max(0, Math.min(100, (rc(p, t).voltage / p.u) * 100));
  return { ...p, mode, [mode ? "initialRatio" : "chargeInitialRatio"]: ratio };
}
