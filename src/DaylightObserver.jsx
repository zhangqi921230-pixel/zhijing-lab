import LongitudeTime from "./LongitudeTime.jsx";
import React, { useMemo } from "react";
import { daynightState } from "./models.mjs";
import "./DaylightObserver.css";
export default function DaylightObserver({ p, onChange, chapter = 0 }) {
  const q = daynightState(p.hour, p.lat),
    x = (h) => 40 + (h / 24) * 320,
    y = (a) => 125 - (a / 90) * 90;
  const path = useMemo(
    () =>
      Array.from(
        { length: 97 },
        (_, i) =>
          `${i ? "L" : "M"}${40 + (i / 96) * 320},${125 - daynightState(i / 4, p.lat).altitude}`,
      ).join(" "),
    [p.lat],
  );
  const choose = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    if (r.width)
      onChange(
        "hour",
        Math.round(
          Math.max(
            0,
            Math.min(
              24,
              ((((e.clientX - r.left) / r.width) * 400 - 40) / 320) * 24,
            ),
          ) * 4,
        ) / 4,
      );
  };
  return (
    <section className="daylight-observer" aria-label="观察地点的一天">
      <header>
        <strong>从观察地点看一天</strong>
        <span>春秋分理想条件 · 太阳直射赤道</span>
      </header>
      <div className="daylight-status">
        <b>
          {q.phase === "day"
            ? "白昼"
            : q.phase === "night"
              ? "黑夜"
              : "晨昏交界"}
        </b>
        <span>太阳高度 {q.altitude.toFixed(2)}°</span>
      </div>
      <div className="daylight-main-layout">
        <div>
          <svg
            viewBox="0 0 400 270"
            role="slider"
            tabIndex="0"
            aria-label="一天的太阳高度选时"
            aria-valuemin={0}
            aria-valuemax={24}
            aria-valuenow={p.hour}
            aria-valuetext={`示意时刻${p.hour}小时，太阳高度${q.altitude.toFixed(2)}度`}
            onPointerDown={(e) => {
              e.currentTarget.setPointerCapture(e.pointerId);
              choose(e);
            }}
            onPointerMove={(e) => {
              if (e.currentTarget.hasPointerCapture(e.pointerId)) choose(e);
            }}
            onPointerUp={(e) => {
              if (e.currentTarget.hasPointerCapture(e.pointerId))
                e.currentTarget.releasePointerCapture(e.pointerId);
            }}
            onKeyDown={(e) => {
              const next =
                e.key === "Home"
                  ? 0
                  : e.key === "End"
                    ? 24
                    : e.key === "ArrowRight"
                      ? p.hour + 0.25
                      : e.key === "ArrowLeft"
                        ? p.hour - 0.25
                        : null;
              if (next !== null) {
                e.preventDefault();
                onChange("hour", Math.max(0, Math.min(24, next)));
              }
            }}
          >
            <rect
              x="40"
              y="35"
              width="320"
              height="90"
              className="daylight-sky"
            />
            <rect
              x="40"
              y="125"
              width="320"
              height="90"
              className="daylight-below"
            />
            {[-90, -45, 0, 45, 90].map((a) => (
              <g key={a}>
                <line
                  x1="40"
                  x2="360"
                  y1={y(a)}
                  y2={y(a)}
                  className={a === 0 ? "daylight-horizon" : "daylight-grid"}
                />
                <text x="32" y={y(a) + 5} textAnchor="end">
                  {a}
                </text>
              </g>
            ))}
            <text x="40" y="20">
              太阳高度 / °
            </text>
            <path d={path} className="daylight-path" />
            <line
              x1={x(p.hour)}
              x2={x(p.hour)}
              y1="35"
              y2="215"
              className="daylight-cursor"
            />
            <circle
              cx={x(p.hour)}
              cy={y(q.altitude)}
              r="5"
              fill="var(--ui-gold)"
            />
            {[0, 6, 12, 18, 24].map((h) => (
              <text key={h} x={x(h)} y="238" textAnchor="middle">
                {h}
              </text>
            ))}
            <text x="200" y="262" textAnchor="middle">
              示意时刻 / 小时
            </text>
          </svg>
        </div>
        <div>
          <div className="daylight-times">
            {[
              [0, "午夜"],
              [6, "日出"],
              [12, "正午"],
              [18, "日落"],
            ].map(([value, label]) => (
              <button
                key={value}
                aria-pressed={Math.abs(p.hour - value) < 0.001}
                onClick={() => onChange("hour", value)}
              >
                {label}
                <small>{value} h</small>
              </button>
            ))}
          </div>
          <p>
            横线为地平线。横线上方的曲线表示太阳在地平线上方，横线下方的曲线表示太阳在地平线以下；负角度不是负的光照。
          </p>
          <p>
            此模型以正午为12 h、自转周期为24
            h，不是当地钟表时间。所有设定纬度在春秋分理想条件下昼夜各12
            h；纬度改变正午高度，不会在本模型中产生四季或极昼极夜。
          </p>
          <p>
            播放自转时，金色观察点与选时线同步移动。点按曲线或用方向键选时可暂停观察。
          </p>
        </div>
      </div>
      {chapter === 5 && <LongitudeTime p={p} onChange={onChange} />}
    </section>
  );
}
