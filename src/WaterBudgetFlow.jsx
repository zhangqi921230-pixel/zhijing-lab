import React, { useState, useEffect, useRef } from "react";
import Button from "./LabButton.jsx";
import "./WaterBudgetFlow.css";
export function waterFlowBands(p) {
  const amounts = [
    (p.rain * (100 - p.infil - p.evap)) / 100,
    (p.rain * p.infil) / 100,
    (p.rain * p.evap) / 100,
  ];
  let cursor = 180 - (p.rain * 0.65) / 2;
  return amounts.map((value, i) => {
    const start = cursor,
      height = value * 0.65,
      center = 70 + i * 110;
    cursor += height;
    return {
      value,
      height,
      start,
      end: cursor,
      top: center - height / 2,
      bottom: center + height / 2,
    };
  });
}
export default function WaterBudgetFlow({ p }) {
  const host = useRef(null);
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const media = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (!media) return;
    const update = () => {
      setReduced(media.matches);
      if (media.matches) setPlaying(false);
    };
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  const [playing, setPlaying] = useState(false),
    [visible, setVisible] = useState(false),
    [foreground, setForeground] = useState(
      typeof document === "undefined" || !document.hidden,
    );
  useEffect(() => {
    const observer =
      typeof IntersectionObserver === "undefined"
        ? null
        : new IntersectionObserver(([entry]) =>
            setVisible(entry.isIntersecting),
          );
    if (observer) observer.observe(host.current);
    else setVisible(true);
    const update = () => setForeground(!document.hidden);
    document.addEventListener("visibilitychange", update);
    return () => {
      observer?.disconnect();
      document.removeEventListener("visibilitychange", update);
    };
  }, []);
  const [focus, setFocus] = useState(-1),
    bands = waterFlowBands(p);
  const names = ["地表径流", "下渗", "蒸散"],
    colors = ["var(--ui-primary)", "var(--ui-gold)", "var(--ui-muted)"];
  return (
    <details className="water-flow-study" open ref={host}>
      <summary>同一份降水，三个去向</summary>
      <p>
        带宽表示本次事件的水量深度，统一使用毫米比例。点击去向突出对应分支；淡色分支仍计入总量。
      </p>
      <div
        className="water-flow-actions"
        role="group"
        aria-label="聚焦水量去向"
      >
        <Button
          disabled={reduced}
          primary={playing}
          aria-pressed={playing}
          onClick={() => setPlaying((v) => !v)}
        >
          {reduced
            ? "系统已减少动态效果"
            : playing
              ? "暂停流向演示"
              : "播放流向演示"}
        </Button>
        <Button aria-pressed={focus === -1} onClick={() => setFocus(-1)}>
          全部去向
        </Button>
        {names.map((name, i) => (
          <Button
            key={name}
            aria-pressed={focus === i}
            onClick={() => setFocus(i)}
          >
            {name}
          </Button>
        ))}
      </div>
      <div
        className="water-flow-scroll"
        tabIndex="0"
        role="region"
        aria-label="同尺度水量分流图，可横向滚动"
      >
        <svg
          viewBox="0 0 760 370"
          role="img"
          aria-label={`${p.rain}毫米降水分配为径流、下渗与蒸散`}
        >
          <text x="40" y="35">
            降水输入
          </text>
          <text x="40" y="62">
            {p.rain} mm
          </text>
          <rect
            x="50"
            y={180 - (p.rain * 0.65) / 2}
            width="100"
            height={p.rain * 0.65}
            fill="var(--ui-primary)"
            opacity=".3"
          />
          {bands.map((b, i) => (
            <g key={names[i]}>
              {b.height > 0 && (
                <>
                  <path
                    data-testid="water-flow-band"
                    opacity={focus === -1 || focus === i ? 1 : 0.25}
                    className="water-flow-branch"
                    d={`M150 ${b.start}C280 ${b.start} 320 ${b.top} 460 ${b.top}L460 ${b.bottom}C320 ${b.bottom} 280 ${b.end} 150 ${b.end}Z`}
                    fill={colors[i]}
                    fillOpacity=".6"
                  />
                  <path
                    className="water-flow-direction"
                    pathLength="100"
                    d={`M150 ${(b.start + b.end) / 2}C280 ${(b.start + b.end) / 2} 320 ${(b.top + b.bottom) / 2} 460 ${(b.top + b.bottom) / 2}`}
                    fill="none"
                    stroke="var(--ui-paper)"
                    strokeWidth={Math.min(3, b.height * 0.45)}
                    strokeDasharray="3 12"
                    opacity={focus === -1 || focus === i ? 0.9 : 0.2}
                    style={{
                      animationPlayState:
                        playing && visible && foreground ? "running" : "paused",
                    }}
                  />
                </>
              )}
              <text x="495" y={64 + i * 110}>
                {names[i]}
              </text>
              <text x="495" y={92 + i * 110}>
                {Number(b.value.toFixed(2))} mm
              </text>
            </g>
          ))}
          <text x="40" y="347">
            合计 {bands.map((b) => Number(b.value.toFixed(2))).join(" + ")} ={" "}
            {p.rain} mm
          </text>
        </svg>
      </div>
      <p>
        移动短线仅提示水量去向，速度不代表真实流速或时间；减少动态效果设置下保持静态。
      </p>
      <p>
        {p.rain === 0
          ? "无降水时三个分支均为零，不绘制有宽度的水带。"
          : focus === 0
            ? "在这个账本中，径流等于降水减去下渗与蒸散。"
            : focus === 1
              ? "固定降水与蒸散时，下渗每增加1 mm，径流就减少1 mm。"
              : focus === 2
                ? "蒸散是水返回大气的合并项；本图没有把蒸发与植物蒸腾分别定量。"
                : "输入量与三项输出之和相等。改变降水量会整体改变带宽；改变分配比例会重新分配带宽。"}
      </p>
      <p>
        这是忽略储水变化的单场事件分配账本。路径形状不是河流形状，带宽不是河宽或瞬时流量；实际流域还需考虑土壤蓄水和地下水等变化。
      </p>
    </details>
  );
}
