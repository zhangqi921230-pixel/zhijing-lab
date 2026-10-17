import { functionBisection } from "./functionBisection.mjs";
import { functionExpression } from "./functionDescription.mjs";
export function bisectionExport(p, left, right, steps) {
  const result = functionBisection(p, Number(left), Number(right), steps);
  if (!result.valid || left.trim() === "" || right.trim() === "") return null;
  return [
    ["实验", "零点与二分法"],
    ["函数", functionExpression(p)],
    ["初始左端点", Number(left), "初始右端点", Number(right)],
    [
      "说明",
      "数值为浮点计算结果；误差上界为保留区间半宽。仅对满足连续性和异号条件的区间使用二分法。",
    ],
    ["折半步骤", "原左端点", "原右端点", "中点", "f(中点)"],
    ...result.rows.map((row, i) => [
      i + 1,
      row.left,
      row.right,
      row.mid,
      row.value,
    ]),
    ["当前保留区间", result.left, result.right],
    ["中点近似值", result.estimate],
    ["误差上界", result.error],
  ];
}
