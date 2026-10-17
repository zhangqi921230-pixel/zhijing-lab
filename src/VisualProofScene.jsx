import React, { useId } from "react";
import PythagorasDissection from "./PythagorasDissection.jsx";
import {
  squareAreas,
  mirrorRay,
  mirrorReference,
} from "./visualProofModels.mjs";

const ink = "var(--ui-ink)",
  teal = "var(--ui-primary)",
  gold = "var(--ui-gold)",
  muted = "var(--ui-muted)";
const clamp = (n) => Math.max(0, Math.min(1, n));
export default function VisualProofScene({
  id,
  p,
  time,
  guides = true,
  chapter = 0,
  trace = true,
}) {
  const uid = useId().replace(/:/g, "");
  const prefix = `proof-${uid}`;
  if (id === "pythagoras-proof" && chapter === 5)
    return <PythagorasDissection p={p} time={time} guides={guides} />;
  const q = id === "pythagoras-proof" ? squareAreas(p) : mirrorRay(p);
  const s =
      id === "pythagoras-proof"
        ? chapter === 4
          ? 320 / (p.a + p.b)
          : Math.min(540 / (p.a + 2 * p.b), 350 / (2 * p.a + p.b))
        : 22,
    a = p.a * s,
    b = p.b * s;
  const progress = clamp(time / 6);
  const mx = 450,
    toY = (h) => 470 - h * 52;
  const O = [mx - p.distance * 52, toY(p.objectHeight)],
    E = [mx - p.eyeDistance * 52, toY(p.eyeHeight)],
    R = [mx, toY(q.height)],
    I = [mx + p.distance * 52, toY(p.objectHeight)];
  const ref = id === "plane-mirror" ? mirrorReference(p) : null;
  const RE = ref ? [mx - ref.eyeDistance * 52, toY(ref.eyeHeight)] : [0, 0];
  const RR = ref ? [mx, toY(ref.height)] : [0, 0];
  const first = Math.hypot(R[0] - O[0], R[1] - O[1]),
    second = Math.hypot(E[0] - R[0], E[1] - R[1]);
  const travelled = progress * (first + second),
    onFirst = travelled <= first;
  const fraction = onFirst ? travelled / first : (travelled - first) / second;
  const start = onFirst ? O : R,
    end = onFirst ? R : E;
  return (
    <svg
      className="motion-diagram visual-proof-diagram"
      viewBox="0 0 900 620"
      role="img"
      aria-label={
        id === "pythagoras-proof"
          ? chapter === 4
            ? "四个全等直角三角形围出斜边正方形的面积证明"
            : "三边正方形与勾股面积对照"
          : "物点、平面镜、虚像和到达观察者的反射光路"
      }
      style={{
        width: "100%",
        display: "block",
        fill: ink,
        fontFamily: '"Microsoft YaHei", sans-serif',
        fontSize: 17,
      }}
    >
      <defs>
        <pattern
          id={`${prefix}-grid`}
          width={s}
          height={s}
          patternUnits="userSpaceOnUse"
        >
          <path
            d={`M${s} 0H0V${s}`}
            fill="none"
            stroke={muted}
            strokeOpacity=".35"
            strokeWidth=".7"
          />
        </pattern>
        <linearGradient id={`${prefix}-mirror`}>
          <stop stopColor={teal} stopOpacity=".5" />
          <stop offset=".5" stopColor="var(--ui-surface)" />
          <stop offset="1" stopColor={muted} />
        </linearGradient>
        <marker
          id={`${prefix}-arrow`}
          markerWidth="8"
          markerHeight="8"
          refX="6"
          refY="3"
          orient="auto"
        >
          <path d="M0 0L6 3L0 6" fill="none" stroke={gold} />
        </marker>
      </defs>
      <rect width="900" height="620" fill="var(--ui-paper)" />
      <text x="32" y="35" fill={muted}>
        {id === "pythagoras-proof"
          ? "AREA / 面积与证明"
          : "OPTICS / 反射与虚像"}
      </text>
      {id === "pythagoras-proof" ? (
        chapter === 4 ? (
          <>
            <g transform="translate(290 70)">
              <rect
                width={a + b}
                height={a + b}
                fill={gold}
                fillOpacity={0.08 + 0.2 * progress}
                stroke={gold}
                strokeWidth="3"
              />
              {[
                `0,0 ${a},0 0,${b}`,
                `${a},0 ${a + b},0 ${a + b},${a}`,
                `${a + b},${a} ${a + b},${a + b} ${b},${a + b}`,
                `${b},${a + b} 0,${a + b} 0,${b}`,
              ].map((points, i) => (
                <polygon
                  key={i}
                  points={points}
                  fill={teal}
                  fillOpacity={i < Math.floor(time / 1.5) ? 0.28 : 0.06}
                  stroke={teal}
                  strokeWidth="2"
                />
              ))}
              {guides && (
                <path
                  d={`M0 14H14V0 M${a + b - 14} 0V14H${a + b} M${a + b} ${a + b - 14}H${a + b - 14}V${a + b} M14 ${a + b}V${a + b - 14}H0`}
                  fill="none"
                  stroke={ink}
                />
              )}
              <text
                x={(a + b) / 2}
                y={(a + b) / 2}
                textAnchor="middle"
                fontSize="28"
              >
                c²
              </text>
              <text x={(a + b) / 2} y={a + b + 34} textAnchor="middle">
                边长 a+b = {p.a + p.b}
              </text>
              <text x={a / 3} y={b / 3 + 8} textAnchor="middle">
                ab/2
              </text>
            </g>
            <text x="450" y="445" textAnchor="middle" fontSize="24">
              外框面积 − 四个三角形面积 = 中央正方形面积
            </text>
            <text x="450" y="495" textAnchor="middle" fontSize="27" fill={gold}>
              {q.outer.toFixed(2)} − {q.triangles.toFixed(2)} ={" "}
              {(q.a2 + q.b2).toFixed(2)}
            </text>
            <text x="450" y="549" textAnchor="middle">
              中央每个角为 180° − (α+β) = 90°
            </text>
            <text x="450" y="582" textAnchor="middle" fill={muted}>
              四条边都是同一个直角三角形的斜边 c。
            </text>
          </>
        ) : (
          <>
            <g transform={`translate(${450 - (a - b) / 2} ${90 + a + b})`}>
              <rect
                x="0"
                y="0"
                width={a}
                height={a}
                fill={teal}
                fillOpacity=".18"
                stroke={teal}
                strokeWidth="2"
              />
              <rect
                x={-b}
                y={-b}
                width={b}
                height={b}
                fill={gold}
                fillOpacity=".2"
                stroke={gold}
                strokeWidth="2"
              />
              {guides && (
                <>
                  <rect width={a} height={a} fill={`url(#${prefix}-grid)`} />
                  <rect
                    x={-b}
                    y={-b}
                    width={b}
                    height={b}
                    fill={`url(#${prefix}-grid)`}
                  />
                </>
              )}
              <g
                transform={`matrix(${-p.a / q.c} ${-p.b / q.c} ${p.b / q.c} ${-p.a / q.c} ${a} 0)`}
              >
                <rect
                  width={q.c * s}
                  height={q.c * s}
                  fill="var(--ui-surface)"
                  stroke={ink}
                  strokeWidth="2"
                />
                <rect
                  width={(q.a2 / q.c) * s}
                  height={q.c * s * clamp(time / 3)}
                  fill={teal}
                  fillOpacity=".4"
                />
                <rect
                  x={(q.a2 / q.c) * s}
                  width={(q.b2 / q.c) * s}
                  height={q.c * s * clamp((time - 3) / 3)}
                  fill={gold}
                  fillOpacity=".45"
                />
                {guides && (
                  <rect
                    width={q.c * s}
                    height={q.c * s}
                    fill={`url(#${prefix}-grid)`}
                  />
                )}
              </g>
              <path
                d={`M0 0H${a}L0 ${-b}Z`}
                fill="var(--ui-surface)"
                stroke={ink}
                strokeWidth="2.5"
              />
              <path d="M0 -14H14V0" fill="none" stroke={ink} />
              <text x={a / 2} y="-10" textAnchor="middle">
                a
              </text>
              <text x="12" y={-b / 2}>
                b
              </text>
              <text x={(a + b) / 2} y={-(a + b) / 2} textAnchor="middle">
                c = {q.c.toFixed(2)}
              </text>
              <text x={a / 2} y={a + 30} textAnchor="middle">
                a² = {q.a2.toFixed(2)}
              </text>
              <text x={-b / 2} y="32" textAnchor="middle">
                b² = {q.b2.toFixed(2)}
              </text>
            </g>
            <text x="450" y="544" textAnchor="middle" fontSize="26">
              {q.a2.toFixed(2)} + {q.b2.toFixed(2)} = {(q.a2 + q.b2).toFixed(2)}
            </text>
            <text x="450" y="584" textAnchor="middle" fill={muted}>
              两色表示面积对应；视野自动适配，格线每格边长为 1。
            </text>
          </>
        )
      ) : (
        <>
          <rect
            x="458"
            y="68"
            width="390"
            height="430"
            fill={teal}
            fillOpacity=".035"
          />
          <text x="655" y="85" textAnchor="middle" fill={muted}>
            镜后 · 虚像空间
          </text>
          <rect
            x="450"
            y="94"
            width="8"
            height="387"
            fill={`url(#${prefix}-mirror)`}
            stroke={muted}
          />
          {Array.from({ length: 18 }, (_, i) => (
            <path
              key={i}
              d={`M458 ${104 + i * 20}l9 -9`}
              stroke={muted}
              opacity=".5"
            />
          ))}
          <text x="455" y="517" textAnchor="middle">
            平面镜
          </text>
          {guides && (
            <>
              {trace && (
                <g>
                  <path
                    d={`M${O[0]} ${O[1]}H${I[0]}`}
                    stroke={teal}
                    strokeDasharray="5 5"
                    fill="none"
                  />
                  <text x={(O[0] + mx) / 2} y={O[1] + 28} textAnchor="middle">
                    {p.distance} cm
                  </text>
                  <text x={(I[0] + mx) / 2} y={I[1] + 28} textAnchor="middle">
                    {p.distance} cm
                  </text>
                </g>
              )}
              <path
                d={`M330 ${R[1]}H545`}
                stroke={muted}
                strokeDasharray="5 5"
              />
              <text x="500" y={R[1] - 12} fill={muted}>
                法线
              </text>
              {[O, E].map((point, i) => {
                const angle = Math.atan2(point[1] - R[1], point[0] - R[0]);
                const endAngle = angle < 0 ? -Math.PI : Math.PI;
                const angles = Array.from(
                  { length: 17 },
                  (_, j) => endAngle + ((angle - endAngle) * j) / 16,
                );
                return (
                  <path
                    key={i}
                    d={angles
                      .map(
                        (v, j) =>
                          `${j ? "L" : "M"}${mx + 44 * Math.cos(v)} ${R[1] + 44 * Math.sin(v)}`,
                      )
                      .join(" ")}
                    fill="none"
                    stroke={i ? teal : gold}
                    strokeWidth="2.5"
                  />
                );
              })}
            </>
          )}
          {trace && (
            <path
              d={`M${R.join(" ")}L${I.join(" ")}`}
              fill="none"
              stroke={teal}
              strokeWidth="2"
              strokeDasharray="7 6"
            />
          )}
          {chapter === 5 && (
            <g data-testid="mirror-reference">
              <path
                d={`M${O.join(" ")}L${RR.join(" ")}L${RE.join(" ")}`}
                fill="none"
                stroke={teal}
                strokeWidth="2.5"
              />
              {trace && (
                <path
                  d={`M${RR.join(" ")}L${I.join(" ")}`}
                  fill="none"
                  stroke={teal}
                  strokeDasharray="7 6"
                  strokeWidth="2"
                />
              )}
              <circle cx={RE[0]} cy={RE[1]} r="8" fill={teal} />
              <text x={RE[0] + 12} y={RE[1] - 20}>
                参考观察者 · 固定
              </text>
              <circle cx={RR[0]} cy={RR[1]} r="4" fill={teal} />
            </g>
          )}
          <path
            d={`M${O.join(" ")}L${R.join(" ")}L${E.join(" ")}`}
            fill="none"
            stroke={gold}
            strokeWidth="3"
            markerEnd={`url(#${prefix}-arrow)`}
          />
          {[
            { v: O, name: "物点", color: gold },
            { v: E, name: "观察者", color: teal },
            { v: I, name: "虚像", color: teal },
          ]
            .filter(({ name }) => trace || name !== "虚像")
            .map(({ v, name, color }) => (
              <g key={name}>
                <circle
                  cx={v[0]}
                  cy={v[1]}
                  r="9"
                  fill={name === "虚像" ? "var(--ui-paper)" : color}
                  stroke={color}
                  strokeWidth="2"
                  strokeDasharray={name === "虚像" ? "3 3" : undefined}
                />
                <text x={v[0]} y={v[1] - 20} textAnchor="middle">
                  {name}
                </text>
              </g>
            ))}
          <circle
            cx={start[0] + (end[0] - start[0]) * fraction}
            cy={start[1] + (end[1] - start[1]) * fraction}
            r="5"
            fill="var(--ui-surface)"
            stroke={gold}
            strokeWidth="3"
          />
          <circle cx={R[0]} cy={R[1]} r="4" fill={gold} />
          <text x="450" y="556" textAnchor="middle">
            实线：物点 → 镜面 → 眼睛　　虚线：反向延长与辅助测量
          </text>
          <text x="450" y="590" textAnchor="middle" fill={muted}>
            {chapter === 5
              ? ref.coincident
                ? "两条光路重合：改变观察者高度，再用交点定位。"
                : trace
                  ? "两条反向延长线相交于同一个虚像点。"
                  : "延长线已隐藏：预测两条反射光路在镜后的交点。"
              : "光不经过虚像；移动观察者不会改变固定物点的像。"}
          </text>
        </>
      )}
    </svg>
  );
}
