import React from "react";
import Button from "./LabButton.jsx";
import { circleAngleState } from "./opticalGeometryModels.mjs";
export default function CircleArcStudy({ p, time, onSide }) {
  const q = circleAngleState(p, time),
    other = p.central / 2;
  return (
    <section className="motion-task" aria-label="两条弧上的角度对照">
      <h3>先辨认：哪条弧不包含顶点 P？</h3>
      <div className="motion-shortcuts">
        <Button aria-pressed={p.side !== 1} onClick={() => onSide(0)}>
          P 与 Q 在同一侧弧
        </Button>
        <Button aria-pressed={p.side === 1} onClick={() => onSide(1)}>
          P 换到另一侧弧
        </Button>
      </div>
      <p>
        金色弧不包含 P，是 ∠APB 所对的弧：{q.intercepted}° ÷ 2 ={" "}
        {q.angle.toFixed(1)}°。图中较小的 ∠AOB 仍为 {p.central}°。
      </p>
      <p>
        {p.side === 1
          ? `P 与 Q 位于弦 AB 两侧，∠APB + ∠AQB = ${q.angle.toFixed(1)}° + ${other.toFixed(1)}° = 180°。`
          : `P 与 Q 位于同一条弧，两个角都为 ${other.toFixed(1)}°。`}
      </p>
      <p>
        播放只沿当前弧移动
        P；跨弧按钮直接切换观察位置，不演示经过端点时的退化三角形。
      </p>
    </section>
  );
}
