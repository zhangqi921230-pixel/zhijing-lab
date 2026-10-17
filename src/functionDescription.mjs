const n = (value) => String(Number(value.toFixed(8))).replace("-", "−");
const suffix = (value) =>
  value === 0 ? "" : ` ${value < 0 ? "−" : "+"} ${n(Math.abs(value))}`;

export function functionExpression(p) {
  const k = p.k ?? 1;
  if (k === 0 && [3, 7].includes(p.type)) return "无定义（k = 0）";
  if (p.a === 0 || k === 0)
    return `y = ${n(p.b + (k === 0 && p.type === 6 ? p.a : 0))}`;
  const shifted = p.shift === 0 ? "x" : `(x${suffix(-p.shift)})`;
  const input =
    k === 1 ? shifted : k === -1 ? `−${shifted}` : `${n(k)}${shifted}`;
  const coefficient = p.a === 1 ? "" : p.a === -1 ? "−" : n(p.a);
  const powerInput = input === "x" ? "x" : `[${input}]`;
  let term;
  switch (p.type) {
    case 0:
      term = `${coefficient}${powerInput}²`;
      break;
    case 1:
      term = `${coefficient}sin(${input})`;
      break;
    case 2:
      term = `${coefficient}|${input}|`;
      break;
    case 3:
      term = `${n(p.a)}/(${input})`;
      break;
    case 4:
      term = `${coefficient}${powerInput}³`;
      break;
    case 5:
      term = `${coefficient}√(${input})`;
      break;
    case 6:
      term = `${Math.abs(p.a) === 1 ? coefficient : coefficient + "·"}2^(${input})`;
      break;
    case 7:
      term = `${coefficient}log₂(${input})`;
      break;
  }
  return `y = ${term}${suffix(p.b)}`;
}

export function functionRange(p) {
  const k = p.k ?? 1;
  if (k === 0 && [3, 7].includes(p.type)) return "空集";
  if (p.a === 0 || k === 0)
    return `{${n(p.b + (k === 0 && p.type === 6 ? p.a : 0))}}`;
  if ([0, 2, 5].includes(p.type))
    return p.a > 0 ? `[${n(p.b)}, +∞)` : `(−∞, ${n(p.b)}]`;
  if (p.type === 1)
    return `[${n(p.b - Math.abs(p.a))}, ${n(p.b + Math.abs(p.a))}]`;
  if (p.type === 3) return `全体实数，除去 ${n(p.b)}`;
  if (p.type === 6) return p.a > 0 ? `(${n(p.b)}, +∞)` : `(−∞, ${n(p.b)})`;
  return "全体实数";
}
