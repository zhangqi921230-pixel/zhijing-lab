import React from "react";
import SeismicDistanceHandle from "./SeismicDistanceHandle.jsx";
import "./SeismicMotion.css";
import { seismic } from "./advancedModels.mjs";
import "./PhotoResponsePlot.css";

export function seismicTriangle(depth, distance) {
  const scale = 3.125;
  const left = 45;
  return {
    source: [left, 36 + depth * scale],
    epicenter: [left, 36],
    station: [left + distance * scale, 36],
  };
}
export default function SeismicDistanceGuide({ p, onChange }) {
  const q = seismic(p, 0),
    { source, epicenter, station } = seismicTriangle(p.depth, p.distance);
  return (
    <section
      className="photo-response seismic-distance-guide"
      aria-label="震源到台站的距离关系"
    >
      <header>
        <strong>波走的是斜边路程</strong>
        <span>固定比例剖面</span>
      </header>
      <svg
        viewBox="0 0 340 176"
        role="group"
        aria-label={`深度 ${p.depth} km，震中距 ${p.distance} km，震源距 ${q.distance.toFixed(2)} km`}
      >
        <path
          d={`M${source}L${epicenter}L${station}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path d={`M${source}L${station}`} stroke="#d4a65a" strokeWidth="3" />
        <path
          d={`M${source[0]} 47h11V36`}
          fill="none"
          stroke="currentColor"
          opacity=".5"
        />
        <SeismicDistanceHandle
          kind="depth"
          point={source}
          value={p.depth}
          onChange={onChange}
        />
        <SeismicDistanceHandle
          kind="distance"
          point={station}
          value={p.distance}
          onChange={onChange}
        />
        <text x={source[0]} y="20" textAnchor="middle">
          震中
        </text>
        <text x={Math.min(290, station[0] + 8)} y="20" textAnchor="start">
          台站
        </text>
        <text x={source[0] + 10} y={source[1] + 22} textAnchor="start">
          震源
        </text>
      </svg>
      <dl className="seismic-distance-readouts">
        <div>
          <dt>震源深度 h</dt>
          <dd>{p.depth} km</dd>
        </div>
        <div>
          <dt>震中距 d</dt>
          <dd>{p.distance} km</dd>
        </div>
        <div>
          <dt>震源距 L</dt>
          <dd>{q.distance.toFixed(2)} km</dd>
        </div>
      </dl>
      <p className="seismic-distance-formula">L = √(d² + h²)</p>
      <p className="photo-current">
        Δt = L × (1 / 3.5 − 1 / 6) ={" "}
        <strong>{(q.ts - q.tp).toFixed(2)} s</strong>
      </p>
      <p>
        拖动金色震源上下调深度，拖动蓝色台站左右调震中距；也可用方向键微调，Home/End
        到两端。图的比例保持不变，观察斜边与到时差一起变化。单个台站的到时差约束的是震源距，不能单独确定震源方位；这里采用均匀介质中的直线路径。
      </p>
    </section>
  );
}
