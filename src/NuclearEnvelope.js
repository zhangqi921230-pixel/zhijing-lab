import * as THREE from "three";

// Two membranes share the perforated topology. The intermembrane spacing is
// enlarged for a teaching cutaway, not a nanometre-scale reconstruction.
export function addNuclearEnvelope(nucleus, outerPores) {
  const inner = new THREE.Mesh(
    nucleus.geometry,
    new THREE.MeshStandardMaterial({
      color: "#b6a1c3",
      roughness: 0.74,
      side: THREE.DoubleSide,
      bumpMap: nucleus.material.bumpMap,
      bumpScale: 0.001,
    }),
  );
  inner.name = "nuclear-inner-membrane";
  inner.scale.setScalar(0.976);
  inner.userData = { action: "parameter", key: "part", value: 1 };
  nucleus.add(inner);
  if (outerPores) {
    const pores = new THREE.InstancedMesh(
      outerPores.geometry,
      outerPores.material,
      outerPores.count,
    );
    pores.name = "nuclear-inner-pore-rims";
    pores.userData = { action: "parameter", key: "part", value: 1 };
    nucleus.updateMatrix();
    const inverse = nucleus.matrix.clone().invert();
    const inset = new THREE.Matrix4().makeScale(0.976, 0.976, 0.976);
    const matrix = new THREE.Matrix4();
    for (let i = 0; i < outerPores.count; i++) {
      outerPores.getMatrixAt(i, matrix);
      matrix.premultiply(inverse).premultiply(inset);
      pores.setMatrixAt(i, matrix);
    }
    nucleus.add(pores);
  }

  // Open equatorial cut surfaces: two distinct lips leave the membrane gap
  // visible. Both follow the same ellipsoid scale as their parent shell.
  const material = new THREE.MeshStandardMaterial({
    color: "#d0bcd8",
    roughness: 0.65,
  });
  for (const radius of [0.55, 0.55 * 0.976]) {
    const rim = new THREE.Mesh(
      new THREE.TorusGeometry(radius, 0.0025, 6, 128),
      material,
    );
    rim.rotation.x = Math.PI / 2;
    rim.name = "nuclear-cut-membrane-rim";
    rim.userData = { action: "parameter", key: "part", value: 1 };
    nucleus.add(rim);
  }
  return inner;
}
