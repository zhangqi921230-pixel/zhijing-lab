import React, { useId } from "react";
import { circleAngleState, pinholeState } from "./opticalGeometryModels.mjs";
const ink = "var(--ui-ink)",
  muted = "var(--ui-muted)",
  gold = "var(--ui-gold)",
  green = "var(--ui-primary)";
export default function OpticalGeometryScene({
  id,
  p,
  time,
  guides = true,
  chapter = 0,
  selectedPoint = -1,
}) {
  const uid = useId().replace(/:/g, "");
  const q = id === "pinhole" ? pinholeState(p) : circleAngleState(p, time);
  const pt = ([x, y]) => [440 + 205 * x, 300 + 205 * y];
  const angleArc = (center, a, b, radius) => {
    const c = pt(center),
      u = a.map((v, i) => v - center[i]),
      v = b.map((n, i) => n - center[i]);
    const start = u.map((n, i) => c[i] + (radius * n) / Math.hypot(...u));
    const end = v.map((n, i) => c[i] + (radius * n) / Math.hypot(...v));
    return `M${start}A${radius} ${radius} 0 0 ${u[0] * v[1] - u[1] * v[0] > 0 ? 1 : 0} ${end}`;
  };
  const progress = Math.min(1, Math.max(0, time / 6));
  const ox = 450 - p.object * 12,
    sx = 450 + p.screen * 12,
    cy = 290;
  return (
    <svg
      className="motion-diagram"
      viewBox="0 0 900 620"
      role="img"
      aria-label={
        id === "pinhole"
          ? "物体、小孔、光屏与倒立实像的光路"
          : p.side === 1
            ? "弦 AB 两侧的圆周角与不包含顶点 P 的优弧"
            : "同一条弧对应的圆心角与圆周角"
      }
      style={{
        width: "100%",
        display: "block",
        fill: ink,
        fontSize: 18,
        fontFamily: '"Microsoft YaHei", sans-serif',
      }}
    >
      <defs>
        <pattern
          id={`og-grid-${uid}`}
          width="30"
          height="30"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M30 0H0V30"
            fill="none"
            stroke="var(--ui-line)"
            strokeWidth=".6"
          />
        </pattern>
        <linearGradient id={`og-screen-${uid}`}>
          <stop stopColor={green} stopOpacity=".18" />
          <stop offset="1" stopColor="var(--ui-surface)" />
        </linearGradient>
      </defs>
      <rect width="900" height="620" fill="var(--ui-paper)" />
      <rect
        x="35"
        y="60"
        width="830"
        height="490"
        fill={`url(#og-grid-${uid})`}
      />
      {id === "pinhole" ? (
        <>
          {chapter === 4 && guides && (
            <g strokeWidth="1.5">
              <path
                d={`M${ox} ${cy - p.height * 14}L${ox} ${cy}L450 ${cy}Z`}
                fill={green}
                fillOpacity=".12"
                stroke={green}
              />
              <path
                d={`M450 ${cy}L${sx} ${cy}L${sx} ${cy + q.imageHeight * 14}Z`}
                fill={gold}
                fillOpacity=".12"
                stroke={gold}
              />
              <path
                d={`M${ox + 12} ${cy}v-12h-12M${sx - 12} ${cy}v12h12`}
                fill="none"
                stroke={muted}
              />
            </g>
          )}
          <rect
            x="450"
            y="65"
            width={sx - 450}
            height="475"
            rx="5"
            fill={green}
            fillOpacity=".045"
            stroke={muted}
            strokeDasharray="7 5"
          />
          <rect
            x={sx - 7}
            y="73"
            width="14"
            height="457"
            fill={`url(#og-screen-${uid})`}
            stroke={muted}
          />
          <path
            d={`M450 65V${cy - 5}M450 ${cy + 5}V540`}
            stroke={ink}
            strokeWidth="10"
          />
          <path
            d={`M${ox} ${cy}V${cy - p.height * 14}m-9 14l9-14 9 14`}
            stroke={green}
            strokeWidth="6"
            fill="none"
          />
          <path
            d={`M${sx} ${cy}V${cy + q.imageHeight * 14}m-9-14l9 14 9-14`}
            stroke={gold}
            strokeWidth="6"
            fill="none"
          />
          {[0, 0.5, 1].map((f, i) => {
            const start = [ox, cy - p.height * 14 * f],
              end = [sx, cy + q.imageHeight * 14 * f];
            return (
              <g
                key={i}
                data-testid={`pinhole-ray-${i}`}
                opacity={selectedPoint < 0 || selectedPoint === i ? 1 : 0.18}
              >
                {guides && (
                  <path
                    d={`M${start}L${end}`}
                    stroke={i === 1 ? muted : gold}
                    strokeWidth={selectedPoint === i ? 3 : 1.8}
                    fill="none"
                    strokeDasharray={i === 1 ? "5 4" : undefined}
                  />
                )}
                <circle cx={start[0]} cy={start[1]} r="4" fill={green} />
                <circle cx={end[0]} cy={end[1]} r="4" fill={gold} />
                {(selectedPoint === i || (selectedPoint < 0 && i !== 1)) && (
                  <g fontSize="16">
                    <text x={start[0] - 18} y={start[1] + 5} textAnchor="end">
                      {["A", "B", "C"][i]}
                    </text>
                    <text x={end[0] + 18} y={end[1] + 5}>
                      {["A′", "B′", "C′"][i]}
                    </text>
                  </g>
                )}
                <circle
                  cx={start[0] + (end[0] - start[0]) * progress}
                  cy={start[1] + (end[1] - start[1]) * progress}
                  r="4"
                  fill={gold}
                />
              </g>
            );
          })}
          <text x={ox} y="565" textAnchor="middle">
            物体
          </text>
          <text x="450" y="565" textAnchor="middle">
            小孔
          </text>
          <text x={sx} y="565" textAnchor="middle">
            光屏 · 倒立像
          </text>
          {guides && (
            <g fill={muted} fontSize="16">
              <path
                d={`M${ox} 47H${sx}M${ox} 42V52M450 42V52M${sx} 42V52`}
                stroke={muted}
              />
              <text x={(ox + 450) / 2} y="40" textAnchor="middle">
                物距 {p.object} cm
              </text>
              <text x={(sx + 450) / 2} y="40" textAnchor="middle">
                屏距 {p.screen} cm
              </text>
            </g>
          )}
          <text x="45" y="602" fill={muted}>
            像高 {q.imageHeight.toFixed(2)} cm · 点孔几何模型 · 光点表示传播顺序
          </text>
        </>
      ) : (
        <>
          <text x="45" y="36" fill={muted}>
            固定弧 AB · 移动顶点 P
          </text>
          <circle
            cx="440"
            cy="300"
            r="205"
            fill="var(--ui-surface)"
            fillOpacity=".65"
            stroke={muted}
            strokeWidth="2"
          />
          <path
            d={`M${pt(q.A)}A205 205 0 ${p.side === 1 ? 1 : 0} ${p.side === 1 ? 0 : 1} ${pt(q.B)}`}
            data-testid="intercepted-arc"
            stroke={gold}
            strokeWidth="6"
            fill="none"
          />
          <path
            d={`M${pt(q.A)}L${pt(q.P)}L${pt(q.B)}`}
            stroke={green}
            strokeWidth="3"
            fill={green}
            fillOpacity=".07"
          />
          {guides && (
            <g fill="none" strokeWidth="2.5">
              <path d={angleArc(q.P, q.A, q.B, 32)} stroke={green} />
              <path d={angleArc([0, 0], q.A, q.B, 44)} stroke={gold} />
            </g>
          )}
          {guides && (
            <path
              d={`M${pt(q.A)}L440 300L${pt(q.B)}`}
              stroke={gold}
              strokeWidth="2"
              fill={gold}
              fillOpacity=".12"
            />
          )}
          {chapter === 3 && p.central === 180 && p.proof > 0 && (
            <g data-testid="diameter-proof">
              <path
                d={`M${pt(q.A)}L440 300L${pt(q.B)}`}
                fill="none"
                stroke={gold}
                strokeWidth="2"
              />
              <path
                d={`M440 300L${pt(q.P)}`}
                fill="none"
                stroke={gold}
                strokeWidth="2.5"
                strokeDasharray="7 4"
              />
              {p.proof === 2 && (
                <>
                  <path
                    d={angleArc(q.P, q.A, [0, 0], 45)}
                    fill="none"
                    stroke={green}
                    strokeWidth="3"
                  />
                  <path
                    d={angleArc(q.P, [0, 0], q.B, 58)}
                    fill="none"
                    stroke={gold}
                    strokeWidth="3"
                  />
                  <text x="45" y="74" fill={green}>
                    α = ∠APO · 绿色小弧
                  </text>
                  <text x="45" y="104" fill={gold}>
                    β = ∠OPB · 金色小弧
                  </text>
                  <text x="45" y="134">
                    α + β = 90°
                  </text>
                </>
              )}
            </g>
          )}
          {chapter >= 4 && (
            <path
              d={`M${pt(q.A)}L${pt(q.Q)}L${pt(q.B)}`}
              stroke={muted}
              strokeWidth="2"
              strokeDasharray="7 4"
              fill="none"
            />
          )}
          {Object.entries({
            A: q.A,
            B: q.B,
            P: q.P,
            ...(chapter >= 4 ? { Q: q.Q } : {}),
          }).map(([name, point]) => {
            const [x, y] = pt(point);
            return (
              <g key={name}>
                <circle
                  cx={x}
                  cy={y}
                  r="5"
                  fill={name === "P" ? green : gold}
                />
                <text
                  x={440 + (x - 440) * 1.14}
                  y={306 + (y - 300) * 1.14}
                  textAnchor="middle"
                >
                  {name}
                </text>
              </g>
            );
          })}
          <circle cx="440" cy="300" r="4" fill={ink} />
          <text x="422" y="327">
            O
          </text>
          {guides && (
            <>
              <text x="470" y="306" fill={ink}>
                {p.central}°
              </text>
              <text x="45" y="567">
                ∠APB = {q.angle.toFixed(1)}°
                {chapter >= 4 ? ` · ∠AQB = ${(p.central / 2).toFixed(1)}°` : ""}
              </text>
            </>
          )}
          <text x="45" y="602" fill={muted}>
            金色弧不包含 P · 所对弧 {q.intercepted}°，圆周角{" "}
            {q.angle.toFixed(1)}°
          </text>
        </>
      )}
    </svg>
  );
}
