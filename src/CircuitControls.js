import * as T from "three";
import { repeatedBoxes } from "./MicroscopeBatch.js";

export function addSupplyControl(root) {
  const control = new T.Group();
  control.name = "circuit-voltage-control";
  control.position.set(-2.42, 0.18, -0.07);
  control.userData = {
    action: "parameter",
    key: "u",
    delta: 0.5,
    min: 0,
    max: 12,
  };
  root.add(control);
  const rotating = new T.Group();
  rotating.name = "circuit-voltage-dial";
  control.add(rotating);
  const body = new T.Mesh(
    new T.CylinderGeometry(0.145, 0.145, 0.1, 32),
    new T.MeshStandardMaterial({ color: "#263438", roughness: 0.64 }),
  );
  body.rotation.x = Math.PI / 2;
  body.position.z = 0.06;
  rotating.add(body);
  repeatedBoxes(
    rotating,
    [0.014, 0.012, 0.1],
    "#46565d",
    0,
    Array.from({ length: 24 }, (_, i) => {
      const a = (i * Math.PI) / 12;
      return {
        position: [0.145 * Math.cos(a), 0.145 * Math.sin(a), 0.06],
        rotation: [0, 0, a],
      };
    }),
    "circuit-voltage-grip",
  );
  const pointer = new T.Mesh(
    new T.BoxGeometry(0.015, 0.075, 0.004),
    new T.MeshBasicMaterial({ color: "#e5e2c9" }),
  );
  pointer.position.set(0, 0.078, 0.112);
  rotating.add(pointer);
  const ticks = [];
  for (let i = 0; i <= 12; i++) {
    const a = ((135 - i * 22.5) * Math.PI) / 180;
    for (const r of [i % 3 === 0 ? 0.18 : 0.19, 0.205])
      ticks.push(-Math.sin(a) * r, Math.cos(a) * r, 0.003);
  }
  control.add(
    new T.LineSegments(
      new T.BufferGeometry().setAttribute(
        "position",
        new T.Float32BufferAttribute(ticks, 3),
      ),
      new T.LineBasicMaterial({ color: "#34484b" }),
    ),
  );
  if (typeof document !== "undefined") {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 256;
    const c = canvas.getContext("2d");
    c.fillStyle = "#243f42";
    c.font = "bold 24px sans-serif";
    c.textAlign = "center";
    c.textBaseline = "middle";
    for (const value of [0, 3, 6, 9, 12]) {
      const a = ((135 - value * 22.5) * Math.PI) / 180;
      const radius = (0.253 / 0.62) * 256;
      c.fillText(
        String(value),
        128 - Math.sin(a) * radius,
        128 - Math.cos(a) * radius,
      );
    }
    c.font = "21px sans-serif";
    c.fillText("V", 128, 222);
    const texture = new T.CanvasTexture(canvas);
    texture.colorSpace = T.SRGBColorSpace;
    const scale = new T.Mesh(
      new T.PlaneGeometry(0.62, 0.62),
      new T.MeshBasicMaterial({
        map: texture,
        transparent: true,
        depthWrite: false,
      }),
    );
    scale.name = "circuit-voltage-scale";
    scale.position.z = 0.004;
    scale.userData.ownedTexture = texture;
    scale.raycast = () => {};
    control.add(scale);
  }
  return (voltage) => {
    rotating.rotation.z = ((135 - (voltage / 12) * 270) * Math.PI) / 180;
  };
}

export function addCircuitPolarityLabels(root, terminals) {
  const textures = {};
  for (const sign of ["+", "−"]) {
    const owner = new T.Group();
    owner.name = `circuit-polarity-texture-${sign}`;
    root.add(owner);
    if (typeof document === "undefined") continue;
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 64;
    const c = canvas.getContext("2d");
    c.clearRect(0, 0, 64, 64);
    c.fillStyle = sign === "+" ? "#9f3028" : "#21383c";
    c.font = "bold 58px sans-serif";
    c.textAlign = "center";
    c.textBaseline = "middle";
    c.fillText(sign, 32, 31);
    const texture = new T.CanvasTexture(canvas);
    texture.colorSpace = T.SRGBColorSpace;
    textures[sign] = texture;
    owner.userData.ownedTexture = texture;
  }
  for (const [name, [x, y, z]] of Object.entries(terminals)) {
    // Resistor and switch terminals are non-polarized; only instrument inputs get signs.
    if (!/^(source|A|V)[+-]$/.test(name)) continue;
    const sign = name.endsWith("+") ? "+" : "−";
    const label = new T.Mesh(
      new T.PlaneGeometry(0.12, 0.12),
      new T.MeshBasicMaterial({
        map: textures[sign] ?? null,
        transparent: true,
        depthWrite: false,
      }),
    );
    label.name = `circuit-polarity-${name}`;
    label.position.set(x, y + 0.17, z - 0.04);
    label.userData.terminal = name;
    root.add(label);
  }
}
