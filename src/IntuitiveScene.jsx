import SquareDimensions from "./SquareDimensions.jsx";
import { squareDissection } from "./squareDissection.mjs";
import RippleAmplitudeField from "./RippleAmplitudeField.jsx";
import React, { useId, useMemo } from "react";
import { squareDifference, rippleState } from "./intuitiveLessons.mjs";
import "./ObservableScene.css";
const ink = "var(--ui-ink)",
  primary = "var(--ui-primary)",
  gold = "var(--ui-gold)",
  muted = "var(--ui-muted)",
  line = "var(--ui-line)";
export default function IntuitiveScene({
  id,
  p,
  time,
  guides = true,
  showField = true,
}) {
  const uid = useId().replace(/:/g, "");
  const wavePaths = useMemo(() => {
    if (id !== "ripple-interference") return [];
    const period = p.wavelength / 20;
    return [0, 1, 2].map((j) =>
      Array.from({ length: 121 }, (_, i) => {
        const z = rippleState(p, (i * 2 * period) / 120);
        return `${i ? "L" : "M"}${80 + i * 4.6},${500 - [z.A, z.B, z.total][j] * 30}`;
      }).join(" "),
    );
  }, [id, p.separation, p.wavelength, p.phase, p.probeX, p.probeY]);
  if (id === "square-difference") {
    const q = squareDifference(p),
      { a, b, h, cx, cy, angle } = squareDissection(p, time);
    return (
      <svg
        className="motion-diagram observable-scene"
        viewBox="0 0 900 620"
        role="img"
        aria-label="平方差两块面积旋转拼接"
      >
        <text x="35" y="44" className="observable-title">
          同一块面积，两种算法
        </text>
        <text x="35" y="82">
          {p.a}² − {p.b}² = {q.area}　·　移动和旋转都不改变面积
        </text>
        <g transform="translate(85 150)">
          {guides && (
            <>
              <rect
                width={a}
                height={a}
                fill="none"
                stroke={muted}
                strokeDasharray="6 5"
              />
              <rect
                x={h}
                width={b}
                height={b}
                fill="none"
                stroke={muted}
                strokeDasharray="6 5"
              />
              {time <= 1 && (
                <text x={h + b / 2} y={b / 2 + 7} textAnchor="middle">
                  −{p.b}²
                </text>
              )}
            </>
          )}
          <rect
            y={b}
            width={a}
            height={h}
            fill={gold}
            fillOpacity=".25"
            stroke={gold}
            strokeWidth="2"
          />
          <text x={a / 2} y={b + h / 2 + 7} textAnchor="middle">
            {p.a} × {q.height}
          </text>
          <g
            data-testid="moving-area"
            transform={`translate(${cx} ${cy}) rotate(${angle})`}
          >
            <rect
              x={-h / 2}
              y={-b / 2}
              width={h}
              height={b}
              fill={primary}
              fillOpacity=".3"
              stroke={primary}
              strokeWidth="2"
            />
            <path
              d={`M${-h / 2 + 6} ${-b / 2 + 6}h12v12`}
              fill="none"
              stroke={primary}
              strokeWidth="2"
            />
            <text textAnchor="middle" y="7" transform={`rotate(${-angle})`}>
              {q.green}
            </text>
          </g>
          {guides && (
            <SquareDimensions p={p} a={a} b={b} h={h} finished={time >= 6} />
          )}
        </g>
        <text x="710" y="190">
          面积账本
        </text>
        <path d="M710 210H875" stroke={line} />
        <text x="710" y="255" fill={gold}>
          a(a−b) = {q.gold}
        </text>
        <text x="710" y="300" fill={primary}>
          b(a−b) = {q.green}
        </text>
        <text x="710" y="360" className="observable-number">
          合计 {q.area}
        </text>
        <text x="35" y="565">
          {time < 1
            ? "观察：大正方形减去右上角小正方形。"
            : time < 2.5
              ? "分离：上方条带平移到外侧。"
              : time < 4
                ? "旋转：条带转过90°，面积不变。"
                : time < 6
                  ? "拼接：条带向右下方归位。"
                  : `验证：(${p.a}+${p.b}) × (${p.a}−${p.b}) = ${q.area}`}
        </text>
        <text x="35" y="604">
          金色与绿色表示两块原有面积；虚线是剪拼前的位置。
        </text>
      </svg>
    );
  }
  const q = rippleState(p, time),
    sx = (x) => 350 + x * 9,
    sy = (y) => 260 - y * 9,
    colors = [primary, gold],
    probe = [sx(p.probeX), sy(p.probeY)];
  return (
    <svg
      className="motion-diagram observable-scene"
      viewBox="0 0 900 620"
      role="img"
      aria-label="双源圆形波峰与观察点振动叠加"
    >
      <defs>
        <clipPath id={uid}>
          <rect x="65" y="115" width="570" height="280" rx="8" />
        </clipPath>
      </defs>
      <text x="35" y="44" className="observable-title">
        波向外传播，观察点上下振动
      </text>
      <text x="35" y="82">
        绿色：波源 A　金色：波源 B　圆环表示波峰，不表示合成高度
      </text>
      <rect
        x="65"
        y="115"
        width="570"
        height="280"
        rx="8"
        fill={primary}
        fillOpacity=".035"
        stroke={line}
      />
      <g clipPath={`url(#${uid})`}>
        {showField && (
          <RippleAmplitudeField
            separation={p.separation}
            wavelength={p.wavelength}
            phase={p.phase}
          />
        )}
        {guides && (
          <>
            <path
              d="M65 260H635M350 115V395"
              stroke={muted}
              strokeDasharray="4 5"
            />
            <path
              d={`M${sx(-p.separation / 2)} 260L${probe}L${sx(p.separation / 2)} 260`}
              fill="none"
              stroke={muted}
              strokeDasharray="6 4"
            />
          </>
        )}
        {[0, 1].map((j) => {
          const x = sx(((j ? 1 : -1) * p.separation) / 2),
            offset =
              (20 * time) / p.wavelength + (j ? p.phase / 360 : 0) - 0.25,
            phase = ((offset % 1) + 1) % 1;
          return (
            <g key={j}>
              {Array.from({ length: 10 }, (_, i) => (
                <circle
                  key={i}
                  cx={x}
                  cy="260"
                  r={(i + phase) * p.wavelength * 9}
                  fill="none"
                  stroke={colors[j]}
                  strokeWidth="1.5"
                  opacity=".4"
                />
              ))}
              <circle cx={x} cy="260" r="7" fill={colors[j]} />
              <text x={x} y="292" textAnchor="middle">
                {j ? "B" : "A"}
              </text>
            </g>
          );
        })}
        <circle
          cx={probe[0]}
          cy={probe[1]}
          r="8"
          fill="var(--ui-paper)"
          stroke={ink}
          strokeWidth="2"
        />
        <text x={probe[0] + 12} y={probe[1] - 12}>
          P
        </text>
      </g>
      <text x="670" y="140">
        观察点 P
      </text>
      <text x="670" y="177">
        rA = {q.rA.toFixed(1)} cm
      </text>
      <text x="670" y="210">
        rB = {q.rB.toFixed(1)} cm
      </text>
      <path d="M690 302H850M770 238V370" stroke={line} />
      <circle cx="770" cy={302 - q.total * 27} r="10" fill={primary} />
      <text x="710" y="397">
        {q.amplitude < 0.001
          ? "抵消 · 合振幅为 0"
          : q.amplitude > 1.999
            ? "加强 · 合振幅为 2"
            : `部分叠加 · 振幅 ${q.amplitude.toFixed(2)}`}
      </text>
      <text x="65" y="430">
        P 点的两个分量与合成振动（两个周期）
      </text>
      <path d="M80 500H632" stroke={muted} />
      <text x="47" y="446">
        2
      </text>
      <text x="47" y="506">
        0
      </text>
      <text x="37" y="566">
        −2
      </text>
      {wavePaths.map((d, j) => (
        <path
          key={j}
          d={d}
          fill="none"
          stroke={[primary, gold, ink][j]}
          strokeWidth={j === 2 ? 3 : 1.6}
          strokeDasharray={j === 1 ? "6 4" : undefined}
          opacity={j === 2 ? 1 : 0.65}
        />
      ))}
      <line
        x1={80 + ((time % (2 * q.period)) / (2 * q.period)) * 552}
        x2={80 + ((time % (2 * q.period)) / (2 * q.period)) * 552}
        y1="440"
        y2="560"
        stroke={primary}
        strokeDasharray="3 4"
      />
      <text x="80" y="583">
        0 s
      </text>
      <text x="570" y="583">
        {(2 * q.period).toFixed(2)} s
      </text>
      <text x="670" y="465">
        实线：A 分量
      </text>
      <text x="670" y="502">
        虚线：B 分量
      </text>
      <text x="670" y="539">
        粗线：A+B
      </text>
      <text x="35" y="611">
        {showField
          ? "底色越显著，合振幅越大（0—2）；底色不是瞬时位移。"
          : "理想稳态：忽略衰减和反射；振幅以单源为1。"}
      </text>
    </svg>
  );
}
