import React, { useId } from "react";
import Button from "./LabButton.jsx";
import { microscopeReference } from "./microscopeReference.mjs";
import "./MicroscopeMotionStudy.css";

export default function MicroscopeMotionStudy({ p, onChange, onReference }) {
  const clip = useId();
  const point = microscopeReference(p);
  const centered = p.x === 0 && p.y === 0;
  function prepare(x, y) {
    Object.entries({
      specimen: 0,
      mag: 100,
      coarse: 50,
      focus: 50,
      power: 1,
      light: 70,
      aperture: 70,
      x,
      y,
    }).forEach(([k, v]) => onChange(k, v));
    onReference(true);
  }
  return (
    <section
      className="microscope-motion-study"
      aria-label="玻片与倒像方向练习"
    >
      <h3>往哪边移动，才能回到中央？</h3>
      <p>
        先选一个偏心情境，再移动玻片。金色点标记玻片原点，与目镜中的教学参考点同步，不是细胞结构。
      </p>
      <div className="micro-motion-choices">
        {[
          ["物像偏右", -24, 0],
          ["物像偏左", 24, 0],
          ["物像偏上", 0, -24],
          ["物像偏下", 0, 24],
        ].map(([label, x, y]) => (
          <Button key={label} onClick={() => prepare(x, y)}>
            {label}
          </Button>
        ))}
      </div>
      <div className="micro-motion-pair">
        {[false, true].map((image) => (
          <figure key={String(image)}>
            <figcaption>{image ? "目镜：倒像" : "载物台：玻片"}</figcaption>
            <svg
              viewBox="0 0 160 160"
              role="img"
              aria-label={image ? "物像与玻片反向移动" : "玻片相对起点的位置"}
            >
              {image ? (
                <circle
                  cx="80"
                  cy="80"
                  r="62"
                  fill="var(--ui-paper)"
                  stroke="var(--ui-line)"
                />
              ) : (
                <rect
                  x="10"
                  y="28"
                  width="140"
                  height="104"
                  rx="4"
                  fill="var(--ui-paper)"
                  stroke="var(--ui-line)"
                />
              )}
              <defs>
                <clipPath id={`${clip}-${image}`}>
                  <circle cx="80" cy="80" r="62" />
                </clipPath>
              </defs>
              <path
                d="M72 80H88M80 72V88"
                stroke="var(--ui-muted)"
                strokeDasharray="2 2"
              />
              <g clipPath={image ? `url(#${clip}-${image})` : undefined}>
                <g
                  transform={`translate(${80 + (image ? point.dx / 2 : p.x)} ${80 + (image ? point.dy / 2 : -p.y)})`}
                >
                  <path
                    d="M-7 0H7M0-7V7"
                    stroke="var(--ui-gold)"
                    strokeWidth="2"
                  />
                  <circle r="3" fill="var(--ui-gold)" />
                  <text
                    x="0"
                    y="-12"
                    textAnchor="middle"
                    fill="var(--ui-ink)"
                    fontSize="25"
                    transform={image ? "rotate(180)" : undefined}
                  >
                    e
                  </text>
                </g>
              </g>
            </svg>
          </figure>
        ))}
      </div>
      <p role="status">
        {centered
          ? "参考点已居中。可以换高倍继续观察。"
          : `要居中，玻片应${p.x < 0 ? "向右" : p.x > 0 ? "向左" : ""}${p.x !== 0 && p.y !== 0 ? "、" : ""}${p.y < 0 ? "向上" : p.y > 0 ? "向下" : ""}移动。`}
      </p>
      <div
        className="micro-motion-choices"
        role="group"
        aria-label="练习移动玻片"
      >
        {[
          ["x", -8, "玻片左移"],
          ["y", 8, "玻片上移"],
          ["y", -8, "玻片下移"],
          ["x", 8, "玻片右移"],
        ].map(([key, delta, label]) => (
          <Button
            key={label}
            disabled={delta < 0 ? p[key] <= -40 : p[key] >= 40}
            onClick={() =>
              onChange(key, Math.max(-40, Math.min(40, p[key] + delta)))
            }
          >
            {label}
          </Button>
        ))}
      </div>
      <small>
        情境会载入100×字母标本并恢复照明与合焦。左图是方向示意，左右图不采用相同尺度；右图原点位置按当前倍率联动，虚线十字表示视野中心。若参考点移出视野，先退回低倍寻找。可用目镜下方原有按钮每次移动一小步。
      </small>
    </section>
  );
}
