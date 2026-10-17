export const GAS_R = 8.314462618; // kPa·L·mol⁻¹·K⁻¹
export function gasState({ volume, temperature, amount }) {
  return {
    pressure: (amount * GAS_R * temperature) / volume,
    pv: amount * GAS_R * temperature,
  };
}
export function binomial(n, p) {
  return Array.from({ length: n + 1 }, (_, k) => {
    let choose = 1;
    for (let j = 1; j <= k; j++) choose *= (n - j + 1) / j;
    return choose * p ** k * (1 - p) ** (n - k);
  });
}
export function sampleCoins(n, p, count, seed = 7291) {
  let state = seed >>> 0;
  const bins = Array(n + 1).fill(0),
    history = [];
  let heads = 0;
  let last = [];
  for (let i = 0; i < count; i++) {
    let k = 0;
    last = [];
    for (let j = 0; j < n; j++) {
      state = (Math.imul(1664525, state) + 1013904223) >>> 0;
      const head = state / 4294967296 < p;
      last.push(head);
      if (head) k++;
    }
    bins[k]++;
    heads += k;
    history.push(heads / ((i + 1) * n));
  }
  return {
    bins,
    history,
    heads,
    last,
    frequency: count ? heads / (count * n) : null,
  };
}
export function moonState(angle) {
  const a = ((angle % 360) + 360) % 360;
  const names = [
    "新月",
    "蛾眉月",
    "上弦月",
    "盈凸月",
    "满月",
    "亏凸月",
    "下弦月",
    "残月",
  ];
  return {
    angle: a,
    fraction: (1 - Math.cos((a * Math.PI) / 180)) / 2,
    day: (a / 360) * 29.53059,
    name: names[
      a === 0
        ? 0
        : a < 90
          ? 1
          : a === 90
            ? 2
            : a < 180
              ? 3
              : a === 180
                ? 4
                : a < 270
                  ? 5
                  : a === 270
                    ? 6
                    : 7
    ],
  };
}
// Orthographic visible hemisphere, light lies in x-z plane. No Earth shadow.
export function moonLitPath(angle, radius = 100) {
  const a = (angle * Math.PI) / 180,
    c = Math.cos(a),
    waxing = Math.sin(a) >= 0;
  const points = [];
  for (let i = 0; i <= 100; i++) {
    const y = -radius + (2 * radius * i) / 100,
      x = Math.sqrt(Math.max(0, radius * radius - y * y));
    points.push([waxing ? x : -x, y]);
  }
  for (let i = 100; i >= 0; i--) {
    const y = -radius + (2 * radius * i) / 100,
      x = Math.sqrt(Math.max(0, radius * radius - y * y));
    points.push([waxing ? c * x : -c * x, y]);
  }
  return `M${points.map((p) => p.join(",")).join("L")}Z`;
}
