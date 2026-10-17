import { opticalScale, objectHeight } from "./opticalModel.mjs";
import { contourLabelAnchors } from "./contourLabels.mjs";
import { TERRAIN_SCALE } from "./terrainWorld.mjs";
import React, { useState, useMemo } from "react";
import { OhmBench, OpticalRail } from "./Apparatus.jsx";
import { NatureMaterials, Landscape, Plant } from "./NatureDetails.jsx";
import {
  lens,
  refraction,
  projectile,
  reaction,
  ph,
  solubility,
  genetics,
  photo,
  contourSegments,
  shorelineWater,
  terrainHeightAt,
  terrainSectionEndpoints,
  terrainReadingAt,
  rad,
  format,
} from "./models.mjs";
const colors = {
  green: "#21846e",
  gold: "#d79636",
  blue: "#3c89b2",
  red: "#cf6555",
  ink: "#264b43",
};
const Line = ({
  x1,
  y1,
  x2,
  y2,
  color = colors.green,
  dash = false,
  arrow = false,
  ...rest
}) => (
  <line
    x1={x1}
    y1={y1}
    x2={x2}
    y2={y2}
    stroke={color}
    strokeWidth="3"
    strokeDasharray={dash ? "7 6" : undefined}
    markerEnd={arrow ? "url(#arrow)" : undefined}
    {...rest}
  />
);
const T = ({ x, y, children, ...rest }) => (
  <text
    x={x}
    y={y}
    textAnchor="middle"
    fill={colors.ink}
    fontSize="18"
    {...rest}
  >
    {children}
  </text>
);
const Dot = ({ x, y, r = 6, color = colors.green }) => (
  <circle cx={x} cy={y} r={r} fill={color} />
);
function Vessel({
  x = 250,
  y = 140,
  w = 170,
  h = 270,
  fill = 0.6,
  color = "#5bbab4",
  label = "",
  crystals = 0,
}) {
  return (
    <g>
      <ellipse
        cx={x + w / 2}
        cy={y + h + 10}
        rx={w * 0.59}
        ry="13"
        fill="#2c555b18"
      />
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx="9"
        fill="url(#glassBody)"
        stroke="#aec7ca"
        strokeWidth="1"
      />
      <rect
        x={x}
        y={y + h * (1 - fill)}
        width={w}
        height={h * fill}
        rx="7"
        fill={color}
        opacity=".55"
      />
      <ellipse
        cx={x + w / 2}
        cy={y + h * (1 - fill)}
        rx={w / 2}
        ry="9"
        fill={color}
        opacity=".65"
      />
      {Array.from({ length: Math.min(30, Math.ceil(crystals)) }, (_, i) => (
        <path
          key={i}
          d={`M${x + 15 + ((i * 29) % (w - 25))},${y + h - 8 - Math.floor(i / 5) * 9}l7 -9l9 5l-5 9Z`}
          fill="#eee"
          stroke="#779aa1"
        />
      ))}
      <path
        d={`M${x - 8} ${y}h8v${h - 10}q0 10 10 10h${w - 20}q10 0 10-10V${y}h8`}
        fill="none"
        stroke="#749e9a"
        strokeWidth="4"
      />
      <ellipse
        cx={x + w / 2}
        cy={y}
        rx={w / 2 + 4}
        ry="7"
        fill="none"
        stroke="#99b5ba"
        strokeWidth="2"
      />
      <path
        d={`M${x + 12} ${y + 18}V${y + h - 22}`}
        stroke="white"
        strokeOpacity=".85"
        strokeWidth="7"
        strokeLinecap="round"
      />
      <path
        d={`M${x + w - 9} ${y + 18}V${y + h - 19}`}
        stroke="white"
        strokeOpacity=".4"
        strokeWidth="3"
      />
      <path
        d={`M${x + 8} ${y + h - 5}Q${x + w / 2} ${y + h + 8} ${x + w - 8} ${y + h - 5}`}
        fill="none"
        stroke="#abc1be"
        strokeWidth="2"
      />
      {[1, 2, 3, 4].map((i) => (
        <Line
          key={i}
          x1={x + w - 24}
          x2={x + w}
          y1={y + (h * i) / 5}
          y2={y + (h * i) / 5}
          color="#a8bfba"
        />
      ))}
      <T x={x + w / 2} y={y + h + 36}>
        {label}
      </T>
    </g>
  );
}
function Atom({ x, y, type = "H", r = 15 }) {
  return (
    <g>
      <circle
        cx={x}
        cy={y}
        r={r}
        fill={type === "H" ? "#f4f5ed" : type === "O" ? "#cb6658" : "#465864"}
        stroke={type === "H" ? "#a6b6b1" : "#fff"}
        strokeWidth="2"
      />
      <T
        x={x}
        y={y + 5}
        fontSize="13"
        fill={type === "H" ? colors.ink : "white"}
      >
        {type}
      </T>
    </g>
  );
}
function Mol({ x, y, type }) {
  return (
    <g>
      {type === "H2O" ? (
        <>
          <Line x1={x} y1={y} x2={x - 20} y2={y + 16} />
          <Line x1={x} y1={y} x2={x + 20} y2={y + 16} />
          <Atom x={x} y={y} type="O" />
          <Atom x={x - 20} y={y + 16} />
          <Atom x={x + 20} y={y + 16} />
        </>
      ) : (
        <>
          <Line x1={x - 12} y1={y} x2={x + 12} y2={y} />
          <Atom x={x - 13} y={y} type={type === "O2" ? "O" : "H"} />
          <Atom x={x + 13} y={y} type={type === "O2" ? "O" : "H"} />
        </>
      )}
    </g>
  );
}
function Contents({ id, p, t }) {
  switch (id) {
    case "fractions": {
      const discs = Math.max(1, Math.ceil(p.n / p.d));
      const r = Math.min(115, 340 / discs);
      return (
        <>
          {Array.from({ length: discs }, (_, d) => {
            const cx = 450 + (d - (discs - 1) / 2) * (2 * r + 15);
            return (
              <g key={d}>
                {Array.from({ length: p.d }, (_, i) => {
                  const a = (i * 2 * Math.PI) / p.d - Math.PI / 2,
                    b = ((i + 1) * 2 * Math.PI) / p.d - Math.PI / 2;
                  return p.d === 1 ? (
                    <circle
                      key={i}
                      cx={cx}
                      cy="240"
                      r={r}
                      fill={d * p.d + i < p.n ? "#72b89d" : "#e0e8dc"}
                      stroke="white"
                    />
                  ) : (
                    <path
                      key={i}
                      d={`M${cx} 240L${cx + r * Math.cos(a)} ${240 + r * Math.sin(a)}A${r} ${r} 0 ${b - a > Math.PI ? 1 : 0} 1 ${cx + r * Math.cos(b)} ${240 + r * Math.sin(b)}Z`}
                      fill={d * p.d + i < p.n ? "#72b89d" : "#e0e8dc"}
                      stroke="#fff"
                      strokeWidth="3"
                    />
                  );
                })}
              </g>
            );
          })}
          <Line x1="130" y1="435" x2="770" y2="435" />
          {Array.from({ length: p.d * discs + 1 }, (_, i) => (
            <g key={i}>
              <Line
                x1={130 + (i * 640) / (p.d * discs)}
                x2={130 + (i * 640) / (p.d * discs)}
                y1="430"
                y2="440"
              />
              <T x={130 + (i * 640) / (p.d * discs)} y="465" fontSize="14">
                {i % p.d === 0 ? i / p.d : `${i}/${p.d}`}
              </T>
            </g>
          ))}
          <Dot
            x={130 + ((p.n / p.d) * 640) / discs}
            y={435}
            color={colors.gold}
          />
          <T x="450" y="65" fontSize="28">
            {p.n} / {p.d} = {format(p.n / p.d)}
          </T>
        </>
      );
    }
    case "pythagoras": {
      let s = Math.min(27, 180 / (p.a + p.b)),
        a = p.a * s,
        b = p.b * s;
      let ox = 310,
        oy = 255;
      return (
        <>
          <rect
            x={ox - a}
            y={oy}
            width={a}
            height={a}
            fill="#b7d7c2"
            stroke="#408771"
          />
          <rect
            x={ox}
            y={oy - b}
            width={b}
            height={b}
            fill="#e5cc95"
            stroke="#b98a37"
          />
          <path
            d={`M${ox} ${oy}L${ox - a} ${oy}L${ox} ${oy - b}Z`}
            fill="#fff"
            stroke="#264b43"
            strokeWidth="3"
          />
          <path
            d={`M${ox - a} ${oy}l${a} ${-b}l${-b} ${-a}l${-a} ${b}Z`}
            fill="#9bc1ce"
            stroke="#397e93"
          />
          <path d={`M${ox - 13} ${oy}v-13h13`} fill="none" stroke="#264b43" />
          <T x={ox - a / 2} y={oy + a / 2 + 7}>
            a² = {format(p.a * p.a)}
          </T>
          <T x={ox + b / 2} y={oy - b / 2 + 7}>
            b² = {format(p.b * p.b)}
          </T>
          <T x={ox - (a + b) / 2} y={oy - (a + b) / 2 + 5}>
            c²
          </T>
          <T x="660" y="215" fontSize="25">
            {format(p.a * p.a)} + {format(p.b * p.b)}
          </T>
          <T x="660" y="260" fontSize="30">
            = {format(p.a * p.a + p.b * p.b)}
          </T>
          <T x="450" y="485">
            拖动直角边参数，三个正方形同步改变
          </T>
        </>
      );
    }
    case "linear": {
      const s = 42,
        ox = 450,
        oy = 275;
      return (
        <>
          {Array.from({ length: 13 }, (_, i) => (
            <g key={i}>
              <Line
                x1={ox + (i - 6) * s}
                x2={ox + (i - 6) * s}
                y1="50"
                y2="490"
                color="#d9e3dc"
                strokeWidth="1"
              />
              <Line
                x1="170"
                x2="730"
                y1={oy + (i - 6) * s}
                y2={oy + (i - 6) * s}
                color="#d9e3dc"
                strokeWidth="1"
              />
            </g>
          ))}
          <Line x1="160" x2="750" y1={oy} y2={oy} arrow />
          <Line x1={ox} x2={ox} y1="490" y2="45" arrow />
          <clipPath id="graphClip">
            <rect x="170" y="50" width="560" height="440" />
          </clipPath>
          <g clipPath="url(#graphClip)">
            <Line
              x1={ox - 7 * s}
              y1={oy - (-7 * p.k + p.b) * s}
              x2={ox + 7 * s}
              y2={oy - (7 * p.k + p.b) * s}
              color={colors.gold}
              strokeWidth="4"
            />
            <Line
              x1={ox + p.x * s}
              y1={oy}
              x2={ox + p.x * s}
              y2={oy - (p.k * p.x + p.b) * s}
              dash
            />
            <Dot x={ox + p.x * s} y={oy - (p.k * p.x + p.b) * s} />
          </g>
          {[-4, -2, 0, 2, 4].map((i) => (
            <T key={i} x={ox + i * s} y={oy + 23} fontSize="14">
              {i}
            </T>
          ))}
          <T x="770" y={oy + 5}>
            x
          </T>
          <T x={ox + 22} y="45">
            y
          </T>
          <T x="670" y="65">
            y = {format(p.k)}x {p.b >= 0 ? "+" : "−"} {Math.abs(p.b)}
          </T>
        </>
      );
    }
    case "circle": {
      const r = p.r * 26;
      return (
        <>
          <circle
            cx="270"
            cy="265"
            r={r}
            fill="#d8e9df"
            stroke="#27836d"
            strokeWidth="3"
          />
          {Array.from({ length: p.parts }, (_, i) => (
            <Line
              key={i}
              x1="270"
              y1="265"
              x2={270 + r * Math.cos((i * 2 * Math.PI) / p.parts)}
              y2={265 + r * Math.sin((i * 2 * Math.PI) / p.parts)}
              color="#a8cbbb"
              strokeWidth="1"
            />
          ))}
          <Line x1="270" y1="265" x2={270 + r} y2="265" color={colors.gold} />
          <T x={270 + r / 2} y="252">
            r = {format(p.r)}
          </T>
          <g transform="translate(460 220)">
            {Array.from({ length: p.parts }, (_, i) => {
              const half = Math.PI / p.parts,
                w = 2 * r * Math.sin(half),
                xx = (i * w) / 2,
                down = i % 2 === 0;
              return (
                <path
                  key={i}
                  d={
                    down
                      ? `M${xx} 0l${-w / 2} ${r * Math.cos(half)}A${r} ${r} 0 0 0 ${xx + w / 2} ${r * Math.cos(half)}Z`
                      : `M${xx} ${r * Math.cos(half)}l${-w / 2} ${-r * Math.cos(half)}A${r} ${r} 0 0 1 ${xx + w / 2} 0Z`
                  }
                  fill={down ? "#77b69c" : "#d0e4d5"}
                  stroke="white"
                />
              );
            })}
          </g>
          <T x="660" y="415">
            等积重排 · 越细分越接近矩形
          </T>
          <T x="450" y="485">
            半径 ×2 → 周长 ×2，面积 ×4
          </T>
        </>
      );
    }
    case "ohm":
      return (
        <>
          <path
            d="M220 240V150H370M460 150H680V390H220V285"
            fill="none"
            stroke="#365d56"
            strokeWidth="4"
          />
          <Line x1="205" y1="240" x2="235" y2="240" color={colors.gold} />
          <Line x1="195" y1="255" x2="245" y2="255" color={colors.gold} />
          <Line x1="220" y1="255" x2="220" y2="270" color="#365d56" />
          <Line x1="205" y1="270" x2="235" y2="270" color={colors.gold} />
          <Line x1="195" y1="285" x2="245" y2="285" color={colors.gold} />
          <T x="172" y="258">
            −
          </T>
          <T x="172" y="290">
            +
          </T>
          <T x="160" y="333">
            {format(p.u)} V
          </T>
          <Dot x="370" y="150" />
          <Dot x="460" y="150" />
          <Line x1="370" y1="150" x2="460" y2={p.closed ? 150 : 105} />
          <T x="415" y="90">
            S · {p.closed ? "闭合" : "断开"}
          </T>
          <rect
            x="500"
            y="375"
            width="100"
            height="30"
            fill="#e6dbc5"
            stroke="#365d56"
            strokeWidth="3"
          />
          <T x="550" y="445">
            R = {format(p.r)} Ω
          </T>
          <circle
            cx="350"
            cy="390"
            r="28"
            fill="#fff"
            stroke="#365d56"
            strokeWidth="3"
          />
          <T x="350" y="397" fontSize="24">
            A
          </T>
          <path
            d="M480 390V270H525M575 270H620V390"
            fill="none"
            stroke="#668d85"
            strokeWidth="3"
          />
          <circle
            cx="550"
            cy="270"
            r="26"
            fill="#fff"
            stroke="#668d85"
            strokeWidth="3"
          />
          <T x="550" y="277" fontSize="24">
            V
          </T>
          <T x="550" y="228">
            {p.digital === 0 ? "待核对" : `${format(p.closed ? p.u : 0)} V`}
          </T>
          <T x="350" y="450">
            {p.digital === 0
              ? "待核对"
              : `${format(p.closed ? p.u / p.r : 0)} A`}
          </T>
          <T x="450" y="505">
            电流表串联 · 电压表并联在电阻两端
          </T>
          {!!p.closed && p.u > 0 && (
            <>
              <Line
                x1="390"
                y1="390"
                x2="440"
                y2="390"
                color={colors.gold}
                arrow
              />
              <T x="415" y="360" fill={colors.gold}>
                I
              </T>
            </>
          )}
        </>
      );
    case "lens": {
      const q = lens(p.u, p.f),
        s = 5,
        cx = 450,
        cy = 260,
        objX = cx - p.u * s,
        h = 48,
        offset = (((p.sourceOffset ?? 0) * opticalScale) / objectHeight) * h,
        tip = h + offset;
      const rayEnd = cx + 360;
      return (
        <>
          <OpticalRail />
          <Line x1="60" y1={cy} x2="840" y2={cy} color="#91aba4" />
          <path
            d={`M${cx} 110Q${cx - 34} 260 ${cx} 410Q${cx + 34} 260 ${cx} 110`}
            fill="url(#glassBody)"
            stroke="#5a999f"
          />
          {[-2, -1, 1, 2].map((n) => (
            <g key={n}>
              <Dot x={cx + n * p.f * s} y={cy} r={4} />
              <T x={cx + n * p.f * s} y={cy + 30}>
                {Math.abs(n) === 2 ? "2F" : "F"}
              </T>
            </g>
          ))}
          <Line
            x1={objX}
            y1={cy - offset}
            x2={objX}
            y2={cy - tip}
            color={colors.green}
            arrow
          />
          <T x={objX} y={cy + 55}>
            物体
          </T>
          <clipPath id="rays">
            <rect x="35" y="65" width="830" height="390" />
          </clipPath>
          <g
            clipPath="url(#rays)"
            data-optical-layer="illumination"
            visibility={p.light === 0 ? "hidden" : "visible"}
          >
            {p.rays !== 0 && (
              <g data-optical-layer="actual-rays">
                <Line
                  x1={objX}
                  y1={cy - tip}
                  x2={cx}
                  y2={cy - tip}
                  color={colors.gold}
                />
                <Line
                  x1={cx}
                  y1={cy - tip}
                  x2={rayEnd}
                  y2={cy - tip + ((rayEnd - cx) * tip) / (p.f * s)}
                  color={colors.gold}
                  arrow
                />
                <Line
                  x1={objX}
                  y1={cy - tip}
                  x2={rayEnd}
                  y2={cy + ((rayEnd - cx) * tip) / (p.u * s)}
                  color={colors.blue}
                  arrow
                />
              </g>
            )}
            {q.v !== null && (
              <>
                <g data-optical-layer="image">
                  <Line
                    x1={cx + q.v * s}
                    y1={cy - offset * q.m}
                    x2={cx + q.v * s}
                    y2={cy - tip * q.m}
                    color={colors.red}
                    dash={q.v < 0}
                    arrow
                  />
                </g>
                {q.v < 0 && p.rays !== 0 && (
                  <g data-optical-layer="virtual-rays">
                    <Line
                      x1={cx}
                      y1={cy - tip}
                      x2={cx + q.v * s}
                      y2={cy - tip * q.m}
                      dash
                      color={colors.gold}
                    />
                    <Line
                      x1={cx}
                      y1={cy}
                      x2={cx + q.v * s}
                      y2={cy - tip * q.m}
                      dash
                      color={colors.blue}
                    />
                  </g>
                )}
              </>
            )}
          </g>
          <T x="450" y="500">
            {p.light === 0
              ? "光源已关闭 · 几何位置保留，暂无成像光路"
              : q.v === null
                ? "物体在焦点：出射光平行，无有限像"
                : q.v < 0
                  ? p.rays === 0
                    ? "正立放大虚像 · 辅助线已隐藏"
                    : "正立放大虚像 · 虚线为反向延长线"
                  : `倒立实像 · 像距 ${format(q.v)} cm${Math.abs(q.v) > 70 ? "（像超出当前画幅）" : ""}`}
          </T>
          {(p.aperture ?? 100) < 100 && (
            <T x="450" y="530">
              孔径与亮度效果请在三维实验台观察；此图为理想光线示意。
            </T>
          )}
        </>
      );
    }
    case "refraction": {
      const q = refraction(p.angle, p.n1, p.n2),
        a = rad(p.angle),
        r = rad(q.angle ?? 0);
      return (
        <>
          <rect
            x="40"
            y="280"
            width="820"
            height="230"
            fill="#acd2d6"
            opacity=".4"
          />
          <Line x1="40" y1="280" x2="860" y2="280" color="#759eaa" />
          <Line x1="450" y1="45" x2="450" y2="505" dash color="#729188" />
          <Line
            x1={450 - 220 * Math.sin(a)}
            y1={280 - 220 * Math.cos(a)}
            x2="450"
            y2="280"
            arrow
            color={colors.gold}
          />
          {p.n1 !== p.n2 && (
            <Line
              x1="450"
              y1="280"
              x2={450 + 220 * Math.sin(a)}
              y2={280 - 220 * Math.cos(a)}
              arrow
              color={colors.red}
            />
          )}
          {!q.tir && (
            <Line
              x1="450"
              y1="280"
              x2={450 + 220 * Math.sin(r)}
              y2={280 + 220 * Math.cos(r)}
              arrow
              color={colors.blue}
            />
          )}
          <T x="170" y="85">
            入射介质 n₁ = {p.n1}
          </T>
          <T x="175" y="470">
            透射介质 n₂ = {p.n2}
          </T>
          <T x="485" y="55">
            法线
          </T>
          <T x="380" y="240">
            i = {format(p.angle)}°
          </T>
          <T x="600" y="400">
            {q.tir ? "全反射" : `r = ${format(q.angle)}°`}
          </T>
          <T x="450" y="535">
            角度始终从法线量起
          </T>
        </>
      );
    }
    case "lever": {
      const left = 450 - p.l1 * 145,
        right = 450 + p.l2 * 145,
        delta = p.f1 * p.l1 - p.f2 * p.l2;
      return (
        <>
          <ellipse cx="450" cy="380" rx="63" ry="9" fill="#25475018" />
          <path
            d="M450 285L415 370H485Z"
            fill="url(#glassMetal)"
            stroke="#648088"
          />
          <rect x="398" y="370" width="104" height="10" rx="4" fill="#3d626d" />
          <rect
            x="120"
            y="270"
            width="660"
            height="15"
            rx="3"
            fill="url(#terracotta)"
            stroke="#957a52"
          />
          {Array.from({ length: 67 }, (_, i) => (
            <line
              key={i}
              x1={120 + i * 10}
              x2={120 + i * 10}
              y1="270"
              y2={i % 5 === 0 ? 280 : 275}
              stroke="#6f573b"
              strokeWidth="1"
            />
          ))}
          <circle cx="450" cy="285" r="4" fill="#d4dfd8" stroke="#4c6e77" />
          <Line
            x1={left}
            y1="278"
            x2={left}
            y2={278 + p.f1 * 5}
            arrow
            color={colors.blue}
          />
          <Line
            x1={right}
            y1="278"
            x2={right}
            y2={278 + p.f2 * 5}
            arrow
            color={colors.gold}
          />
          <T x={left} y="240">
            {p.f1} N ↓
          </T>
          <T x={right} y="240">
            {p.f2} N ↓
          </T>
          <Line x1={left} y1="190" x2="450" y2="190" color={colors.blue} />
          <Line x1="450" y1="155" x2={right} y2="155" color={colors.gold} />
          <T x={(left + 450) / 2} y="175">
            l₁ = {p.l1} m
          </T>
          <T x={(right + 450) / 2} y="140">
            l₂ = {format(p.l2)} m
          </T>
          <T x="450" y="430" fontSize="25">
            {Math.abs(delta) < 1e-8
              ? "力矩平衡"
              : delta > 0
                ? "左侧力矩较大，趋向逆时针转动"
                : "右侧力矩较大，趋向顺时针转动"}
          </T>
          <T x="450" y="477">
            当前展示水平瞬间 · 箭头长度与力成正比
          </T>
        </>
      );
    }
    case "projectile": {
      const q = projectile(p, t),
        s = Math.min(
          10,
          680 / Math.max(1, q.range),
          330 / Math.max(1, q.maxHeight),
        ),
        ox = 100,
        oy = 435;
      const points = Array.from({ length: 81 }, (_, i) => {
        let z = projectile(p, (q.flight * i) / 80);
        return `${ox + z.x * s},${oy - z.y * s}`;
      }).join(" ");
      return (
        <>
          <Line x1="70" y1={oy} x2="830" y2={oy} />
          <polyline
            points={points}
            fill="none"
            stroke="#9eafa0"
            strokeDasharray="5 7"
            strokeWidth="2"
          />
          <circle
            cx={ox + q.x * s}
            cy={oy - q.y * s}
            r="13"
            fill={colors.gold}
          />
          <Line
            x1={ox + q.x * s}
            y1={oy - q.y * s}
            x2={ox + q.x * s}
            y2={oy - q.y * s + 65}
            color={colors.red}
            arrow
          />
          <T x={ox + q.x * s + 27} y={oy - q.y * s + 53}>
            g
          </T>
          <T x="200" y="80">
            落地时间 {format(q.flight)} s
          </T>
          <T x="680" y="80">
            射程 {format(q.range)} m
          </T>
          <T x="450" y="493">
            t = {format(Math.min(t, q.flight))} s · 播放观察轨迹
          </T>
          {[0, 0.25, 0.5, 0.75, 1].map((v, i) => (
            <T key={i} x={ox + v * q.range * s} y="465" fontSize="14">
              {format(v * q.range)} m
            </T>
          ))}
        </>
      );
    }
    case "conservation": {
      const q = reaction(p.h2, p.o2, p.progress);
      return (
        <>
          <rect
            x="75"
            y="120"
            width="330"
            height="300"
            rx="20"
            fill="#edf2e9"
            stroke="#bbcbbf"
          />
          <rect
            x="495"
            y="120"
            width="330"
            height="300"
            rx="20"
            fill="#edf2e9"
            stroke="#bbcbbf"
          />
          <T x="240" y="80">
            反应前
          </T>
          <T x="660" y="80">
            反应后
          </T>
          {Array.from({ length: p.h2 }, (_, i) => (
            <Mol
              key={"h" + i}
              x={125 + (i % 4) * 75}
              y={180 + Math.floor(i / 4) * 70}
              type="H2"
            />
          ))}
          {Array.from({ length: p.o2 }, (_, i) => (
            <Mol key={"o" + i} x={125 + (i % 4) * 75} y={345} type="O2" />
          ))}
          {[
            ...Array(q.h2).fill("H2"),
            ...Array(q.o2).fill("O2"),
            ...Array(q.h2o).fill("H2O"),
          ].map((type, i) => (
            <Mol
              key={i}
              x={545 + (i % 4) * 75}
              y={180 + Math.floor(i / 4) * 80}
              type={type}
            />
          ))}
          <Line x1="423" y1="265" x2="479" y2="265" arrow />
          <T x="450" y="482">
            实际反应 {q.extent} 批 · 原子不消失，只重新组合
          </T>
        </>
      );
    }
    case "dilution":
      return (
        <>
          <Vessel
            x={155}
            w={190}
            fill={0.25 + (p.solute + p.water) / 850}
            label={`原溶液 ${format((100 * p.solute) / (p.solute + p.water))}%`}
          />
          <Line x1="390" y1="270" x2="480" y2="270" arrow />
          <T x="440" y="230">
            + {format(p.add)} g 水
          </T>
          <Vessel
            x={545}
            w={190}
            fill={0.25 + (p.solute + p.water + p.add) / 850}
            color={`hsl(169 45% ${45 + (30 * p.add) / (p.water + p.add)}%)`}
            label={`稀释后 ${format((100 * p.solute) / (p.solute + p.water + p.add))}%`}
          />
          <T x="450" y="510">
            两个烧杯中的溶质都是 {p.solute} g
          </T>
        </>
      );
    case "acid": {
      const value = ph(p.acid, p.base, p.c);
      return (
        <>
          <Vessel
            x={200}
            y={155}
            w={220}
            h={240}
            fill={0.25 + (p.acid + p.base) / 300}
            color={`hsl(${value * 20} 60% 52%)`}
            label="颜色为 pH 比色示意"
          />
          <rect
            x="300"
            y="40"
            width="25"
            height="85"
            fill="#c7dcdd"
            stroke="#6a9690"
          />
          <path d="M300 125l12 25l13-25" fill="#a0c6c5" />
          <T x="580" y="175">
            加入等浓度 NaOH
          </T>
          <T x="610" y="225" fontSize="40">
            pH {format(value)}
          </T>
          <T x="610" y="278">
            {Math.abs(value - 7) < 0.001
              ? "恰好中和"
              : value < 7
                ? "酸性 · H⁺ 过量"
                : "碱性 · OH⁻ 过量"}
          </T>
          {Array.from({ length: 15 }, (_, i) => (
            <g key={i}>
              <rect
                x={135 + i * 43}
                y="465"
                width="43"
                height="20"
                fill={`hsl(${i * 20} 60% 52%)`}
              />
              <T x={156 + i * 43} y="510" fontSize="13">
                {i}
              </T>
            </g>
          ))}
          <path d={`M${156 + value * 43} 458l-7-12h14Z`} fill={colors.ink} />
        </>
      );
    }
    case "solubility": {
      const cap = (solubility(p.temp) * p.water) / 100;
      return (
        <>
          <Vessel
            x={135}
            w={220}
            fill={0.5}
            crystals={Math.max(0, p.mass - cap) / 3}
            color="#84bfc2"
            label="硝酸钾溶液"
          />
          <Line x1="490" y1="415" x2="815" y2="415" arrow />
          <Line x1="490" y1="415" x2="490" y2="100" arrow />
          <polyline
            points={Array.from(
              { length: 81 },
              (_, t) => `${490 + t * 3.8},${415 - solubility(t) * 1.6}`,
            ).join(" ")}
            fill="none"
            stroke={colors.gold}
            strokeWidth="4"
          />
          <Dot x={490 + p.temp * 3.8} y={415 - solubility(p.temp) * 1.6} />
          <T x="650" y="70">
            溶解度 S / (g / 100g 水)
          </T>
          <T x="670" y="460">
            温度 / °C
          </T>
          <T x="450" y="510">
            {p.mass > cap ? "超过溶解限度：有固体剩余" : "尚无固体剩余"} · 当前
            S = {format(solubility(p.temp))}
          </T>
        </>
      );
    }
    case "microscope":
      return (
        <>
          <g transform="translate(35 190) scale(.65)">
            <ellipse cx="135" cy="365" rx="135" ry="16" fill="#203c4820" />
            <path
              d="M30 345H243L258 365H15Z"
              fill="url(#glassMetal)"
              stroke="#607b82"
            />
            <path
              d="M198 342V249Q278 204 216 98L192 111Q236 205 170 223V342Z"
              fill="#6e919e"
              stroke="#375f6d"
              strokeWidth="5"
            />
            <path
              d="M80 87L110 15L145 28L114 102Z"
              fill="url(#glassMetal)"
              stroke="#496d75"
              strokeWidth="3"
            />
            <path d="M105 17L118 -8L152 5L142 29Z" fill="#263e4c" />
            <path d="M107 102L98 133L113 139L127 108" fill="#3d5460" />
            <rect
              x="40"
              y="184"
              width="160"
              height="15"
              rx="3"
              fill="#294a59"
            />
            <path d="M65 180H158L144 165H53Z" fill="#cfe6e2" stroke="#85adaf" />
            <text x="95" y="179" fontSize="20" fill="#45615d">
              e
            </text>
            <circle
              cx="200"
              cy="204"
              r="25"
              fill="url(#glassMetal)"
              stroke="#2f4c59"
              strokeWidth="5"
            />
            <circle cx="200" cy="204" r="10" fill="#294a59" />
            <ellipse
              cx="105"
              cy="287"
              rx="40"
              ry="14"
              fill="#c5dde0"
              stroke="#647f8c"
              strokeWidth="4"
              transform="rotate(-25 105 287)"
            />
            <path d="M105 300V342" stroke="#718b95" strokeWidth="8" />
          </g>
          <defs>
            <clipPath id="scope">
              <circle cx="450" cy="270" r="185" />
            </clipPath>
            <filter id="blur">
              <feGaussianBlur stdDeviation={Math.abs(p.focus - 50) / 8} />
            </filter>
          </defs>
          <circle cx="450" cy="276" r="211" fill="#25485120" />
          <circle
            cx="450"
            cy="270"
            r="205"
            fill="url(#glassMetal)"
            stroke="#3a555e"
            strokeWidth="8"
          />
          <circle cx="450" cy="270" r="193" fill="#172e39" />
          <circle cx="450" cy="270" r="185" fill="#f7efd7" />
          <g clipPath="url(#scope)">
            <g
              filter="url(#blur)"
              transform={`translate(${450 - (p.x * p.mag) / 100} ${270 + (p.y * p.mag) / 100}) rotate(180) scale(${p.mag / 100})`}
            >
              <text
                x="0"
                y="20"
                textAnchor="middle"
                fontSize="95"
                fontFamily="Georgia"
                fill="#4b665d"
              >
                e
              </text>
            </g>
            <Line x1="445" y1="270" x2="455" y2="270" strokeWidth="1" />
            <Line x1="450" y1="265" x2="450" y2="275" strokeWidth="1" />
          </g>
          <T x="125" y="125" fontSize="15">
            玻片原像：e
          </T>
          <T x="450" y="518">
            目镜视野 · {p.mag}× ·{" "}
            {Math.abs(p.focus - 50) < 5 ? "已清晰对焦" : "调整焦点使物像清晰"}
          </T>
        </>
      );
    case "photosynthesis": {
      const rate = photo(p);
      return (
        <>
          <Plant />
          <circle cx="155" cy="105" r="40" fill="#eac363" />
          <Line x1="195" y1="130" x2="340" y2="205" color={colors.gold} arrow />
          <T x="180" y="210">
            光照 {format(p.light)}%
          </T>
          <Line x1="725" y1="235" x2="550" y2="275" color={colors.blue} arrow />
          <T x="710" y="207">
            CO₂
          </T>
          <Line x1="545" y1="340" x2="710" y2="310" arrow />
          <T x="725" y="350">
            O₂
          </T>
          <rect x="680" y="400" width="140" height="15" rx="7" fill="#dce8dc" />
          <rect
            x="680"
            y="400"
            width={(140 * rate) / 100}
            height="15"
            rx="7"
            fill="#398367"
          />
          <T x="750" y="450">
            相对速率 {format(rate)}%
          </T>
        </>
      );
    }
    case "inheritance": {
      const q = genetics(p.parent1, p.parent2),
        alleles = ["AA", "Aa", "aa"];
      return (
        <>
          <T x="450" y="70" fontSize="27">
            {alleles[p.parent1]} × {alleles[p.parent2]}
          </T>
          {[0, 1].map((i) => (
            <React.Fragment key={i}>
              <T x={405 + i * 160} y="140" fontSize="24">
                {alleles[p.parent2][i]}
              </T>
              <T x="280" y={245 + i * 140} fontSize="24">
                {alleles[p.parent1][i]}
              </T>
            </React.Fragment>
          ))}
          {q.cells.map((g, i) => (
            <g key={i}>
              <rect
                x={330 + (i % 2) * 160}
                y={170 + Math.floor(i / 2) * 140}
                width="145"
                height="125"
                rx="14"
                fill={g === "aa" ? "#ead8b4" : "#c4dfce"}
                stroke="#abc4b4"
              />
              <T
                x={402 + (i % 2) * 160}
                y={237 + Math.floor(i / 2) * 140}
                fontSize="38"
              >
                {g}
              </T>
              <T
                x={402 + (i % 2) * 160}
                y={270 + Math.floor(i / 2) * 140}
                fontSize="15"
              >
                25%
              </T>
            </g>
          ))}
          <T x="450" y="505">
            AA {q.AA * 100}% · Aa {q.Aa * 100}% · aa {q.aa * 100}%
          </T>
        </>
      );
    }
    case "foodweb": {
      return (
        <>
          {[0, 1, 2].map((i) => {
            const w = 500 * Math.pow(0.55, i),
              y = 400 - i * 135;
            return (
              <g key={i}>
                <rect
                  x={450 - w / 2}
                  y={y - 75}
                  width={w}
                  height="95"
                  rx="10"
                  fill={["#7baa83", "#c4ce91", "#e4c087"][i]}
                />
                <T x="450" y={y - 35}>
                  {["草 · 生产者", "兔 · 初级消费者", "狐 · 次级消费者"][i]}
                </T>
                <T x="450" y={y} fontSize="25">
                  {format(p.energy * (p.eff / 100) ** i)} kJ
                </T>
                {i < 2 && (
                  <>
                    <Line x1="450" y1={y - 80} x2="450" y2={y - 107} arrow />
                    <T x="720" y={y - 75}>
                      传递 {p.eff}% ↑
                    </T>
                  </>
                )}
              </g>
            );
          })}
          <T x="450" y="510">
            框宽仅作层级示意，能量以数值为准
          </T>
        </>
      );
    }
    case "water":
      return (
        <>
          <Landscape />
          <g fill="#e6ede8">
            <ellipse cx="530" cy="85" rx="95" ry="25" />
            <ellipse cx="480" cy="60" rx="48" ry="34" />
            <ellipse cx="560" cy="60" rx="50" ry="35" />
          </g>
          {[0, 1, 2, 3, 4].map((i) => (
            <Line
              key={i}
              x1={450 + i * 35}
              y1="125"
              x2={430 + i * 35}
              y2={165 + Math.min(40, p.rain / 5)}
              color={colors.blue}
              arrow
            />
          ))}
          <Line x1="770" y1="400" x2="770" y2="200" color={colors.gold} arrow />
          <T x="750" y="170">
            蒸散 {format((p.rain * p.evap) / 100)} mm
          </T>
          <Line x1="340" y1="405" x2="340" y2="490" color={colors.blue} arrow />
          <T x="280" y="525">
            下渗 {format((p.rain * p.infil) / 100)} mm
          </T>
          <T x="580" y="395">
            径流 {format(p.rain * (1 - (p.infil + p.evap) / 100))} mm
          </T>
          <T x="225" y="75">
            降水 {format(p.rain)} mm
          </T>
        </>
      );
    case "plates": {
      let d = p.progress * 0.7;
      return (
        <>
          {p.type === 2 ? (
            <>
              <rect
                x="120"
                y={130 - d / 2}
                width="310"
                height="280"
                fill="#abc3ad"
              />
              <rect
                x="435"
                y={130 + d / 2}
                width="310"
                height="280"
                fill="#c5c79e"
              />
              <Line x1="330" y1="335" x2="330" y2="170" arrow />
              <Line x1="530" y1="170" x2="530" y2="335" arrow />
              <T x="450" y="70">
                俯视：沿断层相对水平错动
              </T>
            </>
          ) : (
            <>
              <path d="M100 340H800V480H100Z" fill="url(#soil)" />
              <rect
                x="100"
                y="350"
                width="700"
                height="130"
                fill="url(#rockStrata)"
                opacity=".65"
              />
              <path
                d={`M100 340V250H${p.type === 0 ? 450 - d : 400}L450 ${p.type === 0 ? 360 : 250 - d}L${p.type === 0 ? 450 + d : 500} 250H800V340Z`}
                fill="url(#mountain)"
                stroke="#6b886d"
                strokeWidth="2"
              />
              {p.type === 0 && (
                <path
                  d={`M${450 - d} 340Q430 275 450 265Q470 280 ${450 + d} 340Z`}
                  fill="#d86e50"
                />
              )}
              <Line
                x1={p.type === 0 ? 340 : 220}
                y1="200"
                x2={p.type === 0 ? 220 : 340}
                y2="200"
                arrow
              />
              <Line
                x1={p.type === 0 ? 560 : 680}
                y1="200"
                x2={p.type === 0 ? 680 : 560}
                y2="200"
                arrow
              />
              <T x="450" y="100">
                {p.type === 0
                  ? "剖面：板块张裂，深部物质上涌"
                  : "剖面：大陆碰撞，地壳缩短增厚"}
              </T>
            </>
          )}
          <T x="450" y="525">
            运动尺度高度夸张 · 用进度滑块比较前后
          </T>
        </>
      );
    }
    default:
      return (
        <T x="450" y="275">
          三维场景
        </T>
      );
  }
}
export default function SvgScene({ id, p, t = 0, diagramOnly = false }) {
  const [apparatus, setApparatus] = useState(true);
  const lab = ["ohm", "dilution", "acid", "solubility", "lens"].includes(id);
  return (
    <div className={`science-wrap visual-${id} ${lab ? "bench-stage" : ""}`}>
      {id === "ohm" && !diagramOnly && (
        <div className="representation-switch" aria-label="实验呈现方式">
          <button aria-pressed={apparatus} onClick={() => setApparatus(true)}>
            器材视图
          </button>
          <button aria-pressed={!apparatus} onClick={() => setApparatus(false)}>
            电路原理图
          </button>
        </div>
      )}
      <svg
        className="science-svg"
        viewBox="0 0 900 560"
        role="img"
        aria-label={`${id} 互动科学示意图`}
      >
        <defs>
          <linearGradient id="glassBody">
            <stop stopColor="#bbdfe5" stopOpacity=".65" />
            <stop offset=".15" stopColor="white" stopOpacity=".65" />
            <stop offset=".42" stopColor="#e4f6f5" stopOpacity=".08" />
            <stop offset=".8" stopColor="#a6c9d0" stopOpacity=".2" />
            <stop offset="1" stopColor="#6b9cac" stopOpacity=".6" />
          </linearGradient>
          <linearGradient id="glassMetal">
            <stop stopColor="#4f6570" />
            <stop offset=".35" stopColor="#eff4ef" />
            <stop offset=".65" stopColor="#a6b5b4" />
            <stop offset="1" stopColor="#4a6471" />
          </linearGradient>
          <pattern
            id="draftGrid"
            width="30"
            height="30"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M30 0H0V30"
              fill="none"
              stroke="#728d8a"
              strokeOpacity=".09"
              strokeWidth="1"
            />
          </pattern>
          <radialGradient id="stageLight" cx=".38" cy=".15" r=".95">
            <stop stopColor="#fffef8" />
            <stop offset="1" stopColor={lab ? "#dce6e7" : "#e9eee3"} />
          </radialGradient>
          <marker
            id="arrow"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M0 0L10 5L0 10Z" fill="context-stroke" />
          </marker>
        </defs>
        <NatureMaterials />
        <rect width="900" height="560" fill="url(#stageLight)" />
        {!lab && <rect width="900" height="560" fill="url(#draftGrid)" />}
        {id === "ohm" && apparatus && !diagramOnly ? (
          <OhmBench p={p} />
        ) : (
          <Contents id={id} p={p} t={t} />
        )}
      </svg>
    </div>
  );
}
let reliefImage;
function terrainReliefImage() {
  if (reliefImage || typeof document === "undefined") return reliefImage;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 320;
  const ctx = canvas.getContext("2d");
  const data = ctx.createImageData(320, 320);
  for (let z = 0; z < 320; z++)
    for (let x = 0; x < 320; x++) {
      const px = (x / 319) * 6 - 3,
        pz = (z / 319) * 6 - 3;
      const h = terrainHeightAt(px, pz);
      const dx =
        (terrainHeightAt(px + 0.02, pz) - terrainHeightAt(px - 0.02, pz)) /
        (TERRAIN_SCALE * 0.04);
      const dz =
        (terrainHeightAt(px, pz + 0.02) - terrainHeightAt(px, pz - 0.02)) /
        (TERRAIN_SCALE * 0.04);
      const shade =
        0.55 +
        0.45 *
          Math.max(0, (-dx * -0.6 + 0.7 - dz * -0.4) / Math.hypot(dx, 1, dz));
      const rock = Math.min(1, Math.max(0, (h - 500) / 1500));
      const offset = (z * 320 + x) * 4;
      [54 + rock * 100, 78 + rock * 63, 44 + rock * 68].forEach(
        (v, k) => (data.data[offset + k] = v * shade),
      );
      data.data[offset + 3] = 255;
    }
  ctx.putImageData(data, 0, 0);
  reliefImage = canvas.toDataURL();
  return reliefImage;
}

