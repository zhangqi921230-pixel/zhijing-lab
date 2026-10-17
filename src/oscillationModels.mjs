const clean = (n) => (Math.abs(n) < 1e-10 ? 0 : n);
export function lissajousCycle(p) {
  let a = p.fx,
    b = p.fy;
  while (b) {
    const remainder = a % b;
    a = b;
    b = remainder;
  }
  return {
    period: 6 / a,
    xCycles: p.fx / a,
    yCycles: p.fy / a,
    xPeriod: 6 / p.fx,
    yPeriod: 6 / p.fy,
  };
}
export function lissajousPoint(p, time) {
  const a = (2 * Math.PI * time) / 6;
  return {
    x: clean(Math.sin(p.fx * a)),
    y: clean(p.height * Math.sin(p.fy * a + (p.phase * Math.PI) / 180)),
  };
}
export function standingState(p, time, position = p.probe / 100) {
  const speed = Math.sqrt(p.tension / 0.01),
    frequency = (p.mode * speed) / 2;
  const kx = p.mode * Math.PI * position,
    wt = (2 * Math.PI * frequency * time) / 60;
  const right = (p.amplitude / 2) * Math.sin(kx - wt),
    left = (p.amplitude / 2) * Math.sin(kx + wt);
  return {
    speed,
    frequency,
    wavelength: 2 / p.mode,
    right,
    left,
    y: clean(right + left),
    envelope: p.amplitude * Math.sin(kx),
    nodes: p.mode + 1,
  };
}
