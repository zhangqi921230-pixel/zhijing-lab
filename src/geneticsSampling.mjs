export const genotypeNames = ["AA", "Aa", "aa"];
export function drawOffspring(parent1, parent2, random = Math.random) {
  const first = Math.min(1, Math.floor(random() * 2));
  const second = Math.min(1, Math.floor(random() * 2));
  return {
    first,
    second,
    genotype: [genotypeNames[parent1][first], genotypeNames[parent2][second]]
      .sort()
      .join(""),
  };
}
export function summarizeOffspring(samples) {
  const counts = { AA: 0, Aa: 0, aa: 0 };
  for (const sample of samples) counts[sample.genotype]++;
  return counts;
}

export function recessiveFrequencyHistory(samples) {
  let recessive = 0;
  return samples.map((sample, i) => {
    if (sample.genotype === "aa") recessive++;
    return { n: i + 1, count: recessive, frequency: recessive / (i + 1) };
  });
}
