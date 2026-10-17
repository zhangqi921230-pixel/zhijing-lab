import SeismicStationTimes from "./SeismicStationTimes.jsx";
import React, { useState } from "react";
import Button from "./LabButton.jsx";
import { seismicLocation, secondIntersection } from "./seismicLocation.mjs";
import "./SeismicLocation.css";
export default function SeismicLocation({ p, time = 0, onSeek }) {
  const [count, setCount] = useState(1);
  const [live, setLive] = useState(false);
  const { stations } = seismicLocation(p);
  const visible = stations
      .slice(0, count)
      .filter((s) => !live || time >= s.path / 3.5),
    shown = visible.length,
    alternative = secondIntersection(visible);
  const minX = Math.min(...stations.map((s) => s.x - s.radius)),
    maxX = Math.max(...stations.map((s) => s.x + s.radius));
  const minY = Math.min(...stations.map((s) => s.y - s.radius)),
    maxY = Math.max(...stations.map((s) => s.y + s.radius));
  const scale = Math.min(590 / (maxX - minX), 320 / (maxY - minY));
  const x = (v) => 360 + (v - (minX + maxX) / 2) * scale,
    y = (v) => 210 - (v - (minY + maxY) / 2) * scale;
  const colors = ["var(--ui-primary)", "var(--ui-gold)", "var(--ui-ink)"];
  return (
    <section className="seismic-location" aria-label="多台站震中定位教学">
      <h3>从一个圆，到共同的位置</h3>
      <p>
        已知震源深度 {p.depth} km；A 台站对应上方剖面的台站，B、C
        是额外的教学台站。完整理论模式提前展示到时差；跟随到站模式按主时间轴逐步揭示。
      </p>
      <div
        className="location-steps"
        role="group"
        aria-label="定位数据呈现方式"
      >
        <Button
          primary={!live}
          aria-pressed={!live}
          onClick={() => setLive(false)}
        >
          完整理论数据
        </Button>
        <Button
          primary={live}
          aria-pressed={live}
          onClick={() => setLive(true)}
        >
          跟随到站进度
        </Button>
      </div>
      {live && (
        <p>
          每个已选台站只有在P、S波都到达后才加入距离约束。当前可用 {shown}/
          {count} 个台站；这是按模拟到时揭示证据，不是真实地震记录。
        </p>
      )}
      <div className="location-steps" role="group" aria-label="逐步加入台站">
        {["1 · 一个台站", "2 · 两个台站", "3 · 三个台站"].map((label, i) => (
          <Button
            key={label}
            primary={count === i + 1}
            aria-pressed={count === i + 1}
            onClick={() => setCount(i + 1)}
          >
            {label}
          </Button>
        ))}
      </div>
      <div
        className="location-map-scroll"
        tabIndex="0"
        role="region"
        aria-label="台站距离圆地图，可横向滚动"
      >
        <svg
          viewBox="0 0 720 440"
          role="img"
          aria-label={`${shown}个台站的震中距离圆`}
        >
          <text x="24" y="28">
            地表俯视 · 距离圆不是波前
          </text>
          <path
            d="M680 76V43m-5 8 5-8 5 8"
            stroke="var(--ui-muted)"
            fill="none"
          />
          <text x="680" y="31" textAnchor="middle">
            北
          </text>
          {stations.slice(0, count).map((s, i) => (
            <g
              key={s.name}
              className={
                visible.includes(s)
                  ? "location-ring"
                  : "location-station-waiting"
              }
            >
              {visible.includes(s) && (
                <circle
                  cx={x(s.x)}
                  cy={y(s.y)}
                  r={s.radius * scale}
                  fill="none"
                  stroke={
                    colors[
                      stations.findIndex((station) => station.name === s.name)
                    ]
                  }
                  strokeWidth="2"
                />
              )}
              <rect
                x={x(s.x) - 5}
                y={y(s.y) - 5}
                width="10"
                height="10"
                fill={
                  colors[
                    stations.findIndex((station) => station.name === s.name)
                  ]
                }
              />
              <text x={x(s.x) + 10} y={y(s.y) - 10}>
                {s.name} 台站
              </text>
            </g>
          ))}
          {shown >= 2 && (
            <g>
              <circle
                cx={x(0)}
                cy={y(0)}
                r="6"
                fill="var(--ui-gold)"
                stroke="var(--ui-ink)"
              />
              <path
                d={`M${x(0)} ${y(0)} L215 365 H35`}
                fill="none"
                stroke="var(--ui-gold)"
                strokeWidth="1.5"
              />
              <text x="35" y="355" className="location-candidate-label">
                {shown === 3 ? "共同交点：震中" : "候选 1"}
              </text>
              <circle
                cx={x(alternative.x)}
                cy={y(alternative.y)}
                r="6"
                fill="var(--ui-paper)"
                stroke="var(--ui-ink)"
                strokeDasharray={shown === 3 ? "2 2" : undefined}
              />
              <path
                d={`M${x(alternative.x)} ${y(alternative.y)} L540 65 H655`}
                fill="none"
                stroke="var(--ui-muted)"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />
              <text
                x="655"
                y="56"
                textAnchor="end"
                className="location-candidate-label"
              >
                {shown === 3 ? "不符合 C 台站" : "候选 2"}
              </text>
            </g>
          )}
          <path
            d={`M30 400v-5m0 5h${20 * scale}v-5`}
            stroke="var(--ui-ink)"
            fill="none"
          />
          <text x="30" y="425">
            20 km
          </text>
        </svg>
      </div>
      <p role="status">
        {shown === 0
          ? "等待已选台站收到P、S波：仅凭P波到达还不能计算S−P到时差。"
          : shown === 1
            ? "一个台站：圆周上每一点都满足这条距离约束，方位仍然未知。"
            : shown === 2
              ? "两个台站：本例留下两个交点，仍不能判断哪一个才是震中。"
              : "三个台站：只有一个点同时满足三条约束；另一个候选点不在 C 台站的圆上。"}
      </p>
      <div className="location-table-scroll">
        <table>
          <caption>
            {live ? "已选台站的定位证据" : "完整理论到时差"}
            （未四舍五入的值用于作图）
          </caption>
          <thead>
            <tr>
              <th>台站</th>
              <th>证据状态</th>
              <th>S−P / s</th>
              <th>震源距 / km</th>
              <th>震中距 / km</th>
            </tr>
          </thead>
          <tbody>
            {stations.slice(0, count).map((s) => {
              const ready = !live || time >= s.path / 3.5;
              return (
                <tr key={s.name}>
                  <th scope="row">{s.name}</th>
                  <td>
                    {!live
                      ? "理论数据"
                      : ready
                        ? "P、S已到 · 可定位"
                        : time >= s.path / 6
                          ? "P已到 · 等待S"
                          : "等待P波"}
                  </td>
                  <td>{ready ? s.lag.toFixed(2) : "—"}</td>
                  <td>{ready ? s.path.toFixed(2) : "—"}</td>
                  <td>{ready ? s.radius.toFixed(2) : "—"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <SeismicStationTimes {...{ p, time, onSeek }} />
      <details>
        <summary>为什么不能直接把到时差当作圆半径？</summary>
        <p>
          本模型 P 波速度 6 km/s、S 波速度 3.5 km/s。震源距 L = Δt ÷ (1/3.5 −
          1/6)，再按已知深度 h 得到震中距 r = √(L² − h²)。距离圆的半径是 r。
        </p>
        <p>
          固定台站位置时，增加深度会增加三条传播路程及到时差，但地表距离圆保持不变。真实定位需要速度结构、多个台站及误差估计；深度未知时不能用这里的三个理想圆完成完整震源定位。
        </p>
      </details>
    </section>
  );
}
