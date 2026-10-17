import React, { useId } from "react";
import { similarState, polarizationState } from "./comparisonLessons.mjs";
import "./ObservableScene.css";
import "./ComparisonScene.css";
const ink = "var(--ui-ink)",
  line = "var(--ui-line)",
  gold = "var(--ui-gold)",
  green = "var(--ui-primary)",
  muted = "var(--ui-muted)";
export default function ComparisonScene({ id, p, time, guides = true }) {
  const uid = useId().replace(/:/g, "");
  if (id === "similar-area") {
    const q = similarState(p, time);
    const shape = (x, k, color) => {
      const w = 120 * k,
        h = 80 * k;
      return (
        <g>
          <path
            d={
              p.shape
                ? `M${x} 400h${w}L${x} ${400 - h}Z`
                : `M${x} 400h${w}v${-h}h${-w}Z`
            }
            fill={color}
            fillOpacity=".14"
            stroke={color}
            strokeWidth="3"
          />
          <text x={x + w / 2} y="434" textAnchor="middle">
            {(3 * k).toFixed(2)} cm
          </text>
          <text x={x + w + 10} y={400 - h / 2}>
            {(2 * k).toFixed(2)}
          </text>
        </g>
      );
    };
    return (
      <svg
        className="motion-diagram observable-scene comparison-scene"
        viewBox="0 0 900 620"
        role="img"
        aria-label="相似图形的长度与面积同尺度对照"
      >
        <defs>
          <pattern
            id={uid + "grid"}
            x="100"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <path d="M40 0H0V40" fill="none" stroke={line} />
          </pattern>
        </defs>
        <text x="35" y="44" className="observable-title">
          长度变为 k 倍，面积变为 k² 倍
        </text>
        <text x="35" y="80">
          当前 k = {q.k.toFixed(2)}　·　目标 {p.scale.toFixed(1)} 倍
        </text>
        {guides && (
          <rect
            x="60"
            y="120"
            width="780"
            height="280"
            fill={`url(#${uid}grid)`}
          />
        )}
        <text x="100" y="130">
          原图
        </text>
        <text x="460" y="130">
          相似图
        </text>
        {shape(100, 1, green)}
        {shape(460, q.k, gold)}
        <text x="100" y="480">
          面积 {q.baseArea.toFixed(2)} cm²
        </text>
        <text x="460" y="480">
          面积 {q.area.toFixed(2)} cm²
        </text>
        <text x="100" y="518">
          周长 {q.basePerimeter.toFixed(2)} cm
        </text>
        <text x="460" y="518">
          周长 {q.perimeter.toFixed(2)} cm
        </text>
        <text x="35" y="573">
          每格边长 1 cm；两图采用相同尺度，右侧高度数字单位为 cm。
        </text>
      </svg>
    );
  }
  const q = polarizationState(p),
    a = p.insert ? p.middle : 0;
  const filters = [
    { x: 240, angle: 0, name: "起偏片", active: true },
    { x: 450, angle: p.middle, name: "中间片", active: !!p.insert },
    { x: 660, angle: p.angle, name: "检偏片", active: true },
  ];
  const levels = [1, q.first, q.middle, q.output];
  return (
    <svg
      className="motion-diagram observable-scene comparison-scene"
      viewBox="0 0 900 620"
      role="img"
      aria-label="三片偏振片与逐级透射光强"
    >
      <text x="35" y="44" className="observable-title">
        旋转透振方向，比较透过的光
      </text>
      <text x="35" y="80">
        入射自然光 I₀ = 100%　·　最终 {(q.output * 100).toFixed(1)}%
      </text>
      {[80, 240, 450, 660].map((x, i) => (
        <g key={x}>
          <path
            d={`M${x} 245H${[240, 450, 660, 810][i]}`}
            stroke={line}
            strokeWidth="2"
          />
          {levels[i] > 0 && (
            <path
              d={`M${x} 245H${[240, 450, 660, 810][i]}`}
              stroke={gold}
              strokeWidth={3 + 12 * levels[i]}
              opacity={0.3 + 0.7 * levels[i]}
              strokeDasharray="12 8"
              strokeDashoffset={-time * 35}
            />
          )}
        </g>
      ))}
      <rect x="45" y="212" width="40" height="66" rx="8" fill={green} />
      <text x="35" y="330">
        自然光
      </text>
      {filters.map((f, i) => {
        const rad = (f.angle * Math.PI) / 180,
          dx = 60 * Math.sin(rad),
          dy = 60 * Math.cos(rad),
          amp =
            40 *
            Math.sqrt(levels[i + 1]) *
            Math.sin(time * Math.PI * 2 + Math.PI / 4);
        return (
          <g key={f.x}>
            <path
              d={`M${f.x} 315V363m-40 0h80`}
              stroke={muted}
              strokeWidth="5"
            />
            <circle
              cx={f.x}
              cy="245"
              r="73"
              fill="var(--ui-surface)"
              stroke={f.active ? ink : line}
              strokeWidth="8"
              strokeDasharray={f.active ? undefined : "7 7"}
            />
            {f.active && (
              <>
                <circle
                  cx={f.x}
                  cy="245"
                  r="63"
                  fill={gold}
                  fillOpacity=".06"
                />
                {guides && (
                  <path
                    d={`M${f.x - dx} ${245 + dy}L${f.x + dx} ${245 - dy}`}
                    stroke={muted}
                    strokeWidth="2"
                    strokeDasharray="5 4"
                  />
                )}
                <path
                  d={`M${f.x - amp * Math.sin(rad)} ${245 + amp * Math.cos(rad)}L${f.x + amp * Math.sin(rad)} ${245 - amp * Math.cos(rad)}`}
                  stroke={green}
                  strokeWidth="6"
                  strokeLinecap="round"
                />
                <circle cx={f.x} cy="245" r="3" fill={ink} />
              </>
            )}
            <text x={f.x} y="150" textAnchor="middle">
              {f.name} {f.active ? `${f.angle}°` : "已移出"}
            </text>
          </g>
        );
      })}
      <rect x="800" y="198" width="35" height="94" rx="5" fill={ink} />
      <rect
        x="805"
        y="205"
        width="25"
        height="80"
        rx="3"
        fill={gold}
        opacity={q.output * 2}
      />
      <text x="773" y="330">
        光屏
      </text>
      <text x="35" y="412">
        逐级平均光强 · 相对于入射自然光
      </text>
      {[
        "入射",
        "第一片后",
        p.insert ? "中间片后" : "中间片移出",
        "检偏片后",
      ].map((label, i) => (
        <g key={i} transform={`translate(${45 + i * 215},450)`}>
          <text>{label}</text>
          <rect y="18" width="160" height="16" fill={line} />
          <rect
            y="18"
            width={160 * levels[i]}
            height="16"
            fill={i === 3 ? gold : green}
          />
          <text y="64">{(levels[i] * 100).toFixed(1)}%</text>
        </g>
      ))}
      <text x="35" y="560">
        检偏片与入射偏振方向差：{Math.abs(p.angle - a)}°
      </text>
      <text x="35" y="593">
        绿色线段示意电场振动；虚线为透振轴；光强读数不随振动相位变化。
      </text>
    </svg>
  );
}
