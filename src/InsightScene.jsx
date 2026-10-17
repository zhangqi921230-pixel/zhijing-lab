import React, { useId } from "react";
import {
  triangleAngles,
  communicatingState,
  triangleAngleRadius,
} from "./insightModels.mjs";
const palette = ["#ca8830", "#3589ac", "#a16bc2"];
function wedge(x, y, r, start, end) {
  return `M${x} ${y} L${x + r * Math.cos(start)} ${y + r * Math.sin(start)} A${r} ${r} 0 0 1 ${x + r * Math.cos(end)} ${y + r * Math.sin(end)} Z`;
}
export default function InsightScene({ id, p, time, guides = true }) {
  const uid = useId().replace(/:/g, "");
  const math = id === "triangle-angles",
    q = math ? triangleAngles(p) : communicatingState(p, time);
  const t = Math.max(0, Math.min(1, time / 6)),
    f = t * t * (3 - 2 * t);
  const ink = "var(--ui-ink)",
    muted = "var(--ui-muted)",
    line = "var(--ui-line)";
  const scale = 38,
    ax = 200,
    ay = 290,
    bx = ax + p.base * scale,
    cx = ax + p.offset * scale,
    cy = ay - p.height * scale;
  const angleRadius = math ? triangleAngleRadius(p, scale, 64) : 0;
  const leftY = 430 - q.left * 10,
    rightY = 430 - q.right * 10,
    rw = 48 * p.ratio;
  return (
    <svg
      className="motion-diagram"
      viewBox="0 0 900 600"
      role="img"
      aria-label={
        math
          ? "三角形三个内角搬运汇成平角与外角对照"
          : "连通器中守恒的液面变化与流动方向"
      }
      style={{
        width: "100%",
        display: "block",
        fill: ink,
        fontFamily: "Microsoft YaHei, sans-serif",
        fontSize: 18,
      }}
    >
      <defs>
        <linearGradient id={`water-${uid}`} x2="0" y2="1">
          <stop stopColor="#69c7dd" stopOpacity=".55" />
          <stop offset="1" stopColor="#2284a5" stopOpacity=".85" />
        </linearGradient>
      </defs>
      {math ? (
        <>
          <text x="40" y="42">
            三个角 · 同一平角
          </text>
          <text x="40" y="74" fill={muted}>
            彩色角片保持原角度；拖动进度观察平移和旋转
          </text>
          <path
            d={`M${ax} ${ay}L${bx} ${ay}L${cx} ${cy}Z`}
            fill="var(--ui-primary)"
            fillOpacity=".08"
            stroke={ink}
            strokeWidth="2"
          />
          <text x={ax - 25} y={ay + 26}>
            A
          </text>
          <text x={bx + 7} y={ay + 26}>
            B
          </text>
          <text x={cx - 7} y={cy - 20}>
            C
          </text>
          {guides && (
            <>
              <path
                d={`M${bx} ${ay}h100`}
                stroke={muted}
                strokeDasharray="6 5"
              />
              <path
                d={wedge(bx, ay, 47, -Math.PI + q.b, 0)}
                fill="none"
                stroke={muted}
              />
              <text x="640" y="158">
                B 点外角
              </text>
              <text x="640" y="192">
                {((q.exterior * 180) / Math.PI).toFixed(1)}° = A + C
              </text>
            </>
          )}
          <path d="M280 490H620" stroke={ink} strokeWidth="2" />
          <text x="320" y="544">
            A + B + C = 180°
          </text>
          {[
            [ax, ay, -q.a, q.a, -Math.PI],
            [bx, ay, -Math.PI, q.b, -q.b],
            [cx, cy, q.b, q.c, -Math.PI + q.a],
          ].map(([x, y, start, angle, target], i) => {
            const px = x + (450 - x) * f,
              py = y + (490 - y) * f,
              a = start + (target - start) * f;
            return (
              <g key={i}>
                {guides && (
                  <path
                    d={wedge(x, y, angleRadius, start, start + angle)}
                    fill={palette[i]}
                    fillOpacity=".08"
                    stroke={palette[i]}
                    strokeDasharray="4 4"
                    strokeWidth="1.5"
                  />
                )}
                <path
                  d={wedge(px, py, angleRadius, a, a + angle)}
                  fill={palette[i]}
                  fillOpacity=".7"
                  stroke={palette[i]}
                  strokeWidth="2"
                />
                <text
                  x={px + 87 * Math.cos(a + angle / 2)}
                  y={py + 87 * Math.sin(a + angle / 2) + 6}
                  textAnchor="middle"
                  fill={ink}
                >
                  {["A", "B", "C"][i]}
                </text>
              </g>
            );
          })}
          <text x="40" y="582" fill={muted}>
            角度读数四舍五入；总和按未舍入角度计算
          </text>
        </>
      ) : (
        <>
          <text x="40" y="42">
            开口连通器 · 同种液体
          </text>
          <text x="40" y="74" fill={muted}>
            两端均为大气压；连接管流向标记不代表实际流速
          </text>
          <path
            d={`M200 ${leftY}H248V430H530V${rightY}H${530 + rw}V470H200Z`}
            fill={`url(#water-${uid})`}
          />
          {guides &&
            [
              [200, 48, p.left, q.left],
              [530, rw, p.right, q.right],
            ].map(([x, w, initial, current], i) => (
              <g
                key={i}
                aria-label={`${i === 0 ? "左" : "右"}管初始与当前液面区间`}
              >
                <rect
                  x={x}
                  y={430 - Math.max(initial, current) * 10}
                  width={w}
                  height={Math.abs(initial - current) * 10}
                  fill="var(--ui-gold)"
                  fillOpacity=".22"
                  stroke="var(--ui-gold)"
                  strokeWidth="1"
                />
                <path
                  d={`M${x - 6} ${430 - initial * 10}h${w + 12}`}
                  stroke="var(--ui-gold)"
                  strokeWidth="2"
                  strokeDasharray="3 3"
                />
              </g>
            ))}
          <path
            d={`M200 115V470H${530 + rw}V115M248 115V430H530V115`}
            fill="none"
            stroke={muted}
            strokeWidth="4"
          />
          <path
            d={`M207 120V462M${523 + rw} 120V462`}
            stroke="var(--ui-surface)"
            strokeWidth="3"
            opacity=".6"
          />
          <path
            d={`M201 ${leftY}H247M531 ${rightY}H${529 + rw}`}
            stroke="#3184a7"
            strokeWidth="3"
          />
          <text x="190" y="102">
            左管 A₁
          </text>
          <text x="530" y="102">
            右管 A₂ = {p.ratio} A₁
          </text>
          <text x="65" y={leftY + 5}>
            {q.left.toFixed(1)} cm
          </text>
          <text x={545 + rw} y={rightY + 5}>
            {q.right.toFixed(1)} cm
          </text>
          {guides && (
            <>
              <path
                d={`M160 ${430 - q.equilibrium * 10}H790`}
                stroke={ink}
                strokeDasharray="7 6"
              />
              <text x="590" y="514">
                长虚线：最终共同液面
              </text>
              {[0, 5, 10, 15, 20, 25, 30].map((h) => (
                <g key={h}>
                  <path d={`M175 ${430 - h * 10}h15`} stroke={muted} />
                  <text
                    x="155"
                    y={436 - h * 10}
                    textAnchor="end"
                    fill={muted}
                    fontSize="15"
                  >
                    {h}
                  </text>
                </g>
              ))}
            </>
          )}
          {q.direction !== 0 &&
            t < 1 &&
            Array.from({ length: 5 }, (_, i) => {
              const phase = (((i / 5 + time * 0.18 * q.direction) % 1) + 1) % 1;
              const x = 275 + phase * 235;
              return (
                <path
                  key={i}
                  d={`M${x - q.direction * 8} 442l${q.direction * 8} 8l${-q.direction * 8} 8`}
                  fill="none"
                  stroke="var(--ui-ink)"
                  strokeWidth="2"
                />
              );
            })}
          <text x="40" y="546">
            底部压强差：{q.pressure.toFixed(1)} Pa
          </text>
          <text x="460" y="546">
            {Math.abs(q.pressure) < 0.001
              ? "液面等高 · 无净流动"
              : q.direction > 0
                ? "流动方向：左 → 右"
                : "流动方向：右 → 左"}
          </text>
          <text x="40" y="582" fill={muted}>
            高度共用比例；6 秒为示意时长，非真实水流仿真
          </text>
        </>
      )}
    </svg>
  );
}
