import { gradeFor } from "./curriculumLevels.mjs";
import SodiumSpectrum from "./SodiumSpectrum.jsx";
import DisplacementComparison from "./DisplacementComparison.jsx";
import ElectrolysisReading from "./ElectrolysisReading.jsx";
import DisplacementElectrons from "./DisplacementElectrons.jsx";
import PhotonEmission from "./PhotonEmission.jsx";
import DistillationSalt from "./DistillationSalt.jsx";
import { displacementAppearance } from "./displacementAppearance.mjs";
import React, { useEffect, useState, useRef, lazy, Suspense } from "react";
import {
  loadChemistrySession,
  saveChemistrySession,
  chemistryDuration,
} from "./chemistrySession.mjs";
import { TopicPicker, TopicChapters } from "./TopicLearning.jsx";
import {
  chemistryTopics,
  flameSamples,
  displacementState,
  electrolysisState,
  distillationState,
} from "./chemistryTopics.mjs";
import "./ChemistryLab.css";
import DisplacementBalance from "./DisplacementBalance.jsx";
import DistillationStudy from "./DistillationStudy.jsx";
import ElectrolysisCompare from "./ElectrolysisCompare.jsx";
import FlameComparison from "./FlameComparison.jsx";
const Chemistry3D = lazy(() => import("./Chemistry3D.jsx"));
const fixed = (n, d = 2) => Number(n).toFixed(d);
const metals = { iron: "铁", zinc: "锌", copper: "铜" };
function Glass({
  x,
  y,
  w = 180,
  h = 240,
  level = 0.6,
  color = "#38b9e3",
  children,
}) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path
        d={`M0 0V${h - 20}Q0 ${h} 20 ${h}H${w - 20}Q${w} ${h} ${w} ${h - 20}V0`}
        fill="url(#glass)"
        stroke="#91adb6"
        strokeWidth="3"
      />
      <path
        d={`M4 ${h * (1 - level)}H${w - 4}V${h - 20}Q${w - 4} ${h - 4} ${w - 20} ${h - 4}H20Q4 ${h - 4} 4 ${h - 20}Z`}
        fill={color}
        opacity=".55"
      />
      <ellipse
        cx={w / 2}
        cy={h * (1 - level)}
        rx={w / 2 - 4}
        ry="7"
        fill={color}
        opacity=".55"
      />
      <path
        d={`M12 18V${h - 28}`}
        stroke="white"
        opacity=".65"
        strokeWidth="5"
      />
      {[1, 2, 3, 4].map((i) => (
        <path key={i} d={`M${w - 22} ${h - (i * h) / 5}h14`} stroke="#6b858c" />
      ))}
      {children}
    </g>
  );
}
function Bubbles({ x, y, width = 70, count = 12, active = true }) {
  return (
    <g className={active ? "chem-bubbles" : "chem-bubbles is-paused"}>
      {Array.from({ length: count }, (_, i) => (
        <circle
          key={i}
          className="chem-bubble"
          cx={x + ((i * 19) % width)}
          cy={y}
          r={2 + (i % 3)}
          fill="#effcff"
          opacity=".65"
          style={{
            animationDelay: `-${i * 0.27}s`,
            animationDuration: `${1.5 + (i % 4) * 0.3}s`,
          }}
        />
      ))}
    </g>
  );
}
export function ChemistryScene({ id, p, time, running, labels = true }) {
  const displacement = displacementState(p.metal, p.mass, time / 60),
    gas = electrolysisState(p.current, time),
    distill = distillationState(p.power, time, p.cooling),
    sample = flameSamples[p.sample] || flameSamples.sodium;
  const appearance = displacementAppearance(p.metal, p.mass, displacement);
  const caption = (x, y, text) =>
    labels ? (
      <text x={x} y={y} className="chem-label">
        {text}
      </text>
    ) : null;
  return (
    <svg
      className={`chem-scene ${running ? "is-running" : "is-paused"}`}
      viewBox="0 0 900 580"
      role="img"
      aria-label={
        {
          flame: "焰色实验：样品与火焰颜色",
          displacement: "金属置换：溶液颜色和铜镀层",
          electrolysis: "电解水：阴极氢气和阳极氧气",
          distillation: "蒸馏装置：蒸发、冷凝和接收",
        }[id]
      }
    >
      <defs>
        <linearGradient id="glass" x1="0" x2="1">
          <stop stopColor="#d7f4ff" stopOpacity=".18" />
          <stop offset=".2" stopColor="#ffffff" stopOpacity=".32" />
          <stop offset=".65" stopColor="#7fc6dd" stopOpacity=".05" />
          <stop offset="1" stopColor="#c3edff" stopOpacity=".28" />
        </linearGradient>
        <linearGradient id="metal">
          <stop stopColor="#344751" />
          <stop offset=".35" stopColor="#d2dce0" />
          <stop offset=".55" stopColor="#8798a0" />
          <stop offset="1" stopColor="#283e48" />
        </linearGradient>
        <linearGradient id="fire" x1="0" y1="1" x2="0" y2="0">
          <stop stopColor="#6bbaff" />
          <stop offset=".3" stopColor={sample.color} />
          <stop offset="1" stopColor={sample.color} stopOpacity=".15" />
        </linearGradient>
        <radialGradient id="flameHalo">
          <stop stopColor={sample.color} stopOpacity=".28" />
          <stop offset="1" stopColor={sample.color} stopOpacity="0" />
        </radialGradient>
        <pattern
          id="chemGrid"
          width="40"
          height="40"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M40 0H0V40"
            fill="none"
            stroke="currentColor"
            opacity=".05"
          />
        </pattern>
      </defs>
      <rect width="900" height="580" fill="var(--ui-paper)" />
      <rect width="900" height="580" fill="url(#chemGrid)" />
      <ellipse cx="450" cy="505" rx="360" ry="28" fill="#172b3420" />
      <path d="M60 490H850" stroke="var(--ui-line)" strokeWidth="3" />
      {id === "flame" && (
        <>
          <ellipse cx="432" cy="278" rx="145" ry="200" fill="url(#flameHalo)" />
          <g className="flame-shape" style={{ transformOrigin: "432px 385px" }}>
            <path
              d="M432 390C335 369 387 274 411 245C428 213 414 156 449 122C425 220 490 232 482 301C486 359 470 386 432 390Z"
              fill="url(#fire)"
            />
            <path
              d="M432 382C402 355 424 310 438 284C439 329 465 349 446 380Z"
              fill="#c1e6ff"
              opacity=".75"
            />
            {p.contamination > 0 && (
              <path
                d="M432 390C354 350 402 253 443 141C422 253 506 303 456 382Z"
                fill="#ffd12e"
                opacity={p.contamination * 0.85}
              />
            )}
          </g>
          <rect
            x="413"
            y="378"
            width="38"
            height="83"
            rx="4"
            fill="url(#metal)"
          />
          <ellipse cx="432" cy="378" rx="22" ry="6" fill="#273c44" />
          <path d="M410 447H455L480 481H384Z" fill="url(#metal)" />
          <rect x="382" y="480" width="100" height="10" rx="5" fill="#41525c" />
          <path d="M440 294L630 238" stroke="#ccd7dd" strokeWidth="4" />
          <ellipse
            cx="440"
            cy="294"
            rx="12"
            ry="7"
            fill="none"
            stroke="#ddd8c9"
            strokeWidth="3"
          />
          <path
            d="M626 240L727 210"
            stroke="#745640"
            strokeWidth="14"
            strokeLinecap="round"
          />
          <Glass
            x={140}
            y={380}
            w={90}
            h={108}
            level={0.5}
            color={p.sample === "copper" ? "#6fbfd8" : "#d7edf1"}
          />
          {caption(140, 358, sample.name)}
          {caption(
            527,
            148,
            p.contamination > 0.3 ? "钠黄光干扰" : sample.label,
          )}
          {caption(515, 444, "本生灯 · 示意")}
          {caption(594, 283, "取样环")}
        </>
      )}
      {id === "displacement" && (
        <>
          <Glass
            x={263}
            y={197}
            w={280}
            h={285}
            level={0.68}
            color={
              p.metal === "iron"
                ? `rgb(${55 + displacement.fraction * 70},${155 + displacement.fraction * 20},${220 - displacement.fraction * 100})`
                : `rgba(40,160,225,${1 - displacement.fraction * 0.9})`
            }
          >
            <g>
              <path
                d="M108 -45V112H139"
                fill="none"
                stroke="#53646b"
                strokeWidth="5"
              />
              {appearance.metalFraction > 1e-8 && (
                <rect
                  x={130 - 17.5 * appearance.metalFraction}
                  y="114"
                  width={35 * appearance.metalFraction}
                  height="118"
                  rx="3"
                  fill={p.metal === "copper" ? "#bf7751" : "url(#metal)"}
                />
              )}
              {Array.from({ length: 72 }, (_, i) => (
                <circle
                  key={i}
                  cx={
                    (115 + ((i * 13) % 32)) * (1 - appearance.settling) +
                    (60 + ((i * 31) % 160)) * appearance.settling
                  }
                  cy={
                    (120 + ((i * 17) % 106)) * (1 - appearance.settling) +
                    (269 - (i % 3) * 3) * appearance.settling
                  }
                  r={Math.cbrt(displacement.fraction) * 3.5}
                  fill="#c66f3e"
                  opacity={displacement.fraction > 0 ? 0.85 : 0}
                />
              ))}
            </g>
          </Glass>
          {caption(
            273,
            150,
            `${metals[p.metal]}片初始质量 · ${fixed(p.mass, 5)} g`,
          )}
          {caption(580, 291, "铜离子剩余")}
          {caption(580, 321, `${fixed(displacement.remaining * 1000)} mmol`)}
          {caption(580, 381, "析出铜")}
          {caption(580, 411, `${fixed(displacement.copper, 3)} g`)}
          {displacement.extent > 0 && (
            <path
              d={`M410 ${375 + 91 * appearance.settling}L568 387`}
              stroke="var(--ui-muted)"
              strokeDasharray="4 4"
              fill="none"
            />
          )}
          {caption(
            272,
            523,
            p.metal === "copper"
              ? "无净置换反应"
              : displacement.extent > 0
                ? "红色固体：析出的金属铜"
                : "开始演示，观察铜的析出",
          )}
        </>
      )}
      {id === "electrolysis" && (
        <>
          <Glass x={240} y={258} w={425} h={210} level={0.65} color="#78bed2" />
          {[
            {
              x: 320,
              h: gas.hydrogen,
              name: "H₂",
              color: "#70c9de",
              sign: "−",
              pole: "阴极",
            },
            {
              x: 530,
              h: gas.oxygen,
              name: "O₂",
              color: "#cfb378",
              sign: "+",
              pole: "阳极",
            },
          ].map((v, i) => (
            <g key={v.name}>
              <path
                d={`M${v.x - 35} 396V127Q${v.x - 35} 110 ${v.x - 18} 110H${v.x + 18}Q${v.x + 35} 110 ${v.x + 35} 127V396`}
                fill="url(#glass)"
                stroke="#829fa9"
                strokeWidth="3"
              />
              <rect
                x={v.x - 32}
                y={125 + Math.min(230, (v.h / 160) * 230)}
                width="64"
                height={Math.max(0, 268 - Math.min(230, (v.h / 160) * 230))}
                fill="#81cbd4"
                opacity=".45"
              />
              <rect
                x={v.x - 8}
                y="356"
                width="16"
                height="73"
                rx="3"
                fill="url(#metal)"
              />
              <path
                d={
                  i
                    ? "M530 430H610V238H690V495H173V235"
                    : "M320 430H275V238H216V145H70V245H112V235"
                }
                fill="none"
                stroke={i ? "#c66e61" : "#5d91b6"}
                strokeWidth="5"
              />
              {running && (
                <Bubbles x={v.x - 18} y={352} width={38} count={i ? 6 : 12} />
              )}
              {caption(v.x - 40, 78, `${v.pole} ${v.sign} ${v.name}`)}
              {caption(v.x - 42, 153, `${fixed(v.h, 1)} mL`)}
            </g>
          ))}
          <rect x="90" y="166" width="105" height="60" rx="8" fill="#283b47" />
          <text x="104" y="195" fill="#beeadc" fontSize="16">
            恒流电源
          </text>
          <text x="104" y="215" fill="#beeadc" fontSize="14">
            {p.current} A
          </text>
          {[112, 173].map((x, i) => (
            <g key={x}>
              <path
                d={`M${x} 225v10`}
                stroke={i ? "#c66e61" : "#5d91b6"}
                strokeWidth="6"
              />
              <circle cx={x} cy="235" r="6" fill={i ? "#c66e61" : "#5d91b6"} />
              <text
                x={x}
                y="263"
                textAnchor="middle"
                fill="var(--ui-ink)"
                fontSize="18"
              >
                {i ? "+" : "−"}
              </text>
            </g>
          ))}
          {caption(314, 550, "相同温度、压强：V(H₂) ∶ V(O₂) = 2 ∶ 1")}
        </>
      )}
      {id === "distillation" && (
        <>
          <path d="M150 479H322" stroke="#6b7f83" strokeWidth="12" />
          <rect x="166" y="439" width="140" height="35" rx="5" fill="#394e59" />
          <text x="190" y="463" fill="#ffd88c" fontSize="17">
            {p.power} W
          </text>
          <path
            d="M219 207V304C131 333 163 431 238 436C318 431 344 337 260 304V207Z"
            fill="url(#glass)"
            stroke="#90a8b2"
            strokeWidth="3"
          />
          <path
            d={`M176 ${376 + (200 - distill.remaining) * 0.4}Q238 ${388 + (200 - distill.remaining) * 0.4} 300 ${376 + (200 - distill.remaining) * 0.4}Q290 436 239 434Q185 432 176 ${376 + (200 - distill.remaining) * 0.4}`}
            fill="#78bfd4"
            opacity=".6"
          />
          <path
            d="M220 241L325 242L685 376L708 410"
            fill="none"
            stroke="#8fabb7"
            strokeWidth="12"
          />
          <path
            d="M220 241L325 242L685 376L708 410"
            fill="none"
            stroke="#d1edf2"
            strokeWidth="7"
          />
          <path
            d="M340 224L654 341L642 379L328 262Z"
            fill={p.cooling ? "#83c9e13d" : "url(#glass)"}
            stroke="#7ba3b6"
            strokeWidth="3"
          />
          <path
            d="M630 373L616 421H559M356 231L372 185H421"
            fill="none"
            stroke={p.cooling ? "#469dc2" : "#9cabb1"}
            strokeWidth="8"
          />
          {p.cooling && (
            <g aria-label="冷却水由低端向高端流动，箭头为方向示意">
              {Array.from({ length: 6 }, (_, i) => {
                const f = (time * 0.015 + i / 6) % 1;
                return (
                  <path
                    key={i}
                    d="M7 0L-5 -4V4Z"
                    transform={`translate(${640 - 295 * f} ${344 - 110 * f}) rotate(-159.55)`}
                    fill="#268cba"
                  />
                );
              })}
            </g>
          )}
          {caption(467, 441, "冷却水：低端进")}
          {caption(380, 170, "高端出")}
          <path d="M234 170V263" stroke="#8299a2" strokeWidth="9" />
          <path d="M234 181V244" stroke="#bc6652" strokeWidth="3" />
          <circle cx="234" cy="246" r="6" fill="#bb624c" />
          <Glass
            x={661}
            y={412}
            w={112}
            h={76}
            level={Math.min(0.8, distill.collected / 75)}
            color="#a1d5e5"
          />
          {distill.boiling && (
            <>
              <Bubbles x={203} y={410} width={66} count={10} active={running} />
              <path
                className="chem-vapor"
                d="M245 300V245H325L685 376"
                fill="none"
                stroke="#ecf9ff"
                strokeWidth="4"
                strokeDasharray="7 21"
              />
              {p.cooling && (
                <circle
                  className="chem-drop"
                  cx="709"
                  cy="402"
                  r="4"
                  fill="#60b5d8"
                />
              )}
            </>
          )}
          {caption(121, 140, `液温 ${fixed(distill.temperature, 1)} °C`)}
          {caption(
            126,
            526,
            `瓶内水 ${fixed(distill.remaining, 1)} g · 盐 2 g`,
          )}
          {caption(628, 526, `馏出水 ${fixed(distill.collected, 1)} g`)}
          {!p.cooling && caption(508, 295, "冷却水已关闭 · 蒸汽未收集")}
        </>
      )}
    </svg>
  );
}
export default function ChemistryLab({ lesson: catalogLesson, open, goHome }) {
  const lesson = catalogLesson.chapters
    ? catalogLesson
    : chemistryTopics.find((topic) => topic.id === catalogLesson.id);
  const [initial] = useState(() => loadChemistrySession(lesson));
  const [view, setView] = useState(initial.view);
  const [photonReset, setPhotonReset] = useState(0);
  const [chapter, setChapter] = useState(initial.chapter),
    [p, setP] = useState(initial.p),
    [time, setTime] = useState(initial.time),
    [running, setRunning] = useState(false),
    [labels, setLabels] = useState(initial.labels),
    [storageAvailable, setStorageAvailable] = useState(initial.available);
  const duration = chemistryDuration(lesson.id),
    snapshot = useRef(),
    saveTimer = useRef(null);
  snapshot.current = { chapter, p, time, view, labels };
  useEffect(() => {
    if (saveTimer.current === null)
      saveTimer.current = setTimeout(() => {
        saveTimer.current = null;
        setStorageAvailable(saveChemistrySession(lesson, snapshot.current));
      }, 500);
  }, [chapter, p, time, view, labels, lesson]);
  useEffect(() => {
    const flush = () => {
      clearTimeout(saveTimer.current);
      saveTimer.current = null;
      return saveChemistrySession(lesson, snapshot.current);
    };
    const hide = () => {
      if (document.hidden) setStorageAvailable(flush());
    };
    window.addEventListener("pagehide", flush);
    document.addEventListener("visibilitychange", hide);
    return () => {
      flush();
      window.removeEventListener("pagehide", flush);
      document.removeEventListener("visibilitychange", hide);
    };
  }, [lesson]);
  useEffect(() => {
    if (!running) return;
    let frame, last;
    const tick = (now) => {
      if (document.hidden) last = undefined;
      else {
        if (last !== undefined) {
          const dt =
            Math.min((now - last) / 1000, 0.08) *
            (lesson.id === "electrolysis"
              ? 20
              : lesson.id === "distillation"
                ? 10
                : 2);
          setTime((t) => Math.min(duration, t + dt));
        }
        last = now;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [running, duration, lesson.id]);
  useEffect(() => {
    if (time >= duration) setRunning(false);
  }, [time, duration]);
  function select(i) {
    setPhotonReset((v) => v + 1);
    setChapter(i);
    setP({ ...lesson.chapters[i].preset });
    setTime(lesson.chapters[i].time ?? 0);
    setRunning(false);
  }
  function change(k, v) {
    setPhotonReset((n) => n + 1);
    setP((old) => ({ ...old, [k]: v }));
    setTime(0);
    setRunning(false);
  }
  const guide = lesson.chapters[chapter],
    gas = electrolysisState(p.current, time),
    metal = displacementState(p.metal, p.mass, time / 60),
    water = distillationState(p.power, time, p.cooling);
  const readings =
    lesson.id === "flame"
      ? [
          ["当前样品", flameSamples[p.sample].name],
          ["特征颜色", flameSamples[p.sample].label],
          ["工具状态", p.contamination ? "有钠污染" : "已清洁"],
        ]
      : lesson.id === "displacement"
        ? [
            ["析出铜", `${fixed(metal.copper, 3)} g`],
            ["剩余 Cu²⁺", `${fixed(metal.remaining * 1000)} mmol`],
            ["现象", p.metal === "copper" ? "无净反应" : "铜沉积 / 蓝色减弱"],
          ]
        : lesson.id === "electrolysis"
          ? [
              ["阴极 H₂", `${fixed(gas.hydrogen)} mL`],
              ["阳极 O₂", `${fixed(gas.oxygen)} mL`],
              ["通过电荷", `${fixed(gas.charge, 0)} C`],
            ]
          : [
              ["液体温度", `${fixed(water.temperature, 1)} °C`],
              ["馏出水", `${fixed(water.collected, 1)} g`],
              ["未收集水蒸气", `${fixed(water.lost, 1)} g`],
            ];
  function range(key, label, min, max, step, unit) {
    const displayValue =
      key === "mass"
        ? Number(p[key]).toFixed(5)
        : Number(Number(p[key]).toFixed(3));
    return (
      <label className="chem-range">
        {label}
        <strong>
          {displayValue} {unit}
        </strong>
        <input
          type="range"
          aria-label={label}
          aria-valuetext={`${displayValue} ${unit || ""}`}
          min={min}
          max={max}
          step={step}
          value={p[key]}
          onChange={(e) => change(key, +e.target.value)}
        />
      </label>
    );
  }
  const isPhoton = lesson.id === "flame" && chapter === 6;
  return (
    <main className="chemistry-lab">
      <aside className="chem-nav">
        <button onClick={goHome}>← 返回探索馆</button>
        <div className="chem-brand">
          化学 · 现象与证据<small>CHEMISTRY COLLECTION</small>
        </div>
        <TopicPicker lesson={lesson} onSelect={open} />
        <TopicChapters
          chapters={lesson.chapters}
          chapter={chapter}
          onSelect={select}
        />
        <p>先预测现象，再操作验证。</p>
      </aside>
      <section className="chem-main">
        <header>
          <span>
            {lesson.tag} / {gradeFor(lesson.id)}
          </span>
          <h1>{isPhoton ? guide.title : lesson.title}</h1>
          <p>
            {isPhoton
              ? "从焰色现象走向能量解释：逐步观察，改变波长，比较单个光子的能量。"
              : lesson.description}
          </p>
        </header>
        {isPhoton ? (
          <React.Fragment key={`photon-${chapter}-${photonReset}`}>
            <PhotonEmission />
            <SodiumSpectrum />
          </React.Fragment>
        ) : (
          <>
            <div className="chem-apparatus">
              <div className="chem-stage-head">
                <div
                  className="chem-view-choice"
                  role="group"
                  aria-label="器材视图"
                >
                  <button
                    aria-pressed={view === "3d"}
                    onClick={() => setView("3d")}
                  >
                    立体器材
                  </button>
                  <button
                    aria-pressed={view === "diagram"}
                    onClick={() => setView("diagram")}
                  >
                    原理剖面
                  </button>
                </div>
                <button
                  aria-pressed={labels}
                  onClick={() => setLabels((v) => !v)}
                >
                  {labels ? "隐藏标注" : "显示标注"}
                </button>
              </div>
              {view === "3d" ? (
                <Suspense
                  fallback={
                    <div className="chem-3d chem-loading" role="status">
                      正在准备立体器材…
                    </div>
                  }
                >
                  <Chemistry3D
                    id={lesson.id}
                    p={p}
                    time={time}
                    running={running}
                    labels={labels}
                    onFallback={() => setView("diagram")}
                  />
                </Suspense>
              ) : (
                <ChemistryScene
                  id={lesson.id}
                  p={p}
                  time={time}
                  running={running}
                  labels={labels}
                />
              )}
              <div className="chem-playbar">
                <button
                  className="chem-primary"
                  onClick={() => {
                    if (time >= duration) setTime(0);
                    setRunning((v) => !v);
                  }}
                >
                  {running
                    ? "暂停演示"
                    : lesson.id === "electrolysis"
                      ? "接通电源"
                      : lesson.id === "distillation"
                        ? "开始加热"
                        : "开始演示"}
                </button>
                <button
                  onClick={() => {
                    setTime(0);
                    setRunning(false);
                    setPhotonReset((v) => v + 1);
                  }}
                >
                  复位
                </button>
                <label>
                  演示进度
                  <input
                    type="range"
                    aria-label="演示进度"
                    min="0"
                    max={duration}
                    step=".1"
                    value={time}
                    onChange={(e) => {
                      setTime(+e.target.value);
                      setRunning(false);
                    }}
                  />
                </label>
                <output>
                  {fixed(time, 1)}{" "}
                  {lesson.id === "flame" || lesson.id === "displacement"
                    ? "示意秒"
                    : "s"}
                </output>
              </div>
            </div>
            <div className="chem-readings" aria-live="off">
              {readings.map(([name, value]) => (
                <div key={name}>
                  <small>{name}</small>
                  <strong>{value}</strong>
                </div>
              ))}
            </div>
          </>
        )}
        {lesson.id === "displacement" && (chapter === 1 || chapter === 2) && (
          <DisplacementComparison
            p={p}
            time={time}
            onSeek={(t) => {
              setTime(t);
              setRunning(false);
            }}
            onInspect={(metal, mass) => {
              setP((old) => ({ ...old, metal, mass }));
              setRunning(false);
            }}
          />
        )}
        {lesson.id === "displacement" && chapter === 5 && (
          <DisplacementElectrons
            p={p}
            time={time}
            onSeek={(t) => {
              setTime(t);
              setRunning(false);
            }}
          />
        )}
        {lesson.id === "displacement" && (
          <DisplacementBalance
            p={p}
            time={time}
            onPrepare={(mass) => change("mass", mass)}
            onEnd={() => {
              setTime(60);
              setRunning(false);
            }}
          />
        )}
        {lesson.id === "distillation" && chapter !== 5 && (
          <DistillationStudy
            p={p}
            time={time}
            onSeek={(t) => {
              setTime(t);
              setRunning(false);
            }}
          />
        )}
        {lesson.id === "distillation" && chapter === 5 && (
          <DistillationSalt
            onSeek={(t) => {
              setRunning(false);
              setTime(t);
            }}
            p={p}
            time={time}
            onApply={(cooling) => {
              setRunning(false);
              setP((old) => ({ ...old, cooling }));
            }}
          />
        )}
        {lesson.id === "electrolysis" && chapter === 5 && (
          <ElectrolysisReading
            key={`reading-${chapter}`}
            p={p}
            time={time}
            onSeek={(t) => {
              setRunning(false);
              setTime(t);
            }}
          />
        )}
        {lesson.id === "electrolysis" && (
          <ElectrolysisCompare
            key={`compare-${chapter}`}
            p={p}
            time={time}
            onApply={(current, t) => {
              setP((old) => ({ ...old, current }));
              setTime(t);
              setRunning(false);
            }}
          />
        )}
        {lesson.id === "flame" && chapter !== 6 && (
          <FlameComparison
            key={chapter}
            p={p}
            onClean={() => change("contamination", 0)}
          />
        )}
        {!isPhoton && (
          <p className="chem-time-note">
            {lesson.id === "electrolysis"
              ? "播放为 20 倍时间；公式按读数时间计算。"
              : lesson.id === "distillation"
                ? "播放为 10 倍时间；公式按读数时间计算。"
                : "动画为过程示意；不用于测定真实反应速率。"}{" "}
            {lesson.id === "distillation" && chapter === 5
              ? "右侧改变实验条件会重新开始；下方同一时刻对照保留进度并暂停。"
              : "改变实验条件会重新开始，避免混用不同条件的数据。"}
          </p>
        )}
      </section>
      <aside className="chem-notes">
        <span className="chem-kicker">
          {String(chapter + 1).padStart(2, "0")} /{" "}
          {isPhoton ? "机制探究" : "实验条件"}
        </span>
        <h2>{guide.title}</h2>
        <p>{guide.text}</p>
        <div className="chem-task">
          <strong>动手试一试</strong>
          <p>{guide.task}</p>
          <p className="chem-chapter-start">
            {isPhoton ? (
              "本节从低能级开始。按四个步骤观察，或播放分步演示；重做会恢复默认波长并暂停。"
            ) : (
              <>
                本节观察点：{guide.time ?? 0}{" "}
                s。切换章节会载入该状态并暂停；可用“复位”回到起点重放。
              </>
            )}
          </p>
          <button className="btn" onClick={() => select(chapter)}>
            {isPhoton ? "重做本节 · 从低能级开始" : "重做本节 · 载入观察点"}
          </button>
        </div>
        {lesson.id === "flame" && chapter !== 6 && (
          <>
            <fieldset>
              <legend>选择样品</legend>
              <div className="chem-choices">
                {Object.entries(flameSamples).map(([k, v]) => (
                  <button
                    key={k}
                    aria-pressed={p.sample === k}
                    onClick={() => change("sample", k)}
                  >
                    <i style={{ background: v.color }} />
                    {v.name}
                  </button>
                ))}
              </div>
            </fieldset>
            {range("contamination", "钠污染示意", 0, 1, 0.05, "")}
            <button onClick={() => change("contamination", 0)}>
              清洁工具 · 消除污染
            </button>
          </>
        )}
        {lesson.id === "displacement" && (
          <>
            <fieldset>
              <legend>金属种类</legend>
              <div className="chem-choices">
                {Object.entries(metals).map(([k, v]) => (
                  <button
                    key={k}
                    aria-pressed={p.metal === k}
                    onClick={() => change("metal", k)}
                  >
                    {v}片
                  </button>
                ))}
              </div>
            </fieldset>
            {range("mass", "金属质量", 0.1, 1, 0.01, "g")}
            <fieldset>
              <legend>停下来观察</legend>
              <div
                className="chem-choices"
                role="group"
                aria-label="置换反应观察阶段"
              >
                {[0, 30, 60].map((t, i) => (
                  <button
                    key={t}
                    onClick={() => {
                      setTime(t);
                      setRunning(false);
                    }}
                  >
                    {["反应前", "观察中间过程", "完全反应"][i]}
                  </button>
                ))}
              </div>
              <p>
                三维视图中可点“观察金属表面”。定位只改变进度并暂停，保留金属、质量与当前视角。
              </p>
            </fieldset>
          </>
        )}
        {lesson.id === "electrolysis" &&
          range("current", "电流", 0.2, 2, 0.1, "A")}
        {lesson.id === "distillation" && (
          <>
            {range("power", "有效加热功率", 200, 800, 50, "W")}
            <button
              aria-pressed={p.cooling}
              onClick={() => change("cooling", !p.cooling)}
            >
              冷却水：{p.cooling ? "开启" : "关闭"}
            </button>
          </>
        )}
        <div className="chem-formula">{lesson.formula}</div>
        <p className="chem-save-note" role="status">
          {storageAvailable
            ? isPhoton
              ? "章节选择保存在此浏览器。能级练习为临时状态，切课或刷新后恢复默认波长并从低能级开始，尚未同步云端。"
              : "章节、条件、进度和视图保存在此浏览器；重新打开后保持暂停，尚未同步云端。"
            : "当前浏览器无法保存实验状态；本次仍可操作，离开后可能无法恢复。"}
        </p>
        <div className="chem-next">
          <button disabled={!chapter} onClick={() => select(chapter - 1)}>
            ← 上一节
          </button>
          <button
            disabled={chapter === lesson.chapters.length - 1}
            onClick={() => select(chapter + 1)}
          >
            下一节 →
          </button>
        </div>
        <details>
          <summary>模型边界与科学依据</summary>
          <p>{lesson.boundary}</p>
          <a href={lesson.source} target="_blank" rel="noreferrer">
            阅读教学依据 ↗
          </a>
        </details>
      </aside>
    </main>
  );
}
