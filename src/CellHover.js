const names = [
  "",
  "细胞核",
  "中央液泡",
  "叶绿体",
  "线粒体",
  "高尔基体",
  "内质网",
];

export const isCellPickable = (object) =>
  object.isMesh || (object.isSprite && object.userData.action === "parameter");

export function cellHoverAction(object, selectedPart = 0) {
  for (let target = object; target; target = target.parent) {
    const action = target.userData;
    if (action?.action !== "parameter" || action.key !== "part") continue;
    const name = names[action.value];
    if (!name) return null;
    return action.value === selectedPart
      ? { text: `${name} · 当前观察结构，拖动可旋转`, cursor: "grab" }
      : { text: `${name} · 点击放大观察结构`, cursor: "pointer" };
  }
  return null;
}
