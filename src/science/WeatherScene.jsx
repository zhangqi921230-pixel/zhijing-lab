import React, { useState, useId } from "react";
import Button from "../LabButton.jsx";
const settings = {
  sunset: ["太阳高度", 5, 85, 65, "°"],
  rainbow: ["光线入射位置", 15, 95, 85, "%"],
  clouds: ["云层厚度", 10, 100, 35, "%"],
  raindrops: ["雨滴大小", 10, 100, 25, "%"],
  "fog-dew-frost": ["情境", 0, 2, 0, ""],
  snowflakes: ["生长阶段", 0, 100, 20, "%"],
  thunder: ["声源距离", 100, 3000, 1000, "米"],
  wind: ["昼夜情境", 0, 1, 0, ""],
  "mountain-cold": ["气团高度", 0, 100, 20, "%"],
};
function refract(d, n, ratio) {
  const cos = -d[0] * n[0] - d[1] * n[1],
    k = 1 - ratio * ratio * (1 - cos * cos);
  return [
    ratio * d[0] + (ratio * cos - Math.sqrt(Math.max(0, k))) * n[0],
    ratio * d[1] + (ratio * cos - Math.sqrt(Math.max(0, k))) * n[1],
  ];
}
export function dropletRay(impact, n) {
  const p = [-Math.sqrt(1 - impact * impact), impact],
    d = refract([1, 0], p, 1 / n),
    t = -2 * (p[0] * d[0] + p[1] * d[1]),
    q = [p[0] + t * d[0], p[1] + t * d[1]],
    dot = d[0] * q[0] + d[1] * q[1],
    r = [d[0] - 2 * dot * q[0], d[1] - 2 * dot * q[1]],
    u = -2 * (q[0] * r[0] + q[1] * r[1]),
    end = [q[0] + u * r[0], q[1] + u * r[1]],
    out = refract(r, [-end[0], -end[1]], n);
  return { p, q, end, out };
}
export function WeatherDiagram({ id, value, alternate = false }) {
  const uid = useId().replaceAll(":", "");
  const v = value ?? settings[id]?.[3] ?? 50;
  const cloud = (x, y, s = 1, color = "#fff") => (
    <g transform={`translate(${x},${y}) scale(${s})`} fill={color}>
      <ellipse rx="90" ry="32" />
      <circle cx="-35" cy="-22" r="38" />
      <circle cx="15" cy="-35" r="48" />
      <circle cx="58" cy="-15" r="35" />
    </g>
  );
  const arrow = (d, color = "#e4bd66") => (
    <path
      d={d}
      fill="none"
      stroke={color}
      strokeWidth="5"
      markerEnd={`url(#${uid}arrow)`}
    />
  );
  let body;
  switch (id) {
    case "rainbow":
      body = alternate ? (
        <>
          <circle
            cx="400"
            cy="290"
            r="110"
            fill="none"
            stroke="#f38c78"
            strokeWidth="8"
          />
          <circle
            cx="400"
            cy="290"
            r="101"
            fill="none"
            stroke="#edca75"
            strokeWidth="8"
          />
          <circle
            cx="400"
            cy="290"
            r="92"
            fill="none"
            stroke="#78b5d2"
            strokeWidth="8"
          />
          <path d="M0 310 H800 V450 H0Z" fill="#456955" />
          <circle cx="400" cy="290" r="5" fill="#f9f2d3" />
          <text x="300" y="385" fill="white">
            圆心在反太阳方向 · 地面遮住下部
          </text>
        </>
      ) : (
        <>
          <circle
            cx="450"
            cy="230"
            r="145"
            fill="#8ec0d7"
            stroke="#ddf5ff"
            strokeWidth="3"
          />
          {[1.331, 1.337, 1.343].map((n, i) => {
            const r = dropletRay(v / 100, n),
              xy = (p) => `${450 + p[0] * 145},${230 - p[1] * 145}`,
              out = [r.end[0] + r.out[0] * 1.6, r.end[1] + r.out[1] * 1.6];
            return (
              <polyline
                key={n}
                points={`40,${230 - (v / 100) * 145} ${xy(r.p)} ${xy(r.q)} ${xy(r.end)} ${xy(out)}`}
                fill="none"
                stroke={["#f49673", "#f4d879", "#b2a7f1"][i]}
                strokeWidth="3"
              />
            );
          })}
          <text x="36" y="45" fill="white">
            进入时折射 → 内反射 → 离开时折射
          </text>
          <text x="36" y="405" fill="white">
            颜色角度差已做可见性增强；光线方向由折射关系计算
          </text>
        </>
      );
      break;
    case "clouds":
      body = (
        <>
          <circle cx="400" cy="60" r="24" fill="#ffeab3" />
          {arrow("M400 90 V140")}
          {cloud(
            400,
            190,
            1 + v / 110,
            `rgb(${245 - v / 3},${245 - v / 3},${245 - v / 3})`,
          )}
          <path
            d="M370 265 L345 380 M400 265 V380 M430 265 L455 380"
            stroke="#ffe8a0"
            strokeWidth={10 - v * 0.085}
            opacity={1 - v * 0.007}
          />
          <text x="60" y="410" fill="white">
            云底：{v > 65 ? "透过的光较少，显得暗" : "较多光能穿过"}
          </text>
        </>
      );
      break;
    case "raindrops":
      body = (
        <>
          <ellipse
            cx="400"
            cy="225"
            rx={35 + v}
            ry={35 + v * 0.45}
            fill="#91c4d9"
            stroke="#ddf7ff"
            strokeWidth="4"
          />
          {[250, 400, 550].map((x) => (
            <path
              key={x}
              d={`M${x} 350 Q${x - 70} 220 ${x - 20} 100`}
              fill="none"
              stroke="#b7d6e4"
              strokeWidth="2"
              markerEnd={`url(#${uid}arrow)`}
            />
          ))}
          <text x="60" y="410" fill="white">
            {v < 35
              ? "小滴接近球形"
              : v < 85
                ? "较大雨滴变扁，底部趋平"
                : "大滴容易振荡、变形并破碎（这里只示变扁趋势）"}
          </text>
        </>
      );
      break;
    case "fog-dew-frost":
      body = (
        <>
          <path d="M70 360 Q320 170 700 290 Q420 410 70 360" fill="#527e61" />
          <path
            d="M90 356 Q350 300 680 292"
            fill="none"
            stroke="#acbd84"
            strokeWidth="3"
          />
          {Array.from({ length: v === 0 ? 55 : 12 }, (_, i) => {
            const x = 100 + ((i * 73) % 580),
              y = v === 0 ? 70 + ((i * 47) % 210) : 280 + ((i * 17) % 55);
            return v === 2 ? (
              <path
                key={i}
                d={`M${x - 6} ${y}h12 M${x} ${y - 6}v12 M${x - 4} ${y - 4}l8 8`}
                stroke="#e8f6fa"
                strokeWidth="2"
              />
            ) : (
              <circle
                key={i}
                cx={x}
                cy={y}
                r={v === 0 ? 6 : 9}
                fill="#d4edf6"
                opacity=".75"
              />
            );
          })}
          <text x="50" y="410" fill="white">
            {
              [
                "雾：微小水滴悬浮在近地面空气中",
                "露：水汽在叶片表面凝结成液滴",
                "霜：水汽在冷表面直接形成冰晶",
              ][v]
            }
          </text>
        </>
      );
      break;
    case "snowflakes":
      body = (
        <g transform="translate(400 220)">
          {Array.from({ length: 6 }, (_, i) => (
            <g
              key={i}
              transform={`rotate(${i * 60})`}
              stroke="#d7f2fb"
              strokeWidth="5"
              strokeLinecap="round"
            >
              <path d={`M0 0 V${-45 - v}`} />
              {v > 25 && <path d={`M0 -50 l-25 -20 M0 -50 l25 -20`} />}
              {v > 60 && (
                <path d="M0 -90 l-22 -20 M0 -90 l22 -20 M0 -65 l-42 -35 M0 -65 l42 -35" />
              )}
            </g>
          ))}
          <text x="-240" y="185" fill="white">
            六个相似的生长方向 · 不是单个水分子的外形
          </text>
        </g>
      );
      break;
    case "thunder":
      body = (
        <>
          <path
            d="M140 70 L110 185 H160 L125 300 L220 150 H165 L190 70Z"
            fill="#ffeac0"
          />
          <circle cx="650" cy="280" r="23" fill="#d6b58e" />
          <path
            d="M650 305 V370 M650 325 L615 350 M650 325 L685 350"
            stroke="#c9d8dd"
            strokeWidth="9"
          />
          {arrow("M210 180 H625", "#fee4a8")}
          {arrow("M210 250 H625", "#8ed2df")}
          <text x="285" y="160" fill="white">
            光：在这个尺度几乎立即到达
          </text>
          <text x="285" y="285" fill="white">
            声音：约 {(v / 343).toFixed(1)} 秒后到达
          </text>
          <text x="60" y="415" fill="white">
            {v} 米 · 采用约 20°C 空气声速 343 m/s 的近似
          </text>
        </>
      );
      break;
    case "wind":
      body = (
        <>
          <path d="M0 330 H400 V450 H0Z" fill="#397fa3" />
          <path d="M400 330 Q560 300 800 330 V450 H400Z" fill="#76826a" />
          {v === 0 ? (
            <circle cx="650" cy="80" r="30" fill="#ffe3a3" />
          ) : (
            <circle cx="650" cy="80" r="25" fill="#d1dce1" />
          )}
          {arrow(
            v === 0
              ? "M180 290 H610 V150 H180 V260"
              : "M610 290 H180 V150 H610 V260",
          )}
          <text x="150" y="380" fill="white">
            海洋
          </text>
          <text x="580" y="380" fill="white">
            陆地
          </text>
          <text x="35" y="42" fill="white">
            {v === 0 ? "白天：近地面海风" : "夜间：可能形成陆风"}
          </text>
        </>
      );
      break;
    case "mountain-cold":
      body = (
        <>
          <path d="M120 400 L450 90 L710 400Z" fill="#80949a" />
          <path
            d="M450 90 L365 170 L438 157 L465 180 L495 150Z"
            fill="#e8f0ef"
          />
          <circle
            cx={220 + v * 2.2}
            cy={365 - v * 2.4}
            r={20 + v * 0.35}
            fill="#e9d7a2"
            opacity=".9"
          />
          <text x="40" y="45" fill="white">
            气团上升 → 压力降低 → 膨胀冷却
          </text>
          <text x="40" y="425" fill="white">
            对流层常见趋势 · 不包含逆温和凝结潜热计算
          </text>
        </>
      );
      break;
    default:
      body = (
        <text x="40" y="200" fill="white">
          观察图正在准备
        </text>
      );
  }
  return (
    <svg viewBox="0 0 800 450" role="img" aria-label={`${id} 的科学过程示意`}>
      <defs>
        <marker
          id={`${uid}arrow`}
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="5"
          markerHeight="5"
          orient="auto-start-reverse"
        >
          <path d="M0 0 L10 5 L0 10Z" fill="#e4bd66" />
        </marker>
      </defs>
      <rect width="800" height="450" fill="#31546c" />
      {body}
    </svg>
  );
}
export default function WeatherScene({ topic }) {
  const [label, min, max, initial, unit] = settings[topic.id];
  const [value, setValue] = useState(initial),
    [alternate, setAlternate] = useState(false);
  return (
    <div>
      <WeatherDiagram id={topic.id} value={value} alternate={alternate} />
      <div className="science-controls">
        <label>
          {label}{" "}
          <output>
            {value}
            {unit}
          </output>
          <input
            type="range"
            min={min}
            max={max}
            step="1"
            disabled={topic.id === "rainbow" && alternate}
            value={value}
            onChange={(e) => setValue(Number(e.target.value))}
          />
        </label>
        {topic.id === "rainbow" && (
          <Button
            aria-pressed={alternate}
            onClick={() => setAlternate(!alternate)}
          >
            {alternate ? "看单滴光路" : "看天空圆弧"}
          </Button>
        )}
        <Button
          onClick={() => {
            setValue(initial);
            setAlternate(false);
          }}
        >
          恢复初始状态
        </Button>
      </div>
      {topic.id === "rainbow" && alternate && (
        <p className="science-caption">
          天空视角显示固定观察方向的圆弧关系。切回“单滴光路”可改变入射位置，观察各色光离开水滴的方向。
        </p>
      )}
    </div>
  );
}
