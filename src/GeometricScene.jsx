import React, { useId } from "react";
import { vectorState, fenceState } from "./geometricLessons.mjs";
import "./ObservableScene.css";
import "./ComparisonScene.css";
const ink = "var(--ui-ink)",
  line = "var(--ui-line)",
  green = "var(--ui-primary)",
  gold = "var(--ui-gold)";
export default function GeometricScene({ id, p, time, guides = true }) {
  const uid = useId().replace(/:/g, "");
  const arrow = (x, y, ex, ey, color, dashed = false) => {
    const l = Math.hypot(ex - x, ey - y);
    if (l < 0.01) return <circle cx={x} cy={y} r="6" fill={color} />;
    const a = Math.atan2(ey - y, ex - x);
    return (
      <g stroke={color} fill={color}>
        <path
          d={`M${x} ${y}L${ex} ${ey}`}
          fill="none"
          strokeWidth="3"
          strokeDasharray={dashed ? "7 5" : undefined}
        />
        <path
          d={`M${ex} ${ey}L${ex - 12 * Math.cos(a - 0.4)} ${ey - 12 * Math.sin(a - 0.4)}L${ex - 12 * Math.cos(a + 0.4)} ${ey - 12 * Math.sin(a + 0.4)}Z`}
        />
      </g>
    );
  };
  if (id === "vector-sum") {
    const q = vectorState(p),
      u = Math.max(0, Math.min(1, time / 6)),
      ox = 240,
      oy = 400,
      s = 62,
      ax = ox + s * p.a,
      ex = ox + s * q.x,
      ey = oy - s * q.y;
    return (
      <svg
        className="motion-diagram observable-scene comparison-scene"
        viewBox="0 0 900 620"
        role="img"
        aria-label="向量首尾相接与坐标分量"
      >
        <text x="35" y="44" className="observable-title">
          方向与长度一起决定合向量
        </text>
        <text x="35" y="80">
          绿色 a · 蓝色 b · 金色 a+b · 同一单位尺度
        </text>
        {guides && (
          <g stroke={line} fill="none">
            {Array.from({ length: 13 }, (_, i) => (
              <path key={i} d={`M${ox + (i - 3) * s} 130V435`} />
            ))}
            {[0, 1, 2, 3, 4].map((i) => (
              <path key={i} d={`M40 ${oy - i * s}H850`} />
            ))}
          </g>
        )}
        {arrow(40, oy, 850, oy, ink)}
        {arrow(ox, 440, ox, 125, ink)}
        <text x="850" y="430">
          x
        </text>
        <text x="255" y="139">
          y
        </text>
        {guides && (
          <>
            <path
              d={`M${ox + s * q.bx} ${ey}L${ex} ${ey}L${ax} ${oy}`}
              stroke={line}
              fill="none"
              strokeDasharray="6 5"
              strokeWidth="2"
            />
            <path
              d={`M${ex} ${oy}V${ey}H${ox}`}
              fill="none"
              stroke={gold}
              strokeDasharray="5 5"
            />
            {arrow(ox, oy, ox + s * q.bx, ey, "var(--ui-muted)", true)}
          </>
        )}
        {arrow(ox, oy, ax, oy, green)}
        {arrow(
          ox + s * p.a * u,
          oy,
          ox + s * p.a * u + s * q.bx,
          ey,
          "#438ad0",
        )}
        {arrow(ox, oy, ex, ey, gold)}
        <circle cx={ox} cy={oy} r="4" fill={ink} />
        <text x="210" y="435">
          O
        </text>
        <text x={(ox + ax) / 2} y="465" fill={green}>
          a = {p.a}
        </text>
        <text x="35" y="505">
          {u < 1
            ? "正在平移 b：方向与长度保持不变"
            : "首尾相接完成：金色箭头连接起点与终点"}
        </text>
        <text x="35" y="546">
          Rₓ = {q.x.toFixed(2)}　Rᵧ = {q.y.toFixed(2)}　|R| ={" "}
          {q.length.toFixed(2)}
        </text>
        <text x="35" y="587">
          {q.length === 0
            ? "合向量为零向量：没有确定方向。"
            : "虚线用于投影与平行四边形构图；合向量不随平移步骤改变。"}
        </text>
      </svg>
    );
  }
  const q = fenceState(p, time),
    s = 30,
    w = q.x * s,
    h = q.y * s,
    cx = 265,
    cy = 305,
    half = p.perimeter / 2;
  const px = (x) => 555 + (265 * x) / half,
    py = (a) => 440 - (240 * a) / q.max;
  const curve = Array.from({ length: 81 }, (_, i) => {
    const x = (half * i) / 80;
    return `${i ? "L" : "M"}${px(x)} ${py(x * (half - x))}`;
  }).join(" ");
  return (
    <svg
      className="motion-diagram observable-scene comparison-scene"
      viewBox="0 0 900 620"
      role="img"
      aria-label="固定周长花园与面积曲线"
    >
      <defs>
        <pattern
          id={uid + "grass"}
          width="30"
          height="30"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M11 18l3-6 2 6m8-10 2-4"
            stroke={green}
            opacity=".22"
            fill="none"
          />
          {guides && <path d="M30 0H0V30" stroke={line} fill="none" />}
        </pattern>
      </defs>
      <text x="35" y="44" className="observable-title">
        同样长的围栏，能围多大的花园？
      </text>
      <text x="35" y="80">
        P = {p.perimeter} m · 当前横边占半周长 {q.share.toFixed(1)}%
      </text>
      <rect
        x={cx - w / 2}
        y={cy - h / 2}
        width={w}
        height={h}
        fill={green}
        fillOpacity=".10"
      />
      <rect
        x={cx - w / 2}
        y={cy - h / 2}
        width={w}
        height={h}
        fill={`url(#${uid}grass)`}
        stroke={gold}
        strokeWidth="5"
      />
      {[
        [cx - w / 2, cy - h / 2],
        [cx + w / 2, cy - h / 2],
        [cx + w / 2, cy + h / 2],
        [cx - w / 2, cy + h / 2],
      ].map(([x, y], i) => (
        <rect key={i} x={x - 4} y={y - 4} width="8" height="8" fill={ink} />
      ))}
      <text x={cx} y={cy + h / 2 + 32} textAnchor="middle">
        横边 {q.x.toFixed(2)} m
      </text>
      <text x="35" y="125">
        竖边 {q.y.toFixed(2)} m
      </text>
      <text x="555" y="150">
        面积 S / m²
      </text>
      <path d="M555 180V440H840" stroke={ink} fill="none" />
      {guides &&
        [0.25, 0.5, 0.75, 1].map((r) => (
          <g key={r}>
            <path d={`M555 ${py(q.max * r)}H820`} stroke={line} />
            <text x="550" y={py(q.max * r) - 5} textAnchor="end">
              {(q.max * r).toFixed(1)}
            </text>
          </g>
        ))}
      <path d={curve} fill="none" stroke={green} strokeWidth="3" />
      <circle cx={px(half / 2)} cy={py(q.max)} r="5" fill={green} />
      <text x={px(half / 2)} y="183" textAnchor="middle">
        正方形 · {q.max.toFixed(1)}
      </text>
      <path
        d={`M${px(q.x)} 440V${py(q.area)}`}
        fill="none"
        stroke={gold}
        strokeDasharray="5 5"
      />
      <circle cx={px(q.x)} cy={py(q.area)} r="7" fill={gold} stroke={ink} />
      <text x="555" y="473">
        0
      </text>
      <text x="820" y="473" textAnchor="end">
        {half} m
      </text>
      <text x="675" y="507">
        横边 x / m
      </text>
      <text x="35" y="552">
        当前面积 {q.area.toFixed(2)} m² · 比最大值少{" "}
        {(q.max - q.area).toFixed(2)} m²
      </text>
      <text x="35" y="593">
        每格 1 m × 1 m；左右交换尺寸，面积不变；曲线只比较矩形。
      </text>
    </svg>
  );
}
