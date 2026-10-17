import * as T from "three";
import { repeatedBoxes } from "./MicroscopeBatch.js";

export function opticalMountingPoints() {
  return Array.from({ length: 31 }, (_, column) => -3.575 + column * 0.275)
    .flatMap((x) => [-1.01, -0.735, 1.01].map((z) => [x, z]))
    .filter(([x, z]) => !(z > 0 && x > 1.1 && x < 4.05));
}

export function addOpticalBaseDetails(root) {
  // The rail end blocks need feet: their undersides otherwise float above the base.
  repeatedBoxes(
    root,
    [0.26, 0.07, 0.88],
    "#46565d",
    0,
    [-3.66, 4.76].map((x) => ({ position: [x, -0.955, 0] })),
    "optical-rail-supports",
  );

  // Shallow bore appearance, batched into two meshes; no CSG or per-hole objects.
  const points = opticalMountingPoints();
  for (const [name, geometry, material, y] of [
    [
      "optical-mounting-insets",
      new T.CircleGeometry(0.027, 12),
      new T.MeshBasicMaterial({ color: "#0b1418" }),
      -0.988,
    ],
    [
      "optical-mounting-rims",
      new T.RingGeometry(0.027, 0.041, 12),
      new T.MeshStandardMaterial({
        color: "#9faeb1",
        metalness: 0.8,
        roughness: 0.46,
      }),
      -0.987,
    ],
  ]) {
    const batch = new T.InstancedMesh(geometry, material, points.length);
    const pose = new T.Object3D();
    pose.rotation.x = -Math.PI / 2;
    points.forEach(([x, z], i) => {
      pose.position.set(x, y, z);
      pose.updateMatrix();
      batch.setMatrixAt(i, pose.matrix);
    });
    batch.name = name;
    batch.receiveShadow = true;
    batch.computeBoundingBox();
    batch.computeBoundingSphere();
    root.add(batch);
  }

  const plate = new T.Mesh(
    new T.PlaneGeometry(2.8, 0.24),
    new T.MeshStandardMaterial({
      color: "#c7ccbc",
      roughness: 0.55,
      metalness: 0.35,
    }),
  );
  plate.name = "optical-nameplate";
  plate.position.set(2.575, -0.982, 1.01);
  plate.rotation.x = -Math.PI / 2;
  plate.receiveShadow = true;
  root.add(plate);
  if (typeof document !== "undefined") {
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 128;
    const c = canvas.getContext("2d");
    c.fillStyle = "#bdc2b6";
    c.fillRect(0, 0, 1024, 128);
    c.strokeStyle = "#566568";
    c.lineWidth = 3;
    c.strokeRect(8, 8, 1008, 112);
    c.fillStyle = "#23343a";
    c.textAlign = "left";
    c.font = "bold 36px sans-serif";
    c.fillText("ZHIJING  /  OPTICAL BENCH", 30, 54);
    c.font = "26px sans-serif";
    c.fillText("知境 · 光具座     刻度单位 cm · 透镜中心为零点", 30, 98);
    const texture = new T.CanvasTexture(canvas);
    texture.colorSpace = T.SRGBColorSpace;
    plate.material.map = texture;
    plate.userData.ownedTexture = texture;
  }
}
