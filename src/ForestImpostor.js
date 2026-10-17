import * as T from "three";
// Atlas silhouettes leave transparent margins. Match the visible crown, not
// the full quad, to the detailed pine and three-cluster deciduous templates.
export function forestImpostorDimensions(height, broad) {
  const width = height * (broad ? 1.7 : 1.22);
  const vertical = height * (broad ? 1.18 : 1.06);
  return { scale: [width, vertical, width], centerY: vertical * 0.45 };
}
export function forestImpostorGeometry() {
  const positions = [],
    uv = [];
  function quad(points, range) {
    for (const i of [0, 1, 2, 0, 2, 3]) {
      positions.push(...points[i]);
      uv.push(...range[i]);
    }
  }
  for (let k = 0; k < 3; k++) {
    const angle = (k * Math.PI) / 3,
      x = Math.cos(angle) * 0.3,
      z = Math.sin(angle) * 0.3;
    quad(
      [
        [-x, -0.45, -z],
        [x, -0.45, z],
        [x, 0.45, z],
        [-x, 0.45, -z],
      ],
      [
        [0, 0],
        [0.5, 0],
        [0.5, 1],
        [0, 1],
      ],
    );
  }
  quad(
    [
      [-0.26, 0.03, 0.26],
      [0.26, 0.03, 0.26],
      [0.26, 0.03, -0.26],
      [-0.26, 0.03, -0.26],
    ],
    [
      [0.5, 0],
      [1, 0],
      [1, 1],
      [0.5, 1],
    ],
  );
  const geometry = new T.BufferGeometry();
  geometry.setAttribute("position", new T.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("uv", new T.Float32BufferAttribute(uv, 2));
  geometry.computeVertexNormals();
  return geometry;
}
export function forestImpostorTexture(species = "pine") {
  if (typeof document === "undefined") return null;
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");
  let seed = 42;
  const rand = () =>
    (seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0) / 4294967296;
  ctx.strokeStyle = "#c9bc9f";
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(128, 250);
  ctx.lineTo(128, 10);
  ctx.stroke();
  // A deterministic needle silhouette, not an opaque rectangular billboard.
  for (let row = 0; row < 24; row++) {
    const y = 15 + row * 8,
      reach = 5 + row * 3.7;
    for (const sign of [-1, 1]) {
      const endX = 128 + sign * reach,
        endY = y + 8 + rand() * 10;
      ctx.fillStyle = `rgb(${165 + row * 2},${183 + row * 2},${148 + row * 2})`;
      ctx.beginPath();
      ctx.moveTo(128, y - 12);
      ctx.lineTo(endX, endY - 3);
      ctx.lineTo(endX - sign * 7, endY + 4);
      ctx.lineTo(128, y + 13);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = `rgb(${160 + row * 2},${180 + row * 2},${143 + row * 2})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(128, y - 8);
      ctx.lineTo(endX, endY);
      ctx.stroke();
      for (let j = 0; j < 18; j++) {
        const t = j / 18,
          x = 128 + (endX - 128) * t,
          by = y - 8 + (endY - y + 8) * t;
        ctx.strokeStyle = `rgba(230,242,206,${0.7 + rand() * 0.3})`;
        ctx.lineWidth = 1.3 + rand() * 1.8;
        ctx.beginPath();
        ctx.moveTo(x, by);
        ctx.lineTo(x + sign * (4 + rand() * 9), by - 5 - rand() * 8);
        ctx.stroke();
      }
    }
  }
  if (species === "broad") {
    ctx.clearRect(0, 0, 256, 256);
    ctx.strokeStyle = "#bbae94";
    ctx.lineWidth = 7;
    ctx.beginPath();
    ctx.moveTo(128, 252);
    ctx.lineTo(128, 87);
    ctx.stroke();
    for (const direction of [-1, 1]) {
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(128, 183);
      ctx.lineTo(128 + direction * 56, 102);
      ctx.stroke();
    }
    // Overlapping leaf clusters form an irregular, rounded deciduous crown.
    for (let i = 0; i < 650; i++) {
      const a = rand() * Math.PI * 2,
        r = Math.sqrt(rand());
      const x = 128 + Math.cos(a) * r * 97,
        y = 99 + Math.sin(a) * r * 83;
      const shade = Math.floor(160 + rand() * 88);
      ctx.fillStyle = `rgb(${shade},${shade},${Math.floor(shade * 0.82)})`;
      ctx.beginPath();
      ctx.ellipse(x, y, 4 + rand() * 10, 3 + rand() * 7, a, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  // Separate radial crown for a useful silhouette when the camera looks down.
  ctx.save();
  ctx.beginPath();
  ctx.rect(256, 0, 256, 256);
  ctx.clip();
  for (let i = 0; i < 850; i++) {
    const angle = rand() * Math.PI * 2,
      r = Math.sqrt(rand()) * 107,
      x = 384 + Math.cos(angle) * r,
      y = 128 + Math.sin(angle) * r;
    const shade = Math.floor(165 + rand() * 85);
    ctx.fillStyle = `rgb(${shade},${shade},${Math.floor(shade * 0.87)})`;
    ctx.beginPath();
    ctx.ellipse(x, y, 3 + rand() * 8, 2 + rand() * 5, angle, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
  const texture = new T.CanvasTexture(canvas);
  texture.colorSpace = T.SRGBColorSpace;
  texture.anisotropy = 2;
  return texture;
}
