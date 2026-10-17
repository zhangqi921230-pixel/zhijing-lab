import * as T from "three";

// Ideal uniform-field direction only. Display geometry is not a length scale.
export function addRCField(root) {
  const material = new T.MeshBasicMaterial({
    color: "#eab857",
    transparent: true,
    opacity: 1,
    depthWrite: false,
  });
  const shafts = new T.InstancedMesh(
    new T.CylinderGeometry(0.008, 0.008, 0.31, 8).rotateZ(-Math.PI / 2),
    material,
    9,
  );
  const heads = new T.InstancedMesh(
    new T.ConeGeometry(0.035, 0.075, 12).rotateZ(-Math.PI / 2),
    material,
    9,
  );
  shafts.name = "rc-field-shafts";
  heads.name = "rc-field-heads";
  const matrix = new T.Matrix4();
  let i = 0;
  for (const y of [-0.45, 0.1, 0.65])
    for (const z of [-0.5, 0, 0.5]) {
      matrix.makeTranslation(1.755, y, z);
      shafts.setMatrixAt(i, matrix);
      matrix.makeTranslation(1.9475, y, z);
      heads.setMatrixAt(i++, matrix);
    }
  const group = new T.Group();
  group.name = "rc-electric-field";
  group.add(shafts, heads);
  root.add(group);
  group.visible = false;
  return (p, state) => {
    const ratio = T.MathUtils.clamp(state.voltage / p.u, 0, 1);
    group.visible = p.fieldLines === 1 && ratio > 0;
    material.opacity = ratio;
  };
}
