import "./LatitudeDayBands.css";
import React from "react";
import { solar } from "./models.mjs";
import Button from "./LabButton.jsx";
export const latitudeBands = (day) =>
  [70, 45, 0, -45, -70].map((lat) => ({ lat, ...solar(day, lat) }));
const label = (lat) =>
  lat === 0 ? "赤道" : `${lat > 0 ? "北纬" : "南纬"}${Math.abs(lat)}°`;
export default function LatitudeDayBands({ p, onChange }) {
  return (
    <section
      className="latitude-day-bands"
      aria-label="同一天五个纬度的昼夜对照"
    >
      <h3>同一天，从北极圈内看到南极圈内</h3>
      <p>
        金色为白昼，灰色为黑夜，每条均为24小时。这里比较时长，不表示各地同一钟表时刻的明暗。
      </p>
      <div className="season-band-actions">
        {[
          [0, "春分附近"],
          [91, "北半球夏至附近"],
          [274, "北半球冬至附近"],
        ].map(([day, name]) => (
          <Button
            key={day}
            aria-pressed={p.day === day}
            onClick={() => onChange("day", day)}
          >
            {name}
          </Button>
        ))}
      </div>
      <div
        role="region"
        tabIndex="0"
        aria-label="纬度昼夜条带，可横向滚动"
        style={{ overflowX: "auto" }}
      >
        <svg
          viewBox="0 0 740 380"
          role="img"
          aria-label="赤道及南北纬45度和70度的昼长，随公转日期变化"
          style={{
            width: "100%",
            minWidth: 600,
            display: "block",
            fontSize: 18,
            fill: "var(--ui-ink)",
          }}
        >
          {[0, 6, 12, 18, 24].map((h) => (
            <g key={h}>
              <path d={`M${145 + h * 18} 42V343`} stroke="var(--ui-line)" />
              <text x={145 + h * 18} y="365" textAnchor="middle">
                {h} h
              </text>
            </g>
          ))}
          {latitudeBands(p.day).map((q, i) => (
            <g key={q.lat}>
              <text x="15" y={76 + i * 60}>
                {label(q.lat)}
              </text>
              <rect
                x="145"
                y={54 + i * 60}
                width="432"
                height="30"
                fill="var(--ui-muted)"
                fillOpacity=".24"
              />
              <rect
                x="145"
                y={54 + i * 60}
                width={q.daylight * 18}
                height="30"
                fill="var(--ui-gold)"
              />
              <text x="590" y={76 + i * 60}>
                {q.daylight.toFixed(2)} h
                {q.daylight === 24
                  ? " · 极昼"
                  : q.daylight === 0
                    ? " · 极夜"
                    : ""}
              </text>
              {p.lat === q.lat && (
                <rect
                  x="6"
                  y={45 + i * 60}
                  width="725"
                  height="48"
                  fill="none"
                  stroke="var(--ui-primary)"
                  strokeDasharray="4 3"
                />
              )}
            </g>
          ))}
        </svg>
      </div>
      <div className="season-band-actions">
        {[70, 45, 0, -45, -70].map((lat) => (
          <Button
            key={lat}
            aria-pressed={p.lat === lat}
            onClick={() => onChange("lat", lat)}
          >
            观察{label(lat)}
          </Button>
        ))}
      </div>
      <p>
        点击纬度，将主图观察地点与全年曲线切换到该位置。播放公转观察五条昼夜带一起变化；春分附近约12小时并不意味着各地正午太阳高度相同。模型忽略大气折射、地形和太阳视半径。
      </p>
    </section>
  );
}
