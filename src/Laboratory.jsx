import { gradeFor, compareLevels } from "./curriculumLevels.mjs";
import CellEnergyCompare from "./CellEnergyCompare.jsx";
import InclineMassStudy from "./InclineMassStudy.jsx";
import RunoffStorageStudy from "./RunoffStorageStudy.jsx";
import { refractionInquiry } from "./refractionInquiry.mjs";
import { reverseRefraction } from "./reverseRefraction.mjs";
import ConservationStudio from "./ConservationStudio.jsx";
import RainVolumeStudy from "./RainVolumeStudy.jsx";
import CubeMeasureGuide from "./CubeMeasureGuide.jsx";
import VisualPhysicsScene from "./VisualPhysicsScene.jsx";
import { topicEntry, instrumentEntry } from "./chapterEntry.mjs";
import { groupFor } from "./courseCatalog.mjs";
import { panelHeading } from "./Theme.jsx";
import { switchRCMode } from "./rcTransition.mjs";
import { advanceTitration, titrationFlowRate } from "./titrationFlow.mjs";
import ConicGuide from "./ConicGuide.jsx";
import CellViewControls, { isCellCloseup } from "./CellViewControls.jsx";
import CellRecognition from "./CellRecognition.jsx";
import SecretoryGuide from "./SecretoryGuide.jsx";
import InquiryPrompt from "./InquiryPrompt.jsx";
import { cellInquiry } from "./cellInquiry.mjs";
import { solidsInquiry } from "./solidsInquiry.mjs";
import { moleculeInquiry } from "./moleculeInquiry.mjs";
import { microscopeInquiry } from "./microscopeInquiry.mjs";
import { functionsInquiry } from "./functionsInquiry.mjs";
import { lensInquiry } from "./lensInquiry.mjs";
import { moleculeChapter } from "./moleculeChapter.mjs";
import { recordedParameter } from "./recordedParameter.mjs";
import WaterBudgetGuide from "./WaterBudgetGuide.jsx";
import SurfaceWaterStudy from "./SurfaceWaterStudy.jsx";
import DaylightObserver from "./DaylightObserver.jsx";
import SeasonCalendar from "./SeasonCalendar.jsx";
import CommunityComparison from "./CommunityComparison.jsx";
import EnergyFlowStudio from "./EnergyFlowStudio.jsx";
import GeneticsStudio from "./GeneticsStudio.jsx";
import PhotoResponsePlot from "./PhotoResponsePlot.jsx";
import { photoInquiry } from "./photoInquiry.mjs";
import TitrationCurve from "./TitrationCurve.jsx";
import IndicatorStudy from "./IndicatorStudy.jsx";
import SeismicMotion from "./SeismicMotion.jsx";
import SeismicDistanceGuide from "./SeismicDistanceGuide.jsx";
import SeismicArrival from "./SeismicArrival.jsx";
import SeismicLocation from "./SeismicLocation.jsx";
import PlateStrainExplorer from "./PlateStrainExplorer.jsx";
import FractionComparison from "./FractionComparison.jsx";
import GeologyConnections from "./GeologyConnections.jsx";
import {
  titrationKeyboardValue,
  titrationVolumeLabel,
} from "./titrationInput.mjs";
import { MicroscopeChapters, MicroscopeGuide } from "./MicroscopeGuide.jsx";
import { LensChapters, LensGuide } from "./LensGuide.jsx";
import { lensChapters } from "./lensChapters.mjs";
import { ohmChapters } from "./ohmChapters.mjs";
import { circuitViews } from "./circuitViews.mjs";
import { OhmChapters, OhmGuide } from "./OhmGuide.jsx";
import { OhmDataPlot } from "./OhmDataPlot.jsx";
import { DilutionChapters, DilutionGuide } from "./DilutionGuide.jsx";
import { DilutionPlot } from "./DilutionPlot.jsx";
import { SolubilityChapters, SolubilityGuide } from "./SolubilityGuide.jsx";
import { solubilityChapters } from "./solubilityChapters.mjs";
import { solubilityViews } from "./solubilityViews.mjs";
import { SolubilityPlot } from "./SolubilityPlot.jsx";
import { AcidChapters, AcidGuide } from "./AcidGuide.jsx";
import { topicChapters } from "./topicChapters.mjs";
import { TopicPicker, TopicChapters, TopicGuide } from "./TopicLearning.jsx";
import { acidChapters } from "./acidChapters.mjs";
import { advanceTemperatureScan } from "./temperatureScan.mjs";
import { dilutionChapters } from "./dilutionChapters.mjs";
import { microscopeChapters } from "./microscopeChapters.mjs";
import React, {
  useEffect,
  useRef,
  useState,
  useMemo,
  lazy,
  Suspense,
} from "react";
import {
  ArrowUpRight,
  ArrowLeft,
  Search,
  X,
  Play,
  Pause,
  RotateCcw,
  StepForward,
  Maximize2,
  Minimize2,
  BookOpen,
  FlaskConical,
  ChevronRight,
  Download,
  Plus,
  Check,
  Compass,
  Layers3,
  Eye,
} from "lucide-react";
import { subjects, lessons, defaults } from "./lessons.mjs";
import { calculate, format, projectile } from "./models.mjs";
import FractionsScene from "./FractionsScene.jsx";
import PythagorasScene from "./PythagorasScene.jsx";
import LinearScene from "./LinearScene.jsx";
import CircleScene from "./CircleScene.jsx";
import CubeGuide from "./CubeGuide.jsx";
import FunctionStudio from "./FunctionStudio.jsx";
import SolidsGuide from "./SolidsGuide.jsx";
import MoleculeProjection from "./MoleculeProjection.jsx";
import MoleculeGuide from "./MoleculeGuide.jsx";
import InclineGuide from "./InclineGuide.jsx";
import RCGuide from "./RCGuide.jsx";
import RefractionScene from "./RefractionScene.jsx";
import LeverScene from "./LeverScene.jsx";
import { leverInquiry } from "./leverInquiry.mjs";
import ProjectileScene from "./ProjectileScene.jsx";
import { volcanoInquiry } from "./volcanoInquiry.mjs";
import { projectileInquiry } from "./projectileInquiry.mjs";
import SvgScene, { ContourMap } from "./SvgScene.jsx";
import TerrainProfile from "./TerrainProfile.jsx";
import ThreeScene from "./SceneLoader.jsx";
import { threeIds, diagramIds } from "./sceneCatalog.mjs";
import { restoreSession, saveSession } from "./session.mjs";
import { downloadCsv } from "./csvDownload.mjs";
import {
  cellViews,
  isCellReturnKey,
  cellControlKeys,
} from "./cellNavigation.mjs";
import { advancedChoices, presets } from "./advancedLessons.mjs";
import {
  timedIds,
  duration,
  normalizeInclineFriction,
} from "./advancedModels.mjs";
import { AdvancedOverlay } from "./AdvancedOverlay.jsx";
import PrecipitationGuide from "./PrecipitationGuide.jsx";
import Button from "./LabButton.jsx";
const choices = {
  "cube.detail": ["折叠纸板", "每面分格", "体积小方块"],
  "waves.mode": ["单列行波", "同向叠加", "相向驻波"],
  "buoyancy.mode": ["受控浸入", "最终平衡"],
  "capacitor.currentArrows": ["隐藏", "显示"],
  "capacitor.chargeMarkers": ["隐藏", "显示"],
  "capacitor.fieldLines": ["关闭", "开启"],
  "water.vegetation": ["隐藏植被", "显示植被"],
  "water.pathways": ["隐藏路径", "显示路径"],
  "cube.pair": ["全部面", "A ↔ F", "B ↔ D", "C ↔ E"],
  ...advancedChoices,
  "ohm.closed": ["断开", "闭合"],
  "ohm.digital": ["隐藏", "显示"],
  "ohm.trace": ["实际线色", "主回路", "电压支路"],
  "cell.part": [
    "全部结构",
    "细胞核",
    "中央液泡",
    "叶绿体",
    "线粒体",
    "高尔基体",
    "内质网",
  ],
  "inheritance.parent1": ["AA", "Aa", "aa"],
  "inheritance.parent2": ["AA", "Aa", "aa"],
  "plates.type": ["张裂", "大陆碰撞", "水平错动"],
};
const animated = {
  refraction: ["angle", 0, 89.9, 8],
  acid: ["base", 0, 100, 0.5],
  dilution: ["add", 0, 300, 10],
  circle: ["rearrange", 0, 100, 20],
  pythagoras: ["arrange", 0, 100, 20],
  cube: ["fold", 0, 100, 15],
  conservation: ["progress", 0, 4, 0.6],
  plates: ["progress", 0, 100, 12],
  seasons: ["day", 0, 365, 20],
  daynight: ["hour", 0, 24, 1],
  contour: ["level", 100, 2400, 120],
  water: ["rain", 0, 200, 15],
  cell: ["cut", 0, 100, 15],
};
const playLabels = {
  refraction: "扫描入射角",
  waves: "播放波动",
  buoyancy: "逐渐浸入",
  pythagoras: "演示面积拼合",
  circle: "演示扇形重排",
  cube: "演示折叠",
  functions: "扫描观察点",
  solids: "扫描水平截面",
  incline: "释放滑块",
  lever: "释放杠杆",
  projectile: "发射小球",
  precipitation: "开始滴加",
  molecule: "观察分子运动",
  conservation: "演示原子重组",
  cell: "打开剖面",
  biodiversity: "观察生物活动",
  volcano: "演示喷发",
  earthquake: "传播地震波",
  seasons: "演示公转",
  daynight: "演示自转",
  plates: "演示板块运动",
  water: "扫描水量分配",
  microscope: "观察微生物活动",
};
const exactFunctionKeys = new Set(["a", "k", "shift", "b", "probe"]);
function Controls({ lesson, p, change, keys = null }) {
  const visibleParams = keys
    ? keys
        .map((key) => lesson.params.find((param) => param.key === key))
        .filter(Boolean)
    : lesson.params;
  return (
    <div className="controls">
      {visibleParams
        .filter(
          (param) =>
            lesson.id !== "volcano" ||
            !["showLava", "showAsh", "showEjecta"].includes(param.key),
        )
        .map((param) =>
          param.options || choices[`${lesson.id}.${param.key}`] ? (
            <fieldset className="choice-field" key={param.key}>
              <legend>{param.label.split("：")[0]}</legend>
              <div>
                {(
                  param.options ||
                  choices[`${lesson.id}.${param.key}`].map((name, index) => ({
                    label: name,
                    value: index,
                  }))
                ).map(({ label: name, value: index }) => (
                  <button
                    key={name}
                    aria-label={`${param.label.split("：")[0]} ${name}`}
                    aria-pressed={p[param.key] === index}
                    onClick={() => change(param.key, index)}
                  >
                    {name}
                  </button>
                ))}
              </div>
            </fieldset>
          ) : (
            <label className="parameter" key={param.key}>
              <span>
                {param.label}
                <strong>
                  {lesson.id === "acid" && param.key === "base"
                    ? titrationVolumeLabel(p.base, p.acid)
                    : format(p[param.key])}
                  <small>{param.unit}</small>
                </strong>
              </span>
              <input
                type="range"
                disabled={
                  lesson.id === "lens" &&
                  param.key === "sourceOffset" &&
                  p.heightLock === 1
                }
                min={param.min}
                max={param.max}
                step={
                  (lesson.id === "acid" && param.key === "base") ||
                  (lesson.id === "solubility" && param.key === "temp") ||
                  (lesson.id === "dilution" && param.key === "add") ||
                  (lesson.id === "solids" && param.key === "slice") ||
                  (lesson.id === "functions" &&
                    exactFunctionKeys.has(param.key))
                    ? "any"
                    : param.step
                }
                value={p[param.key]}
                aria-valuetext={
                  lesson.id === "acid" && param.key === "base"
                    ? `${titrationVolumeLabel(p.base, p.acid)} mL`
                    : undefined
                }
                onKeyDown={(event) => {
                  if (
                    (lesson.id === "solubility" && param.key === "temp") ||
                    (lesson.id === "dilution" && param.key === "add") ||
                    (lesson.id === "solids" && param.key === "slice") ||
                    (lesson.id === "functions" &&
                      exactFunctionKeys.has(param.key))
                  ) {
                    const delta = {
                      ArrowLeft: -1,
                      ArrowDown: -1,
                      ArrowRight: 1,
                      ArrowUp: 1,
                    }[event.key];
                    const next =
                      event.key === "Home"
                        ? param.min
                        : event.key === "End"
                          ? param.max
                          : delta === undefined
                            ? null
                            : Math.max(
                                param.min,
                                Math.min(
                                  param.max,
                                  p[param.key] + delta * param.step,
                                ),
                              );
                    if (next !== null) {
                      event.preventDefault();
                      change(param.key, next);
                    }
                    return;
                  }
                  if (lesson.id !== "acid" || param.key !== "base") return;
                  const next = titrationKeyboardValue(p.base, event.key, 0.1);
                  if (next !== null) {
                    event.preventDefault();
                    change("base", next);
                  }
                }}
                style={{
                  "--range-progress": `${(100 * (p[param.key] - param.min)) / (param.max - param.min)}%`,
                }}
                onChange={(e) => change(param.key, Number(e.target.value))}
              />
              <span className="range-ends">
                <small>
                  {param.min}
                  {param.unit}
                </small>
                <small>
                  {param.max}
                  {param.unit}
                </small>
              </span>
            </label>
          ),
        )}
    </div>
  );
}
export default function Laboratory({ lesson: metadata, open, goHome }) {
  const lesson = lessons.find((x) => x.id === metadata.id) ?? metadata;
  const [saved] = useState(() => {
    try {
      return restoreSession(lesson, localStorage);
    } catch {
      return restoreSession(lesson, null);
    }
  });
  const [transportRevision, setTransportRevision] = useState(0);
  const [conicPlotHost, setConicPlotHost] = useState(null);
  const [p, setP] = useState(saved.p),
    [t, setT] = useState(
      lesson.id === "solids"
        ? Math.min(20, saved.t > 0 ? saved.t : saved.p.slice / 5)
        : lesson.id === "functions"
          ? Math.min(20, saved.t > 0 ? saved.t : (saved.p.probe + 5) * 2)
          : saved.t,
    ),
    [playing, setPlaying] = useState(false),
    [dosePulse, setDosePulse] = useState(0),
    [records, setRecords] = useState(saved.records),
    [bisectionProgress, setBisectionProgress] = useState(
      saved.observation?.bisection,
    ),
    [status, setStatus] = useState(
      saved.restored ? "已恢复这台设备上次的实验。" : "",
    ),
    [storageOk, setStorageOk] = useState(true),
    [step, setStep] = useState(0),
    [microChapter, setMicroChapter] = useState(0),
    [lensChapter, setLensChapter] = useState(0),
    [ohmChapter, setOhmChapter] = useState(0),
    [dilutionChapter, setDilutionChapter] = useState(
      lesson.id === "dilution" ? (saved.observation?.chapter ?? 0) : 0,
    ),
    [solubilityChapter, setSolubilityChapter] = useState(
      lesson.id === "solubility" ? (saved.observation?.chapter ?? 0) : 0,
    ),
    [acidChapter, setAcidChapter] = useState(
      lesson.id === "acid" ? (saved.observation?.chapter ?? 0) : 0,
    ),
    [selectedTopicChapter, setTopicChapter] = useState(
      saved.observation?.chapter ?? 0,
    ),
    [thermalDirection, setThermalDirection] = useState(1),
    [specimenSelection, setSpecimenSelection] = useState(0),
    [view, setView] = useState(saved.observation?.view ?? "perspective"),
    [presentation, setPresentation] = useState(false),
    [representation, setRepresentation] = useState(
      saved.observation?.representation ?? "3d",
    ),
    [rate, setRate] = useState(1);
  const use3d = threeIds.includes(lesson.id) && representation === "3d";
  const chapters = topicChapters[lesson.id];
  const topicChapter =
    lesson.id === "plates" && selectedTopicChapter < 3
      ? p.type
      : lesson.id === "capacitor" && selectedTopicChapter < 2
        ? p.mode
        : lesson.id === "molecule"
          ? moleculeChapter(p, selectedTopicChapter)
          : lesson.id === "projectile" &&
              selectedTopicChapter === 0 &&
              p.angle > 0
            ? 1
            : selectedTopicChapter;
  const inquiryChapter =
    lesson.id === "microscope"
      ? microChapter
      : lesson.id === "lens"
        ? lensChapter
        : topicChapter;
  const inquiry =
    {
      volcano: volcanoInquiry,
      projectile: projectileInquiry,
      lever: leverInquiry,
      refraction: refractionInquiry,
      cell: cellInquiry,
      photosynthesis: photoInquiry,
      solids: solidsInquiry,
      molecule: moleculeInquiry,
      microscope: microscopeInquiry,
      functions: functionsInquiry,
      lens: lensInquiry,
    }[lesson.id]?.[inquiryChapter] ?? lesson;
  const activeKeys =
    lesson.id === "cell"
      ? topicChapter === 7
        ? ["cytoskeleton", "labels"]
        : cellControlKeys(view)
      : chapters
        ? chapters[topicChapter].keys
        : lesson.id === "microscope"
          ? microscopeChapters[microChapter].keys
          : lesson.id === "lens"
            ? lensChapters[lensChapter].keys
            : lesson.id === "ohm"
              ? ohmChapters[ohmChapter].keys
              : lesson.id === "dilution"
                ? dilutionChapters[dilutionChapter].keys
                : lesson.id === "solubility"
                  ? solubilityChapters[solubilityChapter].keys
                  : lesson.id === "acid"
                    ? acidChapters[acidChapter].keys
                    : null;
  const extraKeys = activeKeys
    ? lesson.params
        .map((param) => param.key)
        .filter((key) => !activeKeys.includes(key))
        .filter((key) => lesson.id !== "acid" || key !== "doseRate")
        .filter(
          (key) =>
            lesson.id !== "volcano" ||
            !["showLava", "showAsh", "showEjecta"].includes(key),
        )
        .filter(
          (key) =>
            lesson.id !== "cell" ||
            !["secretoryMode", "secretoryProgress", "cellMotion"].includes(key),
        )
        .filter(
          (key) =>
            lesson.id !== "water" || !["vegetation", "pathways"].includes(key),
        )
    : [];
  function returnToCell() {
    setPlaying(false);
    setView("perspective");
  }
  useEffect(() => {
    if (
      lesson.id === "biodiversity" &&
      ((view === "fungus" && p.fungi === 0) ||
        (view === "insect" && p.insects === 0))
    )
      setView("perspective");
  }, [lesson.id, view, p.fungi, p.insects]);
  useEffect(() => {
    if (lesson.id !== "cell" || !cellViews.slice(1).includes(view)) return;
    const handle = (event) => {
      if (document.fullscreenElement || !isCellReturnKey(event)) return;
      event.preventDefault();
      returnToCell();
    };
    window.addEventListener("keydown", handle);
    return () => window.removeEventListener("keydown", handle);
  }, [lesson.id, view]);
  function enterChapter(entry, title) {
    prepareMicroChapter(entry.p);
    setT(entry.time);
    setView(entry.view);
    setStatus(`已切换到“${title}”的演示状态，可继续操作；已有实验记录保留。`);
  }
  function selectTopicChapter(index) {
    if (
      [
        "inheritance",
        "foodweb",
        "photosynthesis",
        "biodiversity",
        "water",
      ].includes(lesson.id)
    )
      setSpecimenSelection((n) => n + 1);
    setTopicChapter(index);
    enterChapter(topicEntry(lesson, chapters, index, p), chapters[index].title);
  }
  function selectInstrumentChapter(setChapter, list, index) {
    setChapter(index);
    enterChapter(instrumentEntry(lesson, list, index, p), list[index].title);
  }
  function selectSimpleChapter(setChapter, index) {
    const list = {
      acid: acidChapters,
      dilution: dilutionChapters,
      solubility: solubilityChapters,
    }[lesson.id];
    selectInstrumentChapter(setChapter, list, index);
  }
  function selectOhmChapter(index) {
    selectInstrumentChapter(setOhmChapter, ohmChapters, index);
  }
  function applyTopicScenario(parameters, camera, label, time) {
    if (["inheritance", "water"].includes(lesson.id))
      setSpecimenSelection((n) => n + 1);
    prepareMicroChapter(parameters);
    if (Number.isFinite(time))
      setT(Math.max(0, Math.min(duration(lesson.id, parameters), time)));
    setView(
      lesson.id === "cell" && parameters.part === 1
        ? "nucleus"
        : lesson.id === "cell" && parameters.part === 2
          ? "vacuole"
          : lesson.id === "cell" && parameters.part === 3
            ? "chloroplast"
            : lesson.id === "cell" && parameters.part === 4
              ? "mitochondrion"
              : lesson.id === "cell" && parameters.part === 5
                ? "golgi"
                : lesson.id === "cell" && parameters.part === 6
                  ? "reticulum"
                  : camera,
    );
    setStatus(`已准备“${label}”，可继续调整或播放；已有记录保留。`);
  }
  useEffect(() => {
    if (playing) return;
    try {
      setStorageOk(
        saveSession(
          lesson,
          {
            p,
            t,
            records,
            observation: {
              chapter:
                lesson.id === "acid"
                  ? acidChapter
                  : lesson.id === "dilution"
                    ? dilutionChapter
                    : lesson.id === "solubility"
                      ? solubilityChapter
                      : selectedTopicChapter,
              view,
              representation,
              bisection: bisectionProgress,
            },
          },
          localStorage,
        ),
      );
    } catch {
      setStorageOk(false);
    }
  }, [
    lesson,
    p,
    t,
    records,
    playing,
    selectedTopicChapter,
    view,
    acidChapter,
    dilutionChapter,
    solubilityChapter,
    representation,
    bisectionProgress,
  ]);
  const subject = subjects.find((s) => s.id === lesson.subject);
  const motion =
      lesson.id === "water" && topicChapter === 8
        ? undefined
        : lesson.id === "conservation"
          ? Math.min(Math.floor(p.h2 / 2), p.o2) > 0
            ? ["progress", 0, Math.min(Math.floor(p.h2 / 2), p.o2), 0.6]
            : undefined
          : lesson.id === "cube" && p.detail === 2
            ? ["fill", 0, 100, 20]
            : lesson.id === "buoyancy"
              ? p.mode === 0
                ? ["immersion", 0, 100, 15]
                : undefined
              : lesson.id === "circle" && topicChapter === 0
                ? ["unroll", 0, 100, 20]
                : lesson.id === "circle" && topicChapter === 2
                  ? ["r", 1, 5, 0.5]
                  : lesson.id === "water" && topicChapter >= 5
                    ? ["infil", 10, 70, 6]
                    : lesson.id === "water" && [1, 3].includes(topicChapter)
                      ? ["infil", 0, 80, 6]
                      : lesson.id === "water" && topicChapter === 2
                        ? ["evap", 0, 20, 2]
                        : animated[lesson.id],
    canPlay =
      lesson.id === "microscope"
        ? p.specimen === 2
        : !!motion ||
          lesson.id === "projectile" ||
          timedIds.includes(lesson.id);
  useEffect(() => {
    if (!playing) return;
    let frame,
      last = null;
    const tick = (now) => {
      if (last !== null) {
        const dt = Math.min(0.1, (now - last) / 1000) * rate;
        if (document.hidden) {
          last = now;
          frame = requestAnimationFrame(tick);
          return;
        }
        if (lesson.id === "solubility") {
          setP((old) => {
            const next = advanceTemperatureScan(old.temp, thermalDirection, dt);
            if (next.done) setPlaying(false);
            return { ...old, temp: next.temp };
          });
        } else if (timedIds.includes(lesson.id)) {
          setT((old) => {
            const end = duration(lesson.id, p);
            const next = Math.min(end, old + dt);
            if (next >= end) setPlaying(false);
            return next;
          });
        } else if (lesson.id === "projectile") {
          setT((old) => {
            const end = projectile(p, 0).flight;
            let next = Math.min(end, old + dt);
            if (next >= end) setPlaying(false);
            return next;
          });
        } else {
          const [key, min, max, speed] = motion;
          setP((old) => {
            const raw =
              lesson.id === "acid"
                ? advanceTitration(old.base, dt, old.doseRate)
                : Math.min(max, old[key] + speed * dt);
            if (raw >= max) setPlaying(false);
            return { ...old, [key]: raw };
          });
        }
      }
      last = now;
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [playing, lesson.id, rate, thermalDirection, topicChapter]);
  // Quantise discrete states only; continuous animation parameters remain smooth.
  const parameterTime = ["functions", "solids"].includes(lesson.id) ? t : 0;
  const renderP = useMemo(() => {
    const renderP = { ...p };
    if (lesson.id === "solids") renderP.accumulation = topicChapter >= 4;
    if (lesson.id === "functions" && parameterTime > 0)
      renderP.probe = -5 + Math.min(20, parameterTime) * 0.5;
    if (lesson.id === "solids" && parameterTime > 0)
      renderP.slice = Math.min(100, parameterTime * 5);
    for (const param of lesson.params) {
      if (
        ["type", "part", "progress"].includes(param.key) &&
        param.step === 1 &&
        lesson.id !== "plates"
      )
        renderP[param.key] = Math.floor(p[param.key]);
    }
    return renderP;
  }, [p, lesson, parameterTime, topicChapter]);
  const renderValues = calculate(lesson.id, renderP, t);
  function selectMicroChapter(index) {
    selectInstrumentChapter(setMicroChapter, microscopeChapters, index);
  }
  function prepareMicroChapter(preset) {
    setTransportRevision((value) => value + 1);
    if ("specimen" in preset) setSpecimenSelection((v) => v + 1);
    setPlaying(false);
    setT(
      lesson.id === "solids"
        ? (preset.slice ?? renderP.slice) / 5
        : lesson.id === "functions"
          ? ((preset.probe ?? renderP.probe) + 5) * 2
          : 0,
    );
    setP((old) =>
      lesson.id === "incline"
        ? normalizeInclineFriction({ ...old, ...preset })
        : lesson.id === "solids"
          ? { ...old, slice: renderP.slice, ...preset }
          : lesson.id === "functions"
            ? { ...old, probe: renderP.probe, ...preset }
            : {
                ...old,
                ...(lesson.id === "cell" ? { secretoryMode: 0 } : {}),
                ...preset,
              },
    );
    setStatus(
      "apparatusLabels" in preset
        ? preset.apparatusLabels === 0
          ? "已隐藏器材名称，光路与实验参数保持不变。"
          : "已显示器材名称，可沿引线辨认对应器材。"
        : "digital" in preset
          ? preset.digital === 0
            ? "已隐藏数字读数，请先按指针估读。"
            : "已显示数字读数，可核对并记录结果。"
          : "已准备本节实验；之前的实验记录保留。",
    );
  }
  function selectLensChapter(index) {
    selectInstrumentChapter(setLensChapter, lensChapters, index);
  }
  function restartInstrumentChapter(chapter) {
    prepareMicroChapter({ ...defaults(lesson), ...chapter.preset });
    setView(chapter.view ?? "perspective");
    setStatus("已重做本节：恢复起始参数并暂停，当前章节与实验记录保留。");
  }
  function reset() {
    if (["cell", "conics", "capacitor", "plates"].includes(lesson.id))
      setTopicChapter(0);
    setSpecimenSelection((v) => v + 1);
    setPlaying(false);
    setP(defaults(lesson));
    setT(
      lesson.id === "solids"
        ? defaults(lesson).slice / 5
        : lesson.id === "functions"
          ? (defaults(lesson).probe + 5) * 2
          : 0,
    );
    setStatus("参数与时间已复位，已有实验记录保留。");
    setView("perspective");
  }
  function change(key, value) {
    if (
      lesson.id === "cube" &&
      (key === "detail" || (key === "fold" && p.detail === 2))
    ) {
      setPlaying(false);
      setP((old) => ({
        ...old,
        [key]: value,
        ...(key === "detail" && value === 2
          ? { fold: 100 }
          : key === "fold"
            ? { detail: 0 }
            : {}),
      }));
      return;
    }

    if (lesson.id === "refraction" && key === "reverseRay") {
      const next = reverseRefraction(p);
      if (!next) return;
      setP(next);
      setPlaying(false);
      setT(0);
      setStatus(
        "已交换介质并将折射角设为反向入射角；图形按统一入射方向重新排布，可比较角度是否互换。",
      );
      return;
    }
    if (
      lesson.id === "capacitor" &&
      ["dischargeCurrent", "chargeCurrent", "mode"].includes(key)
    ) {
      const mode = key === "mode" ? value : key === "dischargeCurrent" ? 1 : 0;
      if (mode === p.mode) return;
      setP(switchRCMode(p, t, mode));
      setPlaying(false);
      setT(0);
      setTopicChapter((old) => (old < 2 ? mode : old));
      setStatus(
        `已保留切换前的电容电压，准备${mode ? "放电" : "继续充电"}；时间从切换时刻重新计起。`,
      );
      return;
    }
    if (lesson.id === "capacitor" && key === "prepareMode") {
      setP((old) => ({
        ...old,
        mode: value,
        initialRatio: 100,
        chargeInitialRatio: 0,
      }));
      setPlaying(false);
      setT(0);
      return;
    }

    if (
      lesson.id === "cell" &&
      ["secretoryMode", "secretoryProgress"].includes(key)
    ) {
      setPlaying(false);
      if (key === "secretoryMode") {
        setView("perspective");
        setTopicChapter(value === 1 ? 6 : 0);
        setP((old) => ({ ...old, part: 0, cut: 100, [key]: value }));
      } else {
        setP((old) => ({ ...old, [key]: value }));
      }
      return;
    }
    if (
      (lesson.id === "cell" && key === "labels") ||
      (lesson.id === "circle" && key === "limitRectangle") ||
      (lesson.id === "incline" && key === "forces") ||
      (lesson.id === "solids" &&
        ["solidShell", "solidMeasures"].includes(key)) ||
      (lesson.id === "earthquake" && key === "vegetation") ||
      (lesson.id === "volcano" &&
        ["cut", "labels", "showLava", "showAsh", "showEjecta"].includes(key))
    ) {
      setP((old) => ({ ...old, [key]: value }));
      return;
    }
    if (lesson.id === "volcano" && ["type", "intensity"].includes(key)) {
      setPlaying(false);
      setP((old) => ({ ...old, [key]: value }));
      return;
    }
    if (lesson.id === "functions") {
      const probe = key === "probe" ? value : renderP.probe;
      setPlaying(false);
      setP((old) => ({ ...old, probe, [key]: value }));
      setT((probe + 5) * 2);
      return;
    }
    if (lesson.id === "solids") {
      const slice = key === "slice" ? value : renderP.slice;
      setPlaying(false);
      setP((old) => ({ ...old, slice, [key]: value }));
      setT(slice / 5);
      return;
    }
    if (lesson.id === "cell" && key === "vacuoleSection") {
      setView("vacuole");
      setTopicChapter(1);
      setPlaying(false);
      setP((old) => ({ ...old, vacuoleSection: value, part: 2, cut: 100 }));
      return;
    }
    if (lesson.id === "cell" && key === "cytoskeleton") {
      setView("perspective");
      setTopicChapter(7);
      setPlaying(false);
      setP((old) => ({
        ...old,
        cytoskeleton: value,
        part: 0,
        cut: 100,
        secretoryMode: 0,
      }));
      return;
    }
    if (
      lesson.id === "capacitor" &&
      ["trace", "currentArrows", "chargeMarkers", "fieldLines"].includes(key)
    ) {
      setP((old) => ({ ...old, [key]: value }));
      return;
    }
    if (lesson.id === "cell" && key === "erMode") {
      setView("reticulum");
      setTopicChapter(5);
    }
    if (lesson.id === "cell" && key === "golgiMode") {
      setView("golgi");
      setTopicChapter(4);
      setPlaying(false);
      setP((old) => ({ ...old, golgiMode: value, part: 5, cut: 100 }));
      return;
    }
    if (lesson.id === "cell" && key === "mitochondrionMode") {
      setView("mitochondrion");
      setTopicChapter(3);
      setPlaying(false);
      setP((old) => ({ ...old, mitochondrionMode: value, part: 4, cut: 100 }));
      return;
    }
    if (lesson.id === "cell" && key === "nucleusMode") {
      setView("nucleus");
      setTopicChapter(1);
      setPlaying(false);
      setP((old) => ({ ...old, nucleusMode: value, part: 1, cut: 100 }));
      return;
    }
    if (lesson.id === "cell" && key === "chloroplastMode") {
      setView("chloroplast");
      setTopicChapter(2);
      setPlaying(false);
      setP((old) => ({ ...old, chloroplastMode: value, part: 3, cut: 100 }));
      return;
    }
    if (lesson.id === "cell" && key === "cellMotion") {
      setP((old) => ({ ...old, cellMotion: value }));
      return;
    }
    if (lesson.id === "cell" && key === "cellAngle") {
      setView(
        isCellCloseup(view) ? view : ["perspective", "front", "top"][value],
      );
      setPlaying(false);
      setP((old) => ({ ...old, cellAngle: value }));
      return;
    }
    if (key === "specimen") setSpecimenSelection((v) => v + 1);
    if (lesson.id === "cell" && key === "cut") setView("perspective");
    if (lesson.id === "cell" && key === "part") {
      setView(
        value === 1
          ? "nucleus"
          : value === 2
            ? "vacuole"
            : value === 3
              ? "chloroplast"
              : value === 4
                ? "mitochondrion"
                : value === 5
                  ? "golgi"
                  : value === 6
                    ? "reticulum"
                    : "perspective",
      );
      setTopicChapter(value >= 3 ? value - 1 : value ? 1 : 0);
    }
    setPlaying(false);
    setP((old) =>
      lesson.id === "cell" && key === "erMode"
        ? { ...old, erMode: value, part: 6, cut: 100, secretoryMode: 0 }
        : lesson.id === "incline"
          ? normalizeInclineFriction({ ...old, [key]: value }, key)
          : lesson.id === "lens" &&
              key === "sourceOffset" &&
              old.heightLock === 1
            ? old
            : lesson.id === "cell" && key === "part"
              ? {
                  ...old,
                  [key]: value,
                  cut: value ? 100 : old.cut,
                  secretoryMode: 0,
                }
              : { ...old, [key]: value },
    );
    setT(0);
  }
  function advance() {
    setPlaying(false);
    if (lesson.id === "acid" && p.base < 100)
      setDosePulse((value) => value + 1);
    if (timedIds.includes(lesson.id))
      setT((old) => Math.min(duration(lesson.id, p), old + 0.2));
    else if (motion) {
      const [key, min, max, speed] = motion;
      setP((old) => ({
        ...old,
        [key]: Math.min(
          max,
          old[key] +
            (lesson.id === "acid"
              ? 0.1
              : lesson.id === "conservation"
                ? 1
                : speed * 0.5),
        ),
      }));
    } else setT((old) => Math.min(projectile(p, 0).flight, old + 0.1));
  }
  function play() {
    if (!playing) {
      if (timedIds.includes(lesson.id) && t >= duration(lesson.id, p)) {
        setT(0);
        if (lesson.id === "solids") setP((old) => ({ ...old, slice: 0 }));
        if (lesson.id === "functions") setP((old) => ({ ...old, probe: -5 }));
      }
      if (motion && p[motion[0]] >= motion[2])
        setP((old) => ({ ...old, [motion[0]]: motion[1] }));
      if (lesson.id === "projectile" && t >= projectile(p, 0).flight) setT(0);
    }
    setPlaying(!playing);
  }
  function toggleSupply() {
    if (p.add >= 300) {
      setStatus(
        "已达到本次演示的加水上限。需要重新实验时，请点击重新加水演示。",
      );
      return;
    }
    setPlaying((previous) => !previous);
  }
  function toggleDosing() {
    if (p.base >= 100) {
      setStatus("滴定管已空。需要重新实验时，请点击重新滴定演示。");
      return;
    }
    setPlaying((previous) => !previous);
  }
  function toggleReactionDosing() {
    if (p.base <= 0 || t >= 8) {
      setStatus(
        p.base <= 0
          ? "尚未准备 NaOH，请先设置试剂体积。"
          : "本次试剂已加完。可继续观察沉降，或选择滴加前重新演示。",
      );
      return;
    }
    setPlaying((previous) => !previous);
  }
  function record() {
    if (lesson.id === "ohm" && p.digital === 0) {
      setStatus("请先显示数字核对读数，再保存实验记录。");
      return;
    }
    if (records.length >= 200) {
      setStatus(
        "已达到 200 组记录，请先导出 CSV，再在管理记录中清空当前主题记录。",
      );
      return;
    }
    const row = {
      number: records.length + 1,
      t,
      parameters: { ...renderP },
      values: renderValues.map((v) => ({ ...v })),
    };
    setRecords((old) => [...old, row]);
    setStatus(`已记录第 ${row.number} 组数据，可继续改变一个变量进行比较。`);
    setStep(2);
  }
  function download() {
    const columns = [
      "序号",
      "时间 (s)",
      ...lesson.params.map((x) => `${x.label} (${x.unit})`),
      ...renderValues.map((v) => `${v.label} (${v.unit})`),
    ];
    const rows = records.map((r) => [
      r.number,
      r.t,
      ...lesson.params.map((x) => r.parameters[x.key]),
      ...r.values.map((x) => x.value),
    ]);
    downloadCsv(lesson.id + "-实验记录.csv", [columns, ...rows]);
    setStatus("已导出当前实验记录 CSV");
  }
  return (
    <div
      className={
        "laboratory subject-" +
        lesson.subject +
        " " +
        (presentation ? "presentation" : "")
      }
      data-scene={lesson.id}
    >
      <aside className="lesson-nav">
        <button className="back" onClick={goHome}>
          <ArrowLeft size={17} /> 返回探索馆
        </button>
        <div className="subject-identity">
          <span style={{ color: subject.color }}>{subject.symbol}</span>
          <strong>{subject.name}实验室</strong>
          <small>{subject.en}</small>
        </div>
        <div className="nav-subjects">
          {subjects.map((s) => (
            <button
              key={s.id}
              aria-label={`${s.name}实验列表`}
              aria-pressed={s.id === subject.id}
              onClick={() => open(lessons.find((l) => l.subject === s.id).id)}
            >
              {s.name}
            </button>
          ))}
        </div>
        <TopicPicker lesson={lesson} lessons={lessons} onSelect={open} />
        {lesson.id === "microscope" ? (
          <MicroscopeChapters
            chapter={microChapter}
            onSelect={selectMicroChapter}
          />
        ) : lesson.id === "acid" ? (
          <AcidChapters
            chapter={acidChapter}
            onSelect={(index) => selectSimpleChapter(setAcidChapter, index)}
          />
        ) : lesson.id === "solubility" ? (
          <SolubilityChapters
            chapter={solubilityChapter}
            onSelect={(index) =>
              selectSimpleChapter(setSolubilityChapter, index)
            }
          />
        ) : lesson.id === "dilution" ? (
          <DilutionChapters
            chapter={dilutionChapter}
            onSelect={(index) => selectSimpleChapter(setDilutionChapter, index)}
          />
        ) : lesson.id === "ohm" ? (
          <OhmChapters chapter={ohmChapter} onSelect={selectOhmChapter} />
        ) : lesson.id === "lens" ? (
          <LensChapters chapter={lensChapter} onSelect={selectLensChapter} />
        ) : chapters ? (
          <TopicChapters
            chapters={chapters}
            chapter={topicChapter}
            onSelect={selectTopicChapter}
          />
        ) : (
          <>
            <span className="nav-heading">
              本学科探索 /{" "}
              {lessons.filter((l) => l.subject === subject.id).length}
            </span>
            <nav aria-label="本学科互动主题">
              {lessons
                .filter((l) => l.subject === subject.id)
                .sort(compareLevels)
                .map((l, i) => (
                  <button
                    key={l.id}
                    className={lesson.id === l.id ? "selected" : ""}
                    onClick={() => open(l.id)}
                  >
                    <small>{String(i + 1).padStart(2, "0")}</small>
                    <span>{l.title}</span>
                    <ChevronRight size={14} />
                  </button>
                ))}
            </nav>
          </>
        )}
        <div className="nav-note">
          <BookOpen size={20} />
          <p>
            先预测，再操作。
            <br />
            让证据支持你的解释。
          </p>
          <a href="./curriculum.html" target="_blank" rel="noreferrer">
            查看课程依据 ↗
          </a>
        </div>
      </aside>
      <main className="lab-main">
        <div className="lab-heading">
          <div>
            <div className="breadcrumb">
              探索馆 <ChevronRight size={12} /> {subject.name}{" "}
              <ChevronRight size={12} /> {lesson.tag}
            </div>
            <h1>{groupFor(lesson.id)?.title ?? lesson.title}</h1>
            <p>
              {groupFor(lesson.id) ? `${lesson.title} · ` : ""}
              {lesson.description}
            </p>
          </div>
          <Button
            icon={presentation ? Minimize2 : Maximize2}
            onClick={() => setPresentation(!presentation)}
          >
            {presentation ? "退出投屏" : "课堂投屏"}
          </Button>
        </div>
        <div className="lab-layout">
          <div className="stage-column">
            <div className="stage">
              <div className="stage-bar">
                <span>
                  <i /> {use3d ? "三维交互场景" : "实时科学模型"}
                </span>
                <small>{gradeFor(lesson.id)}</small>
              </div>
              {diagramIds.includes(lesson.id) && (
                <div
                  className="representation-switch"
                  aria-label="实验呈现方式"
                >
                  <button
                    aria-pressed={representation === "3d"}
                    onClick={() => setRepresentation("3d")}
                  >
                    {lesson.id === "water" ? "三维流域" : "三维实验台"}
                  </button>
                  <button
                    aria-pressed={representation === "diagram"}
                    onClick={() => setRepresentation("diagram")}
                  >
                    {lesson.id === "ohm" ? "电路原理图" : "原理示意图"}
                  </button>
                </div>
              )}
              {use3d ? (
                <ThreeScene
                  id={lesson.id}
                  p={renderP}
                  t={lesson.id === "microscope" ? 0 : t}
                  running={playing}
                  dosePulse={dosePulse}
                  onToggleSupply={
                    lesson.id === "dilution" ? toggleSupply : undefined
                  }
                  onToggleDosing={
                    lesson.id === "acid"
                      ? toggleDosing
                      : lesson.id === "precipitation"
                        ? toggleReactionDosing
                        : undefined
                  }
                  view={view}
                  onViewChange={(nextView) => {
                    if (lesson.id === "biodiversity") setPlaying(false);
                    setView(nextView);
                  }}
                  onChange={change}
                  onUseDiagram={
                    diagramIds.includes(lesson.id)
                      ? () => {
                          setPlaying(false);
                          setRepresentation("diagram");
                        }
                      : undefined
                  }
                />
              ) : lesson.id === "foodweb" ? (
                <EnergyFlowStudio
                  key={`${topicChapter}-${specimenSelection}`}
                  p={renderP}
                  chapter={topicChapter}
                />
              ) : lesson.id === "inheritance" ? (
                <GeneticsStudio
                  key={`${p.parent1}-${p.parent2}-${topicChapter}-${specimenSelection}`}
                  p={renderP}
                  chapter={topicChapter}
                />
              ) : lesson.id === "conservation" ? (
                <ConservationStudio p={p} onChange={change} />
              ) : lesson.id === "fractions" ? (
                <FractionsScene p={renderP} onChange={change} />
              ) : lesson.id === "pythagoras" ? (
                <PythagorasScene
                  key={topicChapter}
                  p={renderP}
                  onChange={change}
                  chapter={topicChapter}
                />
              ) : lesson.id === "linear" ? (
                <LinearScene
                  key={topicChapter}
                  p={renderP}
                  onChange={change}
                  chapter={topicChapter}
                />
              ) : ["waves", "buoyancy"].includes(lesson.id) ? (
                <VisualPhysicsScene
                  id={lesson.id}
                  p={renderP}
                  t={t}
                  onChange={change}
                />
              ) : lesson.id === "circle" ? (
                <CircleScene
                  p={renderP}
                  onChange={change}
                  chapter={topicChapter}
                />
              ) : lesson.id === "refraction" ? (
                <RefractionScene
                  p={renderP}
                  onChange={change}
                  chapter={topicChapter}
                />
              ) : lesson.id === "lever" ? (
                <LeverScene
                  p={renderP}
                  t={t}
                  onChange={change}
                  chapter={topicChapter}
                />
              ) : lesson.id === "projectile" ? (
                <ProjectileScene
                  p={renderP}
                  t={t}
                  onChange={change}
                  onSeek={(time) => {
                    setPlaying(false);
                    setT(time);
                  }}
                />
              ) : lesson.id === "functions" ? (
                <FunctionStudio
                  p={renderP}
                  onChange={change}
                  unitCircle={topicChapter === 8}
                  transformationGuide={topicChapter === 2}
                  mappingGuide={[1, 2, 6].includes(topicChapter)}
                  bisection={topicChapter === 9}
                  bisectionProgress={bisectionProgress}
                  onBisectionProgress={setBisectionProgress}
                />
              ) : (
                <SvgScene
                  id={lesson.id}
                  p={renderP}
                  t={t}
                  diagramOnly={lesson.id === "ohm"}
                />
              )}
              {lesson.id === "cell" && !isCellCloseup(view) && (
                <SecretoryGuide
                  key={transportRevision}
                  p={renderP}
                  onChange={change}
                />
              )}
              <AdvancedOverlay
                microChapter={microChapter}
                view={view}
                specimenSelection={specimenSelection}
                id={lesson.id}
                p={renderP}
                t={t}
                onChange={change}
                onSeek={(time) => {
                  setPlaying(false);
                  setT(time);
                }}
              />
              {lesson.id === "cube" && (
                <>
                  {" "}
                  {p.detail !== 2 && (
                    <CubeGuide p={renderP} onChange={change} />
                  )}{" "}
                  <CubeMeasureGuide p={renderP} onChange={change} />{" "}
                </>
              )}
              {lesson.id === "solids" && (
                <SolidsGuide
                  p={renderP}
                  t={t}
                  onChange={change}
                  chapter={topicChapter}
                />
              )}
              {lesson.id === "conics" && (
                <aside
                  className="conic-plot-host"
                  ref={setConicPlotHost}
                  aria-label="截线正视图"
                />
              )}
              <div className="stage-tools">
                {lesson.id === "biodiversity" && (
                  <div role="group" aria-label="样方清点辅助">
                    <button
                      className="btn"
                      onClick={() => {
                        setPlaying(false);
                        setView("top");
                      }}
                    >
                      俯视清点
                    </button>
                    <button
                      className="btn"
                      aria-pressed={p.groundDetails !== 0}
                      onClick={() =>
                        setP((old) => ({
                          ...old,
                          groundDetails: old.groundDetails === 0 ? 1 : 0,
                        }))
                      }
                    >
                      {p.groundDetails === 0 ? "显示地表细节" : "隐藏地表细节"}
                    </button>
                  </div>
                )}
                <div>
                  {lesson.id === "solubility" &&
                    [1, -1].map((direction) => (
                      <Button
                        key={direction}
                        primary={playing && thermalDirection === direction}
                        icon={
                          playing && thermalDirection === direction
                            ? Pause
                            : Play
                        }
                        disabled={direction > 0 ? p.temp >= 80 : p.temp <= 0}
                        onClick={() => {
                          setThermalDirection(direction);
                          setPlaying(
                            !(playing && thermalDirection === direction),
                          );
                        }}
                      >
                        {playing && thermalDirection === direction
                          ? "暂停"
                          : ""}
                        {direction > 0 ? "升温扫描" : "降温扫描"}
                      </Button>
                    ))}
                  {lesson.id === "cell" &&
                  [
                    "nucleus",
                    "vacuole",
                    "chloroplast",
                    "mitochondrion",
                    "golgi",
                    "reticulum",
                  ].includes(view) ? (
                    <Button
                      primary
                      title="返回细胞全景（Esc）；保留当前结构选择与实验记录"
                      onClick={returnToCell}
                    >
                      返回细胞全景
                    </Button>
                  ) : (
                    canPlay &&
                    !(lesson.id === "cell" && p.secretoryMode === 1) &&
                    !(lesson.id === "functions" && topicChapter === 9) && (
                      <>
                        <Button
                          primary
                          icon={playing ? Pause : Play}
                          onClick={play}
                          disabled={
                            lesson.id === "precipitation" && p.base <= 0
                          }
                        >
                          {playing
                            ? "暂停"
                            : lesson.id === "dilution"
                              ? p.add >= 300
                                ? "重新加水演示"
                                : "连续加水"
                              : lesson.id === "acid"
                                ? p.base >= 100
                                  ? "重新滴定演示"
                                  : "连续加碱"
                                : lesson.id === "capacitor"
                                  ? p.mode
                                    ? "开始放电"
                                    : "开始充电"
                                  : lesson.id === "precipitation"
                                    ? p.base <= 0
                                      ? "请先准备试剂"
                                      : t >= duration(lesson.id, p)
                                        ? "重新演示"
                                        : t >= 8
                                          ? "继续观察沉降"
                                          : t > 0
                                            ? "继续滴加"
                                            : "开始滴加"
                                    : lesson.id === "circle" &&
                                        topicChapter === 0
                                      ? "演示圆周展开"
                                      : lesson.id === "circle" &&
                                          topicChapter === 2
                                        ? "演示半径缩放"
                                        : lesson.id === "cube" && p.detail === 2
                                          ? "逐层填入小方块"
                                          : playLabels[lesson.id] || "播放"}
                        </Button>
                        <Button
                          icon={StepForward}
                          onClick={advance}
                          disabled={
                            (lesson.id === "acid" && p.base >= 100) ||
                            (lesson.id === "precipitation" && p.base <= 0)
                          }
                        >
                          {lesson.id === "dilution"
                            ? "加水 5 g"
                            : lesson.id === "acid"
                              ? "加碱 0.1 mL"
                              : timedIds.includes(lesson.id)
                                ? "前进 0.2 s"
                                : lesson.id === "projectile"
                                  ? "前进 0.1 s"
                                  : "单步"}
                        </Button>
                      </>
                    )
                  )}
                  <Button icon={RotateCcw} onClick={reset}>
                    复位
                  </Button>
                  {lesson.id === "cell" && !isCellCloseup(view) && (
                    <Button
                      aria-pressed={p.organelleCutaway === 1}
                      title="在原位置各展开一个叶绿体和线粒体；虚拟剖面仅用于结构对照"
                      onClick={() =>
                        change(
                          "organelleCutaway",
                          p.organelleCutaway === 1 ? 0 : 1,
                        )
                      }
                    >
                      {p.organelleCutaway === 1
                        ? "收起细胞器内部"
                        : "展开细胞器内部"}
                    </Button>
                  )}
                  {lesson.id === "cell" && (
                    <Button
                      aria-pressed={p.labels !== 0}
                      onClick={() => change("labels", p.labels === 0 ? 1 : 0)}
                    >
                      {p.labels === 0 ? "显示结构标注" : "隐藏结构标注"}
                    </Button>
                  )}
                </div>
                {use3d && lesson.id === "cell" && (
                  <CellViewControls
                    view={view}
                    angle={p.cellAngle ?? 0}
                    motion={p.cellMotion ?? 0}
                    onMotion={(motion) => change("cellMotion", motion)}
                    onPart={(part) => change("part", part)}
                    onAngle={(angle) => change("cellAngle", angle)}
                  />
                )}
                {use3d && lesson.id !== "cell" && (
                  <div className="view-switch" aria-label="相机视角">
                    {[
                      ["perspective", "立体"],
                      ["front", "正视"],
                      ["top", "俯视"],
                      ...(lesson.id === "cell"
                        ? [
                            ["nucleus", "细胞核近景"],
                            ["vacuole", "液泡近景"],
                            ["chloroplast", "叶绿体近景"],
                            ["mitochondrion", "线粒体近景"],
                            ["golgi", "高尔基体近景"],
                            ["reticulum", "内质网近景"],
                          ]
                        : []),
                      ...(lesson.id === "lens" ? [["screen", "观察光屏"]] : []),
                      ...(lesson.id === "dilution"
                        ? [
                            ["originalBalance", "原溶液称量"],
                            ["balance", "稀释后称量"],
                            ["valve", "供水阀近景"],
                          ]
                        : []),
                      ...(lesson.id === "earthquake"
                        ? [["station", "台站近景"]]
                        : []),
                      ...(lesson.id === "incline"
                        ? [["block", "跟随物块"]]
                        : []),
                      ...(lesson.id === "acid"
                        ? [
                            ["meniscus", "液面读数"],
                            ["stopcock", "旋塞近景"],
                            ["clamps", "夹具近景"],
                            ["readout", "读取 pH 仪表"],
                            ["electrode", "电极近景"],
                            ["surface", "观察滴落"],
                          ]
                        : []),
                      ...(lesson.id === "capacitor"
                        ? [
                            ["source", "电源近景"],
                            ["selector", "开关近景"],
                            ["plates", "极板近景"],
                          ]
                        : []),
                      ...(lesson.id === "biodiversity"
                        ? [
                            ["plant", "植物近景"],
                            ["fungus", "真菌近景"],
                            ["insect", "昆虫近景"],
                          ]
                        : []),
                      ...(lesson.id === "photosynthesis"
                        ? [
                            ["leaf", "叶片近景"],
                            ["lamp", "灯具近景"],
                            ["readout", "读取控制台"],
                          ]
                        : []),
                      ...(lesson.id === "conics"
                        ? [["conicUpper", "上锥面近景"]]
                        : []),
                      ...(lesson.id === "volcano"
                        ? [
                            ["volcanoCrater", "火山口近景"],
                            ["volcanoInterior", "通道剖面近景"],
                          ]
                        : []),
                      ...(lesson.id === "precipitation"
                        ? [
                            ["sediment", "沉淀近景"],
                            ["volumeReadout", "平视液面"],
                            ["dosing", "滴加器近景"],
                          ]
                        : []),
                      ...(lesson.id === "ohm"
                        ? Object.entries(circuitViews).map(([key, item]) => [
                            key,
                            item.label,
                          ])
                        : []),
                      ...(lesson.id === "solubility"
                        ? Object.entries(solubilityViews).map(([key, item]) => [
                            key,
                            item.label,
                          ])
                        : []),
                    ].map(([v, text]) => (
                      <button
                        key={v}
                        disabled={
                          lesson.id === "biodiversity" &&
                          ((v === "fungus" && p.fungi === 0) ||
                            (v === "insect" && p.insects === 0))
                        }
                        title={
                          lesson.id === "biodiversity" &&
                          v === "fungus" &&
                          p.fungi === 0
                            ? "当前没有真菌；增加真菌个体数后可观察近景"
                            : undefined
                        }
                        aria-pressed={
                          lesson.id === "cell" &&
                          [
                            "nucleus",
                            "vacuole",
                            "chloroplast",
                            "mitochondrion",
                            "golgi",
                            "reticulum",
                          ].includes(view) &&
                          ["perspective", "front", "top"].includes(v)
                            ? (p.cellAngle ?? 0) ===
                              ["perspective", "front", "top"].indexOf(v)
                            : view === v
                        }
                        onClick={() => {
                          if (lesson.id === "biodiversity" && v === "insect")
                            setPlaying(false);
                          if (
                            lesson.id === "cell" &&
                            [
                              "nucleus",
                              "vacuole",
                              "chloroplast",
                              "mitochondrion",
                              "golgi",
                              "reticulum",
                            ].includes(view) &&
                            ["perspective", "front", "top"].includes(v)
                          ) {
                            change(
                              "cellAngle",
                              ["perspective", "front", "top"].indexOf(v),
                            );
                            return;
                          }
                          const part = {
                            nucleus: 1,
                            vacuole: 2,
                            chloroplast: 3,
                            mitochondrion: 4,
                            golgi: 5,
                            reticulum: 6,
                          }[v];
                          if (lesson.id === "cell" && part)
                            change("part", part);
                          else {
                            if (
                              lesson.id === "volcano" &&
                              v === "volcanoInterior"
                            )
                              setP((old) => ({ ...old, cut: 1 }));
                            setView(v);
                          }
                        }}
                      >
                        {text}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {lesson.id === "biodiversity" && p.insects === 0 && (
                <p className="temperature-scan-note" role="status">
                  当前样方没有昆虫。增加右侧“昆虫示例种个体数”后，即可进入昆虫近景。
                </p>
              )}
              {lesson.id === "biodiversity" && p.fungi === 0 && (
                <p className="temperature-scan-note" role="status">
                  当前样方没有真菌。增加右侧“真菌示例种个体数”后，即可进入真菌近景。
                </p>
              )}
              {lesson.id === "solubility" && (
                <p className="temperature-scan-note">
                  温度扫描：4°C/s ·
                  连续展示各温度下的平衡状态，不代表真实加热或冷却速度。
                </p>
              )}
              {lesson.id === "acid" && (
                <div
                  className="titration-flow-controls"
                  role="group"
                  aria-label="教学滴加速度"
                >
                  <span>滴加速度</span>
                  {[
                    [0.1, "慢速"],
                    [0.5, "常速"],
                    [1, "快速"],
                  ].map(([value, label]) => (
                    <button
                      key={value}
                      aria-pressed={titrationFlowRate(p.doseRate) === value}
                      onClick={() =>
                        setP((old) => ({ ...old, doseRate: value }))
                      }
                    >
                      {label} <small>{value} mL/s</small>
                    </button>
                  ))}
                  <span>接近中和点时用慢速，或逐次加碱 0.1 mL。</span>
                </div>
              )}
              {lesson.id === "acid" && (
                <p className="temperature-scan-note">
                  教学滴加：{titrationFlowRate(p.doseRate)} mL/s ·
                  液滴为过程示意，大小与滴数不代表校准体积；pH
                  按充分混合后的理想状态计算。
                </p>
              )}
              {((timedIds.includes(lesson.id) &&
                !(lesson.id === "functions" && topicChapter === 9) &&
                (lesson.id !== "microscope" || p.specimen === 2)) ||
                lesson.id === "projectile") && (
                <div className="simulation-timeline">
                  <label>
                    <span>
                      {[
                        "volcano",
                        "biodiversity",
                        "precipitation",
                        "microscope",
                        "solids",
                        "functions",
                      ].includes(lesson.id)
                        ? "演示时间"
                        : "实验时间"}{" "}
                      <b>{t.toFixed(1)} s</b>
                    </span>
                    <input
                      aria-label="实验时间轴"
                      type="range"
                      min="0"
                      max={
                        lesson.id === "projectile"
                          ? projectile(p, 0).flight
                          : duration(lesson.id, p)
                      }
                      disabled={
                        lesson.id === "projectile" &&
                        projectile(p, 0).flight === 0
                      }
                      step={
                        lesson.id === "projectile"
                          ? "any"
                          : lesson.id === "waves"
                            ? 1 / 24
                            : "0.05"
                      }
                      value={t}
                      onChange={(e) => {
                        setPlaying(false);
                        const time = Number(e.target.value);
                        setT(time);
                        if (lesson.id === "solids")
                          setP((old) => ({ ...old, slice: time * 5 }));
                        if (lesson.id === "functions")
                          setP((old) => ({ ...old, probe: -5 + time * 0.5 }));
                      }}
                    />
                  </label>
                  <div aria-label="播放速度">
                    {[0.5, 1, 2].map((speed) => (
                      <button
                        key={speed}
                        aria-pressed={rate === speed}
                        onClick={() => setRate(speed)}
                      >
                        {speed}×
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            {lesson.id === "conics" && (
              <ConicGuide
                p={renderP}
                onChange={change}
                plotHost={conicPlotHost}
              />
            )}
            {lesson.id === "incline" && (
              <InclineGuide
                p={renderP}
                t={t}
                decomposition={topicChapter === 0}
                onSeek={(time) => {
                  setPlaying(false);
                  setT(time);
                }}
              />
            )}
            {lesson.id === "incline" && topicChapter === 2 && (
              <InclineMassStudy
                p={renderP}
                t={t}
                onMass={(mass) => change("mass", mass)}
              />
            )}
            {lesson.id === "water" &&
              (topicChapter === 8 ? (
                <RunoffStorageStudy
                  key={`runoff-${topicChapter}-${specimenSelection}`}
                  p={renderP}
                />
              ) : topicChapter >= 5 ? (
                <SurfaceWaterStudy
                  p={renderP}
                  chapter={topicChapter}
                  onChange={change}
                />
              ) : (
                <RainVolumeStudy p={renderP} />
              ))}
            {lesson.id === "precipitation" && (
              <PrecipitationGuide
                p={renderP}
                t={t}
                onChange={(key, value) =>
                  setP((old) => ({ ...old, [key]: value }))
                }
                onSeek={(time) => {
                  setPlaying(false);
                  setT(time);
                }}
              />
            )}
            {lesson.id === "cell" && topicChapter === 3 && (
              <CellEnergyCompare
                part={p.part}
                onSelect={(part) => change("part", part)}
              />
            )}
            {lesson.id === "cell" && (
              <CellRecognition
                key={`cell-recognition-${specimenSelection}`}
                part={p.part}
                onSelect={(part) => change("part", part)}
              />
            )}
            {lesson.id === "earthquake" && topicChapter === 1 && (
              <SeismicMotion
                key={`seismic-motion-${specimenSelection}`}
                time={t}
                onSeek={(time) => {
                  setPlaying(false);
                  setT(time);
                }}
              />
            )}
            {lesson.id === "fractions" && (
              <FractionComparison
                key={`${topicChapter}-${specimenSelection}`}
                p={renderP}
              />
            )}
            {lesson.id === "plates" && (
              <PlateStrainExplorer key={topicChapter} p={renderP} />
            )}
            {lesson.id === "earthquake" && topicChapter > 0 && (
              <SeismicArrival
                p={renderP}
                time={t}
                onSeek={(time) => {
                  setPlaying(false);
                  setT(time);
                }}
              />
            )}
            {lesson.id === "earthquake" && topicChapter === 5 && (
              <SeismicLocation
                key={`seismic-location-${specimenSelection}`}
                p={renderP}
                time={t}
                onSeek={(time) => {
                  setPlaying(false);
                  setT(time);
                }}
              />
            )}
            {lesson.id === "molecule" && topicChapter === 4 && (
              <MoleculeProjection p={renderP} />
            )}
            {lesson.id === "photosynthesis" && (
              <PhotoResponsePlot
                key={`${topicChapter}-${specimenSelection}`}
                p={renderP}
                chapter={topicChapter}
                onChange={change}
              />
            )}
            {lesson.id === "biodiversity" && (
              <CommunityComparison
                key={`${topicChapter}-${specimenSelection}`}
                p={renderP}
              />
            )}
            {lesson.id === "daynight" && (
              <DaylightObserver
                p={renderP}
                onChange={change}
                chapter={topicChapter}
              />
            )}
            {lesson.id === "seasons" && (
              <SeasonCalendar
                p={renderP}
                onChange={change}
                chapter={topicChapter}
              />
            )}
            {lesson.id === "water" && (
              <WaterBudgetGuide
                key={`${topicChapter}-${specimenSelection}`}
                p={renderP}
                onChange={change}
              />
            )}
            {lesson.id === "capacitor" && (
              <RCGuide
                p={renderP}
                t={t}
                onChange={change}
                chapter={topicChapter}
                onSeek={(time) => {
                  setPlaying(false);
                  setT(time);
                }}
              />
            )}
            {presets[lesson.id] && !chapters && (
              <div className="experiment-presets">
                <span>实验情境</span>
                {presets[lesson.id].map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => {
                      setPlaying(false);
                      setP((old) => ({ ...old, ...preset.p }));
                      setT(0);
                      setStatus(
                        `已切换为${preset.name}，${timedIds.includes(lesson.id) ? "点击播放观察过程" : "调整参数或操作教具，观察变化"}。`,
                      );
                    }}
                  >
                    {preset.name}
                  </button>
                ))}
              </div>
            )}
            {!(lesson.id === "functions" && topicChapter === 9) && (
              <div className="readouts" aria-label="实时计算结果">
                {renderValues.map((v) => (
                  <div key={v.label}>
                    <span>{v.label}</span>
                    <strong>
                      {lesson.id === "ohm" && p.digital === 0
                        ? "待核对"
                        : format(v.value, v.digits)}
                      <small>
                        {lesson.id === "ohm" && p.digital === 0
                          ? ""
                          : typeof v.value === "number"
                            ? v.unit
                            : ""}
                      </small>
                    </strong>
                  </div>
                ))}
              </div>
            )}
            {lesson.id === "dilution" && dilutionChapter > 0 && (
              <DilutionPlot p={renderP} onChange={change} />
            )}
            {lesson.id === "solubility" && solubilityChapter > 0 && (
              <SolubilityPlot p={renderP} onChange={change} />
            )}
            {lesson.id === "acid" && acidChapter >= 3 && (
              <IndicatorStudy p={renderP} onPrepare={prepareMicroChapter} />
            )}
            <div className="inquiry">
              <div className="inquiry-tabs">
                {["观察现象", "改变变量", "记录与解释"].map((s, i) => (
                  <button
                    key={s}
                    className={step === i ? "active" : ""}
                    onClick={() => setStep(i)}
                  >
                    <small>0{i + 1}</small>
                    {s}
                  </button>
                ))}
              </div>
              {step === 0 ? (
                <div className="inquiry-content">
                  <Eye size={22} />
                  <InquiryPrompt
                    key={`${lesson.id}-${inquiryChapter}`}
                    question={inquiry.question}
                    explanation={inquiry.explanation}
                  />
                </div>
              ) : step === 1 ? (
                <div className="inquiry-content">
                  <FlaskConical size={22} />
                  <div>
                    <h3>每次只改变一个变量</h3>
                    <p>
                      先记录初始状态，再调整右侧参数。比较改变前后的现象和数值，其他条件保持不变。
                    </p>
                    <p className="formula">{lesson.formula}</p>
                    <Button icon={Plus} onClick={record}>
                      记录当前状态
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="records">
                  {lesson.id === "ohm" && p.digital === 0 ? (
                    <p>
                      正在练习估读。显示数字核对后，可以查看和导出实验记录。
                    </p>
                  ) : (
                    <>
                      <div className="records-head">
                        <p>
                          {records.length
                            ? `已记录 ${records.length} 组 · 当前设备`
                            : "还没有实验记录"}
                        </p>
                        <Button
                          icon={Download}
                          disabled={!records.length}
                          onClick={download}
                        >
                          导出 CSV
                        </Button>
                        <details className="record-clear">
                          <summary>管理记录</summary>
                          <p>清空只影响当前主题。请先导出需要保留的记录。</p>
                          <Button
                            disabled={!records.length}
                            onClick={() => {
                              setRecords([]);
                              setStatus(
                                "已清空当前主题的实验记录，参数保持不变。",
                              );
                            }}
                          >
                            确认清空当前主题记录
                          </Button>
                        </details>
                      </div>
                      {lesson.id === "ohm" && <OhmDataPlot records={records} />}
                      {records.length ? (
                        <div className="record-scroll">
                          <table>
                            <thead>
                              <tr>
                                <th>序号</th>
                                <th>实验条件</th>
                                {renderValues.map((v) => (
                                  <th key={v.label}>
                                    {v.label}
                                    {v.unit && ` (${v.unit})`}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {records.map((r) => (
                                <tr key={r.number}>
                                  <td>{r.number}</td>
                                  <td>
                                    {lesson.params
                                      .filter(
                                        (v) =>
                                          lesson.id !== "ohm" ||
                                          !["digital", "trace"].includes(v.key),
                                      )
                                      .map(
                                        (v) =>
                                          `${v.label} ${recordedParameter(v, r.parameters[v.key], choices[`${lesson.id}.${v.key}`])}`,
                                      )
                                      .join(" · ")}
                                  </td>
                                  {r.values.map((v) => (
                                    <td key={v.label}>
                                      {format(v.value, v.digits)}
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <p>
                          点击“记录当前状态”，保存参数与对应结果。切换实验、准备情境和复位均保留记录；需要备份时可导出
                          CSV。
                        </p>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
          <aside className="control-panel">
            <div className="panel-title">
              <span>
                <Layers3 size={18} /> {panelHeading(lesson.subject)}
              </span>
              <small>调整 · 观察</small>
            </div>
            {lesson.id === "microscope" && (
              <MicroscopeGuide
                onRestart={() =>
                  restartInstrumentChapter(microscopeChapters[microChapter])
                }
                chapter={microChapter}
                p={renderP}
                onSelect={selectMicroChapter}
                onPrepare={prepareMicroChapter}
              />
            )}
            {lesson.id === "lens" && (
              <LensGuide
                onRestart={() =>
                  restartInstrumentChapter(lensChapters[lensChapter])
                }
                view={view}
                screenControl={lesson.params.find(
                  (param) => param.key === "screen",
                )}
                chapter={lensChapter}
                p={renderP}
                onSelect={selectLensChapter}
                onPrepare={prepareMicroChapter}
              />
            )}
            {lesson.id === "ohm" && (
              <OhmGuide
                onRestart={() =>
                  restartInstrumentChapter(ohmChapters[ohmChapter])
                }
                chapter={ohmChapter}
                p={renderP}
                onSelect={selectOhmChapter}
                onPrepare={prepareMicroChapter}
              />
            )}
            {lesson.id === "dilution" && (
              <DilutionGuide
                onRestart={() =>
                  restartInstrumentChapter(dilutionChapters[dilutionChapter])
                }
                chapter={dilutionChapter}
                p={renderP}
                onSelect={(index) =>
                  selectSimpleChapter(setDilutionChapter, index)
                }
                onPrepare={prepareMicroChapter}
              />
            )}
            {lesson.id === "solubility" && (
              <SolubilityGuide
                onRestart={() =>
                  restartInstrumentChapter(
                    solubilityChapters[solubilityChapter],
                  )
                }
                chapter={solubilityChapter}
                p={renderP}
                onSelect={(index) =>
                  selectSimpleChapter(setSolubilityChapter, index)
                }
                onPrepare={prepareMicroChapter}
              />
            )}
            {lesson.id === "acid" && (
              <AcidGuide
                onRestart={() =>
                  restartInstrumentChapter(acidChapters[acidChapter])
                }
                chapter={acidChapter}
                p={renderP}
                onSelect={(index) => selectSimpleChapter(setAcidChapter, index)}
                onPrepare={prepareMicroChapter}
              />
            )}
            {chapters && (
              <TopicGuide
                lesson={lesson}
                chapters={chapters}
                chapter={topicChapter}
                p={renderP}
                time={t}
                onSelect={selectTopicChapter}
                onApply={applyTopicScenario}
              />
            )}
            <Controls
              lesson={lesson}
              p={renderP}
              change={change}
              keys={activeKeys}
            />
            <GeologyConnections
              id={lesson.id}
              onOpen={open}
              onInspect={() => setPlaying(false)}
            />
            {lesson.id === "molecule" && (
              <MoleculeGuide p={renderP} chapter={topicChapter} />
            )}
            {lesson.id === "earthquake" && [2, 4].includes(topicChapter) && (
              <SeismicDistanceGuide p={renderP} onChange={change} />
            )}
            {lesson.id === "acid" && (
              <TitrationCurve p={renderP} onPrepare={prepareMicroChapter} />
            )}
            {lesson.id === "cell" && view === "nucleus" && (
              <section className="micro-task" aria-label="细胞核结构说明">
                <strong>对照引线，辨认四种结构</strong>
                <p>
                  核膜由内、外两层膜组成，剖切边缘可见两层轮廓；核孔是核与细胞质之间选择性物质交换的通道。
                </p>
                <p>
                  孔缘的八重重复轮廓示意核孔复合体的环状组织，不代表只有八个蛋白质。中央通道在此简化为空，未画出选择性运输屏障。
                </p>
                <p>
                  染色质主要由 DNA 和蛋白质组成；核仁参与核糖体 RNA
                  的合成与核糖体亚基的组装。
                </p>
                <p className="topic-hint">
                  这里展示间期细胞核的剖面示意。膜间距、纤维与孔缘适当放大，颜色用于辨认结构，不是显微照片的真实颜色。
                </p>
              </section>
            )}
            {extraKeys.length > 0 && (
              <details
                className="extra-controls"
                key={`${lesson.id}-${activeKeys.join("-")}`}
              >
                <summary>更多设置 · {extraKeys.length} 项</summary>
                <Controls
                  lesson={lesson}
                  p={renderP}
                  change={change}
                  keys={extraKeys}
                />
              </details>
            )}
            {lesson.id === "contour" && (
              <div className="terrain-analysis">
                <section
                  className="terrain-map-panel"
                  aria-label="同步等高线地形图"
                >
                  <div className="terrain-map-heading">
                    <h3>同步等高线地形图</h3>
                    <button
                      onClick={() =>
                        setView(view === "top" ? "perspective" : "top")
                      }
                      aria-pressed={view === "top"}
                    >
                      {view === "top" ? "返回立体" : "俯视对照"}
                    </button>
                  </div>
                  <ContourMap p={renderP} />
                </section>
                <TerrainProfile p={renderP} />
              </div>
            )}
            <div className="equation">
              <span>规律与关系</span>
              <p>{lesson.formula}</p>
            </div>
            <Button primary icon={Plus} onClick={record}>
              记录当前状态
            </Button>
            <div className="status" role="status">
              {status && (
                <>
                  <Check size={14} />
                  {status}
                </>
              )}
            </div>
            <p className="local-save-note">
              {storageOk
                ? "参数和记录自动保存在此浏览器，最多 200 组；尚未同步到云端。"
                : "此浏览器暂不能保存。离开前请导出实验记录。"}
            </p>
            <details className="model-note" open>
              <summary>模型假设与边界</summary>
              <p>{lesson.assumption}</p>
            </details>
          </aside>
        </div>
      </main>
    </div>
  );
}
