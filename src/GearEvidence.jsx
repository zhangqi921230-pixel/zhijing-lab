import React from "react";
import Button from "./LabButton.jsx";
import { gearTravel } from "./gearTravel.mjs";
import "./GearEvidence.css";
export default function GearEvidence({ p, time, onSeek }) {
  const q = gearTravel(p, time);
  return (
    <section className="gear-evidence" aria-label="齿轮转数与齿距对照">
      <h3>相同齿距通过，不同转数</h3>
      <p>
        从起点累计通过啮合点的齿距数相同。下列格条每格代表一个齿距；每满 12
        格重新开始一行，累计值不清零。
      </p>
      {[
        ["主动轮", q.driverTurns, p.driver],
        ["从动轮", q.drivenTurns, p.driven],
      ].map(([name, turns, teeth]) => (
        <div key={name} className="gear-evidence-row">
          <strong>
            {name} · {teeth} 齿
          </strong>
          <span>
            {turns.toFixed(3)} 圈 × {teeth} 齿 ≈ {q.pitches.toFixed(2)} 个齿距
          </span>
          <div className="gear-pitch-strip" aria-hidden="true">
            {Array.from({ length: 12 }, (_, i) => (
              <i key={i}>
                <b
                  style={{
                    width: `${Math.max(0, Math.min(1, (q.pitches % 12) - i)) * 100}%`,
                  }}
                />
              </i>
            ))}
          </div>
        </div>
      ))}
      <div className="motion-shortcuts" aria-label="定位齿距通过时刻">
        {[1, 6, 12].map((n) => (
          <Button
            key={n}
            disabled={n / q.rate > 6}
            onClick={() => onSeek(n / q.rate)}
          >
            通过 {n} 个齿距
          </Button>
        ))}
      </div>
      <p>
        超过本段 6 秒演示范围的定位按钮不可用。当前每秒通过 {q.rate.toFixed(2)}{" "}
        个齿距；齿距计数表示运动距离，不是当前相互接触的齿数。
      </p>
    </section>
  );
}
