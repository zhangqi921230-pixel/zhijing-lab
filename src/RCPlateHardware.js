import * as T from "three";

export function addRCPlateHardware(root) {
  // Insulating U clamps support each plate separately; no metal bridge spans the gap.
  const profile = new T.Shape();
  const outline = [
    [-0.11, 0],
    [0.11, 0],
    [0.11, 0.2],
    [0.033, 0.2],
    [0.033, 0.014],
    [-0.033, 0.014],
    [-0.033, 0.2],
    [-0.11, 0.2],
  ];
  outline.forEach(([x, y], i) =>
    i ? profile.lineTo(x, y) : profile.moveTo(x, y),
  );
  profile.closePath();
  const holders = new T.InstancedMesh(
    new T.ExtrudeGeometry(profile, {
      depth: 0.16,
      bevelEnabled: true,
      bevelSize: 0.002,
      bevelThickness: 0.002,
      bevelSegments: 2,
      steps: 1,
    }),
    new T.MeshStandardMaterial({
      color: "#d8d4c0",
      roughness: 0.76,
      metalness: 0,
    }),
    4,
  );
  holders.name = "rc-plate-insulating-clamps";
  const transform = new T.Object3D();
  let i = 0;
  for (const x of [1.55, 2.05])
    for (const z of [-0.58, 0.58]) {
      transform.position.set(x, -0.79, z - 0.08);
      transform.updateMatrix();
      holders.setMatrixAt(i++, transform.matrix);
    }
  const contacts = new T.InstancedMesh(
    new T.TorusGeometry(0.044, 0.011, 8, 24),
    new T.MeshStandardMaterial({
      color: "#b9a579",
      metalness: 0.78,
      roughness: 0.3,
    }),
    2,
  );
  contacts.name = "rc-plate-contact-collars";
  for (let j = 0; j < 2; j++) {
    transform.position.set(j ? 2.087 : 1.513, 0, 0);
    transform.rotation.y = Math.PI / 2;
    transform.updateMatrix();
    contacts.setMatrixAt(j, transform.matrix);
  }
  for (const batch of [holders, contacts]) {
    batch.castShadow = batch.receiveShadow = true;
    root.add(batch);
  }
}
