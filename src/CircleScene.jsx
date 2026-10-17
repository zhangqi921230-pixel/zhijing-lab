import RadiusScaleStudy from "./RadiusScaleStudy.jsx";
import React, { useRef } from "react";
import { format } from "./models.mjs";
import CircleCordBoard from "./CircleCordBoard.jsx";
import CircleLimitStudy from "./CircleLimitStudy.jsx";

export function circleDissection(r, n) {
  const half = Math.PI / n,
    chord = 2 * r * Math.sin(half),
    height = r * Math.cos(half);
  return {
    half,
    chord,
    height,
    width: ((n + 1) * chord) / 2,
    area: Math.PI * r * r,
    sectorArea: (Math.PI * r * r) / n,
    sagitta: r - height,
    base: (n * chord) / 2,
  };
}
export function circleSector(r, n) {
  const { chord, height } = circleDissection(r, n);
  return `M0 0L${chord / 2} ${height}A${r} ${r} 0 0 1 ${-chord / 2} ${height}Z`;
}
export function packedSector(r, n, i) {
  const q = circleDissection(r, n);
  return {
    x: (i * q.chord) / 2 - q.width / 2 + q.chord / 2,
    y: i % 2 ? q.height / 2 : -q.height / 2,
    angle: i % 2 ? 180 : 0,
  };
}
function Pieces({ r, n, t, id, angleOffset = 0 }) {
  return Array.from({ length: n }, (_, i) => {
    const target = packedSector(r, n, i),
      initial = (i * 360) / n + angleOffset,
      delta = ((target.angle - initial + 540) % 360) - 180;
    return (
      <path
        key={i}
        d={circleSector(r, n)}
        transform={`translate(${240 + target.x * t},${160 + target.y * t}) rotate(${initial + delta * t})`}
        fill={`url(#${id}-${i % 2 ? "light" : "dark"})`}
        stroke="#f4eedb"
        strokeWidth=".8"
      />
    );
  });
}
function Board({
  p,
  rearranged,
  onChange,
  unitScale = 23,
  cordAligned = false,
}) {
  const dragging = useRef(false);
  const setRadius = (value) =>
    onChange?.("r", Math.round(Math.max(1, Math.min(5, value)) * 10) / 10);
  const moveRadius = (event) => {
    if (!dragging.current) return;
    const matrix = event.currentTarget.ownerSVGElement.getScreenCTM();
    if (!matrix) return;
    const point = new DOMPoint(event.clientX, event.clientY).matrixTransform(
      matrix.inverse(),
    );
    setRadius((point.x - 240) / unitScale);
  };
  const r = p.r * unitScale,
    n = p.parts,
    t = rearranged ? (p.rearrange ?? 100) / 100 : 0,
    id = rearranged ? "circle-pack" : "circle-source";
  const q = circleDissection(r, n),
    exact = rearranged && t === 1;
  return (
    <svg
      viewBox="0 0 480 340"
      role={rearranged ? "img" : "group"}
      aria-label={
        rearranged ? "扇形交错重排，保留真实圆弧边缘" : "等分圆盘与半径"
      }
    >
      <defs>
        <linearGradient id={`${id}-dark`} x2="1" y2="1">
          <stop stopColor="#4e927e" />
          <stop offset="1" stopColor="#225848" />
        </linearGradient>
        <linearGradient id={`${id}-light`} x2=".5" y2="1">
          <stop stopColor="#e8dcb9" />
          <stop offset="1" stopColor="#c5b680" />
        </linearGradient>
        <filter id={`${id}-shadow`} x="-.2" y="-.2" width="1.4" height="1.5">
          <feDropShadow
            dx="1"
            dy="5"
            stdDeviation="3"
            floodColor="#5d5839"
            floodOpacity=".18"
          />
        </filter>
      </defs>
      <rect
        x="14"
        y="36"
        width="452"
        height="240"
        rx="9"
        fill="#f9f7ea"
        stroke="#d8d1b7"
      />
      <text x="240" y="22" textAnchor="middle" fill="#6d7d68" fontSize="15">
        {rearranged ? "交错拼合 · 面积始终不变" : `${n} 份等面积扇形`}
      </text>
      <g filter={`url(#${id}-shadow)`}>
        <Pieces
          r={r}
          n={n}
          t={t}
          id={id}
          angleOffset={cordAligned ? 180 / n : 0}
        />
      </g>
      {!rearranged && (
        <>
          <path d={`M240 160h${r}`} stroke="#e7b354" strokeWidth="3" />
          <circle cx="240" cy="160" r="3" fill="#fff6d9" />
          <text
            x={240 + r / 2}
            y="146"
            textAnchor="middle"
            fill="#fff6de"
            fontSize="16"
            paintOrder="stroke"
            stroke="#315e49"
            strokeWidth="3"
          >
            r = {format(p.r)} cm
          </text>
          {onChange && (
            <g
              className="circle-radius-handle"
              role="slider"
              tabIndex="0"
              aria-label="拖动圆盘半径"
              aria-orientation="horizontal"
              aria-valuemin="1"
              aria-valuemax="5"
              aria-valuenow={p.r}
              aria-valuetext={`${format(p.r)} 厘米`}
              onPointerDown={(event) => {
                if (event.button !== 0 || event.isPrimary === false) return;
                event.preventDefault();
                event.currentTarget.focus();
                event.currentTarget.setPointerCapture(event.pointerId);
                dragging.current = true;
                moveRadius(event);
              }}
              onPointerMove={moveRadius}
              onPointerUp={(event) => {
                if (!dragging.current) return;
                dragging.current = false;
                event.currentTarget.releasePointerCapture(event.pointerId);
              }}
              onPointerCancel={() => (dragging.current = false)}
              onLostPointerCapture={() => (dragging.current = false)}
              onKeyDown={(event) => {
                const steps = {
                  ArrowRight: 0.1,
                  ArrowUp: 0.1,
                  ArrowLeft: -0.1,
                  ArrowDown: -0.1,
                };
                if (event.key in steps) setRadius(p.r + steps[event.key]);
                else if (event.key === "Home") setRadius(1);
                else if (event.key === "End") setRadius(5);
                else return;
                event.preventDefault();
              }}
            >
              <circle
                className="radius-hit-area"
                cx={240 + r}
                cy="160"
                r="22"
                fill="transparent"
                stroke="transparent"
                strokeWidth="20"
                vectorEffect="non-scaling-stroke"
                pointerEvents="all"
              />
              <circle
                className="radius-knob"
                cx={240 + r}
                cy="160"
                r="8"
                fill="#e7b354"
                stroke="#fff6de"
                strokeWidth="2"
              />
              <path
                d={`M${237 + r} 160h6`}
                stroke="#735516"
                strokeWidth="2"
                pointerEvents="none"
              />
            </g>
          )}
        </>
      )}
      {exact && p.limitRectangle === 1 && (
        <g
          className="circle-limit-reference"
          aria-label="极限参照矩形，长 πr、宽 r"
        >
          <rect
            x={240 - (Math.PI * r) / 2}
            y={160 - r / 2}
            width={Math.PI * r}
            height={r}
            fill="none"
            stroke="#3b7194"
            strokeWidth="2"
            strokeDasharray="6 4"
          />
          <path
            d={`M${240 - (Math.PI * r) / 2} ${143 - r / 2}v8m0-4h${Math.PI * r}m0-4v8`}
            fill="none"
            stroke="#3b7194"
          />
          <text
            x="240"
            y={133 - r / 2}
            textAnchor="middle"
            fill="#3b7194"
            fontSize="14"
          >
            πr ≈ {format(Math.PI * p.r)} cm
          </text>
          <path
            d={`M${254 + (Math.PI * r) / 2} ${160 - r / 2}h8m-4 0v${r}m-4 0h8`}
            fill="none"
            stroke="#3b7194"
          />
          <text
            transform={`translate(${274 + (Math.PI * r) / 2},160) rotate(-90)`}
            textAnchor="middle"
            fill="#3b7194"
            fontSize="14"
          >
            r = {format(p.r)} cm
          </text>
          <text
            x="240"
            y="295"
            textAnchor="middle"
            fill="#3b7194"
            fontSize="14"
          >
            蓝色虚线：极限参照，不是当前拼图的边界
          </text>
        </g>
      )}
      {exact && p.limitRectangle !== 1 && (
        <>
          <path
            d={`M${240 - q.width / 2} 266v8m0-4h${q.width}m0-4v8`}
            fill="none"
            stroke="#879276"
          />
          <text
            x="240"
            y="295"
            textAnchor="middle"
            fill="#6d7d68"
            fontSize="14"
          >
            弧边仍有起伏，端部仍然倾斜
          </text>
        </>
      )}
      <text x="240" y="326" textAnchor="middle" fill="#62735f" fontSize="15">
        {rearranged
          ? t > 0 && t < 1
            ? "移动中可能投影重叠，以端点拼合为准"
            : "分割越细，越接近长 πr、宽 r 的矩形"
          : "拖动金色端点调节半径 · 方向键微调 0.1 cm"}
      </text>
    </svg>
  );
}
export default function CircleScene({ p, onChange, chapter = 1 }) {
  if (chapter === 2) return <RadiusScaleStudy p={p} onChange={onChange} />;
  const q = circleDissection(p.r, p.parts),
    progress = p.rearrange ?? 100,
    cordLength = 2 * Math.PI * p.r * 23,
    diameterLength = 2 * p.r * 23,
    cordStart = (960 - cordLength) / 2;
  return (
    <div className="circle-studio">
      <div className="proof-heading">
        <span>{chapter === 0 ? "从圆周到周长公式" : "从圆盘到面积公式"}</span>
        <strong>
          {chapter === 0 ? "围一圈，展开量一量。" : "剪开、交错、重新拼合。"}
        </strong>
        <p>
          {chapter === 0
            ? "圆周绳逐渐变直，颜色标记与原圆对应，绳长保持不变。"
            : "每一块保留原来的圆弧，分割与重排都不改变面积。"}
        </p>
      </div>
      <div className="circle-boards">
        <Board
          p={p}
          onChange={onChange}
          unitScale={chapter === 0 ? 12 : 23}
          cordAligned={chapter === 0}
        />
        {chapter === 0 ? <CircleCordBoard p={p} /> : <Board p={p} rearranged />}
      </div>
      {chapter >= 3 && (
        <CircleLimitStudy p={p} onChange={onChange} chapter={chapter} />
      )}
      {chapter === 0 && (
        <label className="circle-unroll-control">
          圆周绳展开 <output>{Math.round(p.unroll ?? 100)}%</output>
          <input
            type="range"
            aria-label="圆周绳展开进度"
            min="0"
            max="100"
            step="1"
            value={p.unroll ?? 100}
            onChange={(e) => onChange("unroll", Number(e.target.value))}
          />
        </label>
      )}
      <svg
        className="circle-cord"
        viewBox="0 0 960 204"
        role="img"
        aria-label={`圆周展开测量，长度 ${format(2 * Math.PI * p.r)} 厘米；直径 ${format(2 * p.r)} 厘米，周长与直径之比为 π`}
      >
        <text x="480" y="20" textAnchor="middle" fill="#64745f" fontSize="16">
          沿圆周一圈的绳长 · 展开测量
        </text>
        {Array.from({ length: p.parts }, (_, i) => {
          return (
            <line
              key={i}
              x1={cordStart + (i * cordLength) / p.parts}
              x2={cordStart + ((i + 1) * cordLength) / p.parts}
              y1="50"
              y2="50"
              stroke={i % 2 ? "#c8b986" : "#337862"}
              strokeWidth="8"
            />
          );
        })}
        {Array.from({ length: Math.floor(2 * Math.PI * p.r) + 1 }, (_, i) => {
          const x = cordStart + i * 23;
          return (
            <g key={i}>
              <path d={`M${x} 66v${i % 5 === 0 ? 12 : 6}`} stroke="#9b9e83" />
              {i % 5 === 0 && (
                <text
                  x={x}
                  y="98"
                  textAnchor="middle"
                  fontSize="14"
                  fill="#6d7d68"
                >
                  {i}
                </text>
              )}
            </g>
          );
        })}
        <text x="480" y="123" textAnchor="middle" fill="#6d7d68" fontSize="14">
          1 格 = 1 cm · C ≈ {format(2 * Math.PI * p.r)} cm
        </text>
        <g className="circle-diameter-ruler">
          {[0, 1, 2].map((i) => (
            <g key={i}>
              <rect
                x={cordStart + i * diameterLength}
                y="143"
                width={diameterLength}
                height="12"
                fill={i % 2 ? "#d7e5ec" : "#b8d0dd"}
                stroke="#497b94"
                strokeWidth="1"
              />
              <text
                x={cordStart + (i + 0.5) * diameterLength}
                y="177"
                textAnchor="middle"
                fill="#3b7194"
                fontSize="16"
              >
                d
              </text>
            </g>
          ))}
          <path
            d={`M${cordStart + 3 * diameterLength} 149H${cordStart + cordLength}`}
            stroke="#b47e2b"
            strokeWidth="6"
          />
          <text
            x="480"
            y="201"
            textAnchor="middle"
            fill="#3b7194"
            fontSize="16"
          >
            每段 d = {format(2 * p.r)} cm · 一圈比 3 个直径多一点 · C/d = π ≈
            3.1416
          </text>
        </g>
      </svg>
      <div className="circle-relations">
        <div>
          <span>圆的周长</span>
          <strong>
            2πr ≈ {format(2 * Math.PI * p.r)} <small>cm</small>
          </strong>
        </div>
        <div>
          <span>重排前后的面积</span>
          <strong>
            πr² ≈ {format(q.area)} <small>cm²</small>
          </strong>
        </div>
        <div>
          <span>单个圆弧高出弦</span>
          <strong>
            {q.sagitta.toFixed(4)} <small>cm</small>
          </strong>
        </div>
      </div>
      <div className="proof-actions">
        {chapter === 0 ? (
          <>
            <button
              onClick={() => onChange("unroll", 0)}
              aria-pressed={p.unroll === 0}
            >
              围成一圈
            </button>
            <button
              onClick={() => onChange("unroll", 100)}
              aria-pressed={(p.unroll ?? 100) === 100}
            >
              展开测量
            </button>
          </>
        ) : (
          <>
            <button
              aria-pressed={progress === 0}
              onClick={() => onChange("rearrange", 0)}
            >
              合回圆盘
            </button>
            <button
              aria-pressed={progress === 100}
              onClick={() => onChange("rearrange", 100)}
            >
              交错重排
            </button>
            <button
              disabled={p.parts >= 48}
              onClick={() => onChange("parts", Math.min(48, p.parts * 2))}
            >
              分得更细
            </button>
            <button
              aria-pressed={p.limitRectangle === 1}
              onClick={() =>
                onChange("limitRectangle", p.limitRectangle === 1 ? 0 : 1)
              }
            >
              极限矩形参照
            </button>
          </>
        )}
      </div>
      {chapter !== 0 && p.limitRectangle === 1 && progress !== 100 && (
        <p className="proof-caption">
          拼合完成后显示极限参照；点击“交错重排”可直接对照。
        </p>
      )}
      <p className="proof-caption">
        {chapter === 0
          ? "绳子只改变曲率，不拉伸；展开过程为几何演示，不是绳索动力学模拟。"
          : "有限分割得到弧边拼图，不能直接当作精确矩形。极限关系：πr × r = πr²。"}
      </p>
    </div>
  );
}
