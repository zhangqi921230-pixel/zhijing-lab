export function gameteRoute(parent, chosen, progress) {
  const t = Math.max(0, Math.min(1, progress)),
    start = [(parent ? 580 : 220) + (chosen ? 65 : -65), 155],
    control = [parent ? 650 : 150, 290],
    end = [parent ? 425 : 375, 290];
  return {
    path: `M${start} Q${control} ${end}`,
    x: (1 - t) ** 2 * start[0] + 2 * (1 - t) * t * control[0] + t * t * end[0],
    y: (1 - t) ** 2 * start[1] + 2 * (1 - t) * t * control[1] + t * t * end[1],
  };
}
