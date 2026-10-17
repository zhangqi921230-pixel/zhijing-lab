import React, { useId } from "react";
import { circularState, shadowState } from "./observableModels.mjs";
import "./ObservableScene.css";
export default function ObservableScene({ id, p, time, guides = true }) {
  const uid = useId().replace(/:/g, "");
  const circular = id === "circular-motion";
  const q = circular ? circularState(p, time) : shadowState(p, time);
  const scale = circular ? 51 : Math.min(21, 570 / Math.max(q.large, 10));
  const point = circular ? [340 + q.x * scale, 300 - q.y * scale] : null;
  return (
    <svg
      className="motion-diagram observable-scene"
      viewBox="0 0 900 620"
      role="img"
      aria-label={
        circular ? "圆周轨迹、切线速度与向心合力" : "立杆和建筑的同尺度影长测量"
      }
    >
      <defs>
        <pattern
          id={`${uid}-grid`}
          width="30"
          height="30"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M30 0H0V30"
            fill="none"
            stroke="var(--ui-line)"
            strokeWidth=".7"
          />
        </pattern>
        <marker
          id={`${uid}-v`}
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="7"
          markerHeight="7"
          orient="auto-start-reverse"
        >
          <path d="M0 0L10 5L0 10Z" fill="var(--ui-primary)" />
        </marker>
        <marker
          id={`${uid}-f`}
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="7"
          markerHeight="7"
          orient="auto-start-reverse"
        >
          <path d="M0 0L10 5L0 10Z" fill="var(--ui-gold)" />
        </marker>
      </defs>
      <rect
        x="20"
        y="95"
        width="860"
        height="465"
        rx="12"
        fill={`url(#${uid}-grid)`}
      />
      <text x="36" y="40" className="observable-title">
        {circular ? "运动方向 ≠ 受力方向" : "同一束阳光 · 同一把米尺"}
      </text>
      <text x="36" y="75">
        {circular
          ? "绿色：切线速度　金色：向心合力方向"
          : "播放卷尺测量；改变太阳高度角，两个影子同步变化"}
      </text>
      {circular ? (
        <>
          <circle
            cx="340"
            cy="300"
            r={p.radius * scale}
            fill="var(--ui-primary)"
            fillOpacity=".04"
            stroke="var(--ui-muted)"
            strokeWidth="2"
          />
          <circle cx="340" cy="300" r="5" fill="var(--ui-ink)" />
          <text x="320" y="330">
            O
          </text>
          {guides && (
            <>
              <path
                d={`M340 300L${point.join(" ")}`}
                fill="none"
                stroke="var(--ui-muted)"
                strokeDasharray="6 5"
              />
              <path
                data-vector="velocity"
                d={`M${point.join(" ")}l${q.vx * 25} ${-q.vy * 25}`}
                stroke="var(--ui-primary)"
                strokeWidth="4"
                markerEnd={`url(#${uid}-v)`}
              />
              <path
                data-vector="force"
                d={`M${point.join(" ")}l${-Math.cos(q.angle) * Math.min(70, p.radius * scale * 0.8)} ${Math.sin(q.angle) * Math.min(70, p.radius * scale * 0.8)}`}
                stroke="var(--ui-gold)"
                strokeWidth="4"
                markerEnd={`url(#${uid}-f)`}
              />
            </>
          )}
          <circle
            data-object="ball"
            cx={point[0]}
            cy={point[1]}
            r="13"
            fill="var(--ui-primary)"
            stroke="var(--ui-surface)"
            strokeWidth="3"
          />
          <g transform="translate(630 165)">
            <text y="0">半径 r</text>
            <text y="34" className="observable-number">
              {p.radius.toFixed(1)} m
            </text>
            <text y="100">速度大小 v</text>
            <text y="134" className="observable-number">
              {p.speed.toFixed(1)} m/s
            </text>
            <text y="200">向心合力大小</text>
            <text y="234" className="observable-number">
              {q.force.toFixed(2)} N
            </text>
          </g>
          <text x="36" y="535">
            位置：({q.x.toFixed(2)}, {q.y.toFixed(2)}) m　　经过{" "}
            {time.toFixed(2)} s
          </text>
        </>
      ) : (
        <>
          {[
            { height: p.pole, length: q.small, y: 245, label: "参照立杆" },
            { height: p.height, length: q.large, y: 515, label: "被测建筑" },
          ].map((obj, i) => {
            const x = 155,
              y = obj.y,
              h = obj.height * scale,
              l = obj.length * scale;
            return (
              <g key={obj.label}>
                <path
                  d={`M90 ${y}H840`}
                  stroke="var(--ui-muted)"
                  strokeWidth="2"
                />
                {i === 1 ? (
                  <>
                    <rect
                      x={x - 55}
                      y={y - h}
                      width="55"
                      height={h}
                      fill="var(--ui-primary)"
                      fillOpacity=".18"
                      stroke="var(--ui-primary)"
                      strokeWidth="2"
                    />
                    {Array.from({ length: Math.floor(h / 30) }, (_, k) => (
                      <path
                        key={k}
                        d={`M${x - 45} ${y - 15 - k * 30}h12m10 0h12`}
                        stroke="var(--ui-primary)"
                        strokeWidth="6"
                      />
                    ))}
                  </>
                ) : (
                  <path
                    d={`M${x} ${y}V${y - h}`}
                    stroke="var(--ui-primary)"
                    strokeWidth="7"
                  />
                )}
                <path
                  d={`M${x} ${y}H${x + l}`}
                  stroke="var(--ui-ink)"
                  strokeWidth="9"
                  opacity=".32"
                />
                <text x="36" y={y - h - 17}>
                  {obj.label} · {obj.height} m
                </text>
                {guides && (
                  <>
                    <path
                      d={`M${x} ${y - h}L${x + l} ${y}H${x}Z`}
                      fill="var(--ui-gold)"
                      fillOpacity=".08"
                      stroke="var(--ui-gold)"
                      strokeWidth="2"
                    />
                    <path
                      d={`M${x} ${y - 15}h15v15`}
                      fill="none"
                      stroke="var(--ui-ink)"
                    />
                  </>
                )}
                <path
                  data-measure={i}
                  d={`M${x} ${y + 18}h${l * q.progress}`}
                  stroke="var(--ui-primary)"
                  strokeWidth="4"
                />
                <circle
                  cx={x + l * q.progress}
                  cy={y + 18}
                  r="5"
                  fill="var(--ui-primary)"
                />
                <text x={x} y={y + 49}>
                  影长 {obj.length.toFixed(2)} m · 已量{" "}
                  {(obj.length * q.progress).toFixed(2)} m
                </text>
              </g>
            );
          })}
        </>
      )}
      <text x="36" y="598">
        {circular
          ? "金色箭头表示方向；合力大小请看数值，勿与速度箭头比较长度。"
          : `H / h = L / l = ${q.ratio.toFixed(2)}　　太阳高度角 ${p.angle}°；两幅图等比例`}
      </text>
    </svg>
  );
}
