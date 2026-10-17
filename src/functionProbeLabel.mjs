// Curve samples are immutable between parameter/view changes in FunctionStudio.
const curveOrder = new WeakMap();

export function countLabelCrossings(line, rect) {
  let direction = curveOrder.get(line);
  if (direction === undefined) {
    direction = line.length > 1 && line.at(-1)[0] < line[0][0] ? -1 : 1;
    for (let i = 1; i < line.length; i++) {
      if (direction * (line[i][0] - line[i - 1][0]) < 0) {
        direction = 0;
        break;
      }
    }
    curveOrder.set(line, direction);
  }
  let first = 0,
    end = line.length - 1;
  if (direction) {
    const lower = direction > 0 ? rect.x : -(rect.x + rect.width);
    const upper = direction > 0 ? rect.x + rect.width : -rect.x;
    const bound = (value, inclusive) => {
      let lo = 0,
        hi = line.length;
      while (lo < hi) {
        const mid = (lo + hi) >>> 1;
        const x = direction * line[mid][0];
        if (x < value || (inclusive && x === value)) lo = mid + 1;
        else hi = mid;
      }
      return lo;
    };
    first = Math.max(0, bound(lower, false) - 1);
    end = Math.min(end, bound(upper, true));
  }
  let crossings = 0;
  for (let i = first; i < end; i++)
    if (segmentCrossesLabel(line[i], line[i + 1], rect)) crossings++;
  return crossings;
}

// Work in SVG coordinates, while padding and text retain screen-pixel size.
export function functionProbeLabel(
  point,
  text,
  bounds,
  scale = 1,
  curves = [],
  reserved = [],
) {
  const [px, py] = point;
  const width = Math.min(
    bounds.right - bounds.left,
    (text.length * 7 + 16) * scale,
  );
  const height = 24 * scale;
  const gap = 14 * scale;
  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
  const overlap = (a, b) =>
    Math.max(0, Math.min(a.x + a.width, b.x + b.width) - Math.max(a.x, b.x)) *
    Math.max(0, Math.min(a.y + a.height, b.y + b.height) - Math.max(a.y, b.y));
  const obstacles = [
    ...reserved,
    {
      x: bounds.left,
      y: 285,
      width: bounds.right - bounds.left,
      height: 30 * scale,
    },
    {
      x: 310 - 35 * scale,
      y: bounds.top,
      width: 40 * scale,
      height: bounds.bottom - bounds.top,
    },
    {
      x: px - 9 * scale,
      y: py - 9 * scale,
      width: 18 * scale,
      height: 18 * scale,
    },
  ];
  const choices = [0, 24, 48]
    .flatMap((offset) => [
      [px + gap + offset * scale, py - gap - height],
      [px + gap + offset * scale, py + gap],
      [px - gap - width - offset * scale, py - gap - height],
      [px - gap - width - offset * scale, py + gap],
    ])
    .map(([x, y], index) => {
      const rect = {
        x: clamp(x, bounds.left, bounds.right - width),
        y: clamp(y, bounds.top, bounds.bottom - height),
        width,
        height,
      };
      return {
        ...rect,
        score:
          obstacles.reduce((sum, o) => sum + overlap(rect, o), 0) * 100 +
          curves.reduce(
            (sum, line) => sum + countLabelCrossings(line, rect),
            0,
          ) *
            10000 +
          Math.abs(rect.x - x) +
          Math.abs(rect.y - y) +
          index * 0.01,
      };
    });
  choices.sort((a, b) => a.score - b.score);
  return choices[0];
}

export function segmentCrossesLabel(a, b, rect) {
  if (
    Math.max(a[0], b[0]) < rect.x ||
    Math.min(a[0], b[0]) > rect.x + rect.width ||
    Math.max(a[1], b[1]) < rect.y ||
    Math.min(a[1], b[1]) > rect.y + rect.height
  )
    return false;
  let lower = 0,
    upper = 1;
  for (const [origin, delta, min, max] of [
    [a[0], b[0] - a[0], rect.x, rect.x + rect.width],
    [a[1], b[1] - a[1], rect.y, rect.y + rect.height],
  ]) {
    if (delta === 0) {
      if (origin < min || origin > max) return false;
    } else {
      const lo = (min - origin) / delta,
        hi = (max - origin) / delta;
      lower = Math.max(lower, Math.min(lo, hi));
      upper = Math.min(upper, Math.max(lo, hi));
      if (lower > upper) return false;
    }
  }
  return true;
}
