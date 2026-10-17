export function photonEnergy(wavelengthNm) {
  const frequency = 299792458 / (wavelengthNm * 1e-9);
  const joules = 6.62607015e-34 * frequency;
  return { frequency, joules, electronVolts: joules / 1.602176634e-19 };
}
