import React, { useMemo, useState } from "react";
import Button from "./LabButton.jsx";
import { photo } from "./models.mjs";
import { photoNet } from "./photoNet.mjs";
import "./PhotoNetStudy.css";
const x = (l) => 80 + l * 6,
  y = (v) => 300 - v * 2.2;
export default function PhotoNetStudy({ p, onChange, onPause }) {
  const [respiration, setRespiration] = useState(10);
  const q = photoNet(p, respiration);
  const paths = useMemo(() => {
    const samples = Array.from({ length: 101 }, (_, light) => ({
      light,
      gross: photo({ ...p, light }),
    }));
    return [0, respiration].map((r) =>
      samples
        .map((s, i) => `${i ? "L" : "M"}${x(s.light)},${y(s.gross - r)}`)
        .join(" "),
    );
  }, [p.co2, p.temp, respiration]);
  const seek = (light) => {
    onPause();
    onChange("light", light);
  };
  return (
    <section className="photo-net-study" aria-label="总光合、呼吸与净光合">
      <h3>有光合作用，净积累就一定为正吗？</h3>
      <p>
        将现有总光合模型记为 P，再给定呼吸消耗 R，净光合为
        P−R。三者使用同一相对标尺。这里暂把 R
        设为常数，只比较收支，不预测真实植物的呼吸或生长速度。
      </p>
      <label className="photo-net-respiration">
        假定呼吸消耗 R <output>{respiration} 相对单位</output>
        <input
          type="range"
          aria-label="假定呼吸消耗"
          min="0"
          max="30"
          step="1"
          value={respiration}
          onChange={(e) => {
            onPause();
            setRespiration(Number(e.target.value));
          }}
        />
      </label>
      <div
        className="motion-shortcuts"
        role="group"
        aria-label="净光合观察位置"
      >
        <Button onClick={() => seek(0)}>观察黑暗</Button>
        <Button onClick={() => seek(5)}>观察弱光</Button>
        <Button
          disabled={q.compensation === null}
          onClick={() => seek(q.compensation)}
        >
          定位补偿点
        </Button>
        <Button onClick={() => seek(80)}>观察强光</Button>
      </div>
      <div
        className="photo-net-scroll"
        role="region"
        tabIndex={0}
        aria-label="光合收支曲线，可横向滚动"
      >
        <svg
          viewBox="0 0 760 435"
          role="img"
          aria-label={`总光合${q.gross.toFixed(2)}，呼吸${respiration}，净光合${q.net.toFixed(2)}相对单位`}
        >
          <text x="80" y="35">
            同一相对标尺 · CO₂ {p.co2}% · 温度 {p.temp}°C
          </text>
          {[-30, 0, 25, 50, 75, 100].map((v) => (
            <g key={v}>
              <path d={`M80 ${y(v)}H680`} stroke="var(--ui-line)" />
              <text x="62" y={y(v) + 6} textAnchor="end">
                {v}
              </text>
            </g>
          ))}
          {[0, 25, 50, 75, 100].map((l) => (
            <g key={l}>
              <path
                d={`M${x(l)} 80V366`}
                stroke="var(--ui-line)"
                strokeDasharray="4 4"
              />
              <text x={x(l)} y="394" textAnchor="middle">
                {l}
              </text>
            </g>
          ))}
          <path d="M80 300H680" stroke="var(--ui-muted)" strokeWidth="2" />
          <path
            d={paths[0]}
            fill="none"
            stroke="var(--ui-primary)"
            strokeWidth="2"
          />
          <path
            d={`M80 ${y(respiration)}H680`}
            fill="none"
            stroke="var(--ui-gold)"
            strokeWidth="2"
            strokeDasharray="7 5"
          />
          <path
            d={paths[1]}
            fill="none"
            stroke="var(--ui-ink)"
            strokeWidth="3"
          />
          {q.compensation !== null && (
            <circle
              cx={x(q.compensation)}
              cy="300"
              r="7"
              fill="var(--ui-paper)"
              stroke="var(--ui-gold)"
              strokeWidth="2"
            />
          )}
          <path
            d={`M${x(p.light)} 80V366`}
            stroke="var(--ui-muted)"
            strokeDasharray="3 4"
          />
          <circle
            data-testid="photo-net-point"
            cx={x(p.light)}
            cy={y(q.net)}
            r="6"
            fill="var(--ui-ink)"
          />
          <text x="380" y="427" textAnchor="middle">
            相对光照 / %
          </text>
        </svg>
      </div>
      <p className="photo-net-legend">
        绿色细线：总光合 P　金色虚线：呼吸 R　粗实线：净光合 P−R　空心圈：补偿点
      </p>
      <p className="photo-net-balance">
        当前收支：{q.gross.toFixed(2)} − {respiration.toFixed(2)} ={" "}
        <strong>{(Math.abs(q.net) < 1e-7 ? 0 : q.net).toFixed(2)}</strong>{" "}
        相对单位。
        {Math.abs(q.net) < 1e-7
          ? "收支平衡，净光合为零。"
          : q.net > 0
            ? "总光合超过呼吸，净固定为正。"
            : "呼吸超过总光合，净固定为负。"}
      </p>
      <p>
        {q.compensation === null
          ? "当前0—100%光照范围内，总光合始终小于呼吸，没有补偿点。"
          : `本组假设下，补偿点光照约 ${q.compensation.toFixed(2)}%。净光合为零不等于总光合与呼吸都停止。`}
      </p>
      <p>
        R只作用于本节收支图；上方三维仪表与原曲线仍显示总光合。切换章节后R恢复默认10。若要模拟温度对呼吸的影响，需要另外的呼吸模型与实验依据。
      </p>
    </section>
  );
}
