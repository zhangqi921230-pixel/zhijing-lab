import FunctionParameterInput from "./FunctionParameterInput.jsx";
import SecantConvergence from "./SecantConvergence.jsx";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { functionValue, functionRates } from "./advancedModels.mjs";
import { graphPoint, snapLinear } from "./LinearScene.jsx";
import {
  probeRailPosition,
  probeRailValue,
  probeExtent,
} from "./functionProbeRail.mjs";
import { format } from "./models.mjs";
import { functionFamilies } from "./functionFamilies.mjs";
import { functionExpression, functionRange } from "./functionDescription.mjs";
import UnitCircle from "./UnitCircle.jsx";
import FunctionSecantHandle from "./FunctionSecantHandle.jsx";
import FunctionSecantReadouts from "./FunctionSecantReadouts.jsx";
import { clipFunctionSamples } from "./functionClipping.mjs";
import { definedProbePosition } from "./functionProbeRecovery.mjs";
import { functionAxisTicks } from "./functionAxisTicks.mjs";
import { functionMinorGrid } from "./functionMinorGrid.mjs";
import { functionProbeLabel } from "./functionProbeLabel.mjs";
import { functionAsymptotes } from "./functionAsymptotes.mjs";
import { functionLandmark } from "./functionLandmark.mjs";
import BisectionWorkbench, {
  BisectionLayer,
  useBisection,
} from "./BisectionWorkbench.jsx";
export function functionPaths(p, extent, verticalExtent = extent) {
  const k = p.k ?? 1;
  const ranges =
      p.type === 3 && k !== 0
        ? [
            [-extent, Math.min(extent, p.shift - 1e-6)],
            [Math.max(-extent, p.shift + 1e-6), extent],
          ]
        : [[-extent, extent]],
    paths = [];
  for (const [start, end] of ranges) {
    if (start >= end) continue;
    const samples = Array.from(
      { length: 801 },
      (_, i) => start + ((end - start) * i) / 800,
    );
    if (p.type !== 3 && p.shift >= start && p.shift <= end)
      samples.push(p.shift);
    if (p.type === 7 && k !== 0) {
      for (let exponent = -24; exponent <= 12; exponent += 0.125) {
        const x = p.shift + 2 ** exponent / k;
        if (x >= start && x <= end) samples.push(x);
      }
    }
    if (p.type === 1 && extent <= 1000 && k !== 0) {
      const inputStart = Math.min(k * (start - p.shift), k * (end - p.shift));
      const inputEnd = Math.max(k * (start - p.shift), k * (end - p.shift));
      for (
        let n = Math.ceil(inputStart / (Math.PI / 2));
        n <= Math.floor(inputEnd / (Math.PI / 2));
        n++
      )
        samples.push(p.shift + (n * Math.PI) / (2 * k));
    }
    samples.sort((a, b) => a - b);
    paths.push(
      ...clipFunctionSamples(
        samples,
        (x) => functionValue(p, x),
        verticalExtent,
      ),
    );
  }
  return paths;
}
export const functionDomain = (p) => {
  const k = p.k ?? 1;
  if (k === 0)
    return [3, 7].includes(p.type) ? "空集（无可取的 x）" : "全体实数";
  return p.type === 3
    ? `x ≠ ${format(p.shift)}`
    : p.type === 5
      ? `x ${k > 0 ? "≥" : "≤"} ${format(p.shift)}`
      : p.type === 7
        ? `x ${k > 0 ? ">" : "<"} ${format(p.shift)}`
        : "全体实数";
};
const curvePath = (points, extent) =>
  points
    .map((v, i) => `${i ? "L" : "M"}${graphPoint(...v, extent).join(" ")}`)
    .join(" ");
