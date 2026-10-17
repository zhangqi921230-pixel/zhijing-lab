import React, { useState, useEffect, useMemo } from "react";
import Button from "./LabButton.jsx";
import { runoffStorage } from "./runoffStorage.mjs";
import "./RunoffStorageStudy.css";
const fmt = (n) => Number(n.toFixed(2));
function curvePath(total, duration) {
  const max = Math.max(1, total * 2);
  return Array.from({ length: 241 }, (_, i) => {
    const t = i / 20;
    return `${i ? "L" : "M"}${70 + t * 47} ${320 - (runoffStorage(total, duration, t).outRate / max) * 220}`;
  }).join(" ");
}
export default function RunoffStorageStudy({ p }) {
  const [reference, setReference] = useState(null),
    [duration, setDuration] = useState(2),
    [time, setTime] = useState(0),
    [playing, setPlaying] = useState(false);
  const total = (p.rain * (100 - p.infil - p.evap)) / 100;
  useEffect(() => {
    setPlaying(false);
    setTime(0);
  }, [p.rain, p.infil, p.evap]);
  useEffect(() => {
    if (!playing) return;
    let frame, last;
    const tick = (now) => {
      if (document.hidden) last = undefined;
      else {
        if (last !== undefined)
          setTime((t) => Math.min(12, t + Math.min(0.1, (now - last) / 1000)));
        last = now;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [playing]);
  useEffect(() => {
    if (time >= 12) setPlaying(false);
  }, [time]);
  const q = runoffStorage(total, duration, time),
    max = Math.max(1, total * 2),
    x = (t) => 70 + t * 47,
    y = (v) => 320 - (v / max) * 220;
  const path = useMemo(() => curvePath(total, duration), [total, duration]);
  const referencePath = useMemo(
    () => (reference === null ? null : curvePath(total, reference)),
    [total, reference],
  );
  const compare =
    reference === null ? null : runoffStorage(total, reference, time);
  const portions = [
    ["尚未输入", Math.max(0, total - q.input), "var(--ui-muted)"],
    ["暂存在单元内", q.storage, "var(--ui-gold)"],
    ["已经流出", q.released, "var(--ui-primary)"],
  ];
  const seek = (t) => {
    setPlaying(false);
    setTime(t);
  };
  return (
    <section className="runoff-storage-study" aria-label="径流输入与调蓄过程">
      <h2>总量相同，出流峰值也相同吗？</h2>
      <p>
        把本次地表径流 <strong>{fmt(total)} mm</strong>{" "}
        均匀送入同一个简化调蓄单元。只改变输入历时，比较出流曲线；这不是实际流域的洪水预报。
      </p>
      <div className="motion-shortcuts" role="group" aria-label="径流输入历时">
        {[0.5, 1, 2, 4].map((d) => (
          <Button
            key={d}
            primary={duration === d}
            aria-pressed={duration === d}
            onClick={() => {
              setDuration(d);
              seek(d);
            }}
          >
            历时 {d} h
          </Button>
        ))}
      </div>
      <div className="motion-shortcuts" role="group" aria-label="出流曲线对照">
        <Button
          onClick={() => {
            setReference(duration);
            setPlaying(false);
          }}
        >
          固定当前历时作对照
        </Button>
        {reference !== null && (
          <Button onClick={() => setReference(null)}>清除历时对照</Button>
        )}
      </div>
      {reference !== null && (
        <p>
          金色点划线：固定 {reference} h 历时；绿色实线：当前 {duration}{" "}
          h。两者使用相同径流水量和调蓄常数；改变主模型水量时，两条曲线一起重算。
        </p>
      )}
      <div
        className="runoff-storage-scroll"
        tabIndex="0"
        role="region"
        aria-label="输入与出流曲线，可横向滚动"
      >
        <svg
          viewBox="0 0 720 410"
          role="img"
          aria-label="相同总径流的输入强度与调蓄出流过程曲线"
        >
          <path d="M70 80V320H654" fill="none" stroke="var(--ui-muted)" />
          {[0, 3, 6, 9, 12].map((t) => (
            <g key={t}>
              <path d={`M${x(t)} 85V320`} stroke="var(--ui-line)" />
              <text x={x(t)} y="345" textAnchor="middle">
                {t}
              </text>
            </g>
          ))}
          {[0, 0.5, 1].map((f) => (
            <text key={f} x="60" y={y(max * f) + 5} textAnchor="end">
              {fmt(max * f)}
            </text>
          ))}
          <text x="70" y="40">
            等效水深流率 / mm·h⁻¹
          </text>
          <text x="565" y="380">
            时间 / h
          </text>
          <path
            d={`M70 320V${y(total / duration)}H${x(duration)}V320H634`}
            fill="none"
            stroke="var(--ui-muted)"
            strokeWidth="2"
            strokeDasharray="6 5"
          />
          {referencePath && (
            <path
              aria-label="参照出流曲线"
              d={referencePath}
              fill="none"
              stroke="var(--ui-gold)"
              strokeWidth="3"
              strokeDasharray="10 4 2 4"
            />
          )}
          {compare && (
            <rect
              x={x(time) - 5}
              y={y(compare.outRate) - 5}
              width="10"
              height="10"
              fill="var(--ui-gold)"
            />
          )}
          <path
            d={path}
            fill="none"
            stroke="var(--ui-primary)"
            strokeWidth="3"
          />
          <path
            d={`M${x(time)} 80V320`}
            stroke="var(--ui-gold)"
            strokeDasharray="3 4"
          />
          <circle
            cx={x(time)}
            cy={y(q.outRate)}
            r="6"
            fill="var(--ui-primary)"
          />
          <text x="300" y="40">
            灰虚线：输入　绿实线：当前出流
          </text>
        </svg>
      </div>
      {compare && (
        <section
          className="runoff-curve-comparison"
          aria-label="同水量历时对照读数"
        >
          <h3>相同总量，不同出流过程</h3>
          <p>
            当前 {duration} h：峰值 {fmt(q.peak)} mm/h；参照 {reference} h：峰值{" "}
            {fmt(compare.peak)} mm/h。
          </p>
          <p>
            同一时刻 {fmt(time)} h：当前出流 {fmt(q.outRate)} mm/h，参照出流{" "}
            {fmt(compare.outRate)} mm/h。两条完整曲线最终累计流出量均为{" "}
            {fmt(total)} mm；12 h 之前的曲线面积可能尚未包含全部出流。
          </p>
          <Button onClick={() => seek(reference)}>定位参照峰值时刻</Button>
        </section>
      )}
      <div className="motion-shortcuts">
        <Button
          primary
          aria-pressed={playing}
          onClick={() => {
            if (time >= 12) setTime(0);
            setPlaying((v) => !v);
          }}
        >
          {playing ? "暂停调蓄过程" : "播放调蓄过程"}
        </Button>
        <Button onClick={() => seek(0)}>回到输入开始</Button>
        <Button onClick={() => seek(duration)}>输入刚结束</Button>
        <Button onClick={() => seek(Math.min(12, duration + 3))}>
          停止输入 3 h 后
        </Button>
      </div>
      <label className="runoff-storage-time">
        观察时刻 {fmt(time)} h
        <input
          aria-label="调蓄观察时刻"
          type="range"
          min="0"
          max="12"
          step=".05"
          value={time}
          onChange={(e) => seek(Number(e.target.value))}
        />
      </label>
      <p className="runoff-stage-label">
        {total === 0
          ? "无径流输入：三部分水量都为零。"
          : time < duration
            ? "输入仍在继续：部分水正在暂存，部分已经流出。"
            : "输入已经停止：出流由暂存水量继续补给。"}
      </p>
      <section className="runoff-water-locations" aria-label="径流水量当前去向">
        <h3>这一份径流，现在在哪里？</h3>
        <div
          className="runoff-water-strip"
          role="img"
          aria-label={portions
            .map(([name, value]) => `${name} ${fmt(value)} mm`)
            .join("；")}
        >
          {portions.map(([name, value, color]) => (
            <span
              key={name}
              data-part={name}
              style={{
                width: `${total > 0 ? (100 * value) / total : 0}%`,
                background: color,
              }}
            />
          ))}
        </div>
        <div className="runoff-water-legend">
          {portions.map(([name, value, color]) => (
            <span key={name}>
              <i style={{ background: color }} />
              {name} <strong>{fmt(value)} mm</strong>
            </span>
          ))}
        </div>
        <p>
          三部分之和始终为 {fmt(total)} mm；其中“暂存 +
          已流出”才是截至当前的累计输入。条宽按水量比例绘制。
        </p>
      </section>
      <dl>
        {[
          ["累计输入", q.input, "mm"],
          ["累计出流", q.released, "mm"],
          ["暂存水量", q.storage, "mm"],
          ["当前输入率", q.inputRate, "mm/h"],
          ["当前出流率", q.outRate, "mm/h"],
          ["本次出流峰值", q.peak, "mm/h"],
        ].map(([name, value, unit]) => (
          <div key={name}>
            <dt>{name}</dt>
            <dd>
              {fmt(value)} {unit}
            </dd>
          </div>
        ))}
      </dl>
      <p>
        累计输入 = 累计出流 + 暂存水量。输入结束后仍会出流，暂存水量逐渐减少；12
        h 时若还有少量储水，仍保留在账本中。
      </p>
      <details>
        <summary>简化模型如何计算？</summary>
        <p>
          初始储水为零，调蓄时间常数 τ = 1 h，Q = S/τ，dS/dt = I − Q。输入期 I =
          总径流/历时；停止输入后 I =
          0。忽略额外蒸散、下渗和容量上限，不重新分配主模型水量。水深针对相同面积；曲线纵轴固定以便比较历时，动画
          1 秒代表模型 1 小时。
        </p>
      </details>
    </section>
  );
}
