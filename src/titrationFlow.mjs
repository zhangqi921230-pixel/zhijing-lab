export function titrationFlowRate(value) {
  return Number.isFinite(value) ? Math.max(0.1, Math.min(1, value)) : 0.5;
}

export function advanceTitration(base, seconds, rate) {
  return Math.min(100, base + Math.max(0, seconds) * titrationFlowRate(rate));
}
