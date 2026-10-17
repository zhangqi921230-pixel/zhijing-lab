import { dandelinSpheres, dandelinTangents } from "./conicDandelin.mjs";
import DandelinReadout from "./DandelinReadout.jsx";
import { conicPointerProbe } from "./conicPointer.mjs";
import { conicProbe } from "./conicProbe.mjs";
import { conicSectionTriangles } from "./conicSectionFill.mjs";
import "./ConicGuide.css";
import React, { useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  conicState,
  conicFoci,
  CONIC_FOCUS_RANGE,
  conicSegments,
  conicPlanePoint,
} from "./conicGeometry.mjs";
function PlotPlacement({ host, children }) {
  return host ? createPortal(children, host) : children;
}
export default function ConicGuide({ p, onChange, plotHost }) {
  const dragging = useRef(false);
  const [expanded, setExpanded] = useState(false);
  const q = conicState(p);
  const criticalTilt = 90 - p.alpha;
  const foci = conicFoci(p);
  const segments = useMemo(() => conicSegments(p), [p.alpha, p.tilt, p.offset]);
  const closed = useMemo(
    () => conicSectionTriangles(p, segments).length > 0,
    [segments],
  );
  const probe = conicProbe(p, segments);
  const spheres = dandelinSpheres(p);
  // Only geometry and display framing affect the cached path, not probe position.
  const { px, py, path, screenPoints } = useMemo(() => {
    const planePoints = segments
      .flat()
      .map((point) => conicPlanePoint(p, point));
    const visibleFoci =
      p.showFocus !== 0
        ? foci.filter((f) => Math.abs(f.u) <= CONIC_FOCUS_RANGE)
        : [];
    const boundsPoints = [
      ...planePoints,
      ...visibleFoci.map((f) => [f.u, 0]),
      ...(p.showFocus !== 0 && probe?.directrix !== undefined
        ? [[probe.directrix, 0]]
        : []),
    ];
    const xs = boundsPoints.map((point) => point[0]),
      ys = boundsPoints.map((point) => point[1]);
    const minX = xs.length ? Math.min(...xs) : -0.5,
      maxX = xs.length ? Math.max(...xs) : 0.5;
    const minY = ys.length ? Math.min(...ys) : -0.5,
      maxY = ys.length ? Math.max(...ys) : 0.5;
    const scale = Math.min(
      300 / Math.max(0.25, maxX - minX),
      210 / Math.max(0.25, maxY - minY),
    );
    const px = (u) => 180 + (u - (minX + maxX) / 2) * scale;
    const py = (v) => 145 - (v - (minY + maxY) / 2) * scale;
    const path = segments
      .map((segment) =>
        segment
          .map((point, i) => {
            const [u, v] = conicPlanePoint(p, point);
            return `${i ? "L" : "M"}${px(u)},${py(v)}`;
          })
          .join(" "),
      )
      .join(" ");
    const screenPoints = segments.map((segment) => {
      const [u, v] = conicPlanePoint(p, segment[0]);
      return [px(u), py(v)];
    });
    return { px, py, path, screenPoints };
  }, [segments, p.alpha, p.tilt, p.offset, p.showFocus]);
  const seekPointer = (event) => {
    if (p.showFocus === 0 || !probe) return;
    const value = conicPointerProbe(
      event.clientX,
      event.clientY,
      event.currentTarget.getBoundingClientRect(),
      screenPoints,
    );
    if (value !== null) onChange("probe", value);
  };
  return (
    <section
      className={`solids-guide${plotHost ? " conic-guide-separated" : ""}`}
      aria-label="圆锥截线观察"
    >
      <PlotPlacement host={plotHost}>
        <div
          className={`solids-sections conic-plot${expanded ? " is-expanded" : ""}`}
        >
          <div className="conic-plot-heading">
            <span>截线真实形状 · {q.kind}</span>
            <button
              type="button"
              className="conic-plot-expand"
              aria-expanded={expanded}
              onClick={() => setExpanded((value) => !value)}
            >
              {expanded ? "收起观察窗" : "放大观察窗"}
            </button>
          </div>
          <small>沿截平面正视 · 横纵等比例</small>
          <svg
            viewBox="0 0 360 290"
            tabIndex={p.showFocus !== 0 && probe ? 0 : undefined}
            onKeyDown={(event) => {
              if (event.key === "Escape") {
                setExpanded(false);
                return;
              }
              if (
                p.showFocus === 0 ||
                !probe ||
                event.altKey ||
                event.ctrlKey ||
                event.metaKey
              )
                return;
              const delta = event.shiftKey ? 10 : 1;
              const values = {
                ArrowRight: Math.min(100, (p.probe ?? 0) + delta),
                ArrowUp: Math.min(100, (p.probe ?? 0) + delta),
                ArrowLeft: Math.max(0, (p.probe ?? 0) - delta),
                ArrowDown: Math.max(0, (p.probe ?? 0) - delta),
                Home: 0,
                End: 100,
              };
              if (!(event.key in values)) return;
              event.preventDefault();
              onChange("probe", values[event.key]);
            }}
            className={
              p.showFocus !== 0 && probe ? "conic-interactive-plot" : undefined
            }
            onPointerDown={(event) => {
              if (
                event.button !== 0 ||
                event.isPrimary === false ||
                p.showFocus === 0 ||
                !probe
              )
                return;
              dragging.current = true;
              event.currentTarget.setPointerCapture?.(event.pointerId);
              seekPointer(event);
            }}
            onPointerMove={(event) => {
              if (dragging.current) seekPointer(event);
            }}
            onPointerUp={() => {
              dragging.current = false;
            }}
            onPointerCancel={() => {
              dragging.current = false;
            }}
            onLostPointerCapture={() => {
              dragging.current = false;
            }}
            role="img"
            aria-label={`截线真实形状：${q.kind}，截平面内横纵比例一致`}
          >
            <path
              d={`M20 ${py(0)}H340${px(0) >= 20 && px(0) <= 340 ? `M${px(0)} 30V260` : ""}`}
              stroke="#d8d3c6"
              strokeDasharray="4 4"
            />
            {closed && p.showFill !== 0 && (
              <path
                d={path.replaceAll("M", "L").replace(/^L/, "M") + "Z"}
                fill="#d99a32"
                fillOpacity=".16"
                stroke="none"
              />
            )}
            <path d={path} fill="none" stroke="#b87817" strokeWidth="2.5" />
            {p.showFocus !== 0 && probe && (
              <g>
                {foci.map(
                  (focus, i) =>
                    Math.abs(focus.u) <= CONIC_FOCUS_RANGE && (
                      <path
                        key={i}
                        d={`M${px(probe.plane[0])} ${py(probe.plane[1])}L${px(focus.u)} ${py(0)}`}
                        stroke="#467ba0"
                        strokeDasharray="4 3"
                        fill="none"
                      />
                    ),
                )}
                {probe.directrix !== undefined && (
                  <>
                    <path
                      d={`M${px(probe.directrix)} 30V260M${px(probe.plane[0])} ${py(probe.plane[1])}H${px(probe.directrix)}`}
                      stroke="#467ba0"
                      strokeDasharray="4 3"
                      fill="none"
                    />
                    <text
                      x={px(probe.directrix) + 5}
                      y="35"
                      fill="#235f95"
                      fontSize="12"
                    >
                      准线
                    </text>
                  </>
                )}
                <circle
                  cx={px(probe.plane[0])}
                  cy={py(probe.plane[1])}
                  r="4"
                  fill="#a7670b"
                />
                <text
                  x={px(probe.plane[0]) + 9}
                  y={py(probe.plane[1]) - 9}
                  fill="#85570f"
                  fontSize="13"
                >
                  P
                </text>
              </g>
            )}
            {p.showFocus !== 0 &&
              foci.map(
                (focus, i) =>
                  Math.abs(focus.u) <= CONIC_FOCUS_RANGE && (
                    <g key={i}>
                      <circle cx={px(focus.u)} cy="145" r="4" fill="#2673ba" />
                      <text
                        x={px(focus.u)}
                        y={py(0) - 13}
                        textAnchor="middle"
                        fontSize="13"
                        fill="#235f95"
                      >
                        {foci.length === 1 ? "F" : `F${i + 1}`}
                      </text>
                    </g>
                  ),
              )}
            {q.degenerate && q.eccentricity < 1 - 1e-9 && (
              <circle cx="180" cy="145" r="3" fill="#b87817" />
            )}
          </svg>
          {p.showSpheres === 1 && p.showFocus !== 0 && (
            <DandelinReadout
              spheres={spheres}
              foci={foci}
              point={probe?.point}
            />
          )}
          {p.showFocus !== 0 && probe && (
            <small>
              点击或拖动图形移动 P；聚焦图形后用方向键微调，Shift +
              方向键快移。Esc 收起观察窗。
            </small>
          )}
        </div>
      </PlotPlacement>
      <div>
        <span>截平面相对水平面的倾角 θ</span>
        <strong>
          {p.tilt}° · {q.kind}
        </strong>
        <p>
          圆锥半顶角 α = {p.alpha}°，临界倾角 θ = 90° − α = {criticalTilt}°。
          截平面平行于一条母线且不经过顶点时，得到抛物线。
        </p>
        <div className="cube-pairs">
          {[
            [0, "圆"],
            [Math.max(1, 90 - p.alpha - 20), "椭圆"],
            [90 - p.alpha, "抛物线"],
            [Math.min(90, 100 - p.alpha), "双曲线"],
          ].map(([value, label]) => (
            <button
              key={label}
              onClick={() => onChange("tilt", value)}
              aria-pressed={q.kind === label}
            >
              {q.degenerate ? `${label}对应倾角` : label}
            </button>
          ))}
        </div>
        <div
          className="conic-critical-comparison"
          role="group"
          aria-label="临界角两侧对比"
        >
          <span>保持半顶角和截面位置，只改变倾角</span>
          <div className="cube-pairs">
            {[
              [Math.max(0, criticalTilt - 5), "临界角前"],
              [criticalTilt, "平行母线"],
              [Math.min(90, criticalTilt + 5), "临界角后"],
            ].map(([value, label]) => (
              <button
                key={label}
                onClick={() => onChange("tilt", value)}
                aria-pressed={Math.abs(p.tilt - value) < 1e-9}
              >
                {label} · {value}°
              </button>
            ))}
          </div>
          {q.degenerate && (
            <p role="status">
              当前截平面经过顶点，比较结果为点、直线或两条相交直线。增大右侧截面距顶点，可观察非退化曲线。
            </p>
          )}
        </div>
        <p>
          未过顶点时：e = sin θ / cos α = {q.eccentricity.toFixed(3)}
          。截平面通过顶点时，截线退化为点、直线或两条相交直线。
        </p>
        <div className="cube-pairs" role="group" aria-label="圆锥场景显示设置">
          {[
            ["showPlane", "截平面"],
            ["showFill", "闭合截面填色"],
            ["showShell", "锥面"],
            ["showGuides", "辅助线"],
            ["showFocus", "焦点"],
          ].map(([key, label]) => (
            <button
              key={key}
              aria-pressed={p[key] !== 0}
              onClick={() => onChange(key, p[key] === 0 ? 1 : 0)}
            >
              {p[key] === 0 ? "显示" : "隐藏"}
              {label}
            </button>
          ))}
        </div>
        {p.showFill !== 0 && !closed && (
          <p role="status">当前截线未在有限锥面内闭合，不显示截面填色。</p>
        )}
        <p>
          {q.degenerate
            ? "退化截线不显示焦点。"
            : q.kind === "圆"
              ? "圆的两个焦点重合于圆心。"
              : q.kind === "椭圆"
                ? "椭圆上任一点到两个焦点的距离之和不变。"
                : q.kind === "双曲线"
                  ? "双曲线上任一点到两个焦点的距离之差的绝对值不变。"
                  : "抛物线上任一点到焦点的距离等于到准线的距离。"}
        </p>
        {p.showFocus !== 0 && probe && (
          <div className="conic-probe" role="group" aria-label="焦点距离验证">
            <label>
              移动观察点 P
              <input
                type="range"
                min="0"
                max="100"
                step="1"
                value={p.probe ?? 25}
                style={{ "--range-progress": `${p.probe ?? 25}%` }}
                aria-label="截线观察位置"
                onChange={(event) =>
                  onChange("probe", Number(event.target.value))
                }
              />
            </label>
            <p>
              {probe.distances
                .map(
                  (distance, i) =>
                    `${probe.distances.length === 1 ? "PF" : `PF${i + 1}`} = ${distance.toFixed(4)}`,
                )
                .join("；")}
            </p>
            <strong>
              {probe.label} = {probe.value.toFixed(4)}
            </strong>
            <small>
              长度使用统一模型单位。双曲线两支之间切换为跳转，不表示连线。
            </small>
          </div>
        )}
        {p.showFocus !== 0 &&
          foci.some((f) => Math.abs(f.u) > CONIC_FOCUS_RANGE) && (
            <p role="status">
              部分焦点超出当前显示范围。可减小截面距顶点，或调整倾角继续观察。
            </p>
          )}
        <div className="cube-pairs">
          <button
            aria-pressed={p.showSpheres === 1}
            onClick={() => onChange("showSpheres", p.showSpheres === 1 ? 0 : 1)}
          >
            {p.showSpheres === 1 ? "隐藏" : "显示"}Dandelin 球
          </button>
        </div>
        {p.showSpheres === 1 && (
          <div className="conic-probe" aria-label="双球切线验证">
            <p>
              球与截平面相切于焦点 F，与锥面相切于一圈。同一点 P
              引向同一球的两条切线等长：PF = PT。
            </p>
            {spheres.map((sphere, i) => {
              if (!sphere.visible) return null;
              const proof = dandelinTangents(sphere, probe?.point);
              const focusIndex = foci.findIndex(
                (f) =>
                  Math.hypot(
                    ...f.point.map((value, axis) => value - sphere.focus[axis]),
                  ) < 1e-8,
              );
              const focusName = foci.length === 1 ? "F" : `F${focusIndex + 1}`;
              return (
                proof && (
                  <p key={i} style={{ color: i ? "#8d5524" : "#285f52" }}>
                    球 {i + 1}：P{focusName} = {proof.toFocus.toFixed(4)}，PT
                    {i + 1} = {proof.toCone.toFixed(4)}
                  </p>
                )
              );
            })}
            {spheres.some((s) => !s.visible) && (
              <p role="status">
                部分相切球超出有限锥面，暂不显示；减小截面距顶点可继续观察。
              </p>
            )}
            {q.kind === "抛物线" && (
              <p>抛物线只有一个有限相切球；另一个球在临界情况下趋于无穷远。</p>
            )}
            {q.degenerate && <p>过顶点时不显示非零半径的相切球。</p>}
          </div>
        )}
        <p>
          图中只显示有限圆锥范围内的截线；抛物线、双曲线本身无限延伸。倾角过大或截平面远离顶点时，部分截线会超出模型。
        </p>
      </div>
    </section>
  );
}
