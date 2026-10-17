import * as T from "three";

// Local +Y follows the optical axis. The cup is hollow, with the glass below
// its lip; no opaque cylinder cap should cover the observer's line of sight.
export function microscopeEyepiece(parent, base, tip) {
  const group = new T.Group();
  group.name = "microscope-eyepiece";
  group.position.fromArray(tip);
  const direction = new T.Vector3()
    .fromArray(tip)
    .sub(new T.Vector3().fromArray(base));
  const length = direction.length();
  group.quaternion.setFromUnitVectors(
    new T.Vector3(0, 1, 0),
    direction.normalize(),
  );
  parent.add(group);
  function lathe(name, points, material) {
    const part = new T.Mesh(
      new T.LatheGeometry(
        points.map(([r, y]) => new T.Vector2(r, y)),
        48,
      ),
      material,
    );
    part.name = name;
    part.castShadow = part.receiveShadow = true;
    group.add(part);
    return part;
  }
  lathe(
    "eyepiece-barrel",
    [
      [0.128, -length],
      [0.128, -0.23],
      [0.15, -0.22],
      [0.15, -0.12],
      [0.137, -0.12],
      [0.117, -0.22],
      [0.117, -length],
    ],
    new T.MeshStandardMaterial({
      color: "#222d30",
      roughness: 0.38,
      metalness: 0.35,
    }),
  );
  lathe(
    "hollow-rubber-eyecup",
    [
      [0.148, -0.17],
      [0.172, -0.15],
      [0.183, -0.075],
      [0.201, -0.015],
      [0.202, 0.008],
      [0.19, 0.022],
      [0.172, 0.019],
      [0.158, -0.014],
      [0.139, -0.075],
      [0.134, -0.13],
      [0.148, -0.17],
    ],
    new T.MeshStandardMaterial({
      color: "#131b1d",
      roughness: 0.82,
      metalness: 0,
    }),
  );
  lathe(
    "lens-retaining-ring",
    [
      [0.133, -0.115],
      [0.137, -0.095],
      [0.134, -0.075],
      [0.115, -0.075],
      [0.115, -0.115],
      [0.133, -0.115],
    ],
    new T.MeshStandardMaterial({
      color: "#697779",
      roughness: 0.32,
      metalness: 0.85,
    }),
  );
  // Shallow convex optical surface with a dark backing appearance; no costly
  // screen-space transmission pass for a lens that is only a few pixels wide.
  const lens = new T.Mesh(
    new T.SphereGeometry(
      0.28,
      40,
      10,
      0,
      Math.PI * 2,
      0,
      Math.asin(0.117 / 0.28),
    ),
    new T.MeshPhysicalMaterial({
      color: "#15282c",
      roughness: 0.1,
      metalness: 0.18,
      clearcoat: 1,
      clearcoatRoughness: 0.07,
      iridescence: 0.18,
      iridescenceIOR: 1.3,
    }),
  );
  lens.name = "recessed-eyepiece-lens";
  lens.position.y = -0.35;
  group.add(lens);
  const band = new T.Mesh(
    new T.CylinderGeometry(0.153, 0.153, 0.018, 48, 1, true),
    new T.MeshStandardMaterial({
      color: "#87918b",
      roughness: 0.4,
      metalness: 0.75,
    }),
  );
  band.name = "diopter-reference-band";
  band.position.y = -0.2;
  group.add(band);
  if (typeof document !== "undefined") {
    const canvas = document.createElement("canvas");
    canvas.width = 192;
    canvas.height = 96;
    const context = canvas.getContext("2d");
    if (context) {
      context.fillStyle = "#d6dcd5";
      context.font = "600 54px Arial, sans-serif";
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.fillText("10×", 96, 48);
      const texture = new T.CanvasTexture(canvas);
      texture.colorSpace = T.SRGBColorSpace;
      const marking = new T.Mesh(
        new T.CylinderGeometry(0.129, 0.129, 0.08, 20, 1, true, -0.65, 1.3),
        new T.MeshStandardMaterial({
          map: texture,
          transparent: true,
          depthWrite: false,
          roughness: 0.8,
        }),
      );
      marking.name = "eyepiece-10x-marking";
      marking.position.y = -0.3;
      marking.userData.ownedTexture = texture;
      group.add(marking);
    }
  }
  return group;
}
