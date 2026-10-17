import * as T from "three";
export function vesselGraduations(radius, height) {
  const points = [],
    count = 15,
    segments = 6;
  for (let i = 1; i <= count; i++) {
    const y = 0.09 + ((height * 0.88 - 0.09) * i) / count;
    const width = i % 3 === 0 ? 0.5 : 0.27;
    for (let j = 0; j < segments; j++) {
      for (const f of [j / segments, (j + 1) / segments]) {
        const angle = 0.37 + f * width;
        points.push(
          (radius + 0.002) * Math.sin(angle),
          y,
          (radius + 0.002) * Math.cos(angle),
        );
      }
    }
  }
  const geometry = new T.BufferGeometry();
  geometry.setAttribute("position", new T.Float32BufferAttribute(points, 3));
  return geometry;
}
