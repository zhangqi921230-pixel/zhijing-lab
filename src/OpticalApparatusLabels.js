import * as T from "three";

// Fixed textures and carrier-local anchors: moving a mount never rebuilds labels.
export function addOpticalApparatusLabels(carriers) {
  const groups = carriers.map((carrier, i) => {
    const group = new T.Group();
    group.name = `optical-apparatus-label-${i}`;
    carrier.add(group);
    const label = new T.Sprite(
      new T.SpriteMaterial({
        color: "#ffffff",
        depthTest: false,
        depthWrite: false,
        toneMapped: false,
      }),
    );
    label.position.set(0, [1.35, 2, 1.65][i], [1.25, -0.6, -1.25][i]);
    label.scale.set(0.82, 0.28, 1);
    label.renderOrder = 6;
    // Teaching annotations are never physical picking targets.
    label.raycast = () => {};
    group.add(label);
    const leader = new T.Line(
      new T.BufferGeometry().setFromPoints([
        new T.Vector3(0, [0.85, 0.94, 1.22][i], 0),
        label.position.clone(),
      ]),
      new T.LineBasicMaterial({
        color: "#92aab0",
        transparent: true,
        opacity: 0.65,
      }),
    );
    group.add(leader);
    leader.raycast = () => {};
    if (typeof document !== "undefined") {
      const canvas = document.createElement("canvas");
      canvas.width = 256;
      canvas.height = 88;
      const c = canvas.getContext("2d");
      c.fillStyle = "#14252bea";
      c.fillRect(0, 0, 256, 88);
      c.strokeStyle = "#63818b";
      c.lineWidth = 2;
      c.strokeRect(1, 1, 254, 86);
      c.fillStyle = "#e5ede8";
      c.textAlign = "center";
      c.font = "bold 32px sans-serif";
      c.fillText(["箭头光源", "凸透镜", "光屏"][i], 128, 39);
      c.fillStyle = "#a7bfc5";
      c.font = "18px sans-serif";
      c.fillText(["OBJECT", "LENS · O", "SCREEN"][i], 128, 69);
      const texture = new T.CanvasTexture(canvas);
      texture.colorSpace = T.SRGBColorSpace;
      label.material.map = texture;
      label.userData.ownedTexture = texture;
    }
    return group;
  });
  return (p, presentationVisible = true) =>
    groups.forEach((group) => {
      group.visible = presentationVisible && p.apparatusLabels !== 0;
    });
}
