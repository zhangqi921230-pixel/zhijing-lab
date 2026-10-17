import * as T from "three";

export function addReactionVolumeGuide(root) {
  const group = new T.Group();
  group.name = "reaction-volume-guide";
  root.add(group);
  const points = Array.from({ length: 49 }, (_, i) => {
    const angle = -0.6 + (i / 48) * 1.2;
    return new T.Vector3(1.085 * Math.sin(angle), 0, 1.085 * Math.cos(angle));
  });
  const material = new T.LineBasicMaterial({
    color: "#e6b958",
    depthTest: false,
    toneMapped: false,
  });
  const arc = new T.Line(
    new T.BufferGeometry().setFromPoints(points),
    material,
  );
  const leader = new T.Line(
    new T.BufferGeometry().setFromPoints([
      points[0],
      new T.Vector3(-1.45, 0, 1.15),
    ]),
    material,
  );
  for (const line of [arc, leader]) {
    line.renderOrder = 8;
    line.raycast = () => {};
    group.add(line);
  }
  let context, texture;
  if (typeof document !== "undefined") {
    const canvas = document.createElement("canvas");
    canvas.width = 384;
    canvas.height = 96;
    context = canvas.getContext("2d");
    if (context) {
      texture = new T.CanvasTexture(canvas);
      texture.colorSpace = T.SRGBColorSpace;
      const label = new T.Sprite(
        new T.SpriteMaterial({
          map: texture,
          depthTest: false,
          depthWrite: false,
          toneMapped: false,
        }),
      );
      label.userData.ownedTexture = texture;
      label.position.set(-1.9, 0, 1.15);
      label.scale.set(1.1, 0.275, 1);
      label.renderOrder = 9;
      label.raycast = () => {};
      group.add(label);
    }
  }
  let lastLabel = "";
  return (volume, visible) => {
    group.visible = visible;
    group.position.y = -0.82 + (volume * 2.2) / 250;
    group.userData.volume = volume;
    if (!visible) return;
    const label = volume.toFixed(1);
    if (context && label !== lastLabel) {
      lastLabel = label;
      context.fillStyle = "#243739";
      context.fillRect(0, 0, 384, 96);
      context.fillStyle = "#f1ca75";
      context.font = 'bold 30px "Microsoft YaHei", sans-serif';
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.fillText(`总体积 ${label} mL`, 192, 48);
      texture.needsUpdate = true;
    }
  };
}
