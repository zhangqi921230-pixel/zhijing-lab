import * as THREE from "three";

export function bondAngleGeometry(points, radius) {
  const a = new THREE.Vector3(...points[1]).normalize(),
    b = new THREE.Vector3(...points[2]).normalize();
  const angle = Math.acos(THREE.MathUtils.clamp(a.dot(b), -1, 1));
  const tangent = b.clone().addScaledVector(a, -a.dot(b));
  if (tangent.lengthSq() < 1e-10) tangent.set(0, 1, 0);
  tangent.normalize();
  const at = (t) =>
    a.clone().multiplyScalar(Math.cos(t)).addScaledVector(tangent, Math.sin(t));
  return {
    degrees: THREE.MathUtils.radToDeg(angle),
    points: Array.from({ length: 65 }, (_, i) =>
      at((angle * i) / 64).multiplyScalar(radius),
    ),
    label: at(angle / 2).multiplyScalar(radius + 0.28),
  };
}
function textSprite(text, width, height, color) {
  if (typeof document === "undefined") return new THREE.Object3D();
  const canvas = document.createElement("canvas");
  canvas.width = Math.round((128 * width) / height);
  canvas.height = 128;
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, 128);
  ctx.fillStyle = "#18303be6";
  ctx.fillRect(0, 8, canvas.width, 112);
  ctx.fillStyle = color;
  ctx.textAlign = "center";
  ctx.font = "bold 68px sans-serif";
  ctx.fillText(text, canvas.width / 2, 88, canvas.width - 22);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  const sprite = new THREE.Sprite(
    new THREE.SpriteMaterial({ map: texture, depthWrite: false }),
  );
  sprite.scale.set(width, height, 1);
  sprite.userData.ownedTexture = texture;
  return sprite;
}
export function addMoleculeAnnotations(root, points, types, spread) {
  const group = new THREE.Group();
  group.name = "molecule-annotations";
  root.add(group);
  const angle = bondAngleGeometry(points, 0.72 * spread);
  const arc = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints(angle.points),
    new THREE.LineBasicMaterial({ color: "#ba8e36" }),
  );
  arc.name = "molecule-bond-angle";
  group.add(arc);
  const label = textSprite(
    `${angle.degrees.toFixed(points.length === 5 ? 2 : 1)}°`,
    0.95,
    0.26,
    "#efd59b",
  );
  label.position.copy(angle.label);
  group.add(label);
  points.forEach((point, i) => {
    const atom = textSprite(
      types[i],
      0.3,
      0.24,
      types[i] === "O" ? "#ffb5a4" : types[i] === "N" ? "#a8caff" : "#ecf1e6",
    );
    atom.name = `molecule-atom-label-${i}`;
    atom.position.fromArray(point);
    atom.position.add(
      i === 0
        ? types[0] === "N"
          ? new THREE.Vector3(-0.95, 0.7, 0)
          : types[0] === "O"
            ? new THREE.Vector3(0.85, -0.55, 0)
            : new THREE.Vector3(0, -0.85, 0)
        : new THREE.Vector3(...point).normalize().multiplyScalar(0.6),
    );
    group.add(atom);
    if (i === 0) {
      const center = new THREE.Vector3(...point);
      const direction = atom.position.clone().sub(center).normalize();
      const leader = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints([
          center.addScaledVector(direction, 0.57),
          atom.position.clone().addScaledVector(direction, -0.19),
        ]),
        new THREE.LineBasicMaterial({
          color: "#b4c4cd",
          transparent: true,
          opacity: 0.75,
        }),
      );
      leader.name = "molecule-central-atom-leader";
      group.add(leader);
    }
  });
  group.userData.angle = angle.degrees;
  return group;
}
