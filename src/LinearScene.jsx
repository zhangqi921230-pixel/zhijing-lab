import LinearStudyGuide from "./LinearStudyGuide.jsx";
import { linearZero } from "./linearStudy.mjs";
import "./LinearStudyGuide.css";
import React, { useRef, useState } from "react";
import { format } from "./models.mjs";

export const graphPoint = (x, y, extent) => [
  310 + (x * 230) / extent,
  290 - (y * 230) / extent,
];
export const graphCoordinates = (x, y, extent) => [
  ((x - 310) * extent) / 230,
  ((290 - y) * extent) / 230,
];
export const snapLinear = (value, min, max) =>
  Math.max(min, Math.min(max, Math.round(value * 10) / 10));
export function linearSegment(k, b, extent) {
  const pts = [];
  for (const x of [-extent, extent]) {
    const y = k * x + b;
    if (Math.abs(y) <= extent + 1e-9) pts.push([x, y]);
  }
  if (k !== 0)
    for (const y of [-extent, extent]) {
      const x = (y - b) / k;
      if (
        Math.abs(x) <= extent + 1e-9 &&
        !pts.some((p) => Math.hypot(p[0] - x, p[1] - y) < 1e-8)
      )
        pts.push([x, y]);
    }
  return pts.slice(0, 2);
}
export default function LinearScene({ p, onChange, chapter = 0 }) {
  const [anchor, setAnchor] = useState(-1),
    [extent, setExtent] = useState(8),
    [triangle, setTriangle] = useState(true),
    [compare, setCompare] = useState(false);
  const drag = useRef(null),
    svg = useRef(null);
  const y = p.k * p.x + p.b,
    point = graphPoint(p.x, y, extent),
    intercept = graphPoint(0, p.b, extent),
    step = extent <= 8 ? 2 : 4;
  const anchorPoint = graphPoint(anchor, p.k * anchor + p.b, extent),
    zero = linearZero(p.k, p.b);
  const visible = Math.abs(y) <= extent;
  const linePath = (k, b) => {
    const seg = linearSegment(k, b, extent);
    return seg.length === 2
      ? `M${graphPoint(...seg[0], extent).join(" ")}L${graphPoint(...seg[1], extent).join(" ")}`
      : "";
  };
  function move(e) {
    if (!drag.current) return;
    const matrix = svg.current.getScreenCTM();
    if (!matrix) return;
    const pos = new DOMPoint(e.clientX, e.clientY).matrixTransform(
      matrix.inverse(),
    );
    const [x, y] = graphCoordinates(pos.x, pos.y, extent);
    onChange(
      drag.current,
      drag.current === "x" ? snapLinear(x, -4, 4) : snapLinear(y, -4, 4),
    );
  }
  function handle(key) {
    return {
      role: "slider",
      tabIndex: 0,
      "aria-label": key === "x" ? "拖动观察点的横坐标" : "拖动纵轴截距",
      "aria-valuemin": -4,
      "aria-valuemax": 4,
      "aria-valuenow": p[key],
      onPointerDown: (e) => {
        drag.current = key;
        e.currentTarget.setPointerCapture(e.pointerId);
        e.preventDefault();
      },
      onPointerMove: move,
      onPointerUp: (e) => {
        drag.current = null;
        e.currentTarget.releasePointerCapture(e.pointerId);
      },
      onPointerCancel: () => {
        drag.current = null;
      },
      onLostPointerCapture: () => {
        drag.current = null;
      },
      onKeyDown: (e) => {
        if (
          [
            "ArrowLeft",
            "ArrowDown",
            "ArrowRight",
            "ArrowUp",
            "Home",
            "End",
          ].includes(e.key)
        ) {
          e.preventDefault();
          onChange(
            key,
            e.key === "Home"
              ? -4
              : e.key === "End"
                ? 4
                : snapLinear(
                    p[key] +
                      (["ArrowLeft", "ArrowDown"].includes(e.key) ? -0.1 : 0.1),
                    -4,
                    4,
                  ),
          );
        }
      },
    };
  }
  return (
    <div className="linear-studio">
      <div className="linear-title">
        <span>坐标与变化</span>
        <strong>
          y = {format(p.k)}x {p.b < 0 ? "−" : "+"} {format(Math.abs(p.b))}
        </strong>
        <small>
          {p.k === 0 ? "k = 0：常数函数" : "拖动图中的圆点，沿着直线观察变化"}
        </small>
      </div>
      <div className="linear-workspace">
        <svg
          ref={svg}
          viewBox="0 0 620 580"
          role="group"
          aria-label="可操作的函数坐标图，横纵轴等比例"
        >
          <defs>
            <pattern
              id="linear-paper"
              width="6"
              height="6"
              patternUnits="userSpaceOnUse"
            >
              <path d="M0 0h1" stroke="#6e7350" strokeOpacity=".06" />
            </pattern>
            <clipPath id="linear-clip">
              <rect x="80" y="60" width="460" height="460" />
            </clipPath>
            <marker
              id="linear-arrow"
              viewBox="0 0 8 8"
              refX="7"
              refY="4"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M0 0L8 4L0 8Z" fill="var(--ui-muted)" />
            </marker>
          </defs>
          <rect
            x="50"
            y="30"
            width="520"
            height="520"
            rx="8"
            fill="var(--ui-paper)"
            stroke="var(--ui-line)"
          />
          <rect
            x="50"
            y="30"
            width="520"
            height="520"
            fill="url(#linear-paper)"
          />
          {Array.from({ length: extent * 2 + 1 }, (_, i) => i - extent).map(
            (v) => {
              const [x, y] = graphPoint(v, v, extent);
              return (
                <g key={v}>
                  <path
                    d={`M${x} 60V520M80 ${y}H540`}
                    stroke={
                      v % step === 0 ? "var(--ui-line)" : "var(--ui-line)"
                    }
                    strokeWidth={v % step === 0 ? 1 : 0.6}
                  />
                  {v !== 0 && v % step === 0 && (
                    <>
                      <text
                        x={x}
                        y="310"
                        textAnchor="middle"
                        fontSize="14"
                        fill="var(--ui-muted)"
                      >
                        {v}
                      </text>
                      <text
                        x="298"
                        y={y + 4}
                        textAnchor="end"
                        fontSize="14"
                        fill="var(--ui-muted)"
                      >
                        {v}
                      </text>
                    </>
                  )}
                </g>
              );
            },
          )}
          <path
            d="M70 290H552"
            fill="none"
            stroke="var(--ui-muted)"
            strokeWidth="1.6"
            markerEnd="url(#linear-arrow)"
          />
          <path
            d="M310 530V48"
            fill="none"
            stroke="var(--ui-muted)"
            strokeWidth="1.6"
            markerEnd="url(#linear-arrow)"
          />
          <text x="555" y="311" fill="var(--ui-ink)" fontSize="17">
            x
          </text>
          <text x="326" y="53" fill="var(--ui-ink)" fontSize="17">
            y
          </text>
          <text x="295" y="310" fill="var(--ui-muted)" fontSize="14">
            0
          </text>
          <g clipPath="url(#linear-clip)">
            {chapter === 3 && (
              <>
                <path
                  d={`M${anchorPoint.join(" ")}L${point[0]} ${anchorPoint[1]}L${point.join(" ")}`}
                  fill="none"
                  stroke="var(--ui-gold)"
                  strokeDasharray="5 4"
                  strokeWidth="2"
                />
                <circle
                  cx={anchorPoint[0]}
                  cy={anchorPoint[1]}
                  r="7"
                  fill="var(--ui-gold)"
                />
                <text
                  x={anchorPoint[0] - 12}
                  y={anchorPoint[1] - 15}
                  textAnchor="end"
                  fill="var(--ui-ink)"
                  fontSize="16"
                >
                  A
                </text>
              </>
            )}
            {chapter === 4 &&
              zero.kind === "one" &&
              Math.abs(zero.x) <= extent && (
                <g>
                  <circle
                    cx={graphPoint(zero.x, 0, extent)[0]}
                    cy="290"
                    r="10"
                    fill="none"
                    stroke="var(--ui-gold)"
                    strokeWidth="3"
                  />
                  <text
                    x={graphPoint(zero.x, 0, extent)[0]}
                    y="332"
                    textAnchor="middle"
                    fill="var(--ui-ink)"
                    fontSize="14"
                  >
                    零点 {format(zero.x)}
                  </text>
                </g>
              )}
            {compare && (
              <path
                d={linePath(p.k, 0)}
                fill="none"
                stroke="#98a392"
                strokeDasharray="7 5"
                strokeWidth="2"
              />
            )}
            {triangle && (
              <>
                <path
                  d={`M${intercept.join(" ")}L${graphPoint(1, p.b, extent).join(" ")}L${graphPoint(1, p.b + p.k, extent).join(" ")}Z`}
                  fill="#dbaa4524"
                  stroke="#ba923f"
                  strokeWidth="2"
                />
                <path
                  d={linePath(p.k, p.b)}
                  fill="none"
                  stroke="var(--ui-primary)"
                  strokeWidth="3"
                />
              </>
            )}
            {!triangle && (
              <path
                d={linePath(p.k, p.b)}
                fill="none"
                stroke="var(--ui-primary)"
                strokeWidth="3"
              />
            )}
            <path
              d={`M${point[0]} 290V${point[1]}H310`}
              fill="none"
              stroke="#cd9b41"
              strokeDasharray="4 4"
              strokeWidth="1.5"
            />
          </g>
          <g {...handle("b")} className="graph-handle">
            <circle
              cx={intercept[0]}
              cy={intercept[1]}
              r="19"
              fill="transparent"
            />
            <path
              d={`M${intercept[0]} ${intercept[1] - 8}l8 8l-8 8l-8-8Z`}
              fill="#b98832"
              stroke="var(--ui-paper)"
              strokeWidth="2"
            />
          </g>
          {visible && (
            <g {...handle("x")} className="graph-handle">
              <circle cx={point[0]} cy={point[1]} r="20" fill="transparent" />
              <circle
                cx={point[0]}
                cy={point[1]}
                r="8"
                fill="var(--ui-primary)"
                stroke="var(--ui-paper)"
                strokeWidth="3"
              />
              <text
                x={point[0] + (p.x > 0 ? -14 : 14)}
                y={point[1] + (y > extent - 1 ? 26 : -16)}
                textAnchor={p.x > 0 ? "end" : "start"}
                fontSize="15"
                fill="var(--ui-primary)"
                paintOrder="stroke"
                stroke="var(--ui-paper)"
                strokeWidth="4"
              >
                P ({format(p.x)}, {format(y)})
              </text>
            </g>
          )}
          <text
            x="310"
            y="573"
            textAnchor="middle"
            fill="var(--ui-muted)"
            fontSize="13"
          >
            每格 1 单位 · 横纵轴同尺度 · 视野 ±{extent}
          </text>
        </svg>
        <div className="linear-insights">
          <LinearStudyGuide
            {...{ p, chapter, anchor, onChange }}
            onAnchor={setAnchor}
          />
          {chapter < 3 && (
            <>
              <div>
                <span>观察点 P</span>
                <strong>
                  ({format(p.x)}, {format(y)})
                </strong>
                <p>x 每增加 1，y 改变 {format(p.k)}。</p>
              </div>
              <div>
                <span>斜率三角形</span>
                <strong>k = Δy / Δx</strong>
                <p>
                  Δx = 1，Δy = {format(p.k)}。
                  {p.k < 0
                    ? "向右走，图像下降。"
                    : p.k > 0
                      ? "向右走，图像上升。"
                      : "图像与 x 轴平行。"}
                </p>
              </div>
              <div>
                <span>纵轴截距</span>
                <strong>b = {format(p.b)}</strong>
                <p>金色菱形对应 (0, {format(p.b)})，沿纵轴拖动可平移直线。</p>
              </div>
            </>
          )}
          {!visible && (
            <div className="graph-outside" role="status">
              观察点超出当前视野。
              <button
                onClick={() =>
                  setExtent(
                    Math.min(18, Math.max(8, Math.ceil(Math.abs(y) + 1))),
                  )
                }
              >
                显示完整观察点
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="linear-tools">
        <button aria-pressed={triangle} onClick={() => setTriangle((v) => !v)}>
          斜率三角形
        </button>
        <button aria-pressed={compare} onClick={() => setCompare((v) => !v)}>
          对照 y = kx
        </button>
        <label>
          视野{" "}
          <select
            value={extent}
            onChange={(e) => setExtent(Number(e.target.value))}
          >
            {[...new Set([8, 12, 18, extent])]
              .sort((a, b) => a - b)
              .map((v) => (
                <option value={v} key={v}>
                  ±{v}
                </option>
              ))}
          </select>
        </label>
      </div>
      <p className="linear-help">
        圆点沿直线移动，菱形调整截距；也可用方向键微调，Home / End
        到达边界。参数栏可调整全部变量。
      </p>
    </div>
  );
}
