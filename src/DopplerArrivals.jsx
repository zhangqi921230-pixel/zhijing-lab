import React from "react";
import Button from "./LabButton.jsx";
import { dopplerArrivals } from "./motionModels.mjs";
import "./DopplerArrivals.css";
export default function DopplerArrivals({ p, time, onSeek }) {
  const rows = dopplerArrivals(p.mach, p.frequency),
    max = Math.max(8, ...rows.map((r) => r.left), ...rows.map((r) => r.right));
  const x = (t) => 125 + (t / max) * 570;
  const lanes = [
    ["emitted", "发射", 60],
    ["right", "右侧接收", 135],
    ["left", "左侧接收", 210],
  ];
  return (
    <section className="doppler-arrivals" aria-label="波面的发射与到达时间">
      <h2>波面何时到达观察者？</h2>
      <p>
        左右观察者分别位于 −12 m、+12
        m。以下追踪前四次发射；空心点表示主动画当前时刻尚未发生的事件，实心点表示已经发生。
      </p>
      <div
        className="doppler-arrivals-data"
        role="region"
        aria-label="接收时间图，可横向滚动"
        tabIndex="0"
      >
        <svg
          viewBox="0 0 760 280"
          role="img"
          aria-label="前四个波面的发射及左右到达时间，共用秒轴"
        >
          {lanes.map(([key, label, y]) => (
            <g key={key}>
              <text x="12" y={y + 5}>
                {label}
              </text>
              <line x1="125" x2="710" y1={y} y2={y} stroke="var(--ui-line)" />
              {rows.map((r, i) => (
                <g key={i}>
                  <circle
                    cx={x(r[key])}
                    cy={y}
                    r="3.5"
                    fill={
                      r[key] <= time + 1e-9
                        ? "var(--ui-primary)"
                        : "var(--ui-surface)"
                    }
                    stroke="var(--ui-primary)"
                    strokeWidth="2"
                  />
                  <text
                    x={x(r[key])}
                    y={y + (i % 2 ? 25 : -17)}
                    textAnchor="middle"
                  >
                    {i + 1}
                  </text>
                </g>
              ))}
            </g>
          ))}
          <line
            x1={x(time)}
            x2={x(time)}
            y1="25"
            y2="230"
            stroke="var(--ui-gold)"
            strokeDasharray="4 5"
          />
          {[0, 6, max].map((t, i) => (
            <text key={i} x={x(t)} y="261" textAnchor="middle">
              {t.toFixed(1)} s
            </text>
          ))}
        </svg>
      </div>
      <div
        className="doppler-arrivals-data"
        role="region"
        aria-label="到达时间表，可横向滚动"
        tabIndex="0"
      >
        <table>
          <caption>预测到达时间 / s · 不播放声音</caption>
          <thead>
            <tr>
              <th scope="col">波面</th>
              <th scope="col">发射</th>
              <th scope="col">右侧到达</th>
              <th scope="col">左侧到达</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i}>
                <th scope="row">{i + 1}</th>
                <td>{r.emitted.toFixed(2)}</td>
                <td>{r.right.toFixed(2)}</td>
                <td>{r.left.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>
        发射间隔 {(1 / p.frequency).toFixed(3)} s；右侧接收间隔{" "}
        {((1 - p.mach) / p.frequency).toFixed(3)} s；左侧接收间隔{" "}
        {((1 + p.mach) / p.frequency).toFixed(3)} s。接收频率是接收间隔的倒数。
      </p>
      <div className="motion-shortcuts">
        {rows.map((r, i) => (
          <Button key={i} onClick={() => onSeek(r.emitted)}>
            定位第 {i + 1} 次发射
          </Button>
        ))}
      </div>
      <p>
        金色竖线对应上方动画时间。主动画到6秒停止，6秒以后的接收时刻是由传播距离计算的预测，不表示已经播放到该时刻。每个波面以自己的发射位置为圆心，传播速度恒为2
        m/s。
      </p>
    </section>
  );
}
