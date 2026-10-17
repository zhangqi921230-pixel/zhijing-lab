import React from "react";
import Button from "./LabButton.jsx";
import { circleAngleState } from "./opticalGeometryModels.mjs";
export function diameterEvidence(p, time) {
  const q = circleAngleState(p, time);
  const squared = (a, b) =>
    a.reduce((sum, value, i) => sum + (value - b[i]) ** 2, 0);
  return {
    ...q,
    ap2: squared(q.A, q.P),
    bp2: squared(q.B, q.P),
    ab2: squared(q.A, q.B),
  };
}
export default function DiameterStudy({ p, time, onChange }) {
  const q = diameterEvidence(p, time);
  return (
    <section className="motion-task" aria-label="直径与勾股关系对照">
      <h3>直径换成普通弦，平方和还相等吗？</h3>
      <p>
        圆的半径取 1 个长度单位。下方条带长度表示边长的平方，与主图共用顶点 P
        和播放时刻。
      </p>
      <div className="motion-shortcuts">
        <Button
          aria-pressed={p.central === 180}
          onClick={() => onChange({ ...p, central: 180 })}
        >
          直径 AB · 180°
        </Button>
        <Button
          aria-pressed={p.central === 120}
          onClick={() => onChange({ ...p, central: 120 })}
        >
          普通弦 AB · 120°
        </Button>
        <Button onClick={() => onChange({ ...p, position: 25 })}>
          P 靠近 A
        </Button>
        <Button onClick={() => onChange({ ...p, position: 50 })}>
          P 在弧中点
        </Button>
      </div>
      {p.central === 180 && (
        <div className="motion-shortcuts" aria-label="直角证明步骤">
          <Button
            aria-pressed={p.proof === 1}
            onClick={() => onChange({ ...p, proof: 1 })}
          >
            1 · 连接半径 OP
          </Button>
          <Button
            aria-pressed={p.proof === 2}
            onClick={() => onChange({ ...p, proof: 2 })}
          >
            2 · 标出两个底角
          </Button>
          <Button onClick={() => onChange({ ...p, proof: 0 })}>
            收起证明辅助线
          </Button>
        </div>
      )}
      {p.central === 180 && p.proof > 0 && (
        <p role="status">
          {p.proof === 1
            ? "主图已连接 OP。OA = OP = OB，因此 △AOP 与 △BOP 都是等腰三角形。"
            : "设 ∠APO = α，∠OPB = β。两个等腰三角形给出 ∠OAP = α、∠OBP = β。因为 A、O、B 共线，大三角形内角和为 2α + 2β = 180°，所以 ∠APB = α + β = 90°。"}
        </p>
      )}
      <div
        role="region"
        tabIndex="0"
        aria-label="边长平方条带，可横向滚动"
        style={{ overflowX: "auto" }}
      >
        <svg
          viewBox="0 0 700 230"
          role="img"
          aria-label="AP平方与BP平方之和，对照AB平方"
          style={{
            width: "100%",
            minWidth: 560,
            display: "block",
            fontSize: 18,
            fill: "var(--ui-ink)",
          }}
        >
          <text x="20" y="30">
            同一标尺 · 每格 1 平方单位
          </text>
          {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <g key={n}>
              <path d={`M${70 + n * 65} 55V180`} stroke="var(--ui-line)" />
              <text x={70 + n * 65} y="210" textAnchor="middle">
                {n}
              </text>
            </g>
          ))}
          <rect
            x="70"
            y="65"
            width={q.ap2 * 65}
            height="32"
            fill="var(--ui-primary)"
          />
          <rect
            x={70 + q.ap2 * 65}
            y="65"
            width={q.bp2 * 65}
            height="32"
            fill="var(--ui-gold)"
          />
          <text x="70" y="125">
            AP² {q.ap2.toFixed(3)} + BP² {q.bp2.toFixed(3)} ={" "}
            {(q.ap2 + q.bp2).toFixed(3)}
          </text>
          <rect
            x="70"
            y="145"
            width={q.ab2 * 65}
            height="32"
            fill="var(--ui-muted)"
          />
          <text x={80 + q.ab2 * 65} y="168">
            AB² {q.ab2.toFixed(3)}
          </text>
        </svg>
      </div>
      <p>
        ∠APB = <strong>{q.angle.toFixed(1)}°</strong>。
        {p.central === 180
          ? "AB 是直径：AP² + BP² = AB² = 4。播放时三角形形状改变，直角与平方和保持不变。"
          : "AB 不是直径：此时不能把 AP、BP 当作直角三角形的两直角边，平方和一般不等于 AB²。"}
      </p>
      <p>
        先预测，再切换两种弦并播放。本图是数值与几何对照，不代替证明；直径情形的证明可连接
        OP，利用 OA = OP = OB 的两个等腰三角形与三角形内角和。
      </p>
    </section>
  );
}
