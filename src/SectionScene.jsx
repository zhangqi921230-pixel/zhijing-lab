import React from "react";
import { sectionState } from "./sectionLessons.mjs";
import "./ObservableScene.css";
export default function SectionScene({
  id,
  p,
  time,
  chapter = 0,
  guides = true,
}) {
  const q = sectionState(id, p, time),
    solid = id === "solid-volume";
  const r = p.radius * 38,
    h = p.height * 44,
    top = 440 - h,
    sy = 440 - h * q.progress;
  const waterTop = 150,
    bottom = waterTop + p.depth * 58,
    py = waterTop + (q.probeDepth || 0) * 58;
  return (
    <svg
      className="motion-diagram observable-scene"
      viewBox="0 0 900 620"
      role="img"
      aria-label={
        solid ? "圆锥与同底等高圆柱的切片和体积" : "液体压强探头与坝面受力分布"
      }
    >
      <text x="35" y="45" className="observable-title">
        {solid
          ? chapter === 1
            ? "一份 · 两份 · 三份"
            : "同底等高 · 截面与体积"
          : "从一个测压点，到整面水坝"}
      </text>
      <text x="35" y="82">
        {solid
          ? "左：圆锥　右：圆柱；共用长度比例尺"
          : "液面表压为零；金色箭头表示液体对坝面的压力方向"}
      </text>
      {solid ? (
        <>
          <path
            d={`M${235 - r} 440L235 ${top}L${235 + r} 440Z`}
            fill="var(--ui-primary)"
            fillOpacity=".10"
            stroke="var(--ui-primary)"
            strokeWidth="2"
          />
          <ellipse
            cx="235"
            cy="440"
            rx={r}
            ry={r * 0.22}
            fill="var(--ui-primary)"
            fillOpacity=".12"
            stroke="var(--ui-primary)"
          />
          <path
            d={`M${625 - r} ${top}V440A${r} ${r * 0.22} 0 0 0 ${625 + r} 440V${top}`}
            fill="var(--ui-primary)"
            fillOpacity=".05"
            stroke="var(--ui-primary)"
            strokeWidth="2"
          />
          <ellipse
            cx="625"
            cy={top}
            rx={r}
            ry={r * 0.22}
            fill="none"
            stroke="var(--ui-primary)"
          />
          {chapter === 1 ? (
            <>
              <path
                d={`M${625 - r} ${440 - h * q.progress}V440A${r} ${r * 0.22} 0 0 0 ${625 + r} 440V${440 - h * q.progress}`}
                fill="var(--ui-gold)"
                fillOpacity=".28"
              />
              <ellipse
                cx="625"
                cy={440 - h * q.progress}
                rx={r}
                ry={r * 0.22}
                fill="var(--ui-gold)"
                fillOpacity=".35"
              />
              {[1, 2].map((n) => (
                <g key={n}>
                  <path
                    d={`M${625 - r} ${440 - (h * n) / 3}H${625 + r}`}
                    stroke="var(--ui-gold)"
                    strokeDasharray="6 5"
                  />
                  <text x={625 + r + 12} y={446 - (h * n) / 3}>
                    {n}/3
                  </text>
                </g>
              ))}
              <text x="390" y="285" className="observable-number">
                × 3 →
              </text>
              <text x="510" y="505">
                已填 {(q.progress * 3).toFixed(2)} 份圆锥体积
              </text>
            </>
          ) : (
            <>
              <ellipse
                cx="235"
                cy={sy}
                rx={q.sliceRadius * 38}
                ry={q.sliceRadius * 38 * 0.22}
                fill="var(--ui-gold)"
                fillOpacity=".5"
                stroke="var(--ui-gold)"
                strokeWidth="3"
              />
              <ellipse
                cx="625"
                cy={sy}
                rx={r}
                ry={r * 0.22}
                fill="var(--ui-gold)"
                fillOpacity=".35"
                stroke="var(--ui-gold)"
                strokeWidth="3"
              />
              {guides && (
                <path
                  d={`M${235 - r - 20} ${sy}H${625 + r + 20}`}
                  stroke="var(--ui-muted)"
                  strokeDasharray="5 7"
                />
              )}
              <text x="95" y="505">
                圆锥切片：{((q.sliceArea / q.base) * 100).toFixed(1)}% 底面积
              </text>
              <text x="525" y="505">
                圆柱切片：100%
              </text>
            </>
          )}
          {guides && (
            <>
              <path
                d={`M235 ${top}V440H${235 + r}`}
                fill="none"
                stroke="var(--ui-muted)"
                strokeDasharray="5 5"
              />
              <text x="90" y="130">
                r = {p.radius} cm　h = {p.height} cm
              </text>
            </>
          )}
          <text x="95" y="550">
            V锥 = {q.cone.toFixed(2)} cm³
          </text>
          <text x="525" y="550">
            V柱 = {q.cylinder.toFixed(2)} cm³
          </text>
          <text x="35" y="595">
            {chapter === 1
              ? "体积分层示意；不是液体倾倒动力学"
              : "切片高度：" +
                (p.height * q.progress).toFixed(2) +
                " cm；圆锥截面半径随高度线性减小"}
          </text>
        </>
      ) : (
        <>
          <rect
            x="75"
            y={waterTop}
            width="410"
            height={p.depth * 58}
            fill="var(--ui-primary)"
            fillOpacity=".14"
          />
          <path
            d={`M75 ${waterTop}H485M75 ${bottom}H565`}
            stroke="var(--ui-primary)"
            strokeWidth="2"
          />
          <path
            d={`M485 ${waterTop - 15}H510L565 ${bottom}H485Z`}
            fill="var(--ui-muted)"
            fillOpacity=".3"
            stroke="var(--ui-muted)"
            strokeWidth="2"
          />
          <text x="75" y="132">
            液面　p = 0
          </text>
          <text x="575" y="132">
            表压分布
          </text>
          {[0, 0.25, 0.5, 0.75, 1].map((f) => (
            <g key={f}>
              {f > 0 && (
                <path
                  d={`M${485 - (q.bottom / 1000) * f * 2} ${waterTop + p.depth * 58 * f}H485l-8 -4m8 4l-8 4`}
                  fill="none"
                  stroke="var(--ui-gold)"
                  strokeWidth="2"
                />
              )}
              {guides && (
                <text x="20" y={waterTop + p.depth * 58 * f + 6}>
                  {(p.depth * f).toFixed(2)}
                </text>
              )}
            </g>
          ))}
          <path
            d={`M620 ${waterTop}V${bottom}H${620 + (q.bottom / 1000) * 2.4}Z`}
            fill="var(--ui-gold)"
            fillOpacity=".2"
            stroke="var(--ui-gold)"
            strokeWidth="2"
          />
          {chapter === 2 && (
            <>
              <path
                d={`M620 ${waterTop}V${bottom}H${620 + p.depth * 9.8 * 2.4}Z`}
                fill="none"
                stroke="var(--ui-primary)"
                strokeWidth="2"
                strokeDasharray="7 5"
              />
              <text x="575" y="105">
                虚线：清水 1000 kg/m³
              </text>
              <path
                d={`M620 ${py}H${620 + (q.pressure / 1000) * 2.4}`}
                stroke="var(--ui-gold)"
                strokeWidth="4"
              />
            </>
          )}
          <text x="610" y={bottom + 30}>
            {(q.bottom / 1000).toFixed(2)} kPa
          </text>
          <circle
            cx="170"
            cy={py}
            r="9"
            fill="var(--ui-primary)"
            stroke="var(--ui-surface)"
            strokeWidth="3"
          />
          <text x="95" y={py + 35}>
            A {(q.pressure / 1000).toFixed(2)} kPa
          </text>
          {chapter === 1 && (
            <>
              <circle cx="350" cy={py} r="9" fill="var(--ui-primary)" />
              <path
                d={`M170 ${py}H350`}
                stroke="var(--ui-primary)"
                strokeDasharray="5 5"
              />
              <text x="310" y={py + 35}>
                B 同压
              </text>
            </>
          )}
          {chapter >= 3 && (
            <>
              <path
                d={`M485 ${waterTop + (p.depth * 58 * 2) / 3}H590l-12 -6m12 6l-12 6`}
                fill="none"
                stroke="var(--ui-primary)"
                strokeWidth="5"
              />
              <text x="575" y="485">
                合力深度 {q.center.toFixed(2)} m
              </text>
            </>
          )}
          <text x="75" y="530">
            深度 z = {q.probeDepth.toFixed(2)} m
          </text>
          <text x="450" y="530">
            密度 ρ = {p.density} kg/m³
          </text>
          <text x="75" y="575">
            {chapter >= 3
              ? `每米坝宽合力 ${(q.force / 1000).toFixed(2)} kN/m；作用深度为 2h/3`
              : chapter === 2
                ? `同深度清水 ${(q.probeDepth * 9.8).toFixed(2)} kPa；当前密度是清水的 ${(p.density / 1000).toFixed(2)} 倍`
                : "探头沿竖直方向移动；时间轴只控制观察位置"}
          </text>
        </>
      )}
    </svg>
  );
}
