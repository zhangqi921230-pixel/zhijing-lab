import React, { useId, useState } from "react";
import Button from "./LabButton.jsx";
import { apparentDepth } from "./apparentDepth.mjs";
import { rad } from "./models.mjs";
import "./ApparentDepth.css";
export default function ApparentDepth({ p, onChange }) {
  const [depth, setDepth] = useState(2),
    uid = useId().replace(/:/g, "");
  const q = apparentDepth(depth, p.angle, p.n1, p.n2),
    scale = Math.min(
      140 / Math.max(depth, q.apparent ?? 0),
      205 / (q.offset + depth * 0.8),
    ),
    surface = 150,
    base = surface + depth * scale,
    virtual = surface + (q.apparent ?? 0) * scale;
  return (
    <section className="apparent-depth" aria-label="真实深度与视深对照">
      <h3>水下物体，看起来在哪里？</h3>
      <p>
        下方是光源所在介质 n₁，上方是观察介质
        n₂。金色实线从物体发出，绿色实线进入上方介质；虚线是折射光线的反向延长，不是真实光路。
      </p>
      <div
        className="apparent-depth-scroll"
        tabIndex="0"
        role="region"
        aria-label="视深光路图，可横向滚动"
      >
        <svg
          viewBox="0 0 800 420"
          role="img"
          aria-label={
            q.apparent === null
              ? "没有普通透射观察光路"
              : `实际深度${depth}米，所选对称光线延长线交点深度${q.apparent.toFixed(3)}米`
          }
        >
          <defs>
            <linearGradient id={uid} x2="0" y2="1">
              <stop stopColor="var(--ui-selected)" />
              <stop offset="1" stopColor="var(--ui-paper)" />
            </linearGradient>
            <marker
              id={`${uid}-head`}
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="5"
              markerHeight="5"
              orient="auto"
            >
              <path d="M0 0L10 5L0 10Z" fill="context-stroke" />
            </marker>
          </defs>
          <rect
            x="40"
            y={surface}
            width="720"
            height="205"
            fill={`url(#${uid})`}
          />
          <path
            d={`M40 ${surface}H760`}
            stroke="var(--ui-primary)"
            strokeWidth="2"
          />
          <path
            d="M400 45V355"
            stroke="var(--ui-muted)"
            strokeDasharray="5 6"
          />
          <text x="412" y="42">
            物体法线
          </text>
          <text x="54" y="90">
            上方介质 n₂ = {p.n2}
          </text>
          <text x="54" y="190">
            下方介质 n₁ = {p.n1}
          </text>
          {[-1, 1].map((sign) => {
            const x = 400 + sign * q.offset * scale,
              r = rad(q.angle ?? 0),
              endX = x + sign * depth * 0.8 * scale * Math.sin(r),
              endY = surface - depth * 0.8 * scale * Math.cos(r);
            return (
              <g key={sign}>
                <path
                  d={`M400 ${base}L${x} ${surface}`}
                  stroke="var(--ui-gold)"
                  strokeWidth="3"
                  fill="none"
                  markerEnd={`url(#${uid}-head)`}
                />
                {!q.tir && (
                  <path
                    d={`M${x} ${surface}L${endX} ${endY}`}
                    stroke="var(--ui-primary)"
                    strokeWidth="3"
                    fill="none"
                    markerEnd={`url(#${uid}-head)`}
                  />
                )}
                {q.apparent !== null && p.angle > 0 && (
                  <path
                    d={`M${x} ${surface}L400 ${virtual}`}
                    stroke="var(--ui-primary)"
                    strokeWidth="2"
                    strokeDasharray="6 5"
                    fill="none"
                  />
                )}
              </g>
            );
          })}
          <ellipse
            cx="400"
            cy={base}
            rx="15"
            ry="7"
            fill="var(--ui-gold)"
            stroke="var(--ui-ink)"
          />
          {q.apparent !== null && (
            <ellipse
              cx="400"
              cy={virtual}
              rx="15"
              ry="7"
              fill="var(--ui-surface)"
              stroke="var(--ui-primary)"
              strokeDasharray="3 3"
            />
          )}
          <text x="400" y="386" textAnchor="middle">
            实心标记：真实物体　虚线标记：延长线交点 / 近轴极限
          </text>
        </svg>
      </div>
      <div className="apparent-depth-readings">
        <div>
          <span>真实深度</span>
          <strong>{depth.toFixed(2)} m</strong>
        </div>
        <div>
          <span>当前角度的交点深度</span>
          <strong>
            {q.apparent === null ? "不适用" : q.apparent.toFixed(3) + " m"}
          </strong>
        </div>
        <div>
          <span>近轴视深极限</span>
          <strong>{q.limit.toFixed(3)} m</strong>
        </div>
      </div>
      <label>
        真实深度 <output>{depth.toFixed(1)} m</output>
        <input
          aria-label="真实深度"
          type="range"
          min=".5"
          max="4"
          step=".1"
          value={depth}
          onChange={(e) => {
            onChange("angle", p.angle);
            setDepth(Number(e.target.value));
          }}
        />
      </label>
      <div className="apparent-depth-actions">
        {[0, 5, 20, 40].map((angle) => (
          <Button
            key={angle}
            aria-pressed={Math.abs(p.angle - angle) < 1e-8}
            onClick={() => onChange("angle", angle)}
          >
            {angle === 0 ? "近轴极限" : `入射角 ${angle}°`}
          </Button>
        ))}
      </div>
      <p>
        {q.tir
          ? "当前发生全反射，没有进入上方介质的传播折射光线，不能从该方向看到透射像。"
          : q.apparent === null
            ? "当前为临界掠射状态，不把沿界面的光当作普通观察光路。"
            : p.angle === 0
              ? "垂直光线本身不能确定深度；此时虚线标记给出周围近轴光线趋近的极限位置。"
              : `这对对称光线的延长线在深度 ${q.apparent.toFixed(3)} m 处相交。换一个入射角，交点会移动；宽角度光束一般没有单一精确像点。`}
      </p>
      <details>
        <summary>为什么近轴时看起来更浅？</summary>
        <p>
          设物体深度 d，界面横向距离 x=d tan i。将折射光反向延长，交点深度
          d′=x/tan r。由 n₁sin i=n₂sin r，小角度极限得到 d′≈d·n₂/n₁。水到空气时
          n₁&gt;n₂，所以近轴视深小于实深。图中两条光线关于物体法线对称，只表示几何作图；不模拟眼睛、聚焦、光强、波动或水面起伏。
        </p>
      </details>
    </section>
  );
}
