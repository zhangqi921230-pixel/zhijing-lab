import React from "react";
import Button from "./LabButton.jsx";
import { seismic, duration } from "./advancedModels.mjs";
import { seismicLocation } from "./seismicLocation.mjs";
export function stationArrivals(p, time) {
  return seismicLocation(p).stations.map((station) => ({
    ...station,
    ...seismic({ depth: p.depth, distance: station.radius }, time),
  }));
}
export default function SeismicStationTimes({ p, time = 0, onSeek }) {
  const stations = stationArrivals(p, time),
    end = duration("earthquake", p),
    x = (t) => 170 + (t / end) * 450;
  return (
    <section className="station-times" aria-label="三台站实时到站对照">
      <h3>同一次地震，三个台站何时收到波？</h3>
      <p>
        下图跟随主时间轴。金色 P 波先到，绿色 S
        波后到；条段表示到时差，不表示振幅。定位圆使用完整理论数据，未到站时也会显示。
      </p>
      <div
        className="station-times-scroll"
        role="region"
        tabIndex="0"
        aria-label="三台站到时图，可横向滚动"
      >
        <svg
          viewBox="0 0 850 360"
          role="img"
          aria-label={`震后${time.toFixed(2)}秒，三个台站的到波状态`}
        >
          <text x="30" y="30">
            震后 {time.toFixed(2)} s
          </text>
          <text x="630" y="30">
            当前接收状态
          </text>
          {[0, 0.25, 0.5, 0.75, 1].map((f) => (
            <g key={f}>
              <path d={`M${x(f * end)} 48V300`} stroke="var(--ui-line)" />
              <text x={x(f * end)} y="325" textAnchor="middle">
                {(f * end).toFixed(1)}
              </text>
            </g>
          ))}
          {stations.map((s, i) => {
            const y = 90 + i * 85;
            return (
              <g key={s.name}>
                <text x="30" y={y - 7}>
                  {s.name} 台站
                </text>
                <text x="30" y={y + 21}>
                  {s.path.toFixed(1)} km
                </text>
                <path
                  d={`M170 ${y}H620`}
                  stroke="var(--ui-line)"
                  strokeWidth="2"
                />
                <path
                  d={`M${x(s.tp)} ${y}H${x(s.ts)}`}
                  stroke="var(--ui-gold)"
                  strokeWidth="8"
                  opacity=".35"
                />
                {[s.tp, s.ts].map((t, k) => (
                  <g key={k}>
                    <circle
                      cx={x(t)}
                      cy={y}
                      r="6"
                      fill={
                        time >= t
                          ? k
                            ? "var(--ui-primary)"
                            : "var(--ui-gold)"
                          : "var(--ui-paper)"
                      }
                      stroke={k ? "var(--ui-primary)" : "var(--ui-gold)"}
                      strokeWidth="2"
                    />
                    <text x={x(t)} y={y + (k ? 27 : -19)} textAnchor="middle">
                      {k ? "S" : "P"} {t.toFixed(2)} s
                    </text>
                  </g>
                ))}
                <text x="635" y={y + 7}>
                  {s.stage}
                </text>
              </g>
            );
          })}
          <path
            d={`M${x(time)} 48V300`}
            stroke="var(--ui-ink)"
            strokeWidth="2"
            strokeDasharray="4 4"
          />
          <text x="390" y="353">
            震后时间 / s
          </text>
        </svg>
      </div>
      <div
        className="station-times-actions"
        role="group"
        aria-label="定位台站到波时刻"
      >
        {stations.map((s) => (
          <div key={s.name}>
            <strong>{s.name} 台站</strong>
            <Button disabled={!onSeek} onClick={() => onSeek(s.tp)}>
              定位 {s.name} 的 P 波
            </Button>
            <Button disabled={!onSeek} onClick={() => onSeek(s.ts)}>
              定位 {s.name} 的 S 波
            </Button>
          </div>
        ))}
      </div>
    </section>
  );
}
