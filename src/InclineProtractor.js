import * as T from "three";
import { box, panel } from "./CircuitBench.js";

export function addInclineProtractor(root) {
  const group = new T.Group();
  group.name = "incline-protractor";
  group.position.set(2.35, -0.65, 1.04);
  root.add(group);
  const plate = new T.Mesh(
    new T.CircleGeometry(0.84, 64, Math.PI / 2, Math.PI / 2),
    new T.MeshStandardMaterial({
      color: "#e8e4d1",
      roughness: 0.58,
      metalness: 0.08,
      side: T.DoubleSide,
    }),
  );
  group.add(plate);
  const marks = panel(
    group,
    [-0.42, 0.42, 0.005],
    0.84,
    0.84,
    (ctx) => {
      ctx.clearRect(0, 0, 512, 512);
      ctx.strokeStyle = "#30443e";
      ctx.fillStyle = "#30443e";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = "26px sans-serif";
      for (let degrees = 0; degrees <= 90; degrees++) {
        const angle = (degrees * Math.PI) / 180;
        const outer = 494,
          inner = degrees % 10 === 0 ? 451 : degrees % 5 === 0 ? 463 : 477;
        ctx.lineWidth = degrees % 5 === 0 ? 2 : 1;
        ctx.beginPath();
        ctx.moveTo(
          512 - outer * Math.cos(angle),
          512 - outer * Math.sin(angle),
        );
        ctx.lineTo(
          512 - inner * Math.cos(angle),
          512 - inner * Math.sin(angle),
        );
        ctx.stroke();
        if (degrees > 0 && degrees < 90 && degrees % 10 === 0)
          ctx.fillText(
            String(degrees),
            512 - 414 * Math.cos(angle),
            512 - 414 * Math.sin(angle),
          );
      }
    },
    [512, 512],
  );
  if (marks.object) {
    marks.object.material.transparent = true;
    marks.object.material.depthWrite = false;
  }
  marks.update({});
  const pointer = new T.Group();
  pointer.name = "incline-angle-pointer";
  group.add(pointer);
  box(pointer, [0.79, 0.012, 0.014], "#ba5a35", [-0.395, 0, 0.02], 0.003);
  const screw = new T.Mesh(
    new T.CylinderGeometry(0.035, 0.035, 0.045, 24),
    new T.MeshStandardMaterial({
      color: "#b5c0bc",
      metalness: 0.8,
      roughness: 0.25,
    }),
  );
  screw.rotation.x = Math.PI / 2;
  screw.position.z = 0.03;
  group.add(screw);
  return (angle) => {
    pointer.rotation.z = -angle;
  };
}