export function ContourMap({ p, onSectionChange }) {
  const [sample, setSample] = useState(null);
  function samplePointer(e) {
    const svg = e.currentTarget,
      point = svg.createSVGPoint(),
      matrix = svg.getScreenCTM();
    if (!matrix) return;
    point.x = e.clientX;
    point.y = e.clientY;
    const local = point.matrixTransform(matrix.inverse());
    if (local.x < 20 || local.x > 200 || local.y < 20 || local.y > 200) return;
    setSample(
      terrainReadingAt((local.x - 20) / 30 - 3, (local.y - 20) / 30 - 3),
    );
  }
  function sampleKey(e) {
    if (
      ![
        "ArrowLeft",
        "ArrowRight",
        "ArrowUp",
        "ArrowDown",
        "Home",
        "Escape",
      ].includes(e.key)
    )
      return;
    e.preventDefault();
    e.stopPropagation();
    if (e.key === "Escape") {
      setSample(null);
      return;
    }
    if (e.key === "Home") {
      setSample(terrainReadingAt(0, 0));
      return;
    }
    const step = e.shiftKey ? 0.3 : 0.06;
    setSample(
      terrainReadingAt(
        (sample?.x ?? 0) +
          (e.key === "ArrowRight" ? step : e.key === "ArrowLeft" ? -step : 0),
        (sample?.z ?? 0) +
          (e.key === "ArrowDown" ? step : e.key === "ArrowUp" ? -step : 0),
      ),
    );
  }

  const endpoints = terrainSectionEndpoints(
    p.section ?? 50,
    p.sectionAngle ?? 0,
  ).map(([x, z]) => [20 + (x + 3) * 30, 20 + (z + 3) * 30]);
  function moveSection(e) {
    if (!p.profile || !onSectionChange) return;
    const svg = e.currentTarget,
      point = svg.createSVGPoint();
    point.x = e.clientX;
    point.y = e.clientY;
    const matrix = svg.getScreenCTM();
    if (!matrix) return;
    const local = point.matrixTransform(matrix.inverse());
    onSectionChange(
      Math.round(
        Math.max(
          0,
          Math.min(
            100,
            ((-Math.sin(((p.sectionAngle ?? 0) * Math.PI) / 180) *
              ((local.x - 20) / 30 - 3) +
              Math.cos(((p.sectionAngle ?? 0) * Math.PI) / 180) *
                ((local.y - 20) / 30 - 3) +
              3) /
              6) *
              100,
          ),
        ),
      ),
    );
  }
  const relief = useMemo(terrainReliefImage, []);
  const elevationLabels = useMemo(
    () => contourLabelAnchors(p.interval),
    [p.interval],
  );
  const pathForLevel = (l) =>
    contourSegments(l)
      .map(
        ([a, b]) =>
          `M${20 + (a[0] + 3) * 30} ${20 + (a[2] + 3) * 30}L${20 + (b[0] + 3) * 30} ${20 + (b[2] + 3) * 30}`,
      )
      .join(" ");
  const backgroundPaths = useMemo(() => {
    const levels = [];
    for (let l = p.interval; l <= 2600; l += p.interval) levels.push(l);
    return levels.map(pathForLevel);
  }, [p.interval]);
  const selectedPath = useMemo(() => pathForLevel(p.level), [p.level]);
  const paths = [...backgroundPaths, selectedPath];
  const waterPath = useMemo(
    () =>
      shorelineWater
        .map(
          (tri) =>
            tri
              .map(
                (v, i) =>
                  `${i ? "L" : "M"}${20 + (v.x + 3) * 30},${20 + (v.z + 3) * 30}`,
              )
              .join("") + "Z",
        )
        .join(""),
    [],
  );
  return (
    <>
      <svg
        viewBox="0 0 220 220"
        aria-label="与三维地形共用数据的等高线投影"
        tabIndex={0}
        role="img"
        aria-description={
          sample
            ? `海拔 ${sample.height.toFixed(0)} 米，坡度 ${sample.slope.toFixed(1)} 度。方向键移动取样点，Home 回中心，Escape 清除。`
            : "悬停或点击读数；方向键移动取样点，Shift 加速，Home 回中心，Escape 清除。"
        }
        onKeyDown={sampleKey}
        onFocus={() => setSample((old) => old ?? terrainReadingAt(0, 0))}
        style={{
          touchAction: p.profile ? "none" : "auto",
          cursor: p.profile ? "move" : "default",
        }}
        onPointerDown={(e) => {
          samplePointer(e);
          if (p.profile && onSectionChange) {
            e.currentTarget.setPointerCapture(e.pointerId);
            moveSection(e);
          }
        }}
        onPointerMove={(e) => {
          samplePointer(e);
          if (e.currentTarget.hasPointerCapture(e.pointerId)) moveSection(e);
        }}
        onPointerUp={(e) => {
          if (e.currentTarget.hasPointerCapture(e.pointerId))
            e.currentTarget.releasePointerCapture(e.pointerId);
        }}
      >
        <rect width="220" height="220" fill="#132720" />
        <image href={relief} x="20" y="20" width="180" height="180" />
        <path d={waterPath} fill="#4d94ae" />
        {paths.map((d, i) => (
          <path
            key={i}
            d={d}
            fill="none"
            stroke={i === paths.length - 1 ? "#ffe3a3" : "#c4ceb1"}
            strokeWidth={i === paths.length - 1 ? 1.2 : 0.35}
          />
        ))}
        {elevationLabels.map((label) => (
          <g
            key={label.level}
            transform={`translate(${20 + (label.x + 3) * 30},${20 + (label.z + 3) * 30})`}
            pointerEvents="none"
          >
            <rect
              x="-12"
              y="-5"
              width="24"
              height="10"
              rx="2"
              fill="#132720"
              fillOpacity=".88"
            />
            <text
              textAnchor="middle"
              dominantBaseline="central"
              fontSize="8"
              fill="#f1e5bb"
            >
              {label.level}
            </text>
          </g>
        ))}
        {(p.probes ?? []).map((point, i) => (
          <g key={i}>
            <circle
              cx={20 + (point.x + 3) * 30}
              cy={20 + (point.z + 3) * 30}
              r="3"
              fill={i ? "#86e6ff" : "#ffd78a"}
              stroke="#10212c"
            />
            <text
              x={25 + (point.x + 3) * 30}
              y={17 + (point.z + 3) * 30}
              fill={i ? "#86e6ff" : "#ffd78a"}
              fontSize="10"
            >
              {i ? "P2" : "P1"}
            </text>
          </g>
        ))}
        <text x="195" y="20" fill="#cad9cf" fontSize="12">
          N ↑
        </text>
        <g visibility={p.profile === false ? "hidden" : "visible"}>
          <path
            d={`M${endpoints[0].join(" ")}L${endpoints[1].join(" ")}`}
            stroke="#81ddf5"
            strokeWidth="1.5"
            strokeDasharray="4 2"
          />
          <text
            x={endpoints[0][0] - 8}
            y={endpoints[0][1] - 4}
            fill="#a8e9ff"
            fontSize="11"
          >
            A
          </text>
          <text
            x={endpoints[1][0] + 4}
            y={endpoints[1][1] - 4}
            fill="#a8e9ff"
            fontSize="11"
          >
            B
          </text>
        </g>
        {sample && (
          <g
            pointerEvents="none"
            transform={`translate(${20 + (sample.x + 3) * 30} ${20 + (sample.z + 3) * 30})`}
          >
            <circle r="4" fill="#101b22" stroke="#fff1c5" strokeWidth="1" />
            <path
              d="M-8 0H-4M4 0H8M0-8V-4M0 4V8"
              stroke="#fff1c5"
              strokeWidth="1"
            />
          </g>
        )}
        <text x="15" y="211" fill="#cad9cf" fontSize="10">
          等高距 {p.interval} m · 高程 / m
        </text>
      </svg>
      <div className="contour-map-reading" aria-live="off">
        {sample ? (
          <>
            <span>
              地形海拔 <strong>{sample.height.toFixed(0)} m</strong>
            </span>
            <span>
              坡度 <strong>{sample.slope.toFixed(1)}°</strong>
            </span>
          </>
        ) : (
          <span>悬停读海拔与坡度 · 方向键移动</span>
        )}
      </div>
      <p className="contour-map-note">水域读水底高程 · 坡度为局部地形坡度</p>
    </>
  );
}
