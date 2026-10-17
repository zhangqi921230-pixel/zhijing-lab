import * as T from "three";

export function microscopeObjectiveBarrel(parent, length) {
  const barrel = new T.Mesh(
    new T.LatheGeometry(
      [
        [0, -0.06],
        [0.13, -0.06],
        [0.135, -0.07],
        [0.135, -0.105],
        [0.12, -0.115],
        [0.115, -0.125],
        [0.115, -length + 0.025],
        [0.106, -length],
        [0, -length],
      ]
        .reverse()
        .map(([r, y]) => new T.Vector2(r, y)),
      48,
    ),
    new T.MeshStandardMaterial({
      color: "#a3b0ad",
      metalness: 0.86,
      roughness: 0.31,
    }),
  );
  barrel.name = "objective-stepped-barrel";
  barrel.castShadow = barrel.receiveShadow = true;
  parent.add(barrel);
  const seam = new T.Mesh(
    new T.CylinderGeometry(0.1355, 0.1355, 0.005, 48, 1, true),
    new T.MeshStandardMaterial({
      color: "#364143",
      metalness: 0.6,
      roughness: 0.35,
    }),
  );
  seam.name = "objective-mount-seam";
  seam.position.y = -0.084;
  parent.add(seam);
  return barrel;
}

// The front glass is recessed behind the annular nose. Dimensions preserve
// the existing working-distance envelope; this is an external teaching model.
export function microscopeObjectiveFront(parent, length) {
  const front = new T.Group();
  front.name = "objective-front-assembly";
  front.position.y = -length;
  parent.add(front);
  const nose = new T.Mesh(
    new T.LatheGeometry(
      [
        [0.1, 0],
        [0.102, -0.018],
        [0.073, -0.105],
        [0.07, -0.12],
        [0.044, -0.12],
        [0.044, -0.086],
        [0.071, -0.02],
        [0.078, 0],
        [0.1, 0],
      ]
        .reverse()
        .map(([r, y]) => new T.Vector2(r, y)),
      40,
    ),
    new T.MeshStandardMaterial({
      color: "#263437",
      metalness: 0.65,
      roughness: 0.28,
    }),
  );
  nose.name = "hollow-objective-nose";
  front.add(nose);
  const ring = new T.Mesh(
    new T.RingGeometry(0.039, 0.045, 40),
    new T.MeshStandardMaterial({
      color: "#718080",
      metalness: 0.85,
      roughness: 0.3,
      side: T.DoubleSide,
    }),
  );
  ring.rotation.x = Math.PI / 2;
  ring.position.y = -0.087;
  ring.name = "objective-lens-retainer";
  front.add(ring);
  const lens = new T.Mesh(
    new T.SphereGeometry(
      0.14,
      32,
      8,
      0,
      Math.PI * 2,
      0,
      Math.asin(0.04 / 0.14),
    ),
    new T.MeshPhysicalMaterial({
      color: "#183a42",
      roughness: 0.08,
      metalness: 0.12,
      clearcoat: 1,
      clearcoatRoughness: 0.06,
      iridescence: 0.2,
    }),
  );
  lens.rotation.z = Math.PI;
  lens.position.y = 0.052;
  lens.name = "recessed-objective-lens";
  front.add(lens);
  return front;
}
