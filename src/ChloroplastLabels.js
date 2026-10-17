import * as T from "three";

export function addStructureLabels(parent, name, entries, height = 0.033) {
  const group = new T.Group();
  group.name = name;
  group.userData.structureLabels = true;
  parent.add(group);
  const annotations = [];
  for (const [text, point, anchor] of entries) {
    const line = new T.Line(
      new T.BufferGeometry().setFromPoints([
        new T.Vector3(...point),
        new T.Vector3(...anchor),
      ]),
      new T.LineBasicMaterial({
        color: "#b6cbbc",
        transparent: true,
        opacity: 0.7,
        depthTest: false,
      }),
    );
    line.renderOrder = 8;
    line.name = text;
    group.add(line);
    const annotation = { line, anchor, sprite: null };
    annotations.push(annotation);
    if (typeof document === "undefined") continue;
    const canvas = document.createElement("canvas");
    // Keep the world-space footprint while resolving glyphs for close views
    // and high-density classroom displays. Created once, never per frame.
    canvas.width = text.length * 76 + 32;
    canvas.height = 128;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#0c2228f5";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#f5f7ee";
    ctx.font = '500 76px "Microsoft YaHei", sans-serif';
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);
    const texture = new T.CanvasTexture(canvas);
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
    label.userData.layoutAnchor = [...anchor];
    label.name = text;
    label.position.set(...anchor);
    label.scale.set((canvas.width / canvas.height) * height, height, 1);
    label.renderOrder = 9;
    group.add(label);
    annotation.sprite = label;
  }
  let lastAngle = 0;
  group.userData.setViewAngle = (angle = 0) => {
    if (angle === lastAngle) return;
    lastAngle = angle;
    for (const { line, anchor, sprite } of annotations) {
      const [x, y, z] = anchor;
      const labelY = angle === 2 ? 0 : y;
      const labelZ = angle === 2 ? z - 0.65 * y : z;
      const positions = line.geometry.attributes.position;
      positions.setXYZ(1, x, labelY, labelZ);
      positions.needsUpdate = true;
      line.geometry.boundingBox = null;
      line.geometry.computeBoundingSphere();
      sprite?.position.set(x, labelY, labelZ);
      if (sprite) sprite.userData.layoutAnchor = [x, labelY, labelZ];
    }
  };
  return group;
}

export function addChloroplastLabels(parent) {
  const group = new T.Group();
  group.name = "chloroplast-labels";
  parent.add(group);
  const entries = [
    ["双层膜", [0.36, 0, 0], [0.43, 0.1, 0]],
    [
      "基粒 · 类囊体堆叠",
      parent.getObjectByName("chloroplast-thylakoids").userData.labelPoint,
      [-0.28, 0.18, -0.08],
    ],
    ["基质", [0.2, -0.05, -0.12], [0.25, 0.15, -0.18]],
    ["淀粉粒", [0.09, -0.025, -0.16], [0.04, 0.2, -0.24]],
    [
      "基质片层",
      parent.getObjectByName("chloroplast-lamella").userData.labelPoint,
      [-0.42, 0.04, 0.2],
    ],
  ];
  entries.forEach((entry, i) =>
    addStructureLabels(group, `chloroplast-label-${i}`, [entry], 0.05),
  );
  return group;
}
