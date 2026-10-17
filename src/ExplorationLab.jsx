import { explorations } from "./explorations.mjs";
import { gradeFor } from "./curriculumLevels.mjs";
import React, { useState, useEffect, useMemo } from "react";
import { Play, Pause, RotateCcw, ArrowLeft } from "lucide-react";
import MoonCycle from "./MoonCycle.jsx";
import ProbabilityEvent from "./ProbabilityEvent.jsx";
import ProbabilityComparison from "./ProbabilityComparison.jsx";
import GasCollisionStudy from "./GasCollisionStudy.jsx";
import { gasParticles, gasParticleState } from "./gasParticles.mjs";
import GasWorkStudy from "./GasWorkStudy.jsx";
import Button from "./LabButton.jsx";
import { TopicPicker, TopicChapters } from "./TopicLearning.jsx";
import { subjects } from "./lessons.mjs";
import { groupFor } from "./courseCatalog.mjs";
import {
  gasState,
  binomial,
  sampleCoins,
  moonState,
  moonLitPath,
  GAS_R,
} from "./explorationModels.mjs";
import "./ExplorationLab.css";

const f = (n, d = 2) => n.toFixed(d);
function Plot({
  points,
  marker,
  xLabel,
  yLabel,
  xMax,
  yMax,
  bars,
  theoretical,
}) {
  const x = (v) =>
      55 + (theoretical ? (v + 0.5) / theoretical.length : v / xMax) * 590,
    y = (v) => 245 - (v / yMax) * 200;
  return (
    <svg
      className="science-plot"
      viewBox="0 0 700 300"
      role="img"
      aria-label={`${yLabel}随${xLabel}变化的图像`}
    >
      {Array.from({ length: 5 }, (_, i) => (
        <g key={i}>
          <path d={`M55 ${y((i * yMax) / 4)}H645`} className="plot-grid" />
          <text x="45" y={y((i * yMax) / 4) + 5} textAnchor="end">
            {f((i * yMax) / 4, yMax <= 1 ? 2 : 0)}
          </text>
        </g>
      ))}
      <path d="M55 35V245H655" className="plot-axis" />
      {Array.from({ length: theoretical ? theoretical.length : 5 }, (_, i) => (
        <text
          key={i}
          x={x(theoretical ? i : (i * xMax) / 4)}
          y="267"
          textAnchor="middle"
        >
          {theoretical ? i : Number(f((i * xMax) / 4, 2))}
        </text>
      ))}
      <text x="55" y="22">
        {yLabel}
      </text>
      <text x="645" y="290" textAnchor="end">
        {xLabel}
      </text>
      {points && (
        <path
          d={points
            .map(([a, b], i) => `${i ? "L" : "M"}${x(a)} ${y(b)}`)
            .join("")}
          fill="none"
          stroke="var(--primary)"
          strokeWidth="3"
        />
      )}
      {bars?.map((v, i) => (
        <rect
          key={i}
          x={x(i) - (590 / theoretical.length) * 0.3}
          y={y(v)}
          width={(590 / theoretical.length) * 0.6}
          height={245 - y(v)}
          fill="var(--primary)"
          opacity=".65"
        />
      ))}
      {theoretical?.map((v, i) => (
        <g key={i}>
          <path
            d={`M${x(i) - 8} ${y(v)}h16`}
            stroke="#b46c16"
            strokeWidth="3"
          />
          <circle cx={x(i)} cy={y(v)} r="3" fill="#b46c16" />
        </g>
      ))}
      {marker && (
        <g>
          <path
            d={`M${x(marker[0])} 245V${y(marker[1])}H55`}
            fill="none"
            stroke="#b46c16"
            strokeDasharray="5 5"
          />
          <circle
            cx={x(marker[0])}
            cy={y(marker[1])}
            r="6"
            fill="#b46c16"
            stroke="white"
            strokeWidth="2"
          />
        </g>
      )}
    </svg>
  );
}
function GasScene({ p, time }) {
  const h = (p.volume / 30) * 260,
    top = 370 - h,
    pressure = gasState(p).pressure;
  const needle = ((-130 + Math.min(1, pressure / 1000) * 260) * Math.PI) / 180;
  return (
    <svg
      className="apparatus"
      viewBox="0 0 700 470"
      role="img"
      aria-label={`气缸体积 ${p.volume} L，温度 ${p.temperature} K，压强 ${f(pressure)} kPa`}
    >
      <defs>
        <linearGradient id="gas-metal">
          <stop stopColor="#657b80" />
          <stop offset=".22" stopColor="#f4f2e5" />
          <stop offset=".48" stopColor="#c3cdca" />
          <stop offset=".72" stopColor="#faf9ed" />
          <stop offset="1" stopColor="#718587" />
        </linearGradient>
        <linearGradient id="gas-glass">
          <stop stopColor="#b9d9cf" stopOpacity=".42" />
          <stop offset=".25" stopColor="white" stopOpacity=".1" />
          <stop offset=".75" stopColor="#91b8b6" stopOpacity=".08" />
          <stop offset="1" stopColor="#b9d9cf" stopOpacity=".6" />
        </linearGradient>
      </defs>
      <ellipse
        cx="343"
        cy="428"
        rx="267"
        ry="15"
        fill="#193d36"
        opacity=".12"
      />
      <rect
        x="125"
        y="394"
        width="370"
        height="28"
        rx="6"
        fill="url(#gas-metal)"
        stroke="#5e7472"
      />
      <rect x="142" y="422" width="45" height="8" rx="2" fill="#38504d" />
      <rect x="425" y="422" width="45" height="8" rx="2" fill="#38504d" />
      <rect
        x="177"
        y="72"
        width="235"
        height="305"
        rx="9"
        fill="url(#gas-glass)"
        stroke="#6c9992"
        strokeWidth="3"
      />
      <path
        d="M187 85V358M401 85V358"
        stroke="white"
        opacity=".75"
        strokeWidth="5"
      />
      <rect
        x="180"
        y={top}
        width="228"
        height={h}
        fill="#80b9ac"
        opacity=".16"
      />
      {gasParticles.slice(0, Math.round(10 + p.amount * 30)).map((v, i) => {
        const dot = gasParticleState(p, time, v);
        return (
          <circle
            key={i}
            cx={dot.x}
            cy={dot.y}
            r={i === 0 ? 5 : 3.8}
            fill={i === 0 ? "#c08428" : "#277c6b"}
            stroke="#f4fff8"
            strokeWidth="1"
          />
        );
      })}
      <rect
        x="281"
        y="30"
        width="26"
        height={top - 25}
        fill="url(#gas-metal)"
        stroke="#637d78"
      />
      <rect
        x="244"
        y="24"
        width="100"
        height="14"
        rx="4"
        fill="url(#gas-metal)"
        stroke="#637d78"
      />
      <rect
        x="180"
        y={top - 10}
        width="228"
        height="16"
        rx="2"
        fill="url(#gas-metal)"
        stroke="#4d6d66"
      />
      <path d={`M182 ${top + 4}h224`} stroke="#344840" strokeWidth="4" />
      <rect
        x="180"
        y="372"
        width="230"
        height="19"
        rx="4"
        fill="url(#gas-metal)"
        stroke="#47665e"
      />
      <path d="M412 340H510V212" fill="none" stroke="#536e68" strokeWidth="9" />
      <path d="M412 338H508V212" fill="none" stroke="#d5dfd5" strokeWidth="3" />
      <circle
        cx="510"
        cy="152"
        r="65"
        fill="url(#gas-metal)"
        stroke="#4d655e"
        strokeWidth="3"
      />
      <circle cx="510" cy="152" r="55" fill="#fbf8ed" stroke="#81978e" />
      {Array.from({ length: 11 }, (_, i) => {
        const a = ((-130 + i * 26) * Math.PI) / 180;
        return (
          <line
            key={i}
            x1={510 + Math.sin(a) * 44}
            y1={152 - Math.cos(a) * 44}
            x2={510 + Math.sin(a) * 50}
            y2={152 - Math.cos(a) * 50}
            stroke="#455b53"
            strokeWidth="2"
          />
        );
      })}
      <path
        d={`M510 152L${510 + Math.sin(needle) * 42} ${152 - Math.cos(needle) * 42}`}
        stroke="#aa5b32"
        strokeWidth="3"
      />
      <circle cx="510" cy="152" r="5" fill="#50645c" />
      <text x="510" y="178" textAnchor="middle">
        kPa
      </text>
      <rect
        x="420"
        y="217"
        width="180"
        height="65"
        rx="8"
        fill="var(--surface)"
        stroke="var(--line)"
      />
      <text x="510" y="240" textAnchor="middle" className="svg-value">
        {f(pressure)} kPa
      </text>
      <text x="510" y="265" textAnchor="middle">
        绝对压强 · 量程 1000
      </text>
      {Array.from({ length: 7 }, (_, i) => (
        <g key={i}>
          <path d={`M145 ${370 - (i * 260) / 6}h20`} stroke="#5c7569" />
          <text x="135" y={375 - (i * 260) / 6} textAnchor="end">
            {i * 5}
          </text>
        </g>
      ))}
      <text x="142" y="89">
        L
      </text>
      <rect x="208" y="395" width="178" height="23" rx="3" fill="#233e37" />
      <text x="297" y="412" textAnchor="middle" fill="#f3e8c8">
        恒温环境 {p.temperature} K
      </text>
      <text x="350" y="459" textAnchor="middle">
        气缸剖面示意 · 粒子可暂停观察
      </text>
    </svg>
  );
}
function MoonScene({ angle }) {
  const state = moonState(angle),
    a = (angle * Math.PI) / 180,
    mx = 230 + 150 * Math.cos(a),
    my = 210 - 150 * Math.sin(a);
  return (
    <div className="moon-views">
      <svg
        viewBox="0 0 460 440"
        role="img"
        aria-label={`北极上方示意，月球周期角 ${angle} 度`}
      >
        <defs>
          <radialGradient id="earth-light" cx="85%" cy="30%">
            <stop stopColor="#99d9dd" />
            <stop offset=".7" stopColor="#2b6881" />
            <stop offset="1" stopColor="#102533" />
          </radialGradient>
        </defs>
        <text x="24" y="32">
          01 / 从北极上方看
        </text>
        {[90, 150, 210, 270, 330].map((y) => (
          <g key={y}>
            <path d={`M450 ${y}H28`} stroke="#d4b775" opacity=".25" />
            <path d={`M38 ${y - 4}l-10 4 10 4`} fill="none" stroke="#d4b775" />
          </g>
        ))}
        <circle
          cx="230"
          cy="210"
          r="150"
          fill="none"
          stroke="#628392"
          strokeDasharray="4 7"
        />
        <path
          d={`M230 210L${mx} ${my}`}
          stroke="#e3c986"
          strokeDasharray="5 5"
        />
        <circle cx="230" cy="210" r="33" fill="url(#earth-light)" />
        <path
          d="M241 182l-12 9 5 13-8 7 10 13 7-7 7-23Z"
          fill="#94aa80"
          opacity=".7"
        />
        <text x="230" y="266" textAnchor="middle">
          地球
        </text>
        <circle cx={mx} cy={my} r="18" fill="#253342" />
        <path
          d={`M${mx} ${my - 18}A18 18 0 0 1 ${mx} ${my + 18}Z`}
          fill="#e7deca"
        />
        <text x="420" y="55" textAnchor="end" fill="#e3c986">
          太阳光 ←
        </text>
        <text x="230" y="407" textAnchor="middle">
          虚线为地球到月球的视线
        </text>
      </svg>
      <div className="moon-observer">
        <svg
          viewBox="0 0 380 370"
          role="img"
          aria-label={`从地球观察：${state.name}，亮面 ${f(state.fraction * 100, 1)}%`}
        >
          <defs>
            <radialGradient id="lunar-surface" cx="40%" cy="35%">
              <stop stopColor="#f0eadc" />
              <stop offset=".8" stopColor="#bfbfb5" />
              <stop offset="1" stopColor="#969e9e" />
            </radialGradient>
            <clipPath id="moon-disc">
              <circle r="112" />
            </clipPath>
            <clipPath id="moon-lit">
              <path d={moonLitPath(angle, 112)} />
            </clipPath>
          </defs>
          <text x="20" y="32">
            02 / 从地球看月面
          </text>
          <g transform="translate(190 180)">
            <circle r="114" fill="#394858" />
            <circle r="112" fill="#17232d" />
            <g clipPath="url(#moon-lit)">
              <circle r="112" fill="url(#lunar-surface)" />
              <g fill="#6d7778" opacity=".28">
                <ellipse cx="-29" cy="-35" rx="34" ry="27" />
                <ellipse cx="36" cy="-47" rx="24" ry="38" />
                <ellipse cx="-54" cy="14" rx="31" ry="42" />
                <ellipse cx="6" cy="12" rx="29" ry="20" />
              </g>
              {Array.from({ length: 29 }, (_, i) => {
                const ang = i * 2.399,
                  r = Math.sqrt((i + 1) / 30) * 100;
                return (
                  <g key={i}>
                    <circle
                      cx={Math.cos(ang) * r}
                      cy={Math.sin(ang) * r}
                      r={3 + (i % 5)}
                      fill="#828b88"
                      opacity=".3"
                      stroke="#f5f1df"
                      strokeWidth="1"
                    />
                  </g>
                );
              })}
            </g>
          </g>
          <text x="190" y="330" textAnchor="middle" className="svg-value">
            {state.name} · 亮面 {f(state.fraction * 100, 1)}%
          </text>
        </svg>
        <p>北半球常见朝向示意；实际亮面朝向随地点与观测时刻变化。</p>
      </div>
    </div>
  );
}

