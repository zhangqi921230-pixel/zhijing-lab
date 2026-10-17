// 0.1 mol/L CuSO4 needs an equal volume of 0.2 mol/L NaOH.
// The first drop reaches the liquid at .5 s; delivery finishes at 8 s.
export const reactionTiming = { firstImpact: 0.5, end: 8, interval: 0.1 };
export const dosingFraction = (time) =>
  Math.max(
    0,
    Math.min(
      1,
      (time - reactionTiming.firstImpact) /
        (reactionTiming.end - reactionTiming.firstImpact),
    ),
  );

export function dosingTime(volume, capacity) {
  if (!(capacity > 0) || volume <= 0) return 0;
  return (
    reactionTiming.firstImpact +
    ((reactionTiming.end - reactionTiming.firstImpact) *
      Math.min(capacity, volume)) /
      capacity
  );
}

export function dosingState(p, time) {
  const delivered = p.base * dosingFraction(time);
  return {
    delivered,
    remaining: Math.max(0, p.base - delivered),
    equivalence: p.copper,
    canReachEquivalence: p.base >= p.copper && p.base > 0,
  };
}
