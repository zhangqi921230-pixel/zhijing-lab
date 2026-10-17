import React from "react";
import Button from "./LabButton.jsx";
import { linearPointPair, linearZero } from "./linearStudy.mjs";
export default function LinearStudyGuide({
  p,
  chapter,
  anchor,
  onAnchor,
  onChange,
}) {
  const q = linearPointPair(p.k, p.b, anchor, p.x),
    zero = linearZero(p.k, p.b),
    fmt = (n) => Number(n.toFixed(3));
  if (chapter === 3)
    return (
      <section className="linear-study-guide" aria-label="两点与变化率">
        <h3>从 A 到 P，改变了多少？</h3>
        <p>
          A = ({fmt(q.a)}, {fmt(q.ya)})；P = ({fmt(q.x)}, {fmt(q.y)})
        </p>
        <p>
          Δx = {fmt(q.dx)}；Δy = {fmt(q.dy)}
        </p>
        <strong>
          {q.slope === null
            ? "两点重合，不能用 0÷0 求斜率"
            : `k = Δy / Δx ≈ ${fmt(q.slope)}`}
        </strong>
        {q.slope !== null && (
          <p>
            b = yᴬ − kxᴬ ≈ {fmt(q.ya - q.slope * q.a)}
            。这两个不同点共同确定当前直线。
          </p>
        )}
        <div className="linear-study-actions">
          <Button
            onClick={() => {
              onChange("x", p.x);
              onAnchor(p.x);
            }}
          >
            把当前 P 设为 A
          </Button>
          <Button onClick={() => onAnchor(-1)}>A 回到 x = −1</Button>
          <Button onClick={() => onChange("x", anchor)}>让两点重合</Button>
        </div>
        <p>
          A 的横坐标固定，P 沿当前直线移动。改变 k 或 b
          时，两点一起随直线更新；调整范围之外的点可用下方视野选择显示。
        </p>
      </section>
    );
  if (chapter !== 4) return null;
  return (
    <section className="linear-study-guide" aria-label="横轴交点与正负区间">
      <h3>在哪里等于零？哪一侧为正？</h3>
      <strong>
        {zero.kind === "all"
          ? "整条直线与 x 轴重合"
          : zero.kind === "none"
            ? "水平直线不与 x 轴相交"
            : `零点 x₀ = −b/k ≈ ${fmt(zero.x)}`}
      </strong>
      <p>
        {zero.kind === "one"
          ? `当 x ${p.k > 0 ? ">" : "<"} ${fmt(zero.x)} 时 y > 0；另一侧 y < 0。`
          : zero.kind === "all"
            ? "每一个 x 都满足 y = 0。"
            : `所有 x 对应的 y 都${p.b > 0 ? "大于" : "小于"}0。`}
      </p>
      <p>
        当前 P：x = {fmt(p.x)}，y = {fmt(q.y)}，
        {Math.abs(q.y) < 1e-10
          ? "位于 x 轴上"
          : q.y > 0
            ? "位于 x 轴上方"
            : "位于 x 轴下方"}
        。
      </p>
      <Button
        disabled={zero.kind !== "one" || Math.abs(zero.x) > 4}
        onClick={() => onChange("x", zero.x)}
      >
        把 P 移到零点
      </Button>
      {zero.kind === "one" && Math.abs(zero.x) > 4 && (
        <p>零点超出观察点的 −4～4 范围，保留数值供核对，不将它截断到边界。</p>
      )}
      <p>
        “零点”指横坐标；与 x 轴的交点为 (x₀, 0)。k = 0
        时属于常数函数，需单独判断。
      </p>
    </section>
  );
}