export default function ExplorationLab({ lesson: metadata, open, goHome }) {
  const lesson = explorations.find((x) => x.id === metadata.id) ?? metadata;
  const [chapter, setChapter] = useState(0),
    [p, setP] = useState({ ...lesson.chapters[0].preset }),
    [running, setRunning] = useState(false),
    [time, setTime] = useState(0),
    [count, setCount] = useState(0),
    [autoTarget, setAutoTarget] = useState(0),
    [gasSweep, setGasSweep] = useState(null),
    [seed, setSeed] = useState(7291),
    [records, setRecords] = useState([]),
    [status, setStatus] = useState("已准备本节实验。");
  const item = lesson.chapters[chapter],
    subject = subjects.find((x) => x.id === lesson.subject),
    id = lesson.id;
  useEffect(() => {
    if (gasSweep === null) return;
    let volume = 20;
    const handle = setInterval(() => {
      if (document.hidden) return;
      volume = Math.max(10, Math.round((volume - 0.04) * 100) / 100);
      setP((v) => ({ ...v, volume }));
      if (volume === 10) setGasSweep(null);
    }, 16);
    return () => clearInterval(handle);
  }, [gasSweep]);
  useEffect(() => {
    if (!autoTarget) return;
    const handle = setInterval(() => {
      if (!document.hidden) setCount((c) => Math.min(autoTarget, c + 1));
    }, 350);
    return () => clearInterval(handle);
  }, [autoTarget]);
  useEffect(() => {
    if (autoTarget && count >= autoTarget) {
      setAutoTarget(0);
      setStatus(`逐组演示完成，共 ${count} 组。`);
    }
  }, [count, autoTarget]);
  useEffect(() => {
    if (!running) return;
    let handle,
      last = 0;
    function frame(now) {
      if (!document.hidden && now - last >= 32) {
        const dt = last ? Math.min(0.05, (now - last) / 1000) : 0;
        last = now;
        if (id === "moon")
          setP((v) => ({ ...v, angle: (v.angle + dt * 12) % 360 }));
        else setTime((t) => t + dt);
      }
      if (document.hidden) last = now;
      handle = requestAnimationFrame(frame);
    }
    handle = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(handle);
  }, [running, id]);
  const sample = useMemo(
    () => (id === "probability" ? sampleCoins(p.n, p.p, count, seed) : null),
    [id, p.n, p.p, count, seed],
  );
  const theory = useMemo(
    () => (id === "probability" ? binomial(p.n, p.p) : null),
    [id, p.n, p.p],
  );
  function select(i) {
    setGasSweep(null);
    setAutoTarget(0);
    setChapter(i);
    setP({ ...lesson.chapters[i].preset });
    setTime(0);
    setRunning(false);
    setCount(0);
    setStatus(
      `已准备“${lesson.chapters[i].title}”。${id === "gas" ? "本页状态记录保留。" : id === "probability" ? "开始新一轮抽样。" : "动画已暂停，可继续调整。"}`,
    );
  }
  function change(key, value) {
    setGasSweep(null);
    setAutoTarget(0);
    setP((v) => ({ ...v, [key]: value }));
    setRunning(false);
    if (id === "probability") {
      setCount(0);
      setStatus("参数已改变，开始新的随机试验。");
    }
  }
  const gas = id === "gas" ? gasState(p) : null,
    moon = id === "moon" ? moonState(p.angle) : null;
  const gasAxis =
    chapter === 1 ? "temperature" : chapter === 2 ? "amount" : "volume";
  const xmax = gasAxis === "temperature" ? 600 : gasAxis === "amount" ? 1 : 30;
  const curve =
    id === "gas"
      ? Array.from({ length: 101 }, (_, i) => {
          const value =
            (gasAxis === "volume" ? 5 : gasAxis === "temperature" ? 200 : 0.1) +
            ((xmax -
              (gasAxis === "volume"
                ? 5
                : gasAxis === "temperature"
                  ? 200
                  : 0.1)) *
              i) /
              100;
          return [value, gasState({ ...p, [gasAxis]: value }).pressure];
        })
      : [];
  return (
    <div className={`exploration-lab explorer-${id}`}>
      <aside className="exploration-nav">
        <Button icon={ArrowLeft} onClick={goHome}>
          返回探索馆
        </Button>
        <div className="exploration-identity">
          <small>{subject.en}</small>
          <h2>{subject.name}实验室</h2>
        </div>
        <TopicPicker lesson={lesson} onSelect={open} />
        <TopicChapters
          chapters={lesson.chapters}
          chapter={chapter}
          onSelect={select}
        />
      </aside>
      <main className="exploration-main">
        <header>
          <span className="eyebrow">互动探究 / {gradeFor(lesson.id)}</span>
          <h1>{groupFor(id)?.title ?? lesson.title}</h1>
          <p>
            {lesson.title} · {lesson.description}
          </p>
        </header>
        <section className="exploration-stage" aria-label="互动演示">
          <div className="stage-caption">
            <span>
              {String(chapter + 1).padStart(2, "0")} / {item.title}
            </span>
            <span>
              {id === "moon"
                ? "轨道与观察联动"
                : id === "gas"
                  ? "气缸与曲线联动"
                  : "随机试验与理论对照"}
            </span>
          </div>
          {id === "gas" && (
            <>
              <GasScene p={p} time={time} />
              <div className="exploration-readings">
                <span>
                  绝对压强
                  <strong>
                    {f(gas.pressure)} <small>kPa</small>
                  </strong>
                </span>
                <span>
                  PV
                  <strong>
                    {f(gas.pv)} <small>kPa·L</small>
                  </strong>
                </span>
                <span>
                  PV / nT<strong>{f(GAS_R, 3)}</strong>
                </span>
              </div>
            </>
          )}
          {id === "moon" && (
            <>
              <MoonScene angle={p.angle} />
              <MoonCycle angle={p.angle} onChange={change} chapter={chapter} />
              <div className="exploration-readings">
                <span>
                  近似月龄
                  <strong>
                    {f(moon.day, 1)} <small>天</small>
                  </strong>
                </span>
                <span>
                  周期角<strong>{f(p.angle, 0)}°</strong>
                </span>
                <span>
                  可见亮面<strong>{f(moon.fraction * 100, 1)}%</strong>
                </span>
              </div>
            </>
          )}
          {id === "probability" && (
            <>
              <div className="coin-tray" aria-label={`每组 ${p.n} 次独立试验`}>
                {Array.from({ length: p.n }, (_, i) => (
                  <div
                    className={`coin ${count && !sample.last[i] ? "coin-tail" : ""}`}
                    key={`${i}-${count}-${seed}`}
                  >
                    <span>第 {i + 1} 次</span>
                    <strong>
                      {count ? (sample.last[i] ? "正面" : "反面") : "待抛掷"}
                    </strong>
                    <small>p = {f(p.p)}</small>
                  </div>
                ))}
              </div>
              <p className="trial-caption">
                {count
                  ? `上方为第 ${count} 组结果：${sample.last.filter(Boolean).length} 次正面。下方统计全部 ${count} 组。`
                  : "每枚硬币表示一组中的一次独立抛掷。"}
              </p>
              <div className="exploration-readings">
                <span>
                  已完成组数<strong>{count}</strong>
                </span>
                <span>
                  单次正面频率
                  <strong>
                    {sample.frequency === null ? "—" : f(sample.frequency, 3)}
                  </strong>
                </span>
                <span>
                  理论单次概率<strong>{f(p.p, 2)}</strong>
                </span>
              </div>
              <div className="plot-caption">
                各组正面次数 X 的分布 · 绿色为样本频率，金色为理论概率
              </div>
              <Plot
                bars={sample.bins.map((v) => (count ? v / count : 0))}
                theoretical={theory}
                xMax={p.n + 0.5}
                yMax={Math.min(
                  1,
                  Math.ceil(
                    Math.max(
                      ...theory,
                      ...sample.bins.map((v) => (count ? v / count : 0)),
                    ) *
                      1.15 *
                      10,
                  ) / 10,
                )}
                xLabel="每组正面数 X"
                yLabel="相对频率 / 概率"
              />
              {count === 0 && (
                <p className="empty-experiment">
                  还没有样本。点击“做 10 组”开始对照，金色标记为理论值。
                </p>
              )}
            </>
          )}
          <div className="exploration-actions">
            {id === "probability" ? (
              <>
                <Button
                  disabled={count >= 10000}
                  aria-pressed={!!autoTarget}
                  onClick={() =>
                    setAutoTarget((t) => (t ? 0 : Math.min(10000, count + 100)))
                  }
                >
                  {autoTarget ? "暂停逐组演示" : "逐组演示 100 组"}
                </Button>
                {[1, 10, 100, 1000].map((n) => (
                  <Button
                    key={n}
                    primary={n === 10}
                    disabled={count >= 10000}
                    onClick={() => {
                      setAutoTarget(0);
                      setCount((c) => Math.min(10000, c + n));
                      setStatus(`已追加试验，最多记录 10000 组。`);
                    }}
                  >
                    做 {n} 组
                  </Button>
                ))}
                <Button
                  onClick={() => {
                    setAutoTarget(0);
                    setCount(0);
                    setSeed((s) => s + 997);
                    setStatus("已清空本次样本并换用新的随机序列。");
                  }}
                >
                  新一轮试验
                </Button>
              </>
            ) : (
              <>
                <Button
                  primary
                  icon={running ? Pause : Play}
                  onClick={() => setRunning((v) => !v)}
                >
                  {running
                    ? "暂停"
                    : id === "moon"
                      ? "播放月相循环"
                      : "播放粒子示意"}
                </Button>
                <Button icon={RotateCcw} onClick={() => select(chapter)}>
                  重做本节
                </Button>
              </>
            )}
          </div>
        </section>
        {id === "gas" && chapter < 4 && (
          <section className="exploration-chart">
            <h2>同一组状态，读懂一条曲线</h2>
            <p>曲线保持另外两个量不变；金色点对应当前气缸状态。</p>
            <Plot
              points={curve}
              marker={[p[gasAxis], gas.pressure]}
              xMax={xmax}
              yMax={Math.ceil(Math.max(...curve.map((x) => x[1])) / 50) * 50}
              xLabel={
                gasAxis === "volume"
                  ? "体积 V / L"
                  : gasAxis === "temperature"
                    ? "绝对温度 T / K"
                    : "物质的量 n / mol"
              }
              yLabel="绝对压强 P / kPa"
            />
          </section>
        )}
        {id === "probability" && (
          <ProbabilityComparison
            key={`comparison-${p.n}-${p.p}`}
            p={p}
            count={count}
            sample={sample}
            onPause={() => setAutoTarget(0)}
          />
        )}
        {id === "probability" && (
          <ProbabilityEvent
            key={`event-${p.n}-${p.p}`}
            p={p}
            count={count}
            sample={sample}
            onPause={() => setAutoTarget(0)}
          />
        )}
        {id === "gas" && chapter === 5 && (
          <GasCollisionStudy
            p={p}
            time={time}
            onPreset={(next) => {
              setGasSweep(null);
              setRunning(false);
              setTime(0);
              setP(next);
            }}
          />
        )}
        {id === "gas" && chapter === 4 && (
          <GasWorkStudy
            p={p}
            onVolume={(v) => change("volume", v)}
            sweeping={gasSweep !== null}
            onStop={() => setGasSweep(null)}
            onSweep={() => {
              setRunning(false);
              setP((v) => ({ ...v, volume: 20 }));
              setGasSweep(20);
            }}
          />
        )}
        {id === "gas" && (
          <section className="exploration-chart">
            <h2>平衡状态记录</h2>
            <Button
              disabled={records.length >= 12}
              onClick={() => {
                setRecords((r) => [...r, { ...p, ...gas }]);
                setStatus("已记录当前平衡状态。");
              }}
            >
              记录当前状态 {records.length}/12
            </Button>
            {records.length ? (
              <div className="record-table">
                <table>
                  <caption>同一实验的不同状态，单位见表头</caption>
                  <thead>
                    <tr>
                      {["V / L", "T / K", "n / mol", "P / kPa"].map((h) => (
                        <th key={h}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {records.map((r, i) => (
                      <tr key={i}>
                        <td>{f(r.volume, 1)}</td>
                        <td>{r.temperature}</td>
                        <td>{f(r.amount)}</td>
                        <td>{f(r.pressure)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p>尚未记录。改变一个变量后记录，比较前后状态。</p>
            )}
          </section>
        )}
      </main>
      <aside className="exploration-notes">
        <small>学习笔记 / {String(chapter + 1).padStart(2, "0")}</small>
        <h2>{item.title}</h2>
        <p>{item.text}</p>
        <div className="exploration-task">
          <strong>动手试一试</strong>
          <p>{item.task}</p>
        </div>
        {id === "moon" && (
          <div className="phase-presets">
            {[
              ["新月", 0],
              ["上弦", 90],
              ["满月", 180],
              ["下弦", 270],
            ].map(([name, value]) => (
              <Button
                key={name}
                aria-pressed={Math.abs(p.angle - value) < 0.1}
                onClick={() => change("angle", value)}
              >
                {name}
              </Button>
            ))}
          </div>
        )}
        {id === "gas" && chapter < 3 && (
          <div className="phase-presets" role="group" aria-label="一键对照">
            {(chapter === 0
              ? [
                  ["10 L", "volume", 10],
                  ["20 L", "volume", 20],
                ]
              : chapter === 1
                ? [
                    ["300 K", "temperature", 300],
                    ["600 K", "temperature", 600],
                  ]
                : [
                    ["0.25 mol", "amount", 0.25],
                    ["0.50 mol", "amount", 0.5],
                  ]
            ).map(([label, key, value]) => (
              <Button
                key={label}
                aria-pressed={p[key] === value}
                onClick={() => change(key, value)}
              >
                {label}
              </Button>
            ))}
          </div>
        )}
        {lesson.params
          .filter((param) => item.keys.includes(param.key))
          .map((param) => (
            <label className="exploration-control" key={param.key}>
              <span>
                {param.label}
                <strong>
                  {f(p[param.key], param.step < 1 ? 2 : 0)} {param.unit}
                </strong>
              </span>
              <input
                aria-label={param.label}
                type="range"
                min={param.min}
                max={param.max}
                step={param.step}
                value={p[param.key]}
                onChange={(e) => change(param.key, +e.target.value)}
              />
              <small>
                {param.min} {param.unit}
                <span>
                  {param.max} {param.unit}
                </span>
              </small>
            </label>
          ))}
        <div className="exploration-formula">{lesson.formula}</div>
        <div className="exploration-actions">
          <Button disabled={chapter === 0} onClick={() => select(chapter - 1)}>
            上一节
          </Button>
          <Button
            disabled={chapter === lesson.chapters.length - 1}
            onClick={() => select(chapter + 1)}
          >
            下一节
          </Button>
        </div>
        <p role="status" className="exploration-status">
          {status}
        </p>
        <details>
          <summary>模型说明与边界</summary>
          <p>{lesson.assumption}</p>
          <a href={lesson.source} target="_blank" rel="noreferrer">
            查看科学依据 ↗
          </a>
        </details>
      </aside>
    </div>
  );
}
