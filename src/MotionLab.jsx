import { natureTopics } from "./natureTopics.mjs";
import { natureReadouts } from "./natureModels.mjs";
import { geometricReadouts } from "./geometricLessons.mjs";
import SimilarAreaTiles from "./SimilarAreaTiles.jsx";
import PolarizationStudy from "./PolarizationStudy.jsx";
import { comparisonReadouts } from "./comparisonLessons.mjs";
import RadianComparison from "./RadianComparison.jsx";
import BeatObservation from "./BeatObservation.jsx";
import { signalReadouts } from "./signalLessons.mjs";
import RippleSectionStudy from "./RippleSectionStudy.jsx";
import { intuitiveReadouts } from "./intuitiveLessons.mjs";
import ThermalComparison from "./ThermalComparison.jsx";
import { vividReadouts } from "./vividLessons.mjs";
import CylinderAreaStudy from "./CylinderAreaStudy.jsx";
import BuoyancyWeighing from "./BuoyancyWeighing.jsx";
import GearEvidence from "./GearEvidence.jsx";
import { mechanismReadouts } from "./mechanismLessons.mjs";
import ColorMixStudy from "./ColorMixStudy.jsx";
import { expansionReadouts } from "./expansionLessons.mjs";
import { sectionReadouts } from "./sectionLessons.mjs";
import { observableReadouts, circularState } from "./observableModels.mjs";
import DiameterStudy from "./DiameterStudy.jsx";
import DopplerTracker from "./DopplerTracker.jsx";
import CircleRadiusStudy from "./CircleRadiusStudy.jsx";
import NetworkEvidence from "./NetworkEvidence.jsx";
import { networkReadouts } from "./networkLesson.mjs";
import CircleAreaEvidence from "./CircleAreaEvidence.jsx";
import PrismInterfaces from "./PrismInterfaces.jsx";
import { revealReadouts } from "./revealModels.mjs";
import RevealControls from "./RevealControls.jsx";
import { opticalGeometryReadouts } from "./opticalGeometryModels.mjs";
import PinholeStudy from "./PinholeStudy.jsx";
import CircleArcStudy from "./CircleArcStudy.jsx";
import { visualProofReadouts } from "./visualProofModels.mjs";
import TriangleProof from "./TriangleProof.jsx";
import CommunicatingEvidence from "./CommunicatingEvidence.jsx";
import { insightReadouts } from "./insightModels.mjs";
import HydraulicComparison from "./HydraulicComparison.jsx";
import { discoveryReadouts } from "./discoveryModels.mjs";
import { transformedPoint, pulleyState } from "./constructionModels.mjs";
import LissajousCycle from "./LissajousCycle.jsx";
import DopplerArrivals from "./DopplerArrivals.jsx";
import RollingVelocity from "./RollingVelocity.jsx";
import StandingProbe from "./StandingProbe.jsx";
import PolarRadiusStudy from "./PolarRadiusStudy.jsx";
import ProjectileComparison from "./ProjectileComparison.jsx";
import { polarPoint, projectileState } from "./visualModels.mjs";
import { lissajousPoint, standingState } from "./oscillationModels.mjs";
import React, { useState, useEffect } from "react";
import { TopicPicker, TopicChapters } from "./TopicLearning.jsx";
import Button from "./LabButton.jsx";
import MotionScene from "./MotionScene.jsx";
import {
  dopplerState,
  rollingPoint,
  MOTION_DURATION,
} from "./motionModels.mjs";
import "./MotionLab.css";
import { motionTopics } from "./motionLessons.mjs";
export default function MotionLab({ lesson: metadata, open, goHome }) {
  const isNature = natureTopics.some((x) => x.id === metadata.id);
  const lesson = motionTopics.find((item) => item.id === metadata.id);
  const [shadowStep, setShadowStep] = useState(0);
  const [chapter, setChapter] = useState(0),
    [p, setP] = useState(lesson.chapters[0].preset),
    [time, setTime] = useState(lesson.chapters[0].time),
    [running, setRunning] = useState(false),
    [guides, setGuides] = useState(true),
    [showField, setShowField] = useState(true),
    [trace, setTrace] = useState(true),
    [selectedPoint, setSelectedPoint] = useState(-1);
  const item = lesson.chapters[chapter],
    isWheel = lesson.id === "cycloid",
    isFigure = lesson.id === "lissajous",
    isStanding = lesson.id === "standing";
  const orbitPeriod =
    lesson.id === "circular-motion" ? circularState(p).period : null;
  const duration = orbitPeriod
    ? Math.max(MOTION_DURATION, Math.ceil(orbitPeriod * 100) / 100)
    : MOTION_DURATION;
  useEffect(() => {
    if (!running) return;
    let frame, previous;
    const tick = (now) => {
      if (!document.hidden) {
        if (previous !== undefined) {
          const dt = Math.min(0.05, (now - previous) / 1000);
          setTime((t) => Math.min(duration, t + dt));
        }
        previous = now;
      } else previous = undefined;
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [running, duration]);
  useEffect(() => {
    if (time >= duration) setRunning(false);
  }, [time, duration]);
  const seek = (t) => {
    setRunning(false);
    setTime(t);
  };
  const select = (i) => {
    setShadowStep(0);
    setSelectedPoint(-1);
    setRunning(false);
    setChapter(i);
    setP({ ...lesson.chapters[i].preset });
    setTime(lesson.chapters[i].time);
  };
  const q =
    lesson.id === "symmetry"
      ? transformedPoint([1, 1], p, time)
      : lesson.id === "pulley"
        ? pulleyState(p, time)
        : lesson.id === "polar"
          ? polarPoint(p, (time * Math.PI) / 3)
          : lesson.id === "ballistics"
            ? projectileState(p, time / 6)
            : isFigure
              ? lissajousPoint(p, time)
              : isStanding
                ? standingState(p, time)
                : isWheel
                  ? rollingPoint(p.radius, p.ratio, (time * Math.PI) / 3)
                  : dopplerState(p.mach, p.frequency, time);
  const values = natureTopics.some((x) => x.id === lesson.id)
    ? natureReadouts(lesson.id, p, time)
    : ["vector-sum", "fence-area"].includes(lesson.id)
      ? geometricReadouts(lesson.id, p, time)
      : ["similar-area", "polarization"].includes(lesson.id)
        ? comparisonReadouts(lesson.id, p, time)
        : ["radian-arc", "beat-frequency"].includes(lesson.id)
          ? signalReadouts(lesson.id, p, time)
          : ["square-difference", "ripple-interference"].includes(lesson.id)
            ? intuitiveReadouts(lesson.id, p, time)
            : [
                  "square-difference",
                  "ripple-interference",
                  "polygon-turn",
                  "thermal-length",
                ].includes(lesson.id)
              ? vividReadouts(lesson.id, p, time)
              : ["gear-drive", "buoyancy-lift"].includes(lesson.id)
                ? mechanismReadouts(lesson.id, p, time)
                : ["cylinder-net", "additive-light"].includes(lesson.id)
                  ? expansionReadouts(lesson.id, p)
                  : ["solid-volume", "water-pressure"].includes(lesson.id)
                    ? sectionReadouts(lesson.id, p, time, chapter)
                    : ["shadow-height", "circular-motion"].includes(lesson.id)
                      ? observableReadouts(lesson.id, p, time)
                      : lesson.id === "resistor-network"
                        ? networkReadouts(p)
                        : ["prism", "circle-area"].includes(lesson.id)
                          ? revealReadouts(lesson.id, p)
                          : ["pinhole", "inscribed-angle"].includes(lesson.id)
                            ? opticalGeometryReadouts(lesson.id, p, time)
                            : ["pythagoras-proof", "plane-mirror"].includes(
                                  lesson.id,
                                )
                              ? visualProofReadouts(lesson.id, p)
                              : ["triangle-angles", "communicating"].includes(
                                    lesson.id,
                                  )
                                ? insightReadouts(lesson.id, p, time)
                                : ["area-cut", "hydraulic"].includes(lesson.id)
                                  ? discoveryReadouts(lesson.id, p, time)
                                  : lesson.id === "symmetry"
                                    ? [
                                        ["A′ 横坐标", q[0].toFixed(3)],
                                        ["A′ 纵坐标", q[1].toFixed(3)],
                                        [
                                          "变换进度",
                                          `${((time / 6) * 100).toFixed(0)}%`,
                                        ],
                                      ]
                                    : lesson.id === "pulley"
                                      ? [
                                          ["拉力", `${q.force.toFixed(1)} N`],
                                          [
                                            "拉绳距离",
                                            `${q.distance.toFixed(2)} m`,
                                          ],
                                          ["输入功", `${q.work.toFixed(2)} J`],
                                        ]
                                      : lesson.id === "polar"
                                        ? [
                                            ["极径 r", q.r.toFixed(3)],
                                            ["横坐标 x", q.x.toFixed(3)],
                                            ["纵坐标 y", q.y.toFixed(3)],
                                          ]
                                        : lesson.id === "ballistics"
                                          ? [
                                              [
                                                "实际飞行时间",
                                                `${q.t.toFixed(2)} / ${q.duration.toFixed(2)} s`,
                                              ],
                                              [
                                                "射程",
                                                `${q.range.toFixed(2)} m`,
                                              ],
                                              [
                                                "最高高度",
                                                `${q.apex.toFixed(2)} m`,
                                              ],
                                            ]
                                          : isFigure
                                            ? [
                                                ["水平坐标 x", q.x.toFixed(3)],
                                                ["竖直坐标 y", q.y.toFixed(3)],
                                                [
                                                  "振动次数比",
                                                  `${p.fx} : ${p.fy}`,
                                                ],
                                              ]
                                            : isStanding
                                              ? [
                                                  [
                                                    "模型频率",
                                                    `${q.frequency.toFixed(1)} Hz`,
                                                  ],
                                                  [
                                                    "波长",
                                                    `${q.wavelength.toFixed(3)} m`,
                                                  ],
                                                  ["波节数（含两端）", q.nodes],
                                                ]
                                              : isWheel
                                                ? [
                                                    [
                                                      "描迹点 x",
                                                      `${q.x.toFixed(2)} m`,
                                                    ],
                                                    [
                                                      "描迹点 y",
                                                      `${q.y.toFixed(2)} m`,
                                                    ],
                                                    [
                                                      "一周前进",
                                                      `${(2 * Math.PI * p.radius).toFixed(2)} m`,
                                                    ],
                                                  ]
                                                : [
                                                    [
                                                      "左侧波长",
                                                      `${q.leftWavelength.toFixed(2)} m`,
                                                    ],
                                                    [
                                                      "右侧波长",
                                                      `${q.rightWavelength.toFixed(2)} m`,
                                                    ],
                                                    [
                                                      "声源速度",
                                                      `${(2 * p.mach).toFixed(2)} m/s`,
                                                    ],
                                                  ];
  return (
    <main className="motion-lab">
      <aside className="motion-nav">
        <Button onClick={goHome}>← 返回探索馆</Button>
        <TopicPicker lesson={lesson} onSelect={open} />
        <h2>{lesson.title}</h2>
        <TopicChapters
          chapters={lesson.chapters}
          chapter={chapter}
          onSelect={select}
        />
      </aside>
      <section className="motion-main">
        <header>
          <span className="eyebrow">
            {natureTopics.some((x) => x.id === lesson.id)
              ? "NATURE · 观察与探究"
              : lesson.id === "ripple-interference"
                ? "WAVES & SUPERPOSITION"
                : lesson.id === "thermal-length"
                  ? "HEAT & EXPANSION"
                  : lesson.id === "gear-drive"
                    ? "GEARS & TRANSMISSION"
                    : lesson.id === "buoyancy-lift"
                      ? "BUOYANCY & EQUILIBRIUM"
                      : lesson.id === "additive-light"
                        ? "LIGHT & COLOR"
                        : lesson.id === "circular-motion"
                          ? "CIRCULAR MOTION"
                          : lesson.id === "resistor-network"
                            ? "CIRCUITS & CONSERVATION"
                            : lesson.subject === "math"
                              ? "GEOMETRY IN MOTION"
                              : ["plane-mirror", "pinhole", "prism"].includes(
                                    lesson.id,
                                  )
                                ? lesson.id === "pinhole"
                                  ? "LIGHT & PROJECTION"
                                  : lesson.id === "prism"
                                    ? "LIGHT & REFRACTION"
                                    : "LIGHT & REFLECTION"
                                : ["communicating", "water-pressure"].includes(
                                      lesson.id,
                                    )
                                  ? "FLUIDS & EQUILIBRIUM"
                                  : lesson.id === "ballistics"
                                    ? "MOTION & TRAJECTORIES"
                                    : ["pulley", "hydraulic"].includes(
                                          lesson.id,
                                        )
                                      ? "WORK & SIMPLE MACHINES"
                                      : "WAVES IN MOTION"}{" "}
            · {String(chapter + 1).padStart(2, "0")} /{" "}
            {String(lesson.chapters.length).padStart(2, "0")}
          </span>
          <h1>{item.title}</h1>
          <p>{lesson.description}</p>
        </header>
        {lesson.id === "shadow-height" && chapter === 1 && (
          <div className="motion-shortcuts" aria-label="相似测高推导步骤">
            {[
              "1 · 找相等的角",
              "2 · 配对对应边",
              "3 · 缩放验证",
              "4 · 代入测高",
            ].map((label, index) => (
              <Button
                key={label}
                aria-pressed={shadowStep === index}
                onClick={() => {
                  setShadowStep(index);
                  seek(0);
                }}
              >
                {label}
              </Button>
            ))}
          </div>
        )}
        <div
          className="motion-stage"
          tabIndex="0"
          role="region"
          aria-label="互动图形，可横向滚动"
        >
          <MotionScene
            onSeek={seek}
            id={lesson.id}
            p={p}
            time={time}
            guides={guides}
            showField={showField}
            trace={trace}
            chapter={chapter}
            shadowStep={shadowStep}
            selectedPoint={
              lesson.id === "doppler" && chapter === 5
                ? Math.max(0, selectedPoint)
                : selectedPoint
            }
          />
        </div>
        {lesson.id === "pinhole" && (
          <PinholeStudy
            p={p}
            selected={selectedPoint}
            onSelect={setSelectedPoint}
            chapter={chapter}
          />
        )}
        {lesson.id === "inscribed-angle" && chapter === 3 && (
          <DiameterStudy
            p={p}
            time={time}
            onChange={(next) => {
              setP(next);
              seek(0);
            }}
          />
        )}
        {lesson.id === "inscribed-angle" && chapter === 5 && (
          <CircleArcStudy
            p={p}
            time={time}
            onSide={(side) => {
              setP({ ...p, side });
              seek(0);
            }}
          />
        )}
        {["prism", "circle-area"].includes(lesson.id) && (
          <RevealControls
            id={lesson.id}
            p={p}
            onChange={(next, t) => {
              setP(next);
              seek(t);
            }}
          />
        )}
        {lesson.id === "prism" && (
          <PrismInterfaces
            key={`interfaces-${chapter}`}
            p={p}
            onSeek={seek}
            chapter={chapter}
          />
        )}
        {lesson.id === "circle-area" && chapter === 4 && (
          <CircleRadiusStudy
            p={p}
            onRadius={(radius) => {
              setP({ ...p, radius });
              seek(6);
            }}
          />
        )}
        {lesson.id === "circle-area" && (
          <CircleAreaEvidence
            key={chapter}
            p={p}
            chapter={chapter}
            onSelect={(sectors) => {
              setP({ ...p, sectors });
              seek(6);
            }}
          />
        )}
        {lesson.id === "resistor-network" && (
          <NetworkEvidence
            p={p}
            onChange={(next) => {
              setP(next);
              seek(0);
            }}
          />
        )}
        <div className="motion-readouts">
          {values.map(([label, value]) => (
            <div key={label}>
              <span>{label}</span>
              <strong>{value}</strong>
            </div>
          ))}
        </div>
        {lesson.id === "doppler" && (
          <p className="motion-note">
            接收频率显示首个波面到达后的理论稳态值；本图将传播放慢以便观察，不代表空气中的实际声速。
          </p>
        )}
        {isStanding && (
          <p className="motion-note">
            动画放慢 60 倍，纵向位移放大。观察点：{Number(p.probe.toFixed(2))}%
            L；位移 {q.y.toFixed(2)} mm；波速 {q.speed.toFixed(1)} m/s。
          </p>
        )}
        <div className="motion-transport">
          <Button
            primary
            onClick={() => {
              if (
                lesson.id === "shadow-height" &&
                chapter === 1 &&
                shadowStep !== 2
              ) {
                setShadowStep(2);
                setTime(0);
                setRunning(true);
                return;
              }
              if (time >= duration) setTime(0);
              setRunning((v) => !v);
            }}
          >
            {running ? "暂停演示" : "播放演示"}
          </Button>
          <Button onClick={() => seek(0)}>回到起点</Button>
          <Button
            disabled={time >= duration}
            onClick={() => seek(Math.min(duration, time + 0.25))}
          >
            前进一步
          </Button>
          <label>
            演示进度 <output>{time.toFixed(2)} s</output>
            <input
              aria-label="演示进度"
              type="range"
              min="0"
              max={duration}
              step=".01"
              value={time}
              onChange={(e) => seek(Number(e.target.value))}
            />
          </label>
        </div>
        <div className="motion-shortcuts">
          {(lesson.id === "square-difference"
            ? [0, 2.5, 4, 6]
            : orbitPeriod
              ? [0, orbitPeriod / 4, orbitPeriod / 2, orbitPeriod]
              : lesson.id === "solid-volume" && chapter === 1
                ? [0, 2, 4, 6]
                : lesson.id === "area-cut"
                  ? [0, 1.5, 4.5, 6]
                  : [0, 1.5, 3, 6]
          ).map((t, i) => (
            <Button key={t} onClick={() => seek(t)}>
              {lesson.id === "square-difference"
                ? ["原始面积", "平移完成", "旋转完成", "拼接完成"][i]
                : orbitPeriod
                  ? [
                      "共同起点",
                      "当前组四分之一周",
                      "当前组半周",
                      "当前组完整一周",
                    ][i]
                  : lesson.id === "solid-volume" && chapter === 1
                    ? ["空圆柱", "装入一份", "装入两份", "装满三份"][i]
                    : lesson.id === "circle-area"
                      ? ["圆的原位", "开始展开", "交错拼接", "完成拼接"][i]
                      : lesson.id === "prism"
                        ? [
                            "从入射光出发",
                            "接近界面",
                            "棱镜内传播",
                            "比较出射光路",
                          ][i]
                        : lesson.id === "pythagoras-proof"
                          ? (chapter === 5
                              ? [
                                  "中央正方形",
                                  "搬运第二块",
                                  "搬运第三块",
                                  "两块空白正方形",
                                ]
                              : chapter === 4
                                ? [
                                    "辨认外框",
                                    "第一个三角形",
                                    "前两个三角形",
                                    "对照剩余面积",
                                  ]
                                : [
                                    "辨认三边",
                                    "填入第一色",
                                    "第一色完成",
                                    "面积对照完成",
                                  ])[i]
                          : lesson.id === "hydraulic"
                            ? [
                                "起始位置",
                                "下压四分之一",
                                "下压一半",
                                "完成行程",
                              ][i]
                            : lesson.id === "plane-mirror"
                              ? [
                                  "光从物点出发",
                                  "沿光路前进",
                                  "途中观察",
                                  "到达眼睛",
                                ][i]
                              : lesson.id === "triangle-angles"
                                ? [
                                    "原位辨认",
                                    "开始搬运",
                                    "旋转汇合",
                                    "组成平角",
                                  ][i]
                                : lesson.id === "communicating"
                                  ? [
                                      "初始液面",
                                      "开始趋平",
                                      "中途对照",
                                      "最终平衡",
                                    ][i]
                                  : lesson.id === "area-cut"
                                    ? [
                                        "原图与剪切线",
                                        "移出三角形",
                                        "平移到右侧",
                                        "归位成矩形",
                                      ][i]
                                    : isWheel
                                      ? ["起点", "四分之一周", "半周", "一周"][
                                          i
                                        ]
                                      : lesson.id === "water-pressure"
                                        ? [
                                            "液面",
                                            "四分之一水深",
                                            "半水深",
                                            "底部",
                                          ][i]
                                        : `${t} 秒`}
            </Button>
          ))}
        </div>
        {lesson.id === "cylinder-net" && (
          <CylinderAreaStudy
            key={chapter}
            p={p}
            onPause={() => seek(time)}
            onChange={(next) => {
              setP(next);
              seek(6);
            }}
          />
        )}
        {lesson.id === "thermal-length" && (
          <ThermalComparison
            p={p}
            time={time}
            onChange={(next) => {
              setP(next);
              seek(6);
            }}
          />
        )}
        {lesson.id === "radian-arc" && (
          <RadianComparison
            key={chapter}
            p={p}
            chapter={chapter}
            onChange={(next) => {
              setP(next);
              seek(time);
            }}
          />
        )}
        {lesson.id === "similar-area" && (
          <SimilarAreaTiles
            key={`${p.shape}-${p.scale}`}
            p={p}
            time={time}
            onSeek={seek}
          />
        )}
        {lesson.id === "polarization" && (
          <PolarizationStudy
            p={p}
            onChange={(next) => {
              setP(next);
              seek(time);
            }}
          />
        )}
        {lesson.id === "beat-frequency" && (
          <BeatObservation
            p={p}
            time={time}
            onSeek={seek}
            duration={duration}
          />
        )}
        {lesson.id === "buoyancy-lift" && (
          <BuoyancyWeighing p={p} time={time} onSeek={seek} />
        )}
        {lesson.id === "gear-drive" && (
          <GearEvidence p={p} time={time} onSeek={seek} />
        )}
        {lesson.id === "additive-light" && (
          <ColorMixStudy
            p={p}
            onChange={(next) => {
              setP(next);
              seek(6);
            }}
          />
        )}
        <p className="motion-note">
          {lesson.id === "water-pressure"
            ? "调整条件会暂停并保留探头的相对水深；改密度时测量深度不变。切换子主题会载入对应观察条件。"
            : [
                  "vector-sum",
                  "fence-area",
                  "similar-area",
                  "polarization",
                  "radian-arc",
                  "beat-frequency",
                  "square-difference",
                  "ripple-interference",
                  "polygon-turn",
                  "thermal-length",
                  "gear-drive",
                  "buoyancy-lift",
                  "solid-volume",
                  "cylinder-net",
                  "additive-light",
                ].includes(lesson.id)
              ? "调整条件会暂停并保留当前观察进度，便于比较。回到起点可重新播放；切换子主题载入对应条件。"
              : "播放到终点自动停止；调整条件会暂停并回到起点。切换子主题会载入对应观察条件。"}
        </p>
        {lesson.id === "ripple-interference" && (
          <RippleSectionStudy
            p={p}
            onChange={(next) => {
              setP(next);
              seek(time);
            }}
          />
        )}
        {lesson.id === "triangle-angles" && chapter === 5 && (
          <TriangleProof key={chapter} p={p} />
        )}
        {lesson.id === "communicating" && (
          <CommunicatingEvidence
            p={p}
            time={time}
            onSeek={seek}
            onRatio={(ratio) => {
              setP({ ...p, ratio });
              seek(6);
            }}
          />
        )}
        {lesson.id === "hydraulic" && (
          <HydraulicComparison
            p={p}
            time={time}
            onCompare={(ratio) => {
              setP({ ...p, ratio });
              seek(6);
            }}
          />
        )}
        {lesson.id === "polar" && (
          <PolarRadiusStudy p={p} time={time} onSeek={seek} />
        )}
        {isStanding && (
          <StandingProbe
            p={p}
            time={time}
            onSeek={seek}
            onPosition={(probe) => {
              setRunning(false);
              setP({ ...p, probe });
            }}
          />
        )}
        {isWheel && <RollingVelocity p={p} time={time} onSeek={seek} />}
        {lesson.id === "doppler" && chapter === 5 && (
          <DopplerTracker
            p={p}
            time={time}
            selected={Math.max(0, selectedPoint)}
            onSeek={seek}
            onSelect={(index) => {
              setSelectedPoint(index);
              seek(index / p.frequency);
            }}
          />
        )}
        {lesson.id === "doppler" && (
          <DopplerArrivals p={p} time={time} onSeek={seek} />
        )}
        {isFigure && <LissajousCycle p={p} time={time} onSeek={seek} />}
        {lesson.id === "ballistics" && (
          <ProjectileComparison p={p} onSeek={seek} currentTime={q.t} />
        )}
      </section>
      <aside className="motion-notes">
        <h2>观察与理解</h2>
        <p>{item.text}</p>
        {isNature && item.time > 0 && (
          <p className="chapter-entry-note">
            本节从演示第 {item.time}{" "}
            秒的观察状态开始。可拖动进度条回看过程，或回到起点重新播放；演示秒数不代表真实过程用时。
          </p>
        )}
        <div className="motion-task">
          <strong>试一试</strong>
          <p>{item.task}</p>
        </div>
        <h3>
          {isNature
            ? lesson.subject === "geography"
              ? "环境条件"
              : lesson.subject === "biology"
                ? "观察条件"
                : "实验条件"
            : lesson.id === "vector-sum"
              ? "长度与方向"
              : lesson.id === "fence-area"
                ? "围栏与形状"
                : lesson.id === "similar-area"
                  ? "图形与比例"
                  : lesson.id === "polarization"
                    ? "偏振片设置"
                    : lesson.id === "radian-arc"
                      ? "半径与圆心角"
                      : lesson.id === "beat-frequency"
                        ? "频率与振幅"
                        : lesson.id === "square-difference"
                          ? "边长与面积"
                          : lesson.id === "ripple-interference"
                            ? "波源与观察点"
                            : lesson.id === "polygon-turn"
                              ? "图形与行走方向"
                              : lesson.id === "thermal-length"
                                ? "杆长、温差与接缝"
                                : lesson.id === "gear-drive"
                                  ? "齿数与输入速度"
                                  : lesson.id === "buoyancy-lift"
                                    ? "物体与液体"
                                    : lesson.id === "additive-light"
                                      ? "三束光的强度"
                                      : [
                                            "cylinder-net",
                                            "solid-volume",
                                          ].includes(lesson.id)
                                        ? "立体尺寸"
                                        : lesson.id === "water-pressure"
                                          ? "液体与水深"
                                          : lesson.id === "shadow-height"
                                            ? "高度与光照"
                                            : lesson.id === "circular-motion"
                                              ? "运动条件"
                                              : lesson.id === "resistor-network"
                                                ? "电源与电阻"
                                                : lesson.id === "prism"
                                                  ? "介质与入射条件"
                                                  : lesson.id === "circle-area"
                                                    ? "图形与等分"
                                                    : lesson.id === "pinhole"
                                                      ? "暗箱与物体"
                                                      : lesson.id ===
                                                          "inscribed-angle"
                                                        ? "圆与顶点"
                                                        : lesson.id ===
                                                            "pythagoras-proof"
                                                          ? "直角边长度"
                                                          : lesson.id ===
                                                              "plane-mirror"
                                                            ? "物点与观察者"
                                                            : lesson.id ===
                                                                "triangle-angles"
                                                              ? "顶点与边长"
                                                              : lesson.id ===
                                                                  "communicating"
                                                                ? "容器与初始液面"
                                                                : lesson.id ===
                                                                    "hydraulic"
                                                                  ? "活塞与施力"
                                                                  : lesson.id ===
                                                                      "area-cut"
                                                                    ? "底、高与偏移"
                                                                    : lesson.id ===
                                                                        "pulley"
                                                                      ? "装置与载荷"
                                                                      : isWheel ||
                                                                          isFigure ||
                                                                          lesson.id ===
                                                                            "polar" ||
                                                                          lesson.id ===
                                                                            "symmetry"
                                                                        ? "图形与变量"
                                                                        : isStanding
                                                                          ? "弦的条件"
                                                                          : lesson.id ===
                                                                              "ballistics"
                                                                            ? "发射条件"
                                                                            : "声源设置"}
        </h3>
        {["similar-area", "polarization"].includes(lesson.id) && (
          <div
            className="motion-shortcuts"
            aria-label={
              lesson.id === "similar-area" ? "图形选择" : "中间偏振片"
            }
          >
            {(lesson.id === "similar-area"
              ? ["矩形", "直角三角形"]
              : ["移出中间片", "插入中间片"]
            ).map((label, i) => (
              <Button
                key={label}
                aria-pressed={
                  (lesson.id === "similar-area" ? p.shape : p.insert) === i
                }
                onClick={() => {
                  setP({
                    ...p,
                    [lesson.id === "similar-area" ? "shape" : "insert"]: i,
                  });
                  seek(time);
                }}
              >
                {label}
              </Button>
            ))}
          </div>
        )}
        {lesson.id === "polar" && (
          <div className="motion-shortcuts" aria-label="曲线类型">
            {["圆", "心形线", "玫瑰线"].map((name, i) => (
              <Button
                key={name}
                aria-pressed={p.shape === i}
                onClick={() => {
                  setP({ ...p, shape: i });
                  seek(0);
                }}
              >
                {name}
              </Button>
            ))}
          </div>
        )}
        {(lesson.id === "symmetry" || lesson.id === "pulley") && (
          <div className="motion-shortcuts" aria-label="演示方式">
            {(lesson.id === "symmetry"
              ? ["轴对称", "旋转"]
              : ["定滑轮", "动滑轮组"]
            ).map((name, mode) => (
              <Button
                key={name}
                aria-pressed={p.mode === mode}
                onClick={() => {
                  setP({ ...p, mode });
                  seek(0);
                }}
              >
                {name}
              </Button>
            ))}
          </div>
        )}
        {lesson.id === "polygon-turn" && (
          <div role="group" aria-label="行走方向">
            {[
              [1, "逆时针"],
              [-1, "顺时针"],
            ].map(([direction, label]) => (
              <Button
                key={direction}
                primary={p.direction === direction}
                aria-pressed={p.direction === direction}
                onClick={() => {
                  setP({ ...p, direction });
                  seek(time);
                }}
              >
                {label}
              </Button>
            ))}
          </div>
        )}
        {lesson.params
          .filter(
            (field) =>
              field.key !== "insert" &&
              field.key !== "direction" &&
              field.key !== "shape" &&
              (!["symmetry", "pulley"].includes(lesson.id) ||
                (field.key !== "mode" &&
                  (field.key !== "axis" || p.mode === 0) &&
                  (field.key !== "turn" || p.mode === 1))) &&
              (field.key !== "petals" || p.shape === 2),
          )
          .map((field) =>
            isNature && field.min === 0 && field.max === 1 ? (
              <div
                className="motion-field"
                key={field.key}
                role="group"
                aria-label={field.label.split("：")[0]}
              >
                <span>{field.label.split("：")[0]}</span>
                <div className="motion-actions">
                  {field.label
                    .split("：")[1]
                    .split("/")
                    .map((label, value) => (
                      <Button
                        key={value}
                        primary={p[field.key] === value}
                        aria-pressed={p[field.key] === value}
                        onClick={() => {
                          setP({ ...p, [field.key]: value });
                          seek(0);
                        }}
                      >
                        {label.trim().replace(/^[01]\s*/, "")}
                      </Button>
                    ))}
                </div>
              </div>
            ) : (
              <label className="motion-field" key={field.key}>
                <span>
                  {field.label}
                  <output>
                    {Number(p[field.key].toFixed(2))} {field.unit}
                  </output>
                </span>
                <input
                  aria-label={field.label}
                  type="range"
                  min={field.min}
                  max={field.max}
                  step={field.step}
                  value={p[field.key]}
                  onChange={(e) => {
                    setP({ ...p, [field.key]: Number(e.target.value) });
                    seek(
                      [
                        "vector-sum",
                        "fence-area",
                        "similar-area",
                        "polarization",
                        "radian-arc",
                        "beat-frequency",
                        "square-difference",
                        "ripple-interference",
                        "polygon-turn",
                        "thermal-length",
                        "gear-drive",
                        "buoyancy-lift",
                        "water-pressure",
                        "solid-volume",
                        "cylinder-net",
                        "additive-light",
                      ].includes(lesson.id)
                        ? time
                        : 0,
                    );
                  }}
                />
              </label>
            ),
          )}
        {lesson.id === "fence-area" && (
          <div className="motion-actions">
            <Button
              onClick={() => {
                setP({ ...p, share: 50 });
                seek(6);
              }}
            >
              定位最大面积
            </Button>
            <Button
              onClick={() => {
                setP({ ...p, share: 100 - p.share });
                seek(6);
              }}
            >
              交换目标横边与竖边
            </Button>
          </div>
        )}
        {!["combustion", "germination"].includes(lesson.id) && (
          <h3>显示设置</h3>
        )}
        {lesson.id === "ripple-interference" && (
          <Button
            primary={showField}
            aria-pressed={showField}
            onClick={() => setShowField((v) => !v)}
          >
            {showField ? "隐藏" : "显示"}合振幅底图
          </Button>
        )}
        {!["combustion", "germination"].includes(lesson.id) && (
          <Button aria-pressed={guides} onClick={() => setGuides((v) => !v)}>
            {guides ? "隐藏" : "显示"}
            {isNature
              ? "图上说明"
              : lesson.id === "beat-frequency"
                ? "振幅包络"
                : [
                      "vector-sum",
                      "fence-area",
                      "similar-area",
                      "polarization",
                      "radian-arc",
                      "square-difference",
                      "ripple-interference",
                    ].includes(lesson.id)
                  ? "测量辅助线"
                  : lesson.id === "polygon-turn"
                    ? "角度与延长线"
                    : lesson.id === "thermal-length"
                      ? "初始杆端标线"
                      : lesson.id === "gear-drive"
                        ? "节圆与啮合标线"
                        : lesson.id === "buoyancy-lift"
                          ? "受力箭头"
                          : lesson.id === "additive-light"
                            ? "光斑边界与标注"
                            : lesson.id === "cylinder-net"
                              ? "尺寸辅助线"
                              : lesson.id === "circular-motion"
                                ? "方向箭头"
                                : [
                                      "solid-volume",
                                      "water-pressure",
                                      "shadow-height",
                                      "resistor-network",
                                      "prism",
                                      "circle-area",
                                      "pinhole",
                                      "inscribed-angle",
                                      "pythagoras-proof",
                                      "plane-mirror",
                                      "area-cut",
                                      "hydraulic",
                                      "triangle-angles",
                                      "communicating",
                                    ].includes(lesson.id)
                                  ? "测量辅助线"
                                  : lesson.id === "pulley"
                                    ? "受力箭头"
                                    : isWheel ||
                                        isFigure ||
                                        lesson.id === "polar" ||
                                        lesson.id === "symmetry"
                                      ? "辅助线"
                                      : isStanding
                                        ? "波节与包络"
                                        : lesson.id === "ballistics"
                                          ? "参考轨迹与速度分量"
                                          : "发射位置"}
          </Button>
        )}
        {(isWheel ||
          isFigure ||
          lesson.id === "polar" ||
          lesson.id === "plane-mirror") && (
          <Button aria-pressed={trace} onClick={() => setTrace((v) => !v)}>
            {trace ? "隐藏" : "显示"}
            {lesson.id === "plane-mirror" ? "虚像与反向延长线" : "描迹线"}
          </Button>
        )}
        <div className="motion-formula">{lesson.formula}</div>
        <details>
          <summary>模型边界与使用说明</summary>
          <p>{lesson.assumption}</p>
        </details>
        <div className="motion-next">
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
      </aside>
    </main>
  );
}
