import React from "react";
import { seismic, duration } from "./advancedModels.mjs";
import "./SeismicArrival.css";

export default function SeismicArrival({ p, time, onSeek }) {
  const q = seismic(p, time),
    end = duration("earthquake", p);
  const x = (t) => 56 + (t / end) * 604;
  const y = (d) => 196 - (d / (6 * end)) * 154;
  return (
    <section className="seismic-arrival" aria-label="地震波到站时间轴">
      <header>
        <strong>同一段路，两种传播速度</strong>
        <span>
          {q.stage} · {time.toFixed(2)} s
        </span>
      </header>
      <svg
        viewBox="0 0 720 250"
        role="slider"
        tabIndex="0"
        aria-valuemin={0}
        aria-valuemax={end}
        aria-valuenow={time}
        onPointerDown={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          onSeek(
            Math.max(
              0,
              Math.min(
                end,
                ((((e.clientX - r.left) / r.width) * 720 - 56) / 604) * end,
              ),
            ),
          );
        }}
        onKeyDown={(e) => {
          const next = {
            ArrowLeft: time - 0.25,
            ArrowRight: time + 0.25,
            Home: 0,
            End: end,
          }[e.key];
          if (next !== undefined) {
            e.preventDefault();
            onSeek(Math.max(0, Math.min(end, next)));
          }
        }}
        aria-label={`P波${q.tp.toFixed(2)}秒到达，S波${q.ts.toFixed(2)}秒到达，震源距${q.distance.toFixed(2)}千米`}
      >
        <text x="56" y="23">
          传播路程 / km
        </text>
        {[0, 0.5, 1].map((f) => (
          <g key={f}>
            <line
              className="arrival-grid"
              x1="56"
              x2="660"
              y1={y(f * 6 * end)}
              y2={y(f * 6 * end)}
            />
            <text x="48" y={y(f * 6 * end) + 5} textAnchor="end">
              {Math.round(f * 6 * end)}
            </text>
          </g>
        ))}
        <path d={`M56 196L660 ${y(6 * end)}`} stroke="#d5a04c" />
        <path d={`M56 196L660 ${y(3.5 * end)}`} stroke="#46aab9" />
        <text x="672" y={y(6 * end) + 5}>
          P
        </text>
        <text x="672" y={y(3.5 * end) + 5}>
          S
        </text>
        <line
          className="arrival-target"
          x1="56"
          x2="660"
          y1={y(q.distance)}
          y2={y(q.distance)}
        />
        <text x="658" y={y(q.distance) - 9} textAnchor="end">
          到台站 {q.distance.toFixed(1)} km
        </text>
        {[q.tp, q.ts].map((t, i) => (
          <g key={i}>
            <circle
              cx={x(t)}
              cy={y(q.distance)}
              r="5"
              fill={i ? "#46aab9" : "#d5a04c"}
            />
            <line
              className="arrival-grid"
              x1={x(t)}
              x2={x(t)}
              y1={y(q.distance)}
              y2="196"
            />
          </g>
        ))}
        <line
          className="arrival-cursor"
          x1={x(time)}
          x2={x(time)}
          y1="34"
          y2="196"
        />
        {[6, 3.5].map((v, i) => (
          <circle
            key={v}
            cx={x(time)}
            cy={y(v * time)}
            r="4"
            fill={i ? "#46aab9" : "#d5a04c"}
          />
        ))}
        {[0, 0.25, 0.5, 0.75, 1].map((f) => (
          <text key={f} x={x(f * end)} y="218" textAnchor="middle">
            {(f * end).toFixed(1)}
          </text>
        ))}
        <text x="358" y="243" textAnchor="middle">
          震后时间 / s
        </text>
      </svg>
      <p>
        点按图表定位并暂停；方向键微调，Home/End 到两端。金色 P 波 6 km/s，蓝色
        S 波 3.5
        km/s；斜率表示速度，虚线与直线的交点表示到站时刻。这是均匀介质模型的路程—时间图，不是台站振幅记录；波到站后仍继续传播。
      </p>
    </section>
  );
}
