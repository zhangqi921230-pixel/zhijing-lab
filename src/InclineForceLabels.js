import * as T from "three";
import { addStructureLabels } from "./ChloroplastLabels.js";
import { cellLabelLayout } from "./CellLabelLayout.js";

export function addInclineForceLabels(root) {
  const names = ["重力 mg", "支持力 N", "摩擦力 f", "挡板力 F挡"];
  const colors = ["#c66c39", "#258d83", "#b18c28", "#8e6ab5"];
  const labels = names.map((name, i) => {
    const group = addStructureLabels(
      root,
      `incline-force-label-${i}`,
      [[name, [0, 0, 0], [0, 0, 0]]],
      0.32,
    );
    const line = group.children.find((o) => o.isLine);
    const sprite = group.children.find((o) => o.isSprite);
    line.material.color.set(colors[i]);
    line.renderOrder = 22;
    if (sprite) sprite.renderOrder = 23;
    return { group, line, sprite, lastTip: new T.Vector3(NaN, NaN, NaN) };
  });
  const tip = new T.Vector3(),
    anchor = new T.Vector3();
  // Reuse the shared screen-space layout; force origins remain in world space.
  root.userData.beforeRender = cellLabelLayout(root, {
    maxScreenHeight: 0.08,
  }).update;
  return (arrows) =>
    labels.forEach(({ group, line, sprite, lastTip }, i) => {
      const arrow = arrows[i];
      group.visible = arrow.visible;
      if (!arrow.visible) return;
      group.position.copy(arrow.position);
      tip.set(0, arrow.scale.y, 0).applyQuaternion(arrow.quaternion);
      if (lastTip.equals(tip)) return;
      lastTip.copy(tip);
      anchor.set(i > 1 ? -0.65 : 0.65, i === 3 ? -0.24 : 0.15, 0.035).add(tip);
      const positions = line.geometry.attributes.position;
      positions.setXYZ(0, tip.x, tip.y, tip.z);
      positions.setXYZ(1, anchor.x, anchor.y, anchor.z);
      positions.needsUpdate = true;
      line.geometry.boundingBox = null;
      line.geometry.computeBoundingSphere();
      sprite?.position.copy(anchor);
      if (sprite) sprite.userData.layoutAnchor = anchor.toArray();
    });
}
