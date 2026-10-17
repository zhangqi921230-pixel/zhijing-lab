import * as T from "three";

// A retained stack visualizes the adjustable load. The force solver still
// models one rigid sliding body; mesh volume is not used to infer mass.
export function addInclineWeights(block) {
  const profile = [
    [0.027, 0],
    [0.122, 0],
    [0.13, 0.006],
    [0.13, 0.026],
    [0.122, 0.032],
    [0.027, 0.032],
    [0.027, 0],
  ];
  const weights = new T.InstancedMesh(
    new T.LatheGeometry(
      profile.map(([r, y]) => new T.Vector2(r, y)),
      32,
    ),
    new T.MeshStandardMaterial({
      color: "#879592",
      metalness: 0.85,
      roughness: 0.32,
    }),
    9,
  );
  weights.name = "incline-added-weights";
  weights.castShadow = weights.receiveShadow = true;
  const matrix = new T.Matrix4();
  for (let i = 0; i < 9; i++)
    weights.setMatrixAt(i, matrix.makeTranslation(0, 0.3 + i * 0.032, 0));
  block.add(weights);
  const stem = new T.Mesh(
    new T.CylinderGeometry(0.018, 0.018, 0.37, 16),
    new T.MeshStandardMaterial({
      color: "#bac6c4",
      metalness: 0.8,
      roughness: 0.3,
    }),
  );
  stem.name = "incline-weight-retaining-post";
  stem.position.y = 0.485;
  block.add(stem);
  const nut = new T.Mesh(
    new T.CylinderGeometry(0.042, 0.042, 0.025, 6),
    new T.MeshStandardMaterial({
      color: "#465b5b",
      metalness: 0.7,
      roughness: 0.34,
    }),
  );
  nut.name = "incline-weight-clamp";
  block.add(nut);
  return (mass) => {
    const count = Math.max(0, Math.min(9, Math.round((mass - 0.5) / 0.5)));
    weights.count = count;
    weights.visible = count > 0;
    nut.position.y = 0.3 + count * 0.032 + 0.0125;
  };
}
