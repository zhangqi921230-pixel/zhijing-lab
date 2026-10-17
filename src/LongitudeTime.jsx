import React, { useState, useId } from "react";
import Button from "./LabButton.jsx";
import { daynightState } from "./models.mjs";
import "./LongitudeTime.css";
export function longitudeTime(hour, delta) {
  const raw = hour + delta / 15,
    wrapped = ((raw % 24) + 24) % 24,
    minutes = Math.round(wrapped * 60) % 1440;
  return {
    hour: wrapped,
    label: `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`,
    day: Math.floor(raw / 24) - Math.floor(hour / 24),
  };
}
export default function LongitudeTime({ p, onChange }) {
  const [delta, setDelta] = useState(45),
    clip = useId().replace(/:/g, "");
  const a = longitudeTime(p.hour, 0),
    b = longitudeTime(p.hour, delta);
  const point = (h) => {
    const angle = ((h - 12) * Math.PI) / 12;
    return [210 + 105 * Math.cos(angle), 170 - 105 * Math.sin(angle)];
  };
  const posA = point(a.hour),
    posB = point(b.hour),
    same = delta === 0;
  const set = (d) => {
    setDelta(d);
    onChange("hour", p.hour);
  };
  const phase = (q) =>
    q.phase === "day" ? "白昼" : q.phase === "night" ? "黑夜" : "晨昏交界";
  return (
    <section className="longitude-time" aria-label="同一时刻的两地地方时">
      <h3>同一时刻，两条经线</h3>
      <p>
        A 为参考经线，B 与它同纬度。向东的 B 地方时更早进入下一时刻；每向东
        15°，地方时增加 1 小时。
      </p>
      <div className="longitude-layout">
        <div
          className="longitude-scroll"
          tabIndex="0"
          role="region"
          aria-label="从北极上空比较经线方位，可横向滚动"
        >
          <svg
            viewBox="0 0 530 345"
            role="img"
            aria-label={`B相对A${delta >= 0 ? "向东" : "向西"}${Math.abs(delta)}度；A地方时${a.label}，B地方时${b.label}`}
          >
            <defs>
              <clipPath id={clip}>
                <circle cx="210" cy="170" r="105" />
              </clipPath>
            </defs>
            <circle
              cx="210"
              cy="170"
              r="105"
              fill="var(--ui-selected)"
              stroke="var(--ui-muted)"
            />
            <rect
              x="105"
              y="65"
              width="105"
              height="210"
              clipPath={`url(#${clip})`}
              fill="#071018"
              opacity=".45"
            />
            {[0, 6, 12, 18].map((h) => {
              const [x, y] = point(h);
              return (
                <path
                  key={h}
                  d={`M210 170L${x} ${y}`}
                  stroke="var(--ui-line)"
                />
              );
            })}
            <path
              d="M210 65V275"
              stroke="var(--ui-muted)"
              strokeDasharray="5 5"
            />
            {[120, 170, 220].map((y) => (
              <g key={y}>
                <path
                  d={`M480 ${y}H340m10 -5l-10 5 10 5`}
                  fill="none"
                  stroke="var(--ui-gold)"
                  strokeWidth="2"
                />
              </g>
            ))}
            <text x="410" y="85" textAnchor="middle">
              太阳光
            </text>
            <text x="210" y="34" textAnchor="middle">
              北极上空 · 自西向东转动
            </text>
            <path
              d="M122 73A132 132 0 0 0 82 192l-7 -10m7 10 9 -8"
              fill="none"
              stroke="var(--ui-muted)"
              strokeWidth="2"
            />
            {[posA, ...(same ? [] : [posB])].map(([x, y], i) => (
              <g key={i}>
                <path
                  d={`M210 170L${x} ${y}`}
                  stroke={i ? "var(--ui-gold)" : "var(--ui-primary)"}
                  strokeWidth="2"
                />
                <circle
                  cx={x}
                  cy={y}
                  r="7"
                  fill={i ? "var(--ui-gold)" : "var(--ui-primary)"}
                />
                <text
                  x={x + (x >= 210 ? 16 : -16)}
                  y={y + (Math.abs(y - 170) < 12 ? -14 : 6)}
                  textAnchor={x >= 210 ? "start" : "end"}
                >
                  {same ? "A=B" : i ? "B" : "A"}
                </text>
              </g>
            ))}
            <circle cx="210" cy="170" r="4" fill="var(--ui-ink)" />
            <text x="210" y="308" textAnchor="middle">
              左侧背光 · 右侧受光 · 点表示经线方位
            </text>
          </svg>
        </div>
        <div className="longitude-clocks">
          {[
            ["A · 参考经线", a],
            ["B · 对照经线", b],
          ].map(([title, q]) => {
            const sun = daynightState(q.hour, p.lat);
            return (
              <div key={title}>
                <h4>{title}</h4>
                <strong>{q.label}</strong>
                <span>
                  {q.day === 0
                    ? "与 A 同日"
                    : q.day > 0
                      ? "比 A 的日期晚一天"
                      : "比 A 的日期早一天"}
                </span>
                <p>
                  {phase(sun)} · 太阳高度 {sun.altitude.toFixed(1)}°
                </p>
              </div>
            );
          })}
        </div>
      </div>
      <label>
        B 相对 A 的经度差{" "}
        <output>
          {delta === 0
            ? "同一经线"
            : `${delta > 0 ? "向东" : "向西"} ${Math.abs(delta)}°`}
        </output>
        <input
          aria-label="两地经度差"
          type="range"
          min="-180"
          max="180"
          step="15"
          value={delta}
          onChange={(e) => set(Number(e.target.value))}
        />
      </label>
      <div className="longitude-actions">
        {[-90, 0, 45, 90].map((d) => (
          <Button key={d} aria-pressed={delta === d} onClick={() => set(d)}>
            {d === 0
              ? "同一经线"
              : `${d > 0 ? "向东" : "向西"} ${Math.abs(d)}°`}
          </Button>
        ))}
        <Button
          onClick={() => onChange("hour", (((12 - delta / 15) % 24) + 24) % 24)}
        >
          让 B 到正午
        </Button>
      </div>
      <p>
        计算：B 地方时 = A 地方时 + 经度差 ÷ 15。当前相差 {Math.abs(delta / 15)}{" "}
        小时；改变经度差会暂停自转，播放原有“演示自转”时两地时钟同步前进。
      </p>
      <details>
        <summary>这与北京时间、时区有什么不同？</summary>
        <p>
          这是理想地方太阳时：每条经线自己的正午为 12
          时。法定钟表时间由国家或地区规定，不能只按所在地经度计算。这里不指定真实城市、不绘制国际日期变更线；跨零点的日期提示只表示相对
          A
          的形式化日序。春秋分、太阳直射赤道、忽略折射，与上方地球模型共用条件。图中方位点不表示实际地图或纬线半径。
        </p>
      </details>
    </section>
  );
}
