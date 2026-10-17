import React from "react";
import Button from "./LabButton.jsx";
import { networkState } from "./networkLesson.mjs";
import "./NetworkEvidence.css";
export default function NetworkEvidence({ p, onChange }) {
  const q = networkState(p);
  return (
    <section className="network-evidence" aria-label="连接方式与支路读数">
      <div className="motion-shortcuts">
        {["串联", "并联"].map((label, mode) => (
          <Button
            key={label}
            aria-pressed={p.mode === mode}
            onClick={() => onChange({ ...p, mode, branch2: 1 })}
          >
            {label}
          </Button>
        ))}
        <Button
          aria-pressed={!!p.closed}
          onClick={() => onChange({ ...p, closed: p.closed ? 0 : 1 })}
        >
          {p.closed ? "断开总开关" : "闭合总开关"}
        </Button>
        {p.mode === 1 && (
          <Button
            onClick={() =>
              onChange({ ...p, branch2: q.branch2Connected ? 0 : 1 })
            }
          >
            {q.branch2Connected ? "断开 R₂ 支路" : "闭合 R₂ 支路"}
          </Button>
        )}
      </div>
      <p>
        <strong>当前接法：{p.mode === 1 ? "并联" : "串联"}</strong>
        {p.mode === 1 && !q.branch2Connected ? " · R₂ 支路断开" : ""}
      </p>
      <p>
        切换连接方式保持电源电压与两只电阻不变，恢复 R₂
        支路连接并暂停动画。表中数值是模型计算值。
      </p>
      <div
        className="network-values"
        tabIndex="0"
        role="region"
        aria-label="支路读数表，可横向滚动"
      >
        <table>
          <thead>
            <tr>
              <th>器件</th>
              <th>电压</th>
              <th>电流</th>
              <th>功率</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["R₁", q.u1, q.i1, q.power1],
              ["R₂", q.u2, q.i2, q.power2],
            ].map(([name, u, i, power]) => (
              <tr key={name}>
                <th>{name}</th>
                <td>{u.toFixed(2)} V</td>
                <td>{i.toFixed(3)} A</td>
                <td>{power.toFixed(3)} W</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="network-voltage" aria-label="电阻电压与电源电压对照">
        {[
          ["R₁", q.u1],
          ["R₂", q.u2],
        ].map(([name, u]) => (
          <div key={name}>
            <span>{name}</span>
            <div className="network-voltage-track">
              <div style={{ width: `${p.u > 0 ? (u / p.u) * 100 : 0}%` }} />
            </div>
            <span>
              {u.toFixed(2)} / {p.u.toFixed(2)} V
            </span>
          </div>
        ))}
      </div>
      <p>
        {p.u === 0
          ? "电源为 0 V：开关即使闭合，电流也为零。"
          : !p.closed
            ? "电源显示值仍存在，但开关断开，负载两端电压和电流均为零。"
            : p.mode === 1 && !q.branch2Connected
              ? `R₂ 支路断开：R₁ 仍有电流。R₂ 电阻两端为 0 V，断开的支路开关两端为 ${q.switchVoltage.toFixed(2)} V；不要混淆两个测量位置。`
              : p.mode === 1
                ? "并联的两条电压条都达到电源电压，不应把两支路电压相加当作总电压。"
                : "串联的两段电压相加等于电源电压，阻值较大的一段分压较多。"}
      </p>
    </section>
  );
}
