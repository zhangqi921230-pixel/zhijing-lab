import * as T from "three";

// VSEPR directions only, not orbital shapes or measured electron density.
export function lonePairDirections(type) {
  if (type === 3) return [[0, 1, 0]];
  if (type === 0)
    return [
      [0, -Math.sqrt(1 / 3), Math.sqrt(2 / 3)],
      [0, -Math.sqrt(1 / 3), -Math.sqrt(2 / 3)],
    ];
  return [];
}

export function addMoleculeLonePairs(root, type, spread) {
  const group = new T.Group();
  group.name = "molecule-lone-pairs";
  root.add(group);
  const directions = lonePairDirections(type);
  if (!directions.length) return group;
  const geometry = new T.SphereGeometry(1, 24, 16);
  const shell = new T.MeshPhysicalMaterial({
    color: "#b49add",
    transparent: true,
    opacity: 0.24,
    roughness: 0.45,
    depthWrite: false,
  });
  const dots = new T.MeshStandardMaterial({ color: "#7756ad", roughness: 0.4 });
  directions.forEach((direction, i) => {
    const pair = new T.Group();
    pair.name = `lone-pair-${i}`;
    pair.quaternion.setFromUnitVectors(
      new T.Vector3(0, 1, 0),
      new T.Vector3(...direction),
    );
    const lobe = new T.Mesh(geometry, shell);
    lobe.position.y = 0.9 * spread;
    lobe.scale.set(0.32 * spread, 0.6 * spread, 0.32 * spread);
    pair.add(lobe);
    for (const x of [-0.095, 0.095]) {
      const dot = new T.Mesh(geometry, dots);
      dot.position.set(x * spread, 1.06 * spread, 0);
      dot.scale.setScalar(0.055 * spread);
      pair.add(dot);
    }
    group.add(pair);
  });
  return group;
}
