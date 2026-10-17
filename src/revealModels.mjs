export const prismColors = [
  { name: "红", wavelength: 650, color: "#c84840" },
  { name: "黄", wavelength: 589, color: "#af830d" },
  { name: "绿", wavelength: 550, color: "#2a9568" },
  { name: "蓝", wavelength: 470, color: "#357dc9" },
  { name: "紫", wavelength: 420, color: "#9566c4" },
];
const radians = Math.PI / 180;
export function prismState(p) {
  return prismColors.map((color) => {
    const index =
      p.index + 0.0042 * (1 / (color.wavelength / 1000) ** 2 - 1 / 0.55 ** 2);
    const r1 = Math.asin(Math.sin(p.angle * radians) / index) / radians;
    const i2 = 60 - r1;
    const sine = index * Math.sin(i2 * radians);
    const tir = sine > 1;
    const r2 = tir ? null : Math.asin(sine) / radians;
    const insideAngle = (30 - r1) * radians;
    const entry = [360, 110 + 90 * Math.sqrt(3)];
    const dx = Math.cos(insideAngle),
      dy = Math.sin(insideAngle);
    const distance =
      (Math.sqrt(3) * (entry[0] - 450) - entry[1] + 110) /
      (dy - Math.sqrt(3) * dx);
    const exit = [entry[0] + dx * distance, entry[1] + dy * distance];
    const outgoingAngle = (tir ? 180 - 60 - (30 - r1) : -30 + r2) * radians;
    const end = [
      exit[0] + Math.cos(outgoingAngle) * (tir ? 58 : 230),
      exit[1] + Math.sin(outgoingAngle) * (tir ? 58 : 230),
    ];
    return {
      ...color,
      index,
      r1,
      i2,
      r2,
      tir,
      entry,
      exit,
      end,
      deviation: tir ? null : p.angle + r2 - 60,
    };
  });
}
export function visiblePrismRays(p) {
  const rays = prismState(p);
  return p.color === 1
    ? [rays[0]]
    : p.color === 2
      ? [rays[2]]
      : p.color === 3
        ? [rays[4]]
        : p.color === 4
          ? [rays[0], rays[4]]
          : rays;
}
export function circleAreaState(p) {
  return {
    area: Math.PI * p.radius ** 2,
    halfCircumference: Math.PI * p.radius,
    sectorAngle: 360 / p.sectors,
    sagitta: p.radius * (1 - Math.cos(Math.PI / p.sectors)),
  };
}
export function revealReadouts(id, p) {
  if (id === "circle-area") {
    const q = circleAreaState(p);
    return [
      ["圆面积", `${q.area.toFixed(2)} cm²`],
      ["半个圆周长", `${q.halfCircumference.toFixed(2)} cm`],
      ["每块圆心角", `${q.sectorAngle.toFixed(2)}°`],
    ];
  }
  const rays = prismState(p);
  return [
    [
      "红光偏向角",
      rays[0].tir ? "第二界面全反射" : `${rays[0].deviation.toFixed(2)}°`,
    ],
    [
      "紫光偏向角",
      rays[4].tir ? "第二界面全反射" : `${rays[4].deviation.toFixed(2)}°`,
    ],
    ["棱镜顶角", "60°"],
  ];
}
