import ExocytosisDetail from "./ExocytosisDetail.jsx";
import { useEffect, useRef, useState } from "react";
import { secretoryStages } from "./secretoryStages.mjs";
import "./SecretoryGuide.css";

export default function SecretoryGuide({ p, onChange }) {
  const [playing, setPlaying] = useState(false);
  const current = useRef({ p, onChange });
  current.current = { p, onChange };
  const active = p.secretoryMode === 1;
  const progress = p.secretoryProgress ?? 0;
  useEffect(() => {
    if (!active) setPlaying(false);
  }, [active]);
  useEffect(() => {
    if (!playing || !active) return;
    let frame,
      last = performance.now();
    const tick = (now) => {
      if (document.hidden) last = now;
      if (now - last >= 33) {
        const next = Math.min(
          100,
          (current.current.p.secretoryProgress ?? 0) +
            Math.min(now - last, 100) / 200,
        );
        current.current.onChange("secretoryProgress", next);
        last = now;
        if (next === 100) {
          setPlaying(false);
          return;
        }
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [playing, active]);
  const stage =
    progress < 15
      ? 0
      : progress < 35
        ? 1
        : progress < 60
          ? 2
          : progress < 100
            ? 3
            : 4;
  return (
    <section className="secretory-guide" aria-label="分泌运输演示">
      <button
        className="btn"
        aria-expanded={active}
        onClick={() => onChange("secretoryMode", active ? 0 : 1)}
      >
        {active ? "关闭运输演示" : "演示分泌运输过程"}
      </button>
      {active && (
        <>
          <p>
            <strong>{secretoryStages[stage][1]}</strong> ·{" "}
            {secretoryStages[stage][2]}
          </p>
          <div role="group" aria-label="运输阶段">
            {secretoryStages.map(([value, name], index) => (
              <button
                className="btn"
                key={value}
                aria-pressed={index === stage}
                onClick={() => {
                  setPlaying(false);
                  onChange("secretoryProgress", value);
                }}
              >
                {index + 1}. {name}
              </button>
            ))}
          </div>
          <div className="secretory-playback">
            <button
              className="btn"
              onClick={() => {
                if (progress >= 100) onChange("secretoryProgress", 0);
                setPlaying(!playing);
              }}
            >
              {playing
                ? "暂停运输演示"
                : progress >= 100
                  ? "重新播放运输"
                  : "播放运输演示"}
            </button>
            <label>
              演示进度{" "}
              <input
                aria-label="分泌运输演示进度"
                type="range"
                min="0"
                max="100"
                step="1"
                value={progress}
                onChange={(e) => {
                  setPlaying(false);
                  onChange("secretoryProgress", Number(e.target.value));
                }}
              />
            </label>
          </div>
          <ExocytosisDetail
            progress={progress}
            onSeek={(value) => {
              setPlaying(false);
              onChange("secretoryProgress", value);
            }}
          />
          <small>
            金色实心点与外圈为透视追踪标记，球形环网表示运输载体；亮线突出当前段，虚线为顺序导线。尺寸、路线与进度均为示意；不模拟真实出芽、膜融合细节或实测速率。
          </small>
        </>
      )}
    </section>
  );
}
