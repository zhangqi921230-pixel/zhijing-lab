// Ordered phenotype sequences of four independent offspring.
export function offspringQuartet(probability) {
  const sequences = Array.from({ length: 16 }, (_, mask) => {
    const recessive = Array.from({ length: 4 }, (_, i) =>
      Boolean(mask & (1 << i)),
    );
    const count = recessive.filter(Boolean).length;
    return {
      mask,
      recessive,
      count,
      probability: probability ** count * (1 - probability) ** (4 - count),
    };
  });
  return {
    sequences,
    distribution: Array.from({ length: 5 }, (_, count) => ({
      count,
      arrangements: sequences.filter((s) => s.count === count).length,
      probability: sequences
        .filter((s) => s.count === count)
        .reduce((sum, s) => sum + s.probability, 0),
    })),
  };
}
