import React from "react";
import Button from "./LabButton.jsx";
import { mechanismState } from "./mechanismLessons.mjs";
import "./BuoyancyWeighing.css";
export default function BuoyancyWeighing({ p, time, onSeek }) {
  const q = mechanismState("buoyancy-lift", p, time),
    fraction = q.buoyancy / q.weight;
  return (
    <section className="buoyancy-weighing" aria-label="称重法浮力对照">
      <h3>两次称重，求出浮力</h3>
      <p>
        保持同一个物体。空气中读数 G 与当前液体中读数 T
        的差，就是浮力。空气参考随物体体积和密度同步计算，不是先前物体的测量记录。
      </p>
      <div className="motion-shortcuts" aria-label="称重观察位置">
        {[
          ["空气中称重", 0],
          ["浸入一半", 3],
          ["刚好全浸没", 4],
          ["浸没后下移", 6],
        ].map(([label, t]) => (
          <Button
            key={t}
            primary={Math.abs(time - t) < 0.001}
            aria-pressed={Math.abs(time - t) < 0.001}
            onClick={() => onSeek(t)}
          >
            {label}
          </Button>
        ))}
      </div>
      <div className="weighing-readings">
        <div>
          <span>① 空气参考 G</span>
          <strong>{q.weight.toFixed(2)} N</strong>
        </div>
        <div>
          <span>② 当前示数 T</span>
          <strong>{q.tension.toFixed(2)} N</strong>
        </div>
        <div>
          <span>③ 差值 G − T</span>
          <strong>{q.buoyancy.toFixed(2)} N</strong>
        </div>
      </div>
      <div className="weighing-bar" aria-hidden="true">
        <i style={{ width: `${(1 - fraction) * 100}%` }} />
        <b style={{ width: `${fraction * 100}%` }} />
      </div>
      <p className="weighing-legend">
        绿色：悬线承担 {(100 * (1 - fraction)).toFixed(1)}%　蓝色：浮力承担{" "}
        {(100 * fraction).toFixed(1)}% 的重力
      </p>
      <p>
        <strong>用排水量交叉验证：</strong>ρ液 × g × V排 = {p.liquidDensity} ×
        9.8 × {(q.displaced * 1e-6).toFixed(6)} ≈ {q.buoyancy.toFixed(2)} N。
      </p>
      <p>
        体积换算：1 cm³ = 10⁻⁶
        m³。显示值经过四舍五入，计算使用未舍入值；本演示忽略空气浮力。
      </p>
    </section>
  );
}
