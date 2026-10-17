import { genotypeNames } from "./geneticsSampling.mjs";
export function geneticsCondition(p, dominantOnly = true) {
  const entries = Array.from({ length: 4 }, (_, i) => {
    const first = genotypeNames[p.parent1][Math.floor(i / 2)],
      second = genotypeNames[p.parent2][i % 2];
    const genotype = [first, second].sort().join("");
    return {
      first,
      second,
      genotype,
      included: !dominantOnly || genotype !== "aa",
    };
  });
  const included = entries.filter((e) => e.included),
    heterozygotes = included.filter((e) => e.genotype === "Aa").length;
  return {
    entries,
    denominator: included.length,
    heterozygotes,
    probability: included.length ? heterozygotes / included.length : null,
  };
}
