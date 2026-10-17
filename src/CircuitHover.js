export function circuitHoverAction(object, params) {
  for (let target = object; target; target = target.parent) {
    if (
      target.userData.action === "parameter" &&
      target.userData.key === "mode"
    )
      return {
        text: `换向开关 · 点击切到${params.mode ? "充电" : "放电"}，保留当前电容电压并暂停`,
        cursor: "pointer",
      };
    if (target.userData.action === "switch")
      return {
        text: params.closed ? "刀闸 · 点击断开电路" : "刀闸 · 点击闭合电路",
        cursor: "pointer",
      };
    if (target.userData.action === "parameter" && target.userData.key === "u")
      return {
        text: `电源 ${Number(params.u).toFixed(1)} V · ${params.u >= target.userData.max ? "已到上限，Shift + 点击减少 0.5 V" : params.u <= target.userData.min ? "已到下限，点击增加 0.5 V" : "点击增加 0.5 V，Shift + 点击减少"}；也可使用右侧滑块`,
        cursor: "pointer",
      };
  }
  return null;
}
