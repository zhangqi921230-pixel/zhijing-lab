import React, { useMemo } from "react";
import { lissajousPoint, standingState } from "./oscillationModels.mjs";
const path = (points) =>
  points
    .map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(2)} ${y.toFixed(2)}`)
    .join(" ");
export default function OscillationScene({ id, p, time, guides, trace }) {
  const isFigure = id === "lissajous";
  const reference = useMemo(
    () =>
      isFigure
        ? Array.from({ length: 361 }, (_, i) => lissajousPoint(p, i / 60))
        : [],
    [isFigure, p.fx, p.fy, p.phase, p.height],
  );
  const point = isFigure ? lissajousPoint(p, time) : null;
  const q = !isFigure ? standingState(p, time) : null;
  // 1 m occupies 790 SVG units; 3.16 units/mm exaggerates displacement 4x.
  const displacementScale = 3.16;
  const px = (x) => 260 + 155 * x,
    py = (y) => 255 - 155 * y;
  const wave = (key, base) =>
    path(
      Array.from({ length: 181 }, (_, i) => [
        55 + (790 * i) / 180,
        base - standingState(p, time, i / 180)[key] * displacementScale,
      ]),
    );
  return (
    <svg
      className="motion-diagram"
      viewBox="0 0 900 480"
      role="img"
      aria-label={
        isFigure
          ? "水平与竖直振动合成为李萨如轨迹"
          : "两列反向行波及固定端驻波的逐点叠加"
      }
      style={{
        width: "100%",
        display: "block",
        background: "var(--ui-paper)",
        fill: "var(--ui-ink)",
        fontFamily: "Microsoft YaHei, sans-serif",
        fontSize: 18,
      }}
    >
      <rect
        x="18"
        y="18"
        width="864"
        height="444"
        rx="12"
        fill="var(--ui-surface)"
        stroke="var(--ui-line)"
      />
      {isFigure ? (
        <>
          <text x="42" y="52">
            合成轨迹 · x—y 平面
          </text>
          {[-1, -0.5, 0, 0.5, 1].map((v) => (
            <g key={v}>
              <path
                d={`M${px(v)} 90V420M95 ${py(v)}H425`}
                stroke="var(--ui-line)"
                fill="none"
              />
              <text x={px(v)} y="446" textAnchor="middle">
                {v}
              </text>
              <text x="78" y={py(v) + 6} textAnchor="end">
                {v}
              </text>
            </g>
          ))}
          <path
            d="M95 255H440M260 420V78"
            fill="none"
            stroke="var(--ui-muted)"
          />
          <text x="445" y="262">
            x
          </text>
          <text x="270" y="84">
            y
          </text>
          {trace && (
            <>
              <path
                d={path(reference.map((q) => [px(q.x), py(q.y)]))}
                fill="none"
                stroke="var(--ui-muted)"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />
              <path
                data-testid="drawn-trajectory"
                d={path(
                  [...reference.slice(0, Math.floor(time * 60) + 1), point].map(
                    (q) => [px(q.x), py(q.y)],
                  ),
                )}
                fill="none"
                stroke="var(--ui-gold)"
                strokeWidth="3"
              />
            </>
          )}
          {guides && (
            <>
              <path
                d={`M${px(point.x)} 255V${py(point.y)}H260`}
                fill="none"
                stroke="var(--ui-primary)"
                strokeDasharray="6 4"
              />
              <circle
                cx={px(point.x)}
                cy="255"
                r="5"
                fill="var(--ui-primary)"
              />
              <circle
                cx="260"
                cy={py(point.y)}
                r="5"
                fill="var(--ui-primary)"
              />
            </>
          )}
          <circle
            cx={px(point.x)}
            cy={py(point.y)}
            r="8"
            fill="var(--ui-gold)"
            stroke="var(--ui-ink)"
            strokeWidth="1.5"
          />
          <path d="M500 42V438" stroke="var(--ui-line)" />
          {[
            ["x", 145, "水平分量 x(t)"],
            ["y", 310, "竖直分量 y(t)"],
          ].map(([key, base, label]) => (
            <g key={key}>
              <text x="532" y={base - 70}>
                {label}
              </text>
              <path d={`M535 ${base}H850`} stroke="var(--ui-muted)" />
              <path
                d={path(
                  reference.map((q, i) => [
                    535 + (i / 360) * 310,
                    base - q[key] * 48,
                  ]),
                )}
                fill="none"
                stroke="var(--ui-primary)"
                strokeWidth="2"
              />
              <path
                d={`M${535 + (time / 6) * 310} ${base - 53}V${base + 53}`}
                stroke="var(--ui-gold)"
                strokeDasharray="3 4"
              />
              <circle
                cx={535 + (time / 6) * 310}
                cy={base - point[key] * 48}
                r="5"
                fill="var(--ui-gold)"
              />
              <text x="535" y={base + 78}>
                0
              </text>
              <text x="840" y={base + 78} textAnchor="end">
                6 s
              </text>
            </g>
          ))}
          <text x="535" y="439">
            频率比 {p.fx} : {p.fy}　相位差 {p.phase}°
          </text>
        </>
      ) : (
        <>
          {[
            ["right", 110, "① 向右传播 →"],
            ["left", 230, "② ← 向左传播"],
            ["y", 365, "③ 两波叠加 = 弦的位移"],
          ].map(([key, base, label]) => (
            <g key={key}>
              <text x="42" y={base - 49}>
                {label}
              </text>
              <path d={`M55 ${base}H845`} stroke="var(--ui-line)" />
              {key === "y" && guides && (
                <>
                  <path
                    d={wave("envelope", base)}
                    fill="none"
                    stroke="var(--ui-muted)"
                    strokeDasharray="5 5"
                  />
                  <path
                    d={path(
                      Array.from({ length: 181 }, (_, i) => [
                        55 + (790 * i) / 180,
                        base +
                          standingState(p, time, i / 180).envelope *
                            displacementScale,
                      ]),
                    )}
                    fill="none"
                    stroke="var(--ui-muted)"
                    strokeDasharray="5 5"
                  />
                </>
              )}
              <path
                d={wave(key, base)}
                fill="none"
                stroke={key === "y" ? "var(--ui-gold)" : "var(--ui-primary)"}
                strokeWidth={key === "y" ? 4 : 2}
              />
              <circle
                cx={55 + (790 * p.probe) / 100}
                cy={base - q[key] * displacementScale}
                r="5"
                fill="var(--ui-gold)"
              />
              <text x="835" y={base - 49} textAnchor="end">
                {q[key].toFixed(2)} mm
              </text>
            </g>
          ))}
          <path
            d={`M${55 + (790 * p.probe) / 100} 75V420`}
            stroke="var(--ui-gold)"
            strokeDasharray="4 5"
          />
          {[55, 845].map((x) => (
            <g key={x}>
              <rect
                x={x - 7}
                y="342"
                width="14"
                height="46"
                rx="3"
                fill="var(--ui-muted)"
              />
              <circle cx={x} cy="365" r="5" fill="var(--ui-ink)" />
            </g>
          ))}
          {guides &&
            Array.from({ length: p.mode + 1 }, (_, i) => (
              <g key={i}>
                <circle
                  cx={55 + (790 * i) / p.mode}
                  cy="365"
                  r="5"
                  fill="var(--ui-paper)"
                  stroke="var(--ui-ink)"
                  strokeWidth="2"
                />
                <text x={55 + (790 * i) / p.mode} y="431" textAnchor="middle">
                  {(i / p.mode).toFixed(2)}
                </text>
              </g>
            ))}
          <text x="42" y="453">
            x / m · 空心点为波节 · 位移纵向放大 4 倍
          </text>
          <text x="850" y="453" textAnchor="end">
            物理时间 {(time / 60).toFixed(3)} s
          </text>
        </>
      )}
    </svg>
  );
}
