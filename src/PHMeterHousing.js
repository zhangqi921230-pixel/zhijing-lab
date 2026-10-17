import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";

// Mechanical detailing only: controls and calibration remain in the teaching UI.
export function addPHMeterHousing(root) {
  const group = new THREE.Group();
  group.name = "ph-meter-hardware";
  root.add(group);
  const dark = new THREE.MeshStandardMaterial({
    color: "#172c32",
    roughness: 0.58,
  });
  const metal = new THREE.MeshStandardMaterial({
    color: "#a6b3b3",
    metalness: 0.75,
    roughness: 0.32,
  });
  const add = (geometry, material, position, name) => {
    const object = new THREE.Mesh(geometry, material);
    object.position.set(...position);
    object.name = name;
    object.castShadow = object.receiveShadow = true;
    group.add(object);
    return object;
  };
  const rim = new THREE.Shape();
  rim.moveTo(-0.725, -0.255);
  rim.lineTo(0.725, -0.255);
  rim.lineTo(0.725, 0.255);
  rim.lineTo(-0.725, 0.255);
  rim.closePath();
  const aperture = new THREE.Path();
  aperture.moveTo(-0.659, -0.219);
  aperture.lineTo(-0.659, 0.219);
  aperture.lineTo(0.659, 0.219);
  aperture.lineTo(0.659, -0.219);
  aperture.closePath();
  rim.holes.push(aperture);
  add(
    new THREE.ExtrudeGeometry(rim, {
      depth: 0.014,
      bevelEnabled: true,
      bevelSize: 0.004,
      bevelThickness: 0.004,
      bevelSegments: 2,
      steps: 1,
    }),
    dark,
    [2.55, -0.4, 1.003],
    "ph-meter-screen-bezel",
  );
  add(
    new RoundedBoxGeometry(1.554, 0.013, 0.804, 2, 0.004),
    dark,
    [2.55, -0.652, 0.6],
    "ph-meter-case-seam",
  );
  const screwGeometry = new THREE.CylinderGeometry(0.015, 0.015, 0.009, 12);
  const screws = new THREE.InstancedMesh(screwGeometry, metal, 4);
  const transform = new THREE.Object3D();
  transform.rotation.x = Math.PI / 2;
  let index = 0;
  for (const x of [-0.695, 0.695])
    for (const y of [-0.235, 0.235]) {
      transform.position.set(2.55 + x, -0.4 + y, 1.023);
      transform.updateMatrix();
      screws.setMatrixAt(index++, transform.matrix);
    }
  screws.name = "ph-meter-panel-fasteners";
  group.add(screws);
  add(
    new THREE.CylinderGeometry(0.058, 0.058, 0.032, 24),
    metal,
    [2.55, -0.117, 0.45],
    "ph-meter-electrode-socket",
  );
  add(
    new THREE.LatheGeometry(
      [
        [0.035, -0.1],
        [0.035, -0.064],
        [0.029, -0.049],
        [0.026, -0.044],
      ].map((p) => new THREE.Vector2(...p)),
      24,
    ),
    dark,
    [2.55, 0, 0.45],
    "ph-meter-cable-strain-relief",
  );
  return group;
}
