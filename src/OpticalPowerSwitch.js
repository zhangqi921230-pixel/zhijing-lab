import * as T from "three";
import { box } from "./CircuitBench.js";

export function addOpticalPowerSwitch(source) {
  const control = new T.Group();
  control.name = "optical-power-switch";
  control.position.set(-0.118, 0.5, 0.13);
  control.userData = { action: "parameter", key: "light", value: 0 };
  source.add(control);
  box(control, [0.026, 0.23, 0.18], "#78898d", [0, 0, 0], 0.012);
  const rocker = box(
    control,
    [0.038, 0.18, 0.135],
    "#222d32",
    [-0.026, 0, 0],
    0.012,
  );
  rocker.name = "optical-power-rocker";
  const mark = box(
    rocker,
    [0.002, 0.035, 0.007],
    "#e6e3d4",
    [-0.02, 0.043, 0],
    0,
  );
  mark.castShadow = false;
  const ring = new T.Mesh(
    new T.TorusGeometry(0.019, 0.003, 4, 16),
    new T.MeshBasicMaterial({ color: "#e6e3d4" }),
  );
  ring.rotation.y = Math.PI / 2;
  ring.position.set(-0.021, -0.043, 0);
  rocker.add(ring);
  const lamp = new T.Mesh(
    new T.SphereGeometry(0.019, 12, 8),
    new T.MeshStandardMaterial({
      color: "#7abe89",
      emissive: "#4fe487",
      emissiveIntensity: 0.7,
      roughness: 0.3,
    }),
  );
  lamp.name = "optical-power-indicator";
  lamp.position.set(-0.018, 0.17, 0);
  control.add(lamp);
  return (powered) => {
    control.userData.value = powered ? 0 : 1;
    rocker.rotation.z = powered ? 0.15 : -0.15;
    lamp.material.emissiveIntensity = powered ? 0.7 : 0;
    lamp.material.color.set(powered ? "#7abe89" : "#33463b");
  };
}
