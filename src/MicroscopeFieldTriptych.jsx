import React from "react";
import Button from "./LabButton.jsx";
import { microscopeReference } from "./microscopeReference.mjs";
export default function MicroscopeFieldTriptych({ x, y, mag, onChange }) {
  return (
    <section
      className="micro-field-triptych"
      aria-label="同一目标的三倍率视野对照"
    >
      <h4>不动玻片，换物镜会看到什么？</h4>
      <p>
        三幅圆框都是目镜视野。玻片位置相同，金色参考点随倍率放大；超出圆框时不再可见。
      </p>
      <div className="micro-field-cards">
        {[40, 100, 400].map((total) => {
          const point = microscopeReference({ mag: total, x, y });
          return (
            <figure key={total}>
              <svg
                viewBox="0 0 180 180"
                role="img"
                aria-label={`${total}倍：参考点${point.visible ? "在视野内" : "已离开视野"}`}
              >
                <circle
                  cx="90"
                  cy="90"
                  r="70"
                  fill="var(--ui-paper)"
                  stroke={
                    mag === total ? "var(--ui-primary)" : "var(--ui-muted)"
                  }
                  strokeWidth={mag === total ? 3 : 1.5}
                />
                <path d="M82 90H98M90 82V98" stroke="var(--ui-muted)" />
                {point.visible && (
                  <circle
                    data-reference-mag={total}
                    cx={90 + (point.dx * 70) / 124}
                    cy={90 + (point.dy * 70) / 124}
                    r="4"
                    fill="var(--ui-gold)"
                    stroke="var(--ui-ink)"
                  />
                )}
              </svg>
              <figcaption>
                <strong>
                  {total}× · {(180 / total).toFixed(2)} mm
                </strong>
                <span>{point.visible ? "参考点可见" : "参考点已出视野"}</span>
              </figcaption>
              <Button
                disabled={!onChange}
                primary={mag === total}
                aria-pressed={mag === total}
                onClick={() => onChange("mag", total)}
              >
                切到 {total}×
              </Button>
            </figure>
          );
        })}
      </div>
      <p>
        圆框大小相同不表示标本范围相同；高倍显示的实际范围更小。本图只判断参考点中心是否在视野内，不表示调焦或亮度状态。
      </p>
    </section>
  );
}
