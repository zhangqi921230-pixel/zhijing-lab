import React from "react";
import Button from "./LabButton.jsx";
import { displacementState } from "./chemistryTopics.mjs";
import "./DisplacementComparison.css";
const samples = [
  { metal: "iron", name: "铁", molar: 55.845, color: "#77868f" },
  { metal: "zinc", name: "锌", molar: 65.38, color: "#99a6ad" },
  { metal: "copper", name: "铜", molar: 63.546, color: "#bd7347" },
];
export function displacementComparison(time) {
  return samples.map((sample) => ({
    ...sample,
    mass: sample.molar * 0.01,
    ...displacementState(sample.metal, sample.molar * 0.01, time / 60),
  }));
}
export default function DisplacementComparison({ time, p, onSeek, onInspect }) {
  const rows = displacementComparison(time);
  return (
    <section className="displacement-comparison" aria-label="铁锌铜同条件对照">
      <h3>三种金属，同一份硫酸铜</h3>
      <p>
        每杯初始含10 mmol Cu²⁺，分别投入10
        mmol铁、锌或铜。物质的量相同，质量不同。此处为独立对照组，主模型的质量滑块不改变这三份样品。
      </p>
      <div className="displacement-compare-actions">
        {[0, 30, 60].map((t, i) => (
          <Button key={t} onClick={() => onSeek(t)}>
            {["对照反应前", "对照中间过程", "对照完全反应"][i]}
          </Button>
        ))}
      </div>
      <div
        className="displacement-compare-scroll"
        role="region"
        tabIndex="0"
        aria-label="三杯反应对照，可横向滚动"
      >
        <svg
          viewBox="0 0 840 490"
          role="img"
          aria-label="铁锌析出铜，铜片无净反应的并排示意"
        >
          {rows.map((row, i) => {
            const x = 25 + i * 280,
              remaining =
                row.metal === "copper" ? 1 : Math.max(0, 1 - row.fraction);
            return (
              <g
                key={row.metal}
                transform={`translate(${x} 0)`}
                data-compare-metal={row.metal}
              >
                <text
                  x="120"
                  y="33"
                  textAnchor="middle"
                  className="compare-sample-name"
                >
                  {row.name} · 10 mmol
                </text>
                <text x="120" y="62" textAnchor="middle">
                  {row.mass.toFixed(5)} g
                </text>
                <path
                  d="M27 98V310Q27 326 43 326H197Q213 326 213 310V98"
                  fill="var(--ui-surface)"
                  stroke="var(--ui-muted)"
                  strokeWidth="2"
                />
                <path
                  d="M32 155H208V309Q208 321 195 321H45Q32 321 32 309Z"
                  fill="#28a0d9"
                  opacity={0.48 * (1 - row.fraction)}
                />
                {row.metal === "iron" && (
                  <path
                    d="M32 155H208V309Q208 321 195 321H45Q32 321 32 309Z"
                    fill="#84b995"
                    opacity={row.fraction * 0.5}
                  />
                )}
                <ellipse
                  cx="120"
                  cy="155"
                  rx="88"
                  ry="6"
                  fill="#36a8cc"
                  opacity={0.3 * (1 - row.fraction)}
                />
                <ellipse
                  cx="120"
                  cy="155"
                  rx="88"
                  ry="6"
                  fill="none"
                  stroke="var(--ui-muted)"
                  strokeWidth=".8"
                />
                <path
                  d="M40 118V306"
                  stroke="var(--ui-surface)"
                  strokeWidth="4"
                  opacity=".7"
                />
                <path
                  d="M190 193h14m-14 38h14m-14 38h14"
                  stroke="var(--ui-muted)"
                />
                <path
                  d="M80 111H160"
                  stroke="var(--ui-muted)"
                  strokeWidth="5"
                />
                <path
                  d="M120 111V178"
                  stroke="var(--ui-muted)"
                  strokeWidth="3"
                />
                {remaining > 1e-8 && (
                  <rect
                    data-original-metal="true"
                    x={120 - 14 * remaining}
                    y="178"
                    width={28 * remaining}
                    height="104"
                    fill={row.color}
                    stroke="var(--ui-ink)"
                    strokeWidth=".6"
                  />
                )}
                {row.fraction > 0 &&
                  Array.from({ length: 24 }, (_, n) => (
                    <circle
                      key={n}
                      data-new-copper="true"
                      cx={55 + ((n * 37) % 131)}
                      cy={300 + ((n * 11) % 17)}
                      r={3.5 * Math.cbrt(row.fraction)}
                      fill="#c37546"
                      stroke="#85442d"
                      strokeWidth=".6"
                    />
                  ))}
                <text x="120" y="358" textAnchor="middle">
                  {row.metal === "copper"
                    ? "无净置换反应"
                    : row.fraction === 0
                      ? "尚未推进反应"
                      : remaining < 1e-8
                        ? "原金属耗尽，铜留在杯中"
                        : "原金属减少，铜逐渐析出"}
                </text>
                <text x="120" y="393" textAnchor="middle">
                  剩余Cu²⁺ {(row.remaining * 1000).toFixed(2)} mmol
                </text>
                <text x="120" y="424" textAnchor="middle">
                  新析出铜 {row.copper.toFixed(3)} g
                </text>
                <text x="120" y="463" textAnchor="middle">
                  {row.metal === "iron"
                    ? "终点：亚铁盐浅绿色"
                    : row.metal === "zinc"
                      ? "终点：锌盐近于无色"
                      : "终点：原溶液蓝色保留"}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      <div className="displacement-compare-actions">
        {rows.map((row) => (
          <Button
            key={row.metal}
            aria-pressed={
              p.metal === row.metal && Math.abs(p.mass - row.mass) < 1e-7
            }
            onClick={() => onInspect(row.metal, row.mass)}
          >
            主模型观察{row.name}
          </Button>
        ))}
      </div>
      <p>
        共用主时间轴，仅比较相同演示进度下的变化及最终反应量，不能据此比较铁与锌的真实反应速率。蓝色强弱为定性示意；颗粒数量、沉降与片材厚度不代表真实微观尺度。灰色悬挂线为夹持示意，不参与反应。
      </p>
    </section>
  );
}
