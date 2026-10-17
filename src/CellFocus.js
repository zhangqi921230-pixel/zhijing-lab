import * as THREE from "three";
import { mitochondrionAnchor, nucleusAnchor } from "./cellLayout.mjs";
import { addStructureLabels } from "./ChloroplastLabels.js";

export function addCellFocus(root) {
  const group = new THREE.Group();
  group.name = "cell-focus";
  root.add(group);
  const entries = [
    null,
    ["细胞核 · 遗传信息", nucleusAnchor, [-2.65, 0.25, 0.8]],
    ["中央液泡 · 细胞液", [0.55, 0.62, 0], [2.6, 0.65, -0.4]],
    ["叶绿体 · 光合作用", [1.75, -0.48, 1.05], [2.65, 0.1, 1.5]],
    ["线粒体 · 有氧呼吸", mitochondrionAnchor, [-0.8, 0.4, -2.65]],
    ["高尔基体 · 加工与分选", [-1.6, 0.08, -0.5], [-2.65, 0.5, -1.3]],
    [
      "内质网 · 膜囊与管网",
      [erCenter[0], erCenter[1] + erSurface(0, 0, 2), erCenter[2]],
      [-2.75, 0.35, -0.2],
    ],
  ];
  const labels = entries.map((entry, part) => {
    if (!entry) return null;
    const detail = addStructureLabels(
      group,
      `cell-focus-${part}`,
      [entry],
      0.23,
    );
    detail.children.find((child) => child.isLine).material.color.set("#c9a252");
    return detail;
  });
  return (part) => {
    group.visible = !!entries[part];
    labels.forEach((label, index) => {
      if (label) label.visible = index === part;
    });
  };
}
import { erCenter, erSurface } from "./EndoplasmicReticulum.js";
