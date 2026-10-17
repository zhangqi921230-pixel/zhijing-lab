import React from "react";
import Button from "./LabButton.jsx";
import { dopplerState } from "./motionModels.mjs";
export default function DopplerTracker({
  p,
  time,
  selected,
  onSelect,
  onSeek,
}) {
  const born = selected / p.frequency,
    age = Math.max(0, time - born);
  const front = dopplerState(p.mach, p.frequency, time).fronts[selected];
  return (
    <section className="doppler-arrivals" aria-label="追踪同一波面的传播">
      <h2>圆心留在发射处，半径随波龄增长</h2>
      <p>
        金色波面是当前追踪对象。声源继续运动，已经发出的波面不会跟着声源平移；淡色圆仍表示其它波面。
      </p>
      <div className="motion-shortcuts" role="group" aria-label="选择追踪波面">
        {[0, 1, 2, 3].map((i) => (
          <Button
            key={i}
            aria-pressed={selected === i}
            onClick={() => onSelect(i)}
          >
            追踪第 {i + 1} 圈
          </Button>
        ))}
      </div>
      <div className="motion-readouts">
        <div>
          <span>发射时刻</span>
          <strong>{born.toFixed(2)} s</strong>
        </div>
        <div>
          <span>固定圆心 x</span>
          <strong>{(2 * p.mach * born).toFixed(2)} m</strong>
        </div>
        <div>
          <span>{front ? "已传播时间" : "尚未发射"}</span>
          <strong>{front ? `${age.toFixed(2)} s` : "—"}</strong>
        </div>
        <div>
          <span>波面半径</span>
          <strong>{front ? `${front.radius.toFixed(2)} m` : "—"}</strong>
        </div>
      </div>
      <div className="motion-shortcuts">
        {[0, 1, 2].map((dt) => (
          <Button
            key={dt}
            disabled={born + dt > 6}
            onClick={() => onSeek(born + dt)}
          >
            {dt === 0 ? "定位发射瞬间" : `观察发射后 ${dt} 秒`}
          </Button>
        ))}
      </div>
      <p>
        {front
          ? `r = c × Δt = 2 × ${age.toFixed(2)} ≈ ${front.radius.toFixed(2)} m。`
          : "把进度推进到发射时刻，波面才会出现。"}{" "}
        图中金色线段从发射位置连到波面，长度代表半径。定位按钮使用主动画的同一时钟，超出
        6 秒的观察点不可选。
      </p>
      <p>
        本图采用静止均匀介质、亚声速匀速点源；2 m/s
        是便于观察的示意波速。向前和向后的传播速度相同，间距差异来自相邻两次发射位置不同。
      </p>
    </section>
  );
}
