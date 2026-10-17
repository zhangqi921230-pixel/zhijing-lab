import React from "react";
import { photo } from "./models.mjs";
export function photoFactorial(temp) {
  return [20, 80].flatMap((co2) =>
    [20, 80].map((light) => ({
      light,
      co2,
      temp,
      rate: photo({ light, co2, temp }),
    })),
  );
}
export default function PhotoFactorial({ p, onChange }) {
  const rows = photoFactorial(p.temp);
  return (
    <section className="photo-evidence" aria-label="光照与二氧化碳四组对照">
      <h3>同一温度下，四组条件一起看</h3>
      <p>
        固定温度 {p.temp}
        °C。四条柱使用相同的0—100%刻度；每组只计算模型总光合相对速率，不表示产氧量或实际测量。
      </p>
      <div className="photo-scan-controls" role="group" aria-label="只改变光照">
        {[20, 80].map((value) => (
          <button
            key={value}
            aria-pressed={p.light === value}
            onClick={() => onChange("light", value)}
          >
            光照设为 {value}%
          </button>
        ))}
      </div>
      <div
        className="photo-scan-controls"
        role="group"
        aria-label="只改变二氧化碳"
      >
        {[20, 80].map((value) => (
          <button
            key={value}
            aria-pressed={p.co2 === value}
            onClick={() => onChange("co2", value)}
          >
            CO₂ 设为 {value}%
          </button>
        ))}
      </div>
      <div
        tabIndex="0"
        role="region"
        aria-label="四组速率柱图，可横向滚动"
        style={{ overflowX: "auto" }}
      >
        <svg
          viewBox="0 0 740 340"
          role="img"
          aria-label="低高光照与低高二氧化碳的四组速率"
          style={{
            width: "100%",
            minWidth: 620,
            display: "block",
            fill: "var(--ui-ink)",
            fontSize: 18,
          }}
        >
          {[0, 25, 50, 75, 100].map((v) => (
            <g key={v}>
              <path d={`M${230 + v * 4} 30V285`} stroke="var(--ui-line)" />
              <text x={230 + v * 4} y="315" textAnchor="middle">
                {v}%
              </text>
            </g>
          ))}
          {rows.map((row, i) => (
            <g key={i}>
              <text x="12" y={65 + i * 65}>
                光 {row.light}% · CO₂ {row.co2}%
              </text>
              <rect
                x="230"
                y={44 + i * 65}
                width={row.rate * 4}
                height="28"
                fill={row.co2 === 20 ? "var(--ui-gold)" : "var(--ui-primary)"}
              />
              <text x={240 + row.rate * 4} y={65 + i * 65}>
                {row.rate.toFixed(2)}%
              </text>
              {p.light === row.light && p.co2 === row.co2 && (
                <rect
                  x="5"
                  y={36 + i * 65}
                  width="720"
                  height="45"
                  fill="none"
                  stroke="var(--ui-ink)"
                  strokeDasharray="4 3"
                />
              )}
            </g>
          ))}
        </svg>
      </div>
      <p>
        低 CO₂ 时，光照20%→80%增加{" "}
        <strong>{(rows[1].rate - rows[0].rate).toFixed(2)}</strong> 个百分点；高
        CO₂ 时，同样增加光照带来{" "}
        <strong>{(rows[3].rate - rows[2].rate).toFixed(2)}</strong>{" "}
        个百分点的变化。
      </p>
      <p>
        先比较同一 CO₂
        的两组，再比较同一光照的两组。虚线框标出与当前条件一致的组合；微调到其它值时无框。此模型把三个响应相乘，不能据此认定真实植物的唯一限制因素。
      </p>
    </section>
  );
}
