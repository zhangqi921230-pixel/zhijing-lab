// Conservative interior of the rounded envelope. The 0.91 inset also leaves
// room for its surface ripple and the finite radius of each particle.
export function cellParticleFits([x, y, z], radius = 0.018) {
  return (
    ((Math.abs(x) + radius) / (2.48 * 0.91)) ** (2 / 0.47) +
      ((Math.abs(y + 0.03) + radius) / (1.23 * 0.91)) ** (2 / 0.67) +
      ((Math.abs(z) + radius) / (1.82 * 0.91)) ** (2 / 0.47) <
    1
  );
}

export function cytoplasmicParticles() {
  const points = [];
  const radicalInverse = (index, base) => {
    let result = 0,
      fraction = 1 / base;
    while (index > 0) {
      result += (index % base) * fraction;
      index = Math.floor(index / base);
      fraction /= base;
    }
    return result;
  };
  for (let i = 0; i < 560; i++) {
    // Low-discrepancy volume sampling avoids sinusoidal edge clustering.
    const x = (radicalInverse(i + 1, 2) * 2 - 1) * 2.05;
    const z = (radicalInverse(i + 1, 3) * 2 - 1) * 1.4;
    const y = -0.86 + radicalInverse(i + 1, 5) * 0.68;
    const point = [x, y, z];
    // Keep the teaching organelles unobstructed. These are illustrative
    // positions, not a measured distribution or molecular-scale density.
    if (
      cellParticleFits(point) &&
      ((x - 0.55) / 1.3) ** 2 + (z / 1.1) ** 2 > 1 &&
      ((x + 1.36) / 0.68) ** 2 + ((z - 0.55) / 0.68) ** 2 > 1
    )
      points.push(point);
  }
  return points;
}
