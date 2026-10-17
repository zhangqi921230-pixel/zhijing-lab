import React, { useMemo, useState } from "react";
import Button from "./LabButton.jsx";
import { projectileState, projectileApexProgress } from "./visualModels.mjs";
import "./ProjectileComparison.css";
export default function ProjectileComparison({
  p,
  onSeek,
  timelineDuration = 6,
  currentTime = 0,
}) {
  const [saved, setSaved] = useState(null);
  const referenceParams = saved ?? { ...p, angle: 90 - p.angle };
  const current = projectileState(p, 1),
    reference = projectileState(referenceParams, 1);
  const scale = Math.min(
    620 / Math.max(1, current.range, reference.range),
    210 / Math.max(1, current.apex, reference.apex),
  );
  const pathFor = (params) =>
    Array.from({ length: 101 }, (_, i) => {
      const q = projectileState(params, i / 100);
      return `${i ? "L" : "M"}${60 + q.x * scale},${255 - q.y * scale}`;
    }).join(" ");
  const currentPath = useMemo(
    () => pathFor(p),
    [p.speed, p.angle, p.height, p.gravity, scale],
  );
  const referencePath = useMemo(
    () => pathFor(referenceParams),
    [
      referenceParams.speed,
      referenceParams.angle,
      referenceParams.height,
      referenceParams.gravity,
      scale,
    ],
  );
  const atTime = (params, duration) =>
    projectileState(
      params,
      duration > 0 ? Math.max(0, currentTime) / duration : 0,
    );
  const moving = atTime(p, current.duration),
    referenceMoving = atTime(referenceParams, reference.duration);
  const stateName = (duration) =>
    duration === 0
      ? "无空中飞行阶段"
      : currentTime >= duration - 1e-9
        ? "已到达地面"
        : "空中运动";
  const equal = Math.abs(current.range - reference.range) < 1e-8;
  return (
    <section className="projectile-comparison" aria-label="互余角定量对照">
      <header>
        <h2>两条轨迹，三个量</h2>
        <p>
          {saved
            ? "虚线使用保留时的整组条件，实线使用当前条件；改变多个条件时不能只归因于发射角。"
            : "默认对比互余角：初速度、发射高度和重力相同，只改变抛射角。"}
          读数是各自完整飞行的结果。
        </p>
      </header>
      <div className="motion-shortcuts">
        <Button onClick={() => setSaved({ ...p })}>保留当前轨迹作对照</Button>
        {saved && (
          <Button onClick={() => setSaved(null)}>恢复互余角对照</Button>
        )}
      </div>
      <p>
        当前：{p.speed} m/s · {p.angle}° · 高度 {p.height} m · g={p.gravity}{" "}
        m/s²；参考：{referenceParams.speed} m/s · {referenceParams.angle}° ·
        高度 {referenceParams.height} m · g={referenceParams.gravity} m/s²。
      </p>
      <div
        className="projectile-comparison-table"
        role="region"
        tabIndex="0"
        aria-label="同尺度双轨迹图，可横向滚动"
      >
        <svg
          className="projectile-double-plot"
          viewBox="0 0 760 325"
          role="img"
          aria-label="当前实线与参考虚线轨迹，横纵轴同尺度"
        >
          <path d="M60 30V255H710" fill="none" stroke="var(--ui-muted)" />
          <text x="16" y="25">
            y / m
          </text>
          <text x="688" y="280">
            x / m
          </text>
          {[0, 1, 2, 3, 4].map((i) => {
            const x = i * 150;
            return (
              <g key={i}>
                <path d={`M${60 + x} 255v5`} stroke="var(--ui-muted)" />
                <text x={60 + x} y="279" textAnchor="middle">
                  {(x / scale).toFixed(1)}
                </text>
              </g>
            );
          })}
          {[0, 1, 2, 3].map((i) => (
            <text key={i} x="52" y={260 - i * 65} textAnchor="end">
              {((i * 65) / scale).toFixed(1)}
            </text>
          ))}
          <path
            data-reference-trajectory="true"
            d={referencePath}
            fill="none"
            stroke="var(--ui-gold)"
            strokeWidth="3"
            strokeDasharray="7 5"
          />
          <path
            data-current-trajectory="true"
            d={currentPath}
            fill="none"
            stroke="var(--ui-primary)"
            strokeWidth="2.5"
          />
          <circle
            data-reference-position="true"
            cx={60 + referenceMoving.x * scale}
            cy={255 - referenceMoving.y * scale}
            r="8"
            fill="var(--ui-surface)"
            stroke="var(--ui-gold)"
            strokeWidth="2.5"
          />
          <circle
            data-current-position="true"
            cx={60 + moving.x * scale}
            cy={255 - moving.y * scale}
            r="4.5"
            fill="var(--ui-primary)"
            stroke="var(--ui-surface)"
            strokeWidth="1.5"
          />
          <text x="380" y="314" textAnchor="middle">
            实线：当前 · 金色虚线：{saved ? "保留的轨迹" : "互余角参考"} ·
            横纵轴同尺度
          </text>
        </svg>
      </div>
      <div
        className="projectile-time-comparison"
        aria-label="同一真实时刻的位置对照"
      >
        <strong>同一真实时刻：{Math.max(0, currentTime).toFixed(2)} s</strong>
        <p>
          实心点为当前，空心点为参考；两球都从0秒出发，先落地的停留在落点，不模拟碰撞。下方数据表仍是完整飞行结果。
        </p>
        <div>
          {[
            { name: "当前", q: moving, duration: current.duration },
            { name: "参考", q: referenceMoving, duration: reference.duration },
          ].map((item) => (
            <p key={item.name}>
              <b>
                {item.name} · {stateName(item.duration)}
              </b>
              <br />
              x={item.q.x.toFixed(2)} m · y={item.q.y.toFixed(2)} m<br />
              截至此刻飞行 {item.q.t.toFixed(2)} s
            </p>
          ))}
        </div>
      </div>
      <div
        className="projectile-comparison-table"
        role="region"
        aria-label="轨迹数据表，可横向滚动"
        tabIndex="0"
      >
        <table>
          <caption>当前与{saved ? "保留条件" : "互余角"}参考</caption>
          <thead>
            <tr>
              <th scope="col">比较项目</th>
              <th scope="col">当前 {p.angle}°</th>
              <th scope="col">参考 {referenceParams.angle}°</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["射程 / m", "range"],
              ["最大高度 / m", "apex"],
              ["飞行时间 / s", "duration"],
            ].map(([label, key]) => (
              <tr key={key}>
                <th scope="row">{label}</th>
                <td>{current[key].toFixed(2)}</td>
                <td>{reference[key].toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>
        {saved
          ? "请核对两组条件后比较结果。保留轨迹只在本页内有效，离开后清除。"
          : p.angle === 45
            ? "45° 的互余角仍是 45°，两条轨迹完全重合。"
            : p.height === 0
              ? "同高发射与落地：两条轨迹的射程相等，高度和飞行时间可以不同。"
              : "发射点高于地面：互余角同射程的前提不成立，应比较实际计算结果。"}{" "}
        射程差（当前 − 参考）：
        {equal ? "0.00" : (current.range - reference.range).toFixed(2)} m。
      </p>
      <div className="motion-shortcuts">
        <Button
          onClick={() => onSeek(projectileApexProgress(p) * timelineDuration)}
        >
          定位当前最高点
        </Button>
        <Button onClick={() => onSeek(timelineDuration)}>定位落地点</Button>
      </div>
      <p>
        最高点
        vᵧ=0，但重力加速度仍向下；只有竖直上抛的最高点总速度为零。平抛的最高点就是发射点。地面水平发射时飞行时间为零。
      </p>
    </section>
  );
}
