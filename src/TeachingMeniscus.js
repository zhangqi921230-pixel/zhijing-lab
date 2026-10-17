import * as T from "three";
// A normalized shallow concave surface. Subtract its discrete area-weighted
// mean so adding the meniscus does not alter the nominal collected volume.
export function teachingMeniscusGeometry(segments = 32, rings = 6) {
  const vertices = [0, 0, 0],
    indices = [];
  for (let j = 1; j <= rings; j++) {
    const r = j / rings;
    for (let i = 0; i < segments; i++) {
      const a = (i * 2 * Math.PI) / segments;
      vertices.push(r * Math.cos(a), r ** 8, r * Math.sin(a));
    }
  }
  for (let i = 0; i < segments; i++)
    indices.push(0, 1 + ((i + 1) % segments), 1 + i);
  for (let j = 1; j < rings; j++)
    for (let i = 0; i < segments; i++) {
      const a = 1 + (j - 1) * segments + i,
        b = 1 + (j - 1) * segments + ((i + 1) % segments);
      const c = a + segments,
        d = b + segments;
      indices.push(a, b, c, b, d, c);
    }
  let area = 0,
    integral = 0;
  for (let i = 0; i < indices.length; i += 3) {
    const [a, b, c] = indices.slice(i, i + 3).map((n) => n * 3);
    const weight =
      Math.abs(
        (vertices[b] - vertices[a]) * (vertices[c + 2] - vertices[a + 2]) -
          (vertices[c] - vertices[a]) * (vertices[b + 2] - vertices[a + 2]),
      ) / 2;
    area += weight;
    integral +=
      (weight * (vertices[a + 1] + vertices[b + 1] + vertices[c + 1])) / 3;
  }
  const mean = integral / area;
  for (let i = 1; i < vertices.length; i += 3) vertices[i] -= mean;
  const geometry = new T.BufferGeometry();
  geometry.setAttribute("position", new T.Float32BufferAttribute(vertices, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  geometry.userData.edgeHeight = 1 - mean;
  return geometry;
}
