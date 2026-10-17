export function areaCutState(p, time) {
  const fraction = Math.max(0, Math.min(1, time / 6));
  const smooth = (t) => {
    const u = Math.max(0, Math.min(1, t));
    return u * u * (3 - 2 * u);
  };
  const t = fraction * 6;
  const clearance = p.height + 0.35;
  return {
    fraction,
    shift: p.base * smooth((t - 1.5) / 3),
    drop:
      clearance *
      (t < 1.5 ? smooth(t / 1.5) : t > 4.5 ? 1 - smooth((t - 4.5) / 1.5) : 1),
    stage:
      p.shear === 0
        ? "原图已是矩形"
        : t === 1.5
          ? "移出完成"
          : t === 4.5
            ? "平移完成"
            : t === 0
              ? "确定剪切线"
              : t < 1.5
                ? "向下移出"
                : t < 4.5
                  ? "向右平移"
                  : t < 6
                    ? "向上归位"
                    : "矩形已拼成",
    area: p.base * p.height,
    triangle: (p.shear * p.height) / 2,
    side: Math.hypot(p.shear, p.height),
  };
}
export function hydraulicState(p, time) {
  const distance = p.stroke * Math.max(0, Math.min(1, time / 6));
  return {
    distance,
    outputDistance: distance / p.ratio,
    outputForce: p.force * p.ratio,
    pressure: p.force,
    volume: 10 * distance,
    work: (p.force * distance) / 100,
  };
}
export function discoveryReadouts(id, p, time) {
  const q = id === "area-cut" ? areaCutState(p, time) : hydraulicState(p, time);
  return id === "area-cut"
    ? [
        ["总面积", q.area.toFixed(2)],
        ["剪下三角形面积", q.triangle.toFixed(2)],
        ["斜边长度", q.side.toFixed(2)],
      ]
    : [
        ["输出力", `${q.outputForce.toFixed(0)} N`],
        ["外加压强增量", `${q.pressure.toFixed(0)} kPa`],
        ["两端机械功", `${q.work.toFixed(2)} J`],
      ];
}
