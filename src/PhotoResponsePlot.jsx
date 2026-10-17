import PhotoNetStudy from "./PhotoNetStudy.jsx";
import PhotoLightIncrement from "./PhotoLightIncrement.jsx";
import PhotoFactorial from "./PhotoFactorial.jsx";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { photo } from "./models.mjs";
import "./PhotoResponsePlot.css";
import PhotoEvidence from "./PhotoEvidence.jsx";

export const photoAxes = [
  { key: "light", name: "相对光照", min: 0, max: 100, unit: "%" },
  { key: "co2", name: "相对 CO₂ 供给", min: 0, max: 100, unit: "%" },
  { key: "temp", name: "温度", min: 5, max: 45, unit: "°C" },
];
export function photoPlotValue(clientX, bounds, axis) {
  const x = ((clientX - bounds.left) / bounds.width) * 360;
  return Math.round(
    axis.min + Math.max(0, Math.min(1, (x - 42) / 300)) * (axis.max - axis.min),
  );
}
export default function PhotoResponsePlot({ p, chapter, onChange }) {
  const axis = photoAxes[[0, 1, 2, 0, 2][chapter] ?? 0];
  const [baseline, setBaseline] = useState(null),
    [scanning, setScanning] = useState(false);
  const scan = useRef(null),
    latest = useRef({ p, onChange });
  latest.current = { p, onChange };
  useEffect(() => {
    setScanning(false);
    setBaseline(null);
    scan.current = null;
  }, [chapter]);
  useEffect(() => {
    if (!scanning) return;
    let frame,
      last,
      elapsed = 0,
      published = 0;
    const tick = (now) => {
      if (document.hidden || !scan.current) return;
      const dt =
        last === undefined ? 0 : Math.min(100, Math.max(0, now - last));
      last = now;
      elapsed += dt;
      if (elapsed - published >= 1000 / 30 || elapsed >= 6000) {
        published = elapsed;
        const next = Math.min(
          axis.max,
          axis.min + ((axis.max - axis.min) * elapsed) / 6000,
        );
        scan.current.value = Math.round(next * 100) / 100;
        latest.current.onChange(axis.key, scan.current.value);
      }
      if (elapsed >= 6000) {
        setScanning(false);
        return;
      }
      frame = requestAnimationFrame(tick);
    };
    const visibility = () => {
      cancelAnimationFrame(frame);
      last = undefined;
      if (!document.hidden) frame = requestAnimationFrame(tick);
    };
    document.addEventListener("visibilitychange", visibility);
    if (!document.hidden) frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, [scanning, axis.key]);
  useEffect(() => {
    if (!scanning || !scan.current) return;
    const state = scan.current;
    if (
      photoAxes.some(
        (a) =>
          Math.abs(
            p[a.key] - (a.key === axis.key ? state.value : state.fixed[a.key]),
          ) > 1e-7,
      )
    )
      setScanning(false);
  }, [p.light, p.co2, p.temp, scanning, axis.key]);
  const startScan = () => {
    if (scanning) {
      setScanning(false);
      return;
    }
    scan.current = { value: axis.min, fixed: { ...p } };
    onChange(axis.key, axis.min);
    setScanning(true);
  };
  const referencePath = useMemo(
    () =>
      baseline
        ? Array.from({ length: 81 }, (_, i) => {
            const value = axis.min + ((axis.max - axis.min) * i) / 80;
            return `${i ? "L" : "M"}${42 + (i / 80) * 300},${172 - photo({ ...baseline, [axis.key]: value }) * 1.35}`;
          }).join(" ")
        : null,
    [baseline, axis.key],
  );
  const x = (v) => 42 + ((v - axis.min) / (axis.max - axis.min)) * 300,
    y = (v) => 172 - v * 1.35;
  const path = useMemo(
    () =>
      Array.from({ length: 81 }, (_, i) => {
        const value = axis.min + ((axis.max - axis.min) * i) / 80;
        return `${i ? "L" : "M"}${x(value)},${y(photo({ ...p, [axis.key]: value }))}`;
      }).join(" "),
    [
      axis.key,
      axis.key === "light" ? null : p.light,
      axis.key === "co2" ? null : p.co2,
      axis.key === "temp" ? null : p.temp,
    ],
  );
  const rate = photo(p);
  const choose = (event) => {
    setScanning(false);
    const bounds = event.currentTarget.getBoundingClientRect();
    if (bounds.width > 0)
      onChange(axis.key, photoPlotValue(event.clientX, bounds, axis));
  };
  return (
    <section className="photo-response" aria-label="光合作用响应曲线">
      <header>
        <strong>改变{axis.name}，其余条件固定</strong>
        <span>定性模型</span>
      </header>
      <div className="photo-response-layout">
        <div>
          <svg
            viewBox="0 0 360 218"
            role="slider"
            tabIndex="0"
            aria-label={`${axis.name}曲线选点`}
            aria-valuemin={axis.min}
            aria-valuemax={axis.max}
            aria-valuenow={p[axis.key]}
            aria-valuetext={`${p[axis.key]}${axis.unit}，总光合相对速率 ${rate.toFixed(2)}%`}
            onPointerDown={(event) => {
              event.currentTarget.setPointerCapture(event.pointerId);
              choose(event);
            }}
            onPointerMove={(event) => {
              if (event.currentTarget.hasPointerCapture(event.pointerId))
                choose(event);
            }}
            onPointerUp={(event) => {
              if (event.currentTarget.hasPointerCapture(event.pointerId))
                event.currentTarget.releasePointerCapture(event.pointerId);
            }}
            onKeyDown={(event) => {
              const next =
                event.key === "Home"
                  ? axis.min
                  : event.key === "End"
                    ? axis.max
                    : ["ArrowRight", "ArrowUp"].includes(event.key)
                      ? p[axis.key] + 1
                      : ["ArrowLeft", "ArrowDown"].includes(event.key)
                        ? p[axis.key] - 1
                        : null;
              if (next !== null) {
                event.preventDefault();
                setScanning(false);
                onChange(
                  axis.key,
                  Math.max(axis.min, Math.min(axis.max, next)),
                );
              }
            }}
          >
            {[0, 25, 50, 75, 100].map((value) => (
              <g key={value}>
                <line
                  x1="42"
                  x2="342"
                  y1={y(value)}
                  y2={y(value)}
                  className="photo-grid"
                />
                <text x="34" y={y(value) + 4} textAnchor="end">
                  {value}
                </text>
              </g>
            ))}
            <text x="42" y="18">
              总光合相对速率 / %
            </text>
            {referencePath && (
              <path
                data-reference-curve="true"
                d={referencePath}
                fill="none"
                stroke="var(--ui-gold)"
                strokeDasharray="6 4"
                strokeWidth="2.5"
              />
            )}
            <path
              d={path}
              fill="none"
              stroke="var(--ui-primary)"
              strokeWidth="2.5"
            />
            <line
              x1={x(p[axis.key])}
              x2={x(p[axis.key])}
              y1={y(rate)}
              y2="172"
              className="photo-guide-line"
            />
            <circle
              cx={x(p[axis.key])}
              cy={y(rate)}
              r="5"
              fill="#c08828"
              stroke="#fff"
              strokeWidth="2"
            />
            {[axis.min, (axis.min + axis.max) / 2, axis.max].map((value) => (
              <text key={value} x={x(value)} y="189" textAnchor="middle">
                {value}
              </text>
            ))}
            <text x="192" y="212" textAnchor="middle">
              {axis.name} / {axis.unit}
            </text>
          </svg>
        </div>
        <div>
          <div className="photo-scan-controls">
            <button aria-pressed={scanning} onClick={startScan}>
              {scanning ? "暂停扫描" : "扫描本节变量"}
            </button>
            <button
              onClick={() => {
                setScanning(false);
                setBaseline({ ...p });
              }}
            >
              保留当前曲线作对照
            </button>
            {baseline && (
              <button onClick={() => setBaseline(null)}>移除对照</button>
            )}
          </div>
          {baseline && (
            <p className="photo-reference">
              虚线对照：
              {photoAxes
                .filter((a) => a.key !== axis.key)
                .map((a) => `${a.name} ${baseline[a.key]}${a.unit}`)
                .join("、")}
              ；当前实线使用现有条件。相同条件时两线重合。
            </p>
          )}
          <p>
            扫描仅改变{axis.name}
            ，带动灯光或仪表和曲线选点；手动调节会停止扫描。速度为课堂演示，不表示植物响应时间。
          </p>
          <p className="photo-current">
            当前 {p[axis.key]}
            {axis.unit} → <strong>{rate.toFixed(2)}%</strong>
          </p>
          <p>
            点按或拖动曲线区域选值；键盘方向键微调。
            {photoAxes
              .filter((a) => a.key !== axis.key)
              .map((a) => `${a.name} ${p[a.key]}${a.unit}`)
              .join("、")}
            保持不变。
          </p>
          {baseline && (
            <p className="photo-rate-compare">
              同一横坐标：参照{" "}
              {photo({ ...baseline, [axis.key]: p[axis.key] }).toFixed(2)}% →
              当前 {rate.toFixed(2)}%。差额{" "}
              {(rate - photo({ ...baseline, [axis.key]: p[axis.key] })).toFixed(
                2,
              )}{" "}
              个百分点。
            </p>
          )}
          <p>显示总光合，未扣除呼吸消耗；曲线不是实测数据。</p>
        </div>
      </div>
      {[0, 3].includes(chapter) && (
        <PhotoLightIncrement
          p={p}
          onChange={(value) => {
            setScanning(false);
            onChange("light", value);
          }}
        />
      )}
      {chapter === 3 && (
        <PhotoFactorial
          p={p}
          onChange={(key, value) => {
            setScanning(false);
            onChange(key, value);
          }}
        />
      )}
      {chapter === 5 && (
        <PhotoNetStudy
          p={p}
          onChange={onChange}
          onPause={() => setScanning(false)}
        />
      )}
      <PhotoEvidence key={chapter} p={p} onRecord={() => setScanning(false)} />
    </section>
  );
}
