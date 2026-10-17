import React from "react";
import { circleAreaState, visiblePrismRays } from "./revealModels.mjs";
const ink = "var(--ui-ink)",
  gold = "var(--ui-gold)",
  green = "var(--ui-primary)",
  line = "var(--ui-line)";
const mix = (a, b, t) => a + (b - a) * t;
export default function RevealScene({ id, p, time, guides = true }) {
  const f = Math.max(0, Math.min(1, time / 6));
  const math = id === "circle-area";
  const q = math ? circleAreaState(p) : visiblePrismRays(p);
  const cx = 450,
    cy = 290;
  const R = p.radius * 34,
    a = Math.PI / p.sectors;
  const w = 2 * R * Math.sin(a),
    h = R * Math.cos(a);
  const ease = f * f * (3 - 2 * f);
  const left = cx - ((p.sectors / 2 - 0.5) * w) / 2;
  const ray = (from, to, color, progress, name) => (
    <g key={name} data-ray={name}>
      <path
        d={`M${from}L${to}`}
        fill="none"
        stroke={color}
        strokeWidth={math || q.length === 1 ? 3 : 1.5}
        pathLength="1"
        strokeDasharray="1"
        strokeDashoffset={1 - progress}
      />
      {progress > 0 && (
        <circle
          cx={mix(from[0], to[0], progress)}
          cy={mix(from[1], to[1], progress)}
          r={math || q.length === 1 ? 5 : 2.5}
          fill={color}
        />
      )}
    </g>
  );
  return (
    <svg
      className="motion-diagram"
      viewBox="0 0 900 600"
      role="img"
      aria-label={
        math ? "圆的扇形等积拼接与极限长方形" : "三棱镜中不同波长的两次折射光路"
      }
      style={{
        width: "100%",
        display: "block",
        fill: ink,
        fontFamily: "Microsoft YaHei, sans-serif",
        fontSize: 18,
      }}
    >
      <rect width="900" height="600" fill="var(--ui-paper)" />
      {math ? (
        <>
          <text x="32" y="38">
            等积拼接 · {p.sectors} 块扇形
          </text>
          <text x="868" y="38" textAnchor="end">
            每块 {q.sectorAngle.toFixed(1)}°
          </text>
          {guides && f > 0.5 && (
            <rect
              x={cx - (Math.PI * R) / 2}
              y={cy - R / 2}
              width={Math.PI * R}
              height={R}
              fill="none"
              stroke={ink}
              strokeDasharray="7 6"
              opacity=".6"
            />
          )}
          {Array.from({ length: p.sectors }, (_, i) => {
            const up = i % 2 === 0;
            const targetX = left + Math.floor(i / 2) * w + (up ? 0 : w / 2);
            const targetY = cy + (up ? h / 2 : -h / 2);
            const originalAngle = (i * 360) / p.sectors;
            const targetAngle = up ? 0 : 180;
            const rotation =
              originalAngle +
              (((targetAngle - originalAngle + 540) % 360) - 180) * ease;
            return (
              <path
                key={i}
                data-sector={i}
                transform={`translate(${mix(cx, targetX, ease)} ${mix(cy, targetY, ease)}) rotate(${rotation})`}
                d={`M0 0 L${-R * Math.sin(a)} ${-h} A${R} ${R} 0 0 1 ${R * Math.sin(a)} ${-h} Z`}
                fill={up ? gold : green}
                fillOpacity=".76"
                stroke="var(--ui-paper)"
                strokeWidth="1"
              />
            );
          })}
          {guides && (
            <>
              {f < 0.3 ? (
                <>
                  <path d={`M450 290v${-R}`} stroke={ink} strokeWidth="2" />
                  <text x="460" y={cy - R / 2}>
                    r = {p.radius} cm
                  </text>
                </>
              ) : (
                <>
                  <path
                    d={`M${cx - (Math.PI * R) / 2} 435v10H${cx + (Math.PI * R) / 2}v-10`}
                    fill="none"
                    stroke={ink}
                  />
                  <text x="450" y="476" textAnchor="middle">
                    长趋近 πr = {q.halfCircumference.toFixed(2)} cm
                  </text>
                  <text x="755" y="295" textAnchor="middle">
                    宽趋近 r
                  </text>
                  <text x="755" y="326" textAnchor="middle">
                    {p.radius} cm
                  </text>
                </>
              )}
            </>
          )}
          <path d="M32 510H868" stroke={line} />
          <text x="32" y="548">
            S = π × {p.radius}² = {q.area.toFixed(2)} cm²
          </text>
          <text x="32" y="580" fontSize="16">
            有限等分仍有弧边 · 增加等分数后逐渐趋近长方形
          </text>
        </>
      ) : (
        <>
          <text x="32" y="38">
            双界面光路 · 三棱镜顶角 60°
          </text>
          <path
            d={`M450 110 L270 ${110 + 180 * Math.sqrt(3)} H630 Z`}
            fill="#83b7c1"
            fillOpacity=".16"
            stroke="var(--ui-muted)"
            strokeWidth="2"
          />
          <path d="M450 110L450 135" stroke="var(--ui-muted)" />
          <text x="465" y="144">
            60°
          </text>
          {q.map((v) => {
            const incident = ((30 - p.angle) * Math.PI) / 180;
            const source = [
              v.entry[0] - 210 * Math.cos(incident),
              v.entry[1] - 210 * Math.sin(incident),
            ];
            return (
              <g key={v.name}>
                {v === q[0] &&
                  ray(
                    source,
                    v.entry,
                    q.length > 1 ? ink : v.color,
                    Math.min(1, f * 3),
                    `${v.name}-入射`,
                  )}
                {ray(
                  v.entry,
                  v.exit,
                  v.color,
                  Math.max(0, Math.min(1, f * 3 - 1)),
                  `${v.name}-内部`,
                )}
                {ray(
                  v.exit,
                  v.end,
                  v.color,
                  Math.max(0, f * 3 - 2),
                  `${v.name}-${v.tir ? "全反射" : "出射"}`,
                )}
              </g>
            );
          })}
          {guides && (
            <>
              <path
                d={`M${q[0].entry[0] - 60 * Math.cos(Math.PI / 6)} ${q[0].entry[1] - 30}L${q[0].entry[0] + 60 * Math.cos(Math.PI / 6)} ${q[0].entry[1] + 30}`}
                stroke={ink}
                strokeDasharray="5 6"
              />
              <path
                d={`M${q[0].exit[0] - 60 * Math.cos(Math.PI / 6)} ${q[0].exit[1] + 30}L${q[0].exit[0] + 60 * Math.cos(Math.PI / 6)} ${q[0].exit[1] - 30}`}
                stroke={ink}
                strokeDasharray="5 6"
              />
              <text x="485" y="207">
                第二界面法线
              </text>
              <text x="240" y="207">
                第一界面法线
              </text>
              <text x="52" y="393">
                入射角 {p.angle.toFixed(1)}°
              </text>
              <text x="285" y="478">
                内部光路按实际角度绘制
              </text>
            </>
          )}
          <text x="665" y="102">
            出射光谱对照
          </text>
          {q.map((v, i) => (
            <g key={v.name}>
              <circle cx="670" cy={135 + i * 25} r="5" fill={v.color} />
              <text x="685" y={141 + i * 25} fontSize="16">
                {v.name} {v.wavelength} nm ·{" "}
                {v.tir ? "全反射" : `${v.deviation.toFixed(1)}°`}
              </text>
            </g>
          ))}
          {q.length > 1 &&
            q.filter((v) => !v.tir).length > 1 &&
            (() => {
              const output = q.filter((v) => !v.tir),
                base = output[0].deviation,
                span = output.at(-1).deviation - base;
              return (
                <g aria-label="出射偏角差放大对照">
                  <text x="645" y="407" fontSize="16">
                    角差放大对照 · {span.toFixed(2)}°
                  </text>
                  <path d="M652 456H840" stroke={ink} />
                  {output.map((v) => (
                    <path
                      key={v.name}
                      d={`M${655 + (180 * (v.deviation - base)) / span} 425v30`}
                      stroke={v.color}
                      strokeWidth="3"
                    />
                  ))}
                  <text x="645" y="480" fontSize="15">
                    左：{output[0].name}光　右：{output.at(-1).name}光
                  </text>
                </g>
              );
            })()}
          <path d="M32 514H868" stroke={line} />
          <text x="32" y="548">
            {q.every((v) => v.tir)
              ? "第二界面发生全反射；图示仅保留反射后的首段"
              : "不同波长经历不同偏折 · 角度读数为总偏向角"}
          </text>
          <text x="32" y="580" fontSize="16">
            白光以五种代表波长示意；并非真实连续光谱或光强测量
          </text>
        </>
      )}
    </svg>
  );
}
