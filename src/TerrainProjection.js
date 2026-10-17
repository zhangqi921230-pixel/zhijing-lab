import { contourLabelAnchors } from "./contourLabels.mjs";
import * as T from "three";
import { terrainHeightAt, contourSegments, shorelineWater } from "./models.mjs";
const size = 768;
const pixel = (v) => ((v + 3.3) / 6.6) * size;
let base;
function baseMap() {
  if (base) return base;
  base = document.createElement("canvas");
  base.width = base.height = size;
  const ctx = base.getContext("2d");
  ctx.fillStyle = "#eee9d4";
  ctx.fillRect(0, 0, size, size);
  const n = 192,
    step = 6 / n;
  for (let iz = 0; iz < n; iz++)
    for (let ix = 0; ix < n; ix++) {
      const x = -3 + ix * step,
        z = -3 + iz * step,
        h = terrainHeightAt(x + step / 2, z + step / 2),
        t = Math.min(1, h / 2300);
      ctx.fillStyle = `rgb(${Math.round(190 + 49 * t)},${Math.round(209 - 32 * t)},${Math.round(165 - 32 * t)})`;
      ctx.fillRect(
        pixel(x),
        pixel(z),
        (size / 6.6) * step + 1,
        (size / 6.6) * step + 1,
      );
    }
  ctx.fillStyle = "#86b4bf";
  ctx.beginPath();
  for (const tri of shorelineWater) {
    tri.forEach((p, i) =>
      i
        ? ctx.lineTo(pixel(p.x), pixel(p.z))
        : ctx.moveTo(pixel(p.x), pixel(p.z)),
    );
    ctx.closePath();
  }
  ctx.fill();
  ctx.strokeStyle = "#485647";
  ctx.lineWidth = 2;
  ctx.strokeRect(
    pixel(-3),
    pixel(-3),
    pixel(3) - pixel(-3),
    pixel(3) - pixel(-3),
  );
  ctx.fillStyle = "#394a3c";
  ctx.font = "16px sans-serif";
  ctx.fillText("N ↑", size - 75, 25);
  ctx.font = "14px sans-serif";
  ctx.fillText("知境 · 等高线平面投影 / 高程 m", 38, size - 12);
  return base;
}
export function buildTerrainProjection(root) {
  if (typeof document === "undefined") return;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const texture = new T.CanvasTexture(canvas);
  texture.colorSpace = T.SRGBColorSpace;
  texture.anisotropy = 4;
  const plane = new T.Mesh(
    new T.PlaneGeometry(6.6, 6.6),
    new T.MeshBasicMaterial({
      map: texture,
      side: T.DoubleSide,
      toneMapped: false,
    }),
  );
  plane.rotation.x = -Math.PI / 2;
  plane.name = "terrain-projection";
  plane.userData.ownedTexture = texture;
  plane.userData.updateMap = (interval) => {
    const ctx = canvas.getContext("2d");
    ctx.drawImage(baseMap(), 0, 0);
    for (let h = interval; h < 2600; h += interval) {
      ctx.beginPath();
      for (const [a, b] of contourSegments(h)) {
        ctx.moveTo(pixel(a[0]), pixel(a[2]));
        ctx.lineTo(pixel(b[0]), pixel(b[2]));
      }
      ctx.strokeStyle = h % (interval * 5) === 0 ? "#726749" : "#9a8c65";
      ctx.lineWidth = h % (interval * 5) === 0 ? 1.7 : 0.75;
      ctx.stroke();
    }
    ctx.font = "bold 13px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    for (const label of contourLabelAnchors(interval)) {
      const x = pixel(label.x),
        y = pixel(label.z);
      ctx.fillStyle = "#eae6cf";
      ctx.fillRect(x - 21, y - 9, 42, 18);
      ctx.fillStyle = "#4c503b";
      ctx.fillText(String(label.level), x, y);
    }
    texture.needsUpdate = true;
    plane.userData.interval = interval;
  };
  root.add(plane);
  const positions = [];
  for (const x of [-3, 3])
    for (const z of [-3, 3]) positions.push(x, -0.56, z, x, -1.16, z);
  const guides = new T.LineSegments(
    new T.BufferGeometry().setAttribute(
      "position",
      new T.Float32BufferAttribute(positions, 3),
    ),
    new T.LineDashedMaterial({
      color: "#b7c2b6",
      transparent: true,
      opacity: 0.35,
      dashSize: 0.045,
      gapSize: 0.03,
    }),
  );
  guides.name = "projection-guides";
  guides.computeLineDistances();
  root.add(guides);
}
export function updateTerrainProjection(root, p) {
  const plane = root.getObjectByName("terrain-projection"),
    guides = root.getObjectByName("projection-guides");
  if (!plane) return;
  plane.visible = guides.visible = p.projection !== false;
  const y = -0.56 - (p.projectionGap ?? 0.6);
  plane.position.y = y;
  const a = guides.geometry.getAttribute("position");
  for (let i = 1; i < a.count; i += 2) a.setY(i, y);
  a.needsUpdate = true;
  guides.computeLineDistances();
  if (plane.visible && plane.userData.interval !== p.interval)
    plane.userData.updateMap(p.interval);
}
