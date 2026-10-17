import React from "react";
import { lens } from "./models.mjs";
export default function LensScreenCheck({ p, onPrepare, screenControl }) {
  const q = lens(p.u, p.f),
    min = screenControl?.min ?? 5,
    max = screenControl?.max ?? 60;
  const finite = q.v !== null && q.v > 0,
    reachable = finite && q.v >= min && q.v <= max;
  const screen = p.screen ?? 15;
  const x = (value) => 30 + (240 * value) / max;
  return (
    <details className="lens-screen-check">
      <summary>找到像以后，核对光屏位置</summary>
      <p>
        先手动移动光屏寻找清晰像，再用下方按钮核对。按钮只改变光屏位置，不改变物距、焦距或光源。
      </p>
      {reachable ? (
        <>
          <svg
            viewBox="0 0 300 155"
            role="img"
            aria-label={`理论像距${q.v.toFixed(2)}厘米，光屏距透镜${screen.toFixed(2)}厘米`}
            style={{
              width: "100%",
              display: "block",
              fontSize: 15,
              fill: "var(--ui-ink)",
            }}
          >
            <path d="M30 72H270" stroke="var(--ui-muted)" />
            <path d="M30 50V94" stroke="var(--ui-ink)" strokeWidth="3" />
            <path
              d={`M${x(q.v)} 35V72`}
              stroke="var(--ui-primary)"
              strokeWidth="3"
            />
            <path
              d={`M${x(screen)} 72V110`}
              stroke="var(--ui-gold)"
              strokeWidth="3"
            />
            <text x="30" y="22">
              理论像面 · {q.v.toFixed(2)} cm
            </text>
            <text x="30" y="135">
              实际光屏 · {screen.toFixed(2)} cm
            </text>
            <text x="30" y="153">
              透镜为0 · 水平刻度0—{max} cm
            </text>
          </svg>
          <div className="lens-screen-actions">
            {[
              [-2, "像面前2 cm"],
              [0, "理论像面"],
              [2, "像面后2 cm"],
            ].map(([delta, label]) => {
              const target = q.v + delta;
              return (
                <button
                  key={delta}
                  disabled={target < min || target > max}
                  aria-pressed={Math.abs(screen - target) < 1e-7}
                  onClick={() => onPrepare({ screen: target })}
                >
                  {label}
                </button>
              );
            })}
          </div>
          <p>
            光屏位置减像距：{(screen - q.v).toFixed(2)}{" "}
            cm。负值表示光屏更靠近透镜，正值表示更远。与像面重合不保证像完整落在屏内，仍需检查光源、对齐和屏的大小。
          </p>
        </>
      ) : (
        <p>
          {!finite
            ? "当前没有可由右侧光屏承接的有限实像，不能使用像面前后对照。"
            : `理论像面在${q.v.toFixed(2)} cm，超出光屏${min}—${max} cm行程；先调整物距，再核对。`}
        </p>
      )}
    </details>
  );
}
