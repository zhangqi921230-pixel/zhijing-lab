import React, { useId } from "react";
import {
  trianglePoints,
  transformedPoint,
  pulleyState,
} from "./constructionModels.mjs";
export default function ConstructionScene({ id, p, time, guides = true }) {
  const uid = useId().replace(/:/g, "");
  const line = "var(--ui-muted)",
    ink = "var(--ui-ink)",
    accent = "var(--ui-primary)";
  const px = ([x, y]) => [450 + x * 52, 260 - y * 52];
  const pts = (points) => points.map((v) => px(v).join(",")).join(" ");
  const q = pulleyState(p, time),
    moving = p.mode === 1,
    cy = (moving ? 330 : 310) - q.h * 100,
    end = 175 + q.distance * 100;
  const arrow = (x, y, dy, color, label) => (
    <g>
      <path d={`M${x} ${y}v${dy}`} stroke={color} strokeWidth="3" />
      <path
        d={`M${x - 5} ${y + dy - Math.sign(dy) * 9}L${x} ${y + dy}L${x + 5} ${y + dy - Math.sign(dy) * 9}`}
        stroke={color}
        strokeWidth="3"
        fill="none"
      />
      <text x={x + 10} y={y + dy / 2} fill={ink}>
        {label}
      </text>
    </g>
  );
  const wheel = (x, y, travel) => (
    <g>
      <circle
        cx={x}
        cy={y}
        r="55"
        fill={`url(#metal-${uid})`}
        stroke={line}
        strokeWidth="3"
      />
      <circle cx={x} cy={y} r="44" fill="var(--ui-surface)" stroke={line} />
      <g
        transform={`rotate(${(((travel * 100) / 55) * 180) / Math.PI} ${x} ${y})`}
      >
        {[0, 60, 120].map((a) => (
          <path
            key={a}
            d={`M${x - 40} ${y}h80`}
            transform={`rotate(${a} ${x} ${y})`}
            stroke={line}
            strokeWidth="4"
          />
        ))}
      </g>
      <circle cx={x} cy={y} r="8" fill={ink} />
    </g>
  );
  return (
    <svg
      className="motion-diagram"
      viewBox="0 0 900 560"
      role="img"
      aria-label={
        id === "symmetry"
          ? "原像、变换像及对应点连线"
          : "连续绳路、滑轮受力和提升距离"
      }
      style={{
        width: "100%",
        display: "block",
        fill: ink,
        fontSize: 18,
        fontFamily: "Microsoft YaHei, sans-serif",
      }}
    >
      <defs>
        <linearGradient id={`metal-${uid}`}>
          <stop stopColor="#7e9294" />
          <stop offset=".4" stopColor="#e6efec" />
          <stop offset="1" stopColor="#7a9195" />
        </linearGradient>
      </defs>
      {id === "symmetry" ? (
        <>
          {Array.from({ length: 9 }, (_, i) => i - 4).map((i) => (
            <g key={i}>
              <path
                d={`M${450 + i * 52} 52V468M242 ${260 + i * 52}H658`}
                stroke="var(--ui-line)"
              />
              {i !== 0 && (
                <text
                  x={450 + i * 52}
                  y="282"
                  textAnchor="middle"
                  fontSize="14"
                >
                  {i}
                </text>
              )}
            </g>
          ))}
          <path d="M220 260H680M450 490V30" stroke={line} />
          <text x="685" y="252">
            x
          </text>
          <text x="462" y="38">
            y
          </text>
          <text x="427" y="284">
            O
          </text>
          {p.mode === 0 && (
            <path
              d={`M${px([-4.6 * Math.cos((p.axis * Math.PI) / 180), -4.6 * Math.sin((p.axis * Math.PI) / 180)]).join(" ")}L${px([4.6 * Math.cos((p.axis * Math.PI) / 180), 4.6 * Math.sin((p.axis * Math.PI) / 180)]).join(" ")}`}
              stroke={accent}
              strokeWidth="2"
              strokeDasharray="8 5"
            />
          )}
          <polygon
            points={pts(trianglePoints)}
            fill="var(--ui-selected)"
            stroke={line}
            strokeDasharray="6 4"
            strokeWidth="2"
          />
          <polygon
            points={pts(
              trianglePoints.map((v) => transformedPoint(v, p, time)),
            )}
            fill={accent}
            fillOpacity=".2"
            stroke={accent}
            strokeWidth="3"
          />
          {trianglePoints.map((v, i) => {
            const a = px(v),
              b = px(transformedPoint(v, p, time));
            return (
              <g key={i}>
                {guides &&
                  (p.mode === 0 ? (
                    <path
                      d={`M${a.join(" ")}L${b.join(" ")}`}
                      stroke={line}
                      strokeDasharray="4 5"
                    />
                  ) : (
                    <circle
                      cx="450"
                      cy="260"
                      r={Math.hypot(...v) * 52}
                      stroke={line}
                      fill="none"
                      strokeDasharray="4 7"
                    />
                  ))}
                <circle cx={a[0]} cy={a[1]} r="5" fill={line} />
                <text x={a[0] + 10} y={a[1] + 22}>
                  {["A", "B", "C"][i]}
                </text>
                <circle cx={b[0]} cy={b[1]} r="5" fill={accent} />
                <text x={b[0] + 10} y={b[1] + (i === 1 ? 34 : -12)}>
                  {["A′", "B′", "C′"][i]}
                </text>
              </g>
            );
          })}
          <text x="32" y="40">
            {p.mode === 0 ? "轴对称 · 折叠投影" : "绕 O 逆时针旋转"}
          </text>
          <text x="32" y="522">
            虚线轮廓：原像　实线轮廓：当前投影 / 像
          </text>
        </>
      ) : (
        <>
          <path d="M295 65H630" stroke={line} strokeWidth="12" />
          {Array.from({ length: 14 }, (_, i) => (
            <path key={i} d={`M${300 + i * 24} 65l12 -18`} stroke={line} />
          ))}
          <path d="M510 65V130" stroke={line} strokeWidth="7" />
          {wheel(510, 130, q.distance)}
          {moving && wheel(400, cy, -q.h)}
          <path
            d={
              moving
                ? `M345 65V${cy}A55 55 0 0 0 455 ${cy}V130A55 55 0 0 1 565 130V${end}`
                : `M455 ${cy}V130A55 55 0 0 1 565 130V${end}`
            }
            stroke="#bd873a"
            strokeWidth="5"
            fill="none"
          />
          <path
            d={moving ? `M400 ${cy}v80` : `M455 ${cy}v25`}
            stroke={line}
            strokeWidth="6"
          />
          <rect
            x={(moving ? 400 : 455) - 40}
            y={moving ? cy + 80 : cy + 25}
            width="80"
            height="58"
            rx="7"
            fill={`url(#metal-${uid})`}
            stroke={line}
          />
          <text
            x={moving ? 400 : 455}
            y={moving ? cy + 117 : cy + 62}
            textAnchor="middle"
            style={{ fill: "#152c30" }}
          >
            {p.mass} kg
          </text>
          <circle cx="565" cy={end} r="7" fill={accent} />
          {guides && (
            <>
              {arrow(610, end - 45, 60, accent, "F")}
              {arrow(moving ? 345 : 435, cy, -65, accent, "T")}
              {moving && arrow(455, cy, -65, accent, "T")}
              {arrow(
                moving ? 400 : 455,
                moving ? cy + 140 : cy + 85,
                35,
                line,
                "mg",
              )}
            </>
          )}
          <text x="32" y="42">
            {moving ? "动滑轮组 · 两段承重绳" : "定滑轮 · 一段承重绳"}
          </text>
          <text x="32" y="125">
            重物上升 h
          </text>
          <text x="32" y="158" fontSize="26">
            {q.h.toFixed(2)} m
          </text>
          <text x="32" y="210">
            自由端下拉 s
          </text>
          <text x="32" y="243" fontSize="26">
            {q.distance.toFixed(2)} m
          </text>
          <text x="32" y="300">
            拉力 F = mg / {q.n}
          </text>
          <text x="32" y="333" fontSize="26">
            {q.force.toFixed(1)} N
          </text>
          <text x="32" y="522">
            输入功 {q.work.toFixed(2)} J　=　重力势能增加 {q.work.toFixed(2)} J
          </text>
          <text x="32" y="548" fontSize="16">
            理想匀速提升 · 上方定滑轮改变方向 · 箭头仅表示力的方向
          </text>
        </>
      )}
    </svg>
  );
}
