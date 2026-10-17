import * as T from "three";
import { opticalAxis, opticalScale } from "./opticalModel.mjs";

export function addOpticalFocalMarks(root) {
  const group = new T.Group();
  group.name = "optical-focal-marks";
  root.add(group);
  const marks = [-2, -1, 1, 2].map((n) => {
    const material = new T.SpriteMaterial({
      color: "#e8d39b",
      depthWrite: false,
      depthTest: false,
      toneMapped: false,
    });
    const sprite = new T.Sprite(material);
    sprite.name = `optical-focal-${n}`;
    sprite.userData.multiple = n;
    sprite.center.set(0.5, 10 / 64);
    sprite.scale.set(0.32, 0.32, 1);
    sprite.renderOrder = 5;
    sprite.raycast = () => {};
    group.add(sprite);
    return sprite;
  });
  if (typeof document !== "undefined") {
    for (const multiple of [1, 2]) {
      const canvas = document.createElement("canvas");
      canvas.width = canvas.height = 64;
      const c = canvas.getContext("2d");
      c.fillStyle = "#ffffff";
      c.font = "bold 28px sans-serif";
      c.textAlign = "center";
      c.fillText(multiple === 1 ? "F" : "2F", 32, 29);
      c.beginPath();
      c.arc(32, 54, 4, 0, Math.PI * 2);
      c.fill();
      const map = new T.CanvasTexture(canvas);
      map.colorSpace = T.SRGBColorSpace;
      const resource = new T.Group();
      resource.userData.ownedTexture = map;
      group.add(resource);
      marks
        .filter((mark) => Math.abs(mark.userData.multiple) === multiple)
        .forEach((mark) => (mark.material.map = map));
    }
  }
  return (p, presentationVisible = true) => {
    group.visible = presentationVisible && p.rays !== 0;
    marks.forEach((mark) =>
      mark.position.set(
        mark.userData.multiple * p.f * opticalScale,
        opticalAxis,
        0,
      ),
    );
  };
}
