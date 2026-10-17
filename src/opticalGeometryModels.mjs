export function pinholeState(p) {
  return {
    magnification: p.screen / p.object,
    imageHeight: (p.height * p.screen) / p.object,
  };
}
export function circleAngleState(p, time = 0) {
  const rad = Math.PI / 180;
  const point = (a) => [Math.cos(a * rad), -Math.sin(a * rad)];
  const position = p.position + 8 * Math.sin((time * Math.PI) / 3);
  const A = point(p.central / 2),
    B = point(-p.central / 2);
  const P = point(
    p.side === 1
      ? -p.central / 2 + (p.central * position) / 100
      : p.central / 2 + ((360 - p.central) * position) / 100,
  );
  const u = A.map((v, i) => v - P[i]),
    v = B.map((v, i) => v - P[i]);
  const angle =
    Math.acos(
      Math.max(
        -1,
        Math.min(
          1,
          (u[0] * v[0] + u[1] * v[1]) / Math.hypot(...u) / Math.hypot(...v),
        ),
      ),
    ) / rad;
  return {
    A,
    B,
    P,
    Q: [-1, 0],
    angle,
    position,
    intercepted: p.side === 1 ? 360 - p.central : p.central,
  };
}
export function opticalGeometryReadouts(id, p, time) {
  if (id === "pinhole") {
    const q = pinholeState(p);
    return [
      ["物体高度", `${p.height.toFixed(1)} cm`],
      ["像高大小", `${q.imageHeight.toFixed(2)} cm`],
      ["放大率大小", `${q.magnification.toFixed(2)} 倍`],
    ];
  }
  const q = circleAngleState(p, time);
  return [
    ["圆心角 ∠AOB", `${p.central}°`],
    ["圆周角 ∠APB", `${q.angle.toFixed(1)}°`],
    ["P 所对弧的度数", `${q.intercepted}°`],
  ];
}
