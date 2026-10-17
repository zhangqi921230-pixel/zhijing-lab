import * as THREE from "three";
import { box, panel } from "./CircuitBench.js";

export const RC_METER_TERMINALS = {
  positive: [-0.95, -0.64, 1.32],
  negative: [0.15, -0.64, 1.32],
};
export function addRCReadout(root) {
  const body = box(root, [1.65, 0.67, 0.9], "#d3d8cb", [-0.4, -0.5, 0.8], 0.05);
  body.name = "rc-voltmeter";
  box(root, [1.4, 0.3, 0.026], "#172d31", [-0.4, -0.35, 1.265], 0.012);
  for (const x of [-1.03, 0.23])
    for (const z of [0.46, 1.12])
      box(root, [0.16, 0.09, 0.16], "#283d40", [x, -0.88, z], 0.015);
  const sourcePins = [
    [1.5, 0, 0],
    [2.1, 0, 0],
  ];
  for (const [i, key] of ["positive", "negative"].entries()) {
    const pin = RC_METER_TERMINALS[key],
      color = i ? "#273b3e" : "#b64e3b";
    const socket = new THREE.Mesh(
      new THREE.CylinderGeometry(0.055, 0.055, 0.09, 16),
      new THREE.MeshStandardMaterial({ color, roughness: 0.55 }),
    );
    socket.rotation.x = Math.PI / 2;
    socket.position.set(...pin);
    socket.name = `rc-meter-${key}`;
    root.add(socket);
    const route = [
      sourcePins[i],
      [sourcePins[i][0] + (i ? 0.35 : -0.22), -0.65, 0.45],
      [i ? 2.5 : 1.1, -0.7, i ? 2.2 : 1.8],
      [pin[0], -0.72, i ? 2.2 : 1.8],
      pin,
    ].map((p) => new THREE.Vector3(...p));
    const lead = new THREE.Mesh(
      new THREE.TubeGeometry(
        new THREE.CatmullRomCurve3(route),
        56,
        0.022,
        7,
        false,
      ),
      new THREE.MeshStandardMaterial({ color, roughness: 0.8 }),
    );
    lead.name = `rc-meter-lead-${key}`;
    lead.userData.terminals = [sourcePins[i], pin];
    root.add(lead);
  }
  const display = panel(
    root,
    [-0.4, -0.35, 1.283],
    1.26,
    0.255,
    (ctx, q) => {
      ctx.fillStyle = "#12272c";
      ctx.fillRect(0, 0, 768, 160);
      ctx.fillStyle = "#b7e4c8";
      ctx.font = "bold 78px monospace";
      ctx.textAlign = "right";
      ctx.fillText(`${q.voltage.toFixed(2)} V`, 730, 113);
      ctx.font = "24px sans-serif";
      ctx.textAlign = "left";
      ctx.fillText("DC", 22, 44);
    },
    [768, 160],
  );
  const label = panel(
    root,
    [-0.4, -0.65, 1.283],
    0.64,
    0.17,
    (ctx) => {
      ctx.fillStyle = "#d3d8cb";
      ctx.fillRect(0, 0, 512, 96);
      ctx.fillStyle = "#28433f";
      ctx.textAlign = "center";
      ctx.font = "38px sans-serif";
      ctx.fillText("+  电容电压  −", 256, 66);
    },
    [512, 96],
  );
  label.update({});
  const capacitorLabel = panel(
    root,
    [1.8, 1.27, 0],
    1.85,
    0.32,
    (ctx, q) => {
      ctx.fillStyle = "#1c343a";
      ctx.fillRect(0, 0, 768, 128);
      ctx.fillStyle = "#e3d4ae";
      ctx.textAlign = "center";
      ctx.font = "45px sans-serif";
      ctx.fillText(`C = ${q.c} mF`, 384, 59);
      ctx.font = "25px sans-serif";
      ctx.fillText("平行板结构放大示意", 384, 105);
    },
    [768, 128],
  );
  let lastVoltage = "",
    lastC;
  return (q, state) => {
    const value = state.voltage.toFixed(2);
    if (value !== lastVoltage) {
      lastVoltage = value;
      display.update(state);
    }
    if (q.c !== lastC) {
      lastC = q.c;
      capacitorLabel.update(q);
    }
    body.userData.voltage = state.voltage;
  };
}