export default function FunctionStudio({
  p,
  onChange,
  unitCircle = false,
  transformationGuide = false,
  mappingGuide = false,
  bisection = false,
  bisectionProgress,
  onBisectionProgress,
}) {
  const bisectionState = useBisection(
    p,
    bisectionProgress,
    onBisectionProgress,
  );
  const [extent, setExtent] = useState(6),
    [compare, setCompare] = useState(true),
    [guides, setGuides] = useState(true),
    [labels, setLabels] = useState(true),
    [plotWidth, setPlotWidth] = useState(880),
    [plotHeight, setPlotHeight] = useState(undefined),
    [plotPixels, setPlotPixels] = useState(580),
    svg = useRef(null),
    drag = useRef(false);
  useEffect(() => {
    if (unitCircle) setExtent(3);
  }, [unitCircle]);
  useEffect(() => {
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      if (height > 0) {
        setPlotWidth((580 * width) / height);
        setPlotPixels(height);
      }
    });
    observer.observe(svg.current);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    const plot = svg.current;
    const stage = plot?.closest(".stage");
    if (!stage || typeof ResizeObserver === "undefined") return;
    let frame = 0;
    const resize = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (window.innerWidth < 1150) {
          setPlotHeight(undefined);
          return;
        }
        const top = plot.getBoundingClientRect().top + window.scrollY;
        const footer = [
          ...stage.querySelectorAll(".linear-tools, .stage-tools"),
        ].reduce((sum, item) => sum + item.getBoundingClientRect().height, 0);
        setPlotHeight(
          Math.max(240, Math.min(900, window.innerHeight - top - footer - 14)),
        );
      });
    };
    const observer = new ResizeObserver(resize);
    stage
      .querySelectorAll(
        ".linear-title, .function-family, .function-rates, .function-domain-summary, .bisection-workbench, .linear-help, .linear-tools, .stage-tools",
      )
      .forEach((item) => observer.observe(item));
    window.addEventListener("resize", resize);
    resize();
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(frame);
    };
  }, [p.analysis, bisection]);
  const left = 310 - plotWidth / 2 + 25,
    right = 310 + plotWidth / 2 - 25;
  const xExtent = ((plotWidth / 2 - 25) / 230) * extent;
  const rates = functionRates(p);
  const y = functionValue(p, p.probe),
    visible =
      y !== null && Math.abs(y) <= extent && Math.abs(p.probe) <= xExtent,
    xy = graphPoint(p.probe, y ?? 0, extent),
    base = { ...p, a: 1, k: 1, b: 0, shift: 0 };
  const k = p.k ?? 1;
  const sourceX = k * (p.probe - p.shift);
  const sourceY = functionValue(base, sourceX);
  const mappingVisible =
    mappingGuide &&
    compare &&
    guides &&
    k !== 0 &&
    sourceY !== null &&
    y !== null &&
    Math.abs(sourceX) <= xExtent &&
    Math.abs(sourceY) <= extent &&
    visible &&
    Math.hypot(sourceX - p.probe, sourceY - y) > 1e-6;
  const sourcePoint = graphPoint(sourceX, sourceY ?? 0, extent);
  const transformedSamples = useMemo(
    () =>
      functionPaths(
        { type: p.type, a: p.a, k, b: p.b, shift: p.shift },
        xExtent,
        extent,
      ),
    [p.type, p.a, k, p.b, p.shift, xExtent, extent],
  );
  const originalSamples = useMemo(
    () =>
      compare
        ? functionPaths(
            { type: p.type, a: 1, k: 1, b: 0, shift: 0 },
            xExtent,
            extent,
          )
        : [],
    [compare, p.type, xExtent, extent],
  );
  const transformedPaths = useMemo(
    () => transformedSamples.map((points) => curvePath(points, extent)),
    [transformedSamples, extent],
  );
  const originalPaths = useMemo(
    () => originalSamples.map((points) => curvePath(points, extent)),
    [originalSamples, extent],
  );
  const labelCurves = useMemo(
    () =>
      [...transformedSamples, ...originalSamples].map((points) =>
        points.map((point) => graphPoint(...point, extent)),
      ),
    [transformedSamples, originalSamples, extent],
  );
  const step = Math.max(1, Math.ceil((extent / 6) * (580 / plotPixels)));
  const xTicks = functionAxisTicks(xExtent, step, p.type === 1);
  const yTicks = functionAxisTicks(extent, step);
  const pixelsPerUnit = (230 * plotPixels) / (580 * extent);
  const minorX = functionMinorGrid(xTicks, xExtent, pixelsPerUnit);
  const minorY = functionMinorGrid(yTicks, extent, pixelsPerUnit);
  const path = (pts) =>
    pts
      .map((v, i) => `${i ? "L" : "M"}${graphPoint(...v, extent).join(" ")}`)
      .join(" ");
  function move(e) {
    if (!drag.current) return;
    const ctm = svg.current.getScreenCTM();
    if (!ctm) return;
    const point = new DOMPoint(e.clientX, e.clientY).matrixTransform(
      ctm.inverse(),
    );
    const value =
      drag.current === "graph"
        ? ((point.x - 310) * extent) / 230
        : probeRailValue(point.x, left, right);
    onChange("probe", snapLinear(value, -5, 5));
  }
  function probeKeys(e) {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key)) return;
    e.preventDefault();
    onChange(
      "probe",
      e.key === "Home"
        ? -5
        : e.key === "End"
          ? 5
          : snapLinear(p.probe + (e.key === "ArrowLeft" ? -0.1 : 0.1), -5, 5),
    );
  }
  function beginProbe(e, mode) {
    if (e.button !== 0 || e.isPrimary === false) return;
    drag.current = mode;
    e.currentTarget.setPointerCapture(e.pointerId);
    e.preventDefault();
  }
  function beginPlotProbe(e) {
    if (e.target.closest('[role="slider"]')) return;
    if (
      bisection ||
      e.defaultPrevented ||
      e.button !== 0 ||
      e.isPrimary === false
    )
      return;
    const ctm = svg.current.getScreenCTM();
    if (!ctm) return;
    const point = new DOMPoint(e.clientX, e.clientY).matrixTransform(
      ctm.inverse(),
    );
    if (point.x < left || point.x > right || point.y < 60 || point.y > 520)
      return;
    beginProbe(e, "graph");
    move(e);
  }
  function endProbe(e) {
    drag.current = false;
    if (e.currentTarget.hasPointerCapture?.(e.pointerId))
      e.currentTarget.releasePointerCapture(e.pointerId);
  }
  const expression = functionExpression(p);
  const recovery = y === null ? definedProbePosition(p) : null;
  const exponent = expression.match(/^(.*?)\^\((.*)\)(.*)$/);
  const landmark = functionLandmark(p);
  const landmarkAtProbe = landmark && Math.abs(p.probe - landmark.x) < 1e-6;
  const probeText = `${landmarkAtProbe ? `${landmark.name} P` : "P"} (${format(p.probe, 3)}, ${format(y, 3)})`;
  const labelScale = 580 / plotPixels;
  const probeLabel = functionProbeLabel(
    xy,
    probeText,
    { left: left + 4, right: right - 4, top: 64, bottom: 516 },
    labelScale,
    labelCurves,
  );
  const sourceText = `原图点 (${format(sourceX, 3)}, ${format(sourceY, 3)})`;
  const sourceLabel =
    mappingVisible && labels
      ? functionProbeLabel(
          sourcePoint,
          sourceText,
          { left: left + 4, right: right - 4, top: 64, bottom: 516 },
          labelScale,
          labelCurves,
          visible ? [probeLabel] : [],
        )
      : null;
  return (
    <div className="linear-studio function-studio">
      <div className="linear-title">
        <span>函数变换工作台</span>
        <strong aria-label="当前函数表达式">
          {exponent ? (
            <>
              {exponent[1]}
              <sup>{exponent[2]}</sup>
              {exponent[3]}
            </>
          ) : (
            expression
          )}
        </strong>
        <small>
          横纵轴等比例 ·{" "}
          {p.type === 1 ? "角度以弧度计" : "改变一个变量，比较前后的图像"}
        </small>
      </div>
      <div className="function-family">
        {functionFamilies.map(({ name }, i) => (
          <button
            key={name}
            aria-pressed={p.type === i}
            onClick={() => onChange("type", i)}
          >
            {name}
          </button>
        ))}
      </div>
      <div
        className="function-domain-summary"
        aria-label="函数定义域与值域"
        role="status"
      >
        <span>
          定义域 <strong>{functionDomain(p)}</strong>
        </span>
        <span>
          值域 <strong>{functionRange(p)}</strong>
        </span>
        <small>完整函数范围 · 不受画面缩放限制</small>
        {!bisection && y === null && (
          <span>
            当前探针位置无定义。
            {recovery === null ? (
              "当前参数下没有可用的探针位置，请调整函数参数。"
            ) : (
              <button onClick={() => onChange("probe", recovery)}>
                移到 x = {format(recovery)}
              </button>
            )}
          </span>
        )}
      </div>
      {!bisection && p.analysis === 1 && (
        <div
          className="function-rates"
          aria-label="割线与切线读数"
          aria-live="polite"
        >
          <span className="secant-readout">
            割线 Δy/Δx{" "}
            <strong>
              {rates.secant === null ? "不可计算" : format(rates.secant, 3)}
            </strong>
          </span>
          <span className="tangent-readout">
            切线斜率 f′(x){" "}
            <strong>
              {rates.tangent === null
                ? "无有限两侧导数"
                : format(rates.tangent, 3)}
            </strong>
          </span>
          <small>
            {rates.dx === 0
              ? "两点重合，不能用 0 作分母；导数单独按解析式计算。"
              : rates.y === null || rates.qy === null
                ? "至少一个点不在定义域内，请移动探针或调整 Δx。"
                : rates.crossesGap
                  ? "两点跨越间断；此割线不能作为连续趋近的依据。"
                  : rates.tangent === null
                    ? "尖点或定义域端点需单独讨论；不绘制具有有限斜率的切线。"
                    : "拖动空心 Q 点改变 Δx，P 保持不动；方向键每次微调 0.05。蓝虚线为割线，紫实线为 P 处切线。"}
          </small>
        </div>
      )}
      {bisection && <BisectionWorkbench state={bisectionState} />}
      <div
        className={`linear-workspace${unitCircle ? " has-unit-circle" : ""}`}
      >
        <svg
          ref={svg}
          style={{ height: plotHeight, "--plot-text-scale": 580 / plotPixels }}
          viewBox={`${310 - plotWidth / 2} 0 ${plotWidth} 580`}
          role="group"
          aria-label="函数族坐标图与可拖动探针"
          onPointerDown={beginPlotProbe}
          onPointerMove={(e) => {
            if (!e.target.closest('[role="slider"]')) move(e);
          }}
          onPointerUp={endProbe}
          onPointerCancel={() => (drag.current = false)}
          onLostPointerCapture={() => (drag.current = false)}
        >
          <defs>
            <clipPath id="function-clip">
              <rect x={left} y="60" width={right - left} height="460" />
            </clipPath>
            <marker
              id="function-arrow"
              viewBox="0 0 8 8"
              refX="7"
              refY="4"
              markerWidth="6"
              markerHeight="6"
              orient="auto"
            >
              <path d="M0 0L8 4L0 8Z" fill="#617c6a" />
            </marker>
          </defs>
          <rect
            x={310 - plotWidth / 2}
            y="0"
            width={plotWidth}
            height="580"
            rx="0"
            fill="#f5f3ee"
            stroke="none"
          />
          <path
            aria-hidden="true"
            d={[
              ...minorX.map((v) => `M${graphPoint(v, 0, extent)[0]} 60V520`),
              ...minorY.map(
                (v) => `M${left} ${graphPoint(0, v, extent)[1]}H${right}`,
              ),
            ].join(" ")}
            fill="none"
            stroke="var(--ui-line)"
            strokeOpacity="0.4"
            strokeWidth="0.6"
            vectorEffect="non-scaling-stroke"
            pointerEvents="none"
          />
          {xTicks.map(({ value: v, label }) => {
            const [x] = graphPoint(v, 0, extent);
            return (
              <g key={v} aria-label={`横轴刻度 ${label}`}>
                <path d={`M${x} 60V520`} stroke="var(--ui-line)" />
                {labels && v !== 0 && (
                  <>
                    <text
                      x={x}
                      y="310"
                      textAnchor="middle"
                      fill="#78836e"
                      fontSize="18"
                    >
                      {label}
                    </text>
                  </>
                )}
              </g>
            );
          })}
          {yTicks.map(({ value: v, label }) => {
            const [, y] = graphPoint(0, v, extent);
            return (
              <g key={v}>
                <path d={`M${left} ${y}H${right}`} stroke="var(--ui-line)" />
                {labels && v !== 0 && (
                  <text
                    x="297"
                    y={y + 4}
                    textAnchor="end"
                    fill="#78836e"
                    fontSize="18"
                  >
                    {label}
                  </text>
                )}
              </g>
            );
          })}
          <path
            d={`M${left - 7} 290H${right + 9}`}
            stroke="#617c6a"
            markerEnd="url(#function-arrow)"
          />
          <path
            d="M310 530V48"
            stroke="#617c6a"
            markerEnd="url(#function-arrow)"
          />
          <text x={right + 4} y="311" fill="#43604a" fontSize="17">
            x
          </text>
          <text x="327" y="53" fill="#43604a" fontSize="17">
            y
          </text>
          <text x="296" y="310" fill="#78836e" fontSize="18">
            0
          </text>
          <g clipPath="url(#function-clip)">
            {mappingVisible && (
              <g aria-label="原函数点与变换后点的对应关系" pointerEvents="none">
                <path
                  d={`M${sourcePoint[0]} ${sourcePoint[1]}L${xy[0]} ${xy[1]}`}
                  stroke="#7d857d"
                  strokeWidth="1.5"
                  strokeDasharray="4 5"
                />
                <circle
                  cx={sourcePoint[0]}
                  cy={sourcePoint[1]}
                  r="6"
                  fill="#f7f5ec"
                  stroke="#626c64"
                  strokeWidth="2"
                />
                <title>{sourceText}</title>
              </g>
            )}
            {bisection && (
              <BisectionLayer
                result={bisectionState.result}
                guides={guides}
                extent={extent}
                labels={labels}
              />
            )}
            {transformationGuide && guides && Math.abs(p.b) <= extent && (
              <g aria-label="纵向变换参照线">
                <path
                  d={`M${left} ${graphPoint(0, p.b, extent)[1]}H${right}`}
                  stroke="#287c73"
                  strokeWidth="1.5"
                  strokeDasharray="9 5"
                />
                {labels && (
                  <text
                    x={left + 8}
                    y={Math.max(78, graphPoint(0, p.b, extent)[1] - 10)}
                    fill="#287c73"
                    fontSize="17"
                  >
                    翻折参照 y = {format(p.b)}
                  </text>
                )}
                {visible && (
                  <path
                    aria-label="探针相对参照线的竖直距离"
                    d={`M${xy[0]} ${graphPoint(0, p.b, extent)[1]}V${xy[1]}`}
                    stroke="#287c73"
                    strokeWidth="3"
                  />
                )}
              </g>
            )}
            {!bisection && p.analysis === 1 && (
              <g aria-label="割线与切线图层">
                {[
                  [rates.secant, "#2878b5", "7 5", "割线"],
                  [rates.tangent, "#936095", undefined, "切线"],
                ].map(([slope, color, dash, name]) =>
                  slope !== null && rates.y !== null ? (
                    <path
                      key={name}
                      aria-label={name}
                      d={path([
                        [-xExtent, rates.y + slope * (-xExtent - rates.x)],
                        [xExtent, rates.y + slope * (xExtent - rates.x)],
                      ])}
                      fill="none"
                      stroke={color}
                      strokeDasharray={dash}
                      strokeWidth="2"
                    />
                  ) : null,
                )}
                {rates.y !== null && rates.qy !== null && guides && (
                  <path
                    d={path([
                      [rates.x, rates.y],
                      [rates.qx, rates.y],
                      [rates.qx, rates.qy],
                    ])}
                    fill="none"
                    stroke="#2878b5"
                    strokeDasharray="3 5"
                  />
                )}
              </g>
            )}
            {compare &&
              !bisection &&
              originalPaths.map((d, i) => (
                <path
                  key={`base-${i}`}
                  d={d}
                  fill="none"
                  stroke="#929e91"
                  strokeDasharray="6 5"
                  strokeWidth="2"
                />
              ))}
            {guides &&
              functionAsymptotes(p).map(({ axis, value }) => {
                const vertical = axis === "x";
                if (Math.abs(value) >= (vertical ? xExtent : extent))
                  return null;
                const [x, y] = graphPoint(
                  vertical ? value : 0,
                  vertical ? 0 : value,
                  extent,
                );
                const name = `渐近线 ${axis} = ${format(value)}`;
                return (
                  <g key={axis} aria-label={name}>
                    <path
                      d={vertical ? `M${x} 60V520` : `M${left} ${y}H${right}`}
                      fill="none"
                      stroke="#986d36"
                      strokeDasharray="7 5"
                    />
                    {labels && (
                      <text
                        x={vertical ? Math.min(right - 12, x + 10) : right - 10}
                        y={vertical ? 85 : Math.max(82, y - 10)}
                        textAnchor={
                          vertical && x < right - 140 ? "start" : "end"
                        }
                        fill="#805920"
                        stroke="#f5f3ee"
                        strokeWidth="4"
                        paintOrder="stroke"
                        fontSize="16"
                      >
                        {name}
                      </text>
                    )}
                  </g>
                );
              })}
            {p.type === 5 && k !== 0 && (
              <circle
                cx={graphPoint(p.shift, p.b, extent)[0]}
                cy={graphPoint(p.shift, p.b, extent)[1]}
                r="5"
                fill="#be790b"
              />
            )}
            {transformedPaths.map((d, i) => (
              <path
                key={i}
                d={d}
                fill="none"
                stroke="#be790b"
                strokeWidth="3"
              />
            ))}
            {!bisection && (
              <g visibility={visible ? "visible" : "hidden"}>
                {sourceLabel && (
                  <g pointerEvents="none" aria-label="原图点坐标读数">
                    <path
                      d={`M${sourcePoint}L${Math.max(sourceLabel.x, Math.min(sourceLabel.x + sourceLabel.width, sourcePoint[0]))} ${Math.max(sourceLabel.y, Math.min(sourceLabel.y + sourceLabel.height, sourcePoint[1]))}`}
                      stroke="#8a9688"
                      strokeWidth="0.7"
                      vectorEffect="non-scaling-stroke"
                    />
                    <rect
                      x={sourceLabel.x}
                      y={sourceLabel.y}
                      width={sourceLabel.width}
                      height={sourceLabel.height}
                      rx={3 * labelScale}
                      fill="#fffdf7"
                      stroke="#c9d0c3"
                      strokeWidth="0.7"
                      vectorEffect="non-scaling-stroke"
                    />
                    <text
                      x={sourceLabel.x + 8 * labelScale}
                      y={sourceLabel.y + 16 * labelScale}
                      fill="#4d5b52"
                      fontSize="16"
                    >
                      {sourceText}
                    </text>
                  </g>
                )}
                {guides && (
                  <path
                    d={`M${xy[0]} 290V${xy[1]}H310`}
                    fill="none"
                    stroke="#c5973d"
                    strokeDasharray="4 4"
                  />
                )}
                <g
                  role="slider"
                  aria-label="曲线上探针横坐标"
                  aria-valuemin="-5"
                  aria-valuemax="5"
                  aria-valuenow={p.probe}
                  aria-valuetext={`x = ${format(p.probe, 3)}，y = ${format(y, 3)}`}
                  tabIndex="0"
                  className="graph-handle"
                  onPointerDown={(e) => beginProbe(e, "graph")}
                  onPointerMove={move}
                  onPointerUp={endProbe}
                  onPointerCancel={() => (drag.current = false)}
                  onLostPointerCapture={() => (drag.current = false)}
                  onKeyDown={probeKeys}
                >
                  <title>拖动蓝点改变横坐标；方向键微调</title>
                  <circle cx={xy[0]} cy={xy[1]} r="20" fill="transparent" />
                  <circle
                    cx={xy[0]}
                    cy={xy[1]}
                    r="7"
                    fill="#2878b5"
                    stroke="#fffdf5"
                    strokeWidth="2"
                  />
                </g>
                {labels && (unitCircle || p.analysis !== 1) && (
                  <g pointerEvents="none" aria-label="探针坐标读数">
                    <path
                      d={`M${xy}L${Math.max(probeLabel.x, Math.min(probeLabel.x + probeLabel.width, xy[0]))} ${Math.max(probeLabel.y, Math.min(probeLabel.y + probeLabel.height, xy[1]))}`}
                      stroke="#7295a9"
                      strokeWidth="0.7"
                      vectorEffect="non-scaling-stroke"
                    />
                    <rect
                      x={probeLabel.x}
                      y={probeLabel.y}
                      width={probeLabel.width}
                      height={probeLabel.height}
                      rx={3 * labelScale}
                      fill="#fffdf7"
                      stroke="#c4d5df"
                      strokeWidth="0.7"
                      vectorEffect="non-scaling-stroke"
                    />
                    <text
                      x={probeLabel.x + 8 * labelScale}
                      y={probeLabel.y + 16 * labelScale}
                      fill="#2878b5"
                      fontSize="16"
                    >
                      {probeText}
                    </text>
                  </g>
                )}
              </g>
            )}
            {compare &&
              !bisection &&
              !unitCircle &&
              p.analysis !== 1 &&
              k !== 0 &&
              (() => {
                if (!landmark) return null;
                const { sourceX, sourceY, x, y: after, name } = landmark;
                const a = graphPoint(sourceX, sourceY, extent),
                  b = graphPoint(x, after, extent);
                const text = `${name} (${format(x)}, ${format(after)})`;
                const label = functionProbeLabel(
                  b,
                  text,
                  { left: left + 4, right: right - 4, top: 64, bottom: 516 },
                  labelScale,
                  labelCurves,
                  [
                    ...(visible ? [probeLabel] : []),
                    ...(sourceLabel ? [sourceLabel] : []),
                  ],
                );
                return (
                  <g aria-label="变换特征点对应">
                    {guides && (
                      <path
                        d={`M${a}L${b}`}
                        stroke="#6b9db1"
                        strokeDasharray="4 5"
                      />
                    )}
                    <circle cx={a[0]} cy={a[1]} r="4" fill="#a0a8a5" />
                    <circle cx={b[0]} cy={b[1]} r="5" fill="#2878b5" />
                    {labels &&
                      Math.abs(p.probe - x) > 1e-6 &&
                      Math.abs(after) <= extent &&
                      Math.abs(x) <= xExtent && (
                        <g pointerEvents="none" aria-label="变换特征点读数">
                          <path
                            d={`M${b}L${Math.max(label.x, Math.min(label.x + label.width, b[0]))} ${Math.max(label.y, Math.min(label.y + label.height, b[1]))}`}
                            stroke="#7295a9"
                            strokeWidth="0.7"
                            vectorEffect="non-scaling-stroke"
                          />
                          <rect
                            x={label.x}
                            y={label.y}
                            width={label.width}
                            height={label.height}
                            rx={3 * labelScale}
                            fill="#fffdf7"
                            stroke="#c4d5df"
                            strokeWidth="0.7"
                            vectorEffect="non-scaling-stroke"
                          />
                          <text
                            x={label.x + 8 * labelScale}
                            y={label.y + 16 * labelScale}
                            fill="#2878b5"
                          >
                            {text}
                          </text>
                        </g>
                      )}
                  </g>
                );
              })()}
            {!bisection && p.analysis === 1 && (
              <FunctionSecantHandle
                p={p}
                rates={rates}
                extent={extent}
                svg={svg}
                onChange={onChange}
                visible={
                  rates.qy !== null &&
                  Math.abs(rates.qy) <= extent &&
                  Math.abs(rates.qx) <= xExtent
                }
              />
            )}
            {!bisection && p.analysis === 1 && labels && (
              <FunctionSecantReadouts
                rates={rates}
                extent={extent}
                xExtent={xExtent}
                bounds={{
                  left: left + 4,
                  right: right - 4,
                  top: 64,
                  bottom: 516,
                }}
                scale={labelScale}
                curves={labelCurves}
              />
            )}
            {k !== 0 && [3, 7].includes(p.type) && p.a === 0 && (
              <circle
                aria-label="不包含的定义域端点"
                cx={graphPoint(p.shift, p.b, extent)[0]}
                cy={graphPoint(p.shift, p.b, extent)[1]}
                r="5"
                fill="#f5f3ee"
                stroke="#be790b"
                strokeWidth="2"
              />
            )}
          </g>
          {!bisection && (
            <>
              <path
                d={`M${left} 549H${right}`}
                stroke="#becbb4"
                strokeWidth="3"
              />
              <g
                role="slider"
                aria-label="函数图探针横坐标"
                tabIndex="0"
                aria-valuemin="-5"
                aria-valuemax="5"
                aria-valuenow={p.probe}
                className="graph-handle"
                onPointerDown={(e) => beginProbe(e, "rail")}
                onPointerMove={move}
                onPointerUp={endProbe}
                onPointerCancel={() => (drag.current = false)}
                onLostPointerCapture={() => (drag.current = false)}
                onKeyDown={probeKeys}
              >
                <circle
                  cx={probeRailPosition(p.probe, left, right)}
                  cy="549"
                  r="19"
                  fill="transparent"
                />
                <circle
                  cx={probeRailPosition(p.probe, left, right)}
                  cy="549"
                  r="8"
                  fill="#2b715b"
                  stroke="#faf8ee"
                  strokeWidth="2"
                />
              </g>
              <text
                x={left}
                y="577"
                textAnchor="start"
                fill="#74806b"
                fontSize="18"
              >
                −5
              </text>
              <text
                x={right}
                y="577"
                textAnchor="end"
                fill="#74806b"
                fontSize="18"
              >
                5
              </text>
              <text
                x="310"
                y="577"
                textAnchor="middle"
                fill="#74806b"
                fontSize="18"
              >
                参数滑轨 · x = {format(p.probe, 3)}
              </text>
            </>
          )}
        </svg>
        {unitCircle && (
          <UnitCircle
            p={p}
            onChange={onChange}
            onObserve={(x) => {
              const value = functionValue(p, x);
              if (value !== null)
                setExtent((current) =>
                  Math.max(current, probeExtent(x, value, plotWidth)),
                );
              setLabels(true);
              onChange("probe", x);
            }}
          />
        )}
      </div>
      <div className="linear-tools">
        {!bisection && y !== null && !visible && (
          <div className="graph-outside" role="status">
            探针超出当前视野。
            <button
              onClick={() => setExtent(probeExtent(p.probe, y, plotWidth))}
            >
              显示完整探针
            </button>
          </div>
        )}
        {!bisection && (
          <details className="function-notes">
            <summary>读图说明与变换关系</summary>
            <p>
              动态读数保留至小数点后三位，为近似值；计算和图形定位使用未舍入数值。
            </p>
            <div className="linear-insights">
              <div>
                <span>探针坐标</span>
                <strong>
                  {y === null
                    ? "此处无定义"
                    : `(${format(p.probe, 3)}, ${format(y, 3)})`}
                </strong>
                <p>
                  定义域：{functionDomain(p)}。
                  {k !== 0 && p.type === 3 && p.a === 0
                    ? "a=0 时为带空点的水平线，不再是双曲线。"
                    : ""}
                </p>
              </div>
              <div>
                <span>变换顺序</span>
                <strong>
                  a={format(p.a)} · k={format(k)} · h={format(p.shift)} · b=
                  {format(p.b)}
                </strong>
                <p>
                  k≠0 时，原图像点 (u,v) 对应 (u/k+h, av+b)。先将横坐标除以
                  k，再平移 h；k&lt;0 包含左右翻折。纵坐标乘 a 后再平移 b。
                </p>
              </div>
              <div>
                <span>{p.type === 3 ? "定义域与渐近线" : "特征位置"}</span>
                <strong>
                  {k === 0
                    ? [3, 7].includes(p.type)
                      ? "无定义：原函数在 0 处不存在"
                      : `常函数 y = ${format(functionValue(p, 0))}`
                    : p.type === 3
                      ? p.a === 0
                        ? "空点 (h, b)"
                        : "x = h；y = b"
                      : p.type === 1
                        ? "中线 y = b"
                        : p.type === 6
                          ? "水平渐近线 y = b（a≠0）"
                          : p.type === 7
                            ? "定义域边界 x = h"
                            : p.type === 5
                              ? "起点 (h, b)"
                              : p.type === 4
                                ? "对称中心 (h, b)"
                                : "特征点 (h, b)"}
                </strong>
                <p>
                  {k === 0
                    ? "横向输入恒为 0，不能使用 1/k 的伸缩关系；常函数没有基本正周期。"
                    : p.type === 3
                      ? p.a === 0
                        ? "分母为零的位置仍须排除；不画竖直渐近线。"
                        : "金色虚线为渐近线，左右分支分别绘制。"
                      : p.type === 1
                        ? `振幅 |a| = ${format(Math.abs(p.a))}，周期 2π/|k| = ${format((2 * Math.PI) / Math.abs(k))}（a≠0）。`
                        : [5, 7].includes(p.type)
                          ? "即使 a=0，原表达式的定义域限制仍然保留。"
                          : p.type === 6
                            ? "底数为 2；a≠0 时，函数趋近但不达到 y=b。"
                            : p.type === 4
                              ? "三次曲线绕 (h,b) 中心对称；它没有抛物线式的顶点。"
                              : p.a === 0
                                ? "a=0 时退化为水平线 y=b。"
                                : "h 与 b 决定顶点位置，|a| 决定纵向伸缩。"}
                </p>
              </div>
            </div>
          </details>
        )}
        {!bisection && (
          <button aria-pressed={compare} onClick={() => setCompare((v) => !v)}>
            灰色虚线：原函数
          </button>
        )}
        {!bisection && !unitCircle && p.analysis !== 1 && landmark && (
          <button
            disabled={Math.abs(landmark.x) > 5}
            title={
              Math.abs(landmark.x) > 5
                ? "该点超出探针的 −5 至 5 范围，请先调整图像参数"
                : `将探针移到 ${landmark.name} (${format(landmark.x)}, ${format(landmark.y)})，保留函数参数`
            }
            onClick={() => {
              setLabels(true);
              setExtent((current) =>
                Math.max(
                  current,
                  probeExtent(landmark.x, landmark.y, plotWidth),
                ),
              );
              onChange("probe", landmark.x);
            }}
          >
            观察{landmark.name}
          </button>
        )}
        {transformationGuide && (
          <button
            disabled={p.a === 0}
            onClick={() => onChange("a", -p.a)}
            title={
              p.a === 0
                ? "a=0，图像位于参照线上，翻折后不变"
                : "仅将 a 变号；保留其余参数，关于 y=b 翻折"
            }
          >
            当前图像翻折（a 变号）
          </button>
        )}
        <button aria-pressed={guides} onClick={() => setGuides((v) => !v)}>
          辅助线
        </button>
        <button aria-pressed={labels} onClick={() => setLabels((v) => !v)}>
          图上标注
        </button>
        <label>
          视野{" "}
          <select
            value={extent}
            onChange={(e) => setExtent(Number(e.target.value))}
          >
            {[...new Set([6, 12, 24, extent])]
              .sort((a, b) => a - b)
              .map((v) => (
                <option key={v} value={v}>
                  ±{v}
                </option>
              ))}
          </select>
        </label>
      </div>
      <FunctionParameterInput p={p} onChange={onChange} />
      {!bisection && p.analysis === 1 && (
        <SecantConvergence p={p} onChange={onChange} />
      )}
      <p className="linear-help">
        {bisection
          ? "赭金色为当前函数；浅蓝带是保留区间，横轴上的蓝点是中点近似值。每折半一次，区间宽度减半。"
          : "点击坐标区按横坐标取点，按住拖动连续读图；也可拖动蓝色探针或底部滑轨，方向键微调。赭金色为变换后图像；播放可自动扫描。"}
      </p>
    </div>
  );
}
