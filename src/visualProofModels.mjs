export function squareAreas(p) {
  return {
    a2: p.a ** 2,
    b2: p.b ** 2,
    c: Math.hypot(p.a, p.b),
    outer: (p.a + p.b) ** 2,
    triangles: 2 * p.a * p.b,
  };
}
export function mirrorRay(p) {
  const height =
    (p.eyeDistance * p.objectHeight + p.distance * p.eyeHeight) /
    (p.distance + p.eyeDistance);
  const incident = Math.atan2(Math.abs(height - p.objectHeight), p.distance);
  const reflected = Math.atan2(Math.abs(p.eyeHeight - height), p.eyeDistance);
  return {
    height,
    incident,
    reflected,
    imageDistance: p.distance,
    imageHeight: p.objectHeight,
  };
}
export function visualProofReadouts(id, p) {
  if (id === "pythagoras-proof") {
    const q = squareAreas(p);
    return [
      ["直角边正方形 a²", q.a2.toFixed(2)],
      ["直角边正方形 b²", q.b2.toFixed(2)],
      ["斜边正方形 c²", (q.a2 + q.b2).toFixed(2)],
    ];
  }
  const q = mirrorRay(p);
  return [
    ["像到镜面的距离", `${q.imageDistance.toFixed(1)} cm`],
    [
      "入射角 / 反射角",
      `${((q.incident * 180) / Math.PI).toFixed(1)}° / ${((q.reflected * 180) / Math.PI).toFixed(1)}°`,
    ],
    ["反射点高度", `${q.height.toFixed(2)} cm`],
  ];
}

export function mirrorReference(p) {
  const observer = { eyeDistance: 7, eyeHeight: 6 };
  const reference = mirrorRay({ ...p, ...observer });
  const primary = mirrorRay(p);
  return {
    ...observer,
    ...reference,
    coincident: Math.abs(reference.height - primary.height) < 1e-9,
  };
}
