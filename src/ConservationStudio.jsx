import React, { useState, useId } from "react";
import Button from "./LabButton.jsx";
import { atomLayout, conservationFrame } from "./conservationLayout.mjs";
import "./ConservationStudio.css";
export default function ConservationStudio({ p, onChange }) {
  const [labels, setLabels] = useState(true),
    uid = useId().replace(/:/g, "");
  const initial = atomLayout(p.h2, p.o2, 0),
    f = conservationFrame(p),
    q = f.from.q;
  const panel = (layout, offset, moving = false) => (
    <g transform={`translate(${offset} 0)`}>
      <rect
        x="16"
        y="61"
        width="408"
        height="330"
        rx="12"
        fill="var(--ui-surface)"
        stroke="var(--ui-line)"
      />
      <text x="220" y="37" textAnchor="middle">
        {moving ? "当前状态 · 原子编号保持不变" : "投料状态 · 逐个清点"}
      </text>
      {(!moving || f.fraction === 0) &&
        layout.bonds.map(([a, b], i) => (
          <path
            key={i}
            d={`M${layout.atoms[a].x} ${layout.atoms[a].y}L${layout.atoms[b].x} ${layout.atoms[b].y}`}
            stroke="var(--ui-muted)"
            strokeWidth="5"
          />
        ))}
      {(moving ? f.atoms : Object.values(layout.atoms)).map((a) => (
        <g key={a.id} transform={`translate(${a.x} ${a.y})`}>
          <circle
            r={a.element === "H" ? 14 : 17}
            fill={`url(#${uid}-${a.element})`}
            stroke={a.element === "H" ? "#5b747a" : "#99382b"}
            strokeWidth="1.5"
          />
          <text
            textAnchor="middle"
            y="4"
            style={{
              fill: a.element === "H" ? "#20343d" : "#fff",
              fontSize: 12,
              fontWeight: 700,
            }}
          >
            {labels ? a.id : a.element}
          </text>
        </g>
      ))}
      {(!moving || f.fraction === 0) &&
        layout.molecules.map((m, i) => (
          <text key={i} x={m.x} y={m.y} textAnchor="middle">
            {m.type}
          </text>
        ))}
      {layout.molecules.length === 0 && (
        <text x="220" y="220" textAnchor="middle">
          尚未投入分子
        </text>
      )}
    </g>
  );
  return (
    <section
      className="conservation-studio"
      aria-label="原子编号追踪与反应计量"
    >
      <header>
        <span>2H₂ + O₂ → 2H₂O</span>
        <h2>组合在改变，每个原子仍在这里。</h2>
      </header>
      <div className="conservation-actions">
        <Button aria-pressed={labels} onClick={() => setLabels(!labels)}>
          {labels ? "隐藏" : "显示"}原子编号
        </Button>
        <Button onClick={() => onChange("progress", 0)}>回看投料</Button>
        <Button
          disabled={f.complete >= f.limit}
          onClick={() =>
            onChange("progress", Math.min(f.limit, f.complete + 1))
          }
        >
          完成下一批
        </Button>
        <Button onClick={() => onChange("progress", f.limit)}>
          反应到计量终点
        </Button>
      </div>
      <div
        className="conservation-canvas"
        role="region"
        tabIndex="0"
        aria-label="反应前后原子追踪，可横向滚动"
      >
        <svg
          viewBox="0 0 900 415"
          role="img"
          aria-label="每个氢氧原子在反应前后保留相同编号"
        >
          <defs>
            {[
              ["H", "#fff", "#adc8cc"],
              ["O", "#ffc8ae", "#bc4938"],
            ].map(([e, a, b]) => (
              <radialGradient id={`${uid}-${e}`} key={e} cx="30%" cy="25%">
                <stop stopColor={a} />
                <stop offset="1" stopColor={b} />
              </radialGradient>
            ))}
          </defs>
          {panel(initial, 0)}
          {panel(f.from, 460, true)}
        </svg>
      </div>
      {p.progress > f.limit && (
        <p>
          已请求 {Math.floor(p.progress)} 批；当前投料最多完成 {f.limit}{" "}
          批，过量部分保留为反应物。
        </p>
      )}
      <p className="conservation-status">
        已完成 {f.complete} / {f.limit} 批。
        {f.fraction > 0
          ? "正在移动下一批原子的示意位置；下方计数暂显示最近完成的整批状态。"
          : "每批消耗 2 个 H₂ 和 1 个 O₂，生成 2 个 H₂O。"}
      </p>
      <div className="conservation-ledger">
        <table>
          <caption>只数完成的整批：原子守恒，分子数可改变</caption>
          <thead>
            <tr>
              <th>核对项</th>
              <th>投料状态</th>
              <th>当前整批状态</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["H 原子", 2 * p.h2, 2 * q.h2 + 2 * q.h2o],
              ["O 原子", 2 * p.o2, 2 * q.o2 + q.h2o],
              ["分子总数", p.h2 + p.o2, q.h2 + q.o2 + q.h2o],
              ["相对质量总和", f.mass, 2 * q.h2 + 32 * q.o2 + 18 * q.h2o],
            ].map(([name, a, b]) => (
              <tr key={name}>
                <th>{name}</th>
                <td>{a}</td>
                <td>{b}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>
        当前剩余 H₂：{q.h2} 个；O₂：{q.o2} 个；生成 H₂O：{q.h2o} 个。
      </p>
      <details>
        <summary>分子个数比与质量比为什么不同？</summary>
        <p>
          一批反应的分子个数比为 2∶1∶2；取相对原子质量 H≈1、O≈16，对应相对质量
          4∶32∶36，即 1∶8∶9。“相对质量总和”是教学计数，不是这些分子的克数。
        </p>
      </details>
      <p>
        编号用于追踪同一原子；两栏展示同一组原子的两个状态，不是两份物质。球体大小、键长和重排路径为示意，动画不表示真实碰撞、反应机理或速率；中间移动时隐藏键和分子标签，不能据此推断中间产物。
      </p>
    </section>
  );
}
