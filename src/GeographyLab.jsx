import { MobileChapterPicker } from "./MobileLearning.jsx";
import ContourQuiz from "./ContourQuiz.jsx";
import { TopicPicker } from "./TopicLearning.jsx";
import { lessons } from "./lessons.mjs";
import {
  CONTOUR_DEFAULTS,
  readContourSession,
  saveContourSession,
  freshContourSession,
} from "./contourSession.mjs";
import { scanLevel } from "./contourAnimation.mjs";
import { HEIGHT_BANDS, SLOPE_BANDS } from "./terrainDisplay.mjs";
import React, { useEffect, useState, useRef } from "react";
import SceneLoader from "./SceneLoader.jsx";
import { ContourMap } from "./SvgScene.jsx";
import TerrainProfile from "./TerrainProfile.jsx";
import "./GeographyLab.css";
const chapters = [
  [
    "认识等高线地形图",
    "OVERVIEW",
    "等高线连接海拔相同的地点。把立体地形投影到平面，就能通过线的形状、疏密和数值读懂山地。",
    "先旋转观察山体，再切换俯视，对照左下角的等高线图。",
    "perspective",
  ],
  [
    "等高线的形成",
    "HOW CONTOURS FORM",
    "用水平面截取山体，交线上的每一点都具有相同海拔。把不同高度的交线投影到同一平面，就得到等高线地形图。",
    "拖动截取高度，观察浅蓝色水平面与亮色交线如何变化。",
    "perspective",
  ],
  [
    "海拔与相对高度",
    "ELEVATION",
    "海拔以平均海平面为基准；相对高度是两点海拔之差。图中的高程数值由同一地形网格计算。",
    "点击地表选取 P1、P2 两点，比较海拔与相对高度；金色为 P1，蓝色为 P2。",
    "perspective",
  ],
  [
    "等高距与坡度",
    "INTERVAL & SLOPE",
    "等高距是相邻两条等高线的高度差。同一比例尺、同一等高距下，线越密，坡越陡；线越疏，坡越缓。",
    "比较 50、100、200 米等高距；换等高距不会改变山体本身。",
    "top",
  ],
  [
    "山顶与盆地",
    "SUMMIT & BASIN",
    "闭合等高线内部数值增大，表示山顶；内部数值减小，表示洼地。不能仅凭闭合形状判断。",
    "观察西南侧闭合盆地，再与主峰对比。盆地等高线向内部降低；主河道中的湖泊仍属于谷地，不等同于这处盆地。",
    "top",
  ],
  [
    "山脊与山谷",
    "RIDGE & VALLEY",
    "山谷等高线通常向高处凸出，山脊等高线通常向低处凸出。河流沿谷地从高处流向低处。",
    "沿蓝色河流由上游向下游观察，比较两侧等高线的弯曲方向。",
    "top",
  ],
  [
    "鞍部与陡坡",
    "SADDLE & STEEP SLOPE",
    "鞍部位于相邻山顶之间；陡坡处等高线密集。真实陡崖可能出现等高线重合，但本模型是单值高程网格，不表示悬崖倒悬。",
    "切换正视和立体视图，对比峰间低处与岩壁陡坡。",
    "front",
  ],
  [
    "地形剖面图",
    "TOPOGRAPHIC PROFILE",
    "沿 A—B 取地形高程，按行进顺序连成剖面。青色线、平面图和剖面图使用相同采样位置。",
    "旋转和平移剖面线，观察 A 到 B 的起伏。剖面图纵横尺度不同。",
    "perspective",
  ],
  [
    "随堂检测",
    "CHECK YOUR UNDERSTANDING",
    "用 6 道题检验等高距、坡度、地形判读与相对高度。可以点击“观察对应地形”辅助判断。",
    "可以切换视图或隐藏植被，再选择答案。",
    "top",
  ],
];
export default function GeographyLab({ goHome, open }) {
  const [initial] = useState(() => {
    try {
      return readContourSession(localStorage);
    } catch {
      return freshContourSession();
    }
  });
  const [chapter, setChapter] = useState(initial.chapter),
    [p, setP] = useState(initial.p),
    [view, setView] = useState(initial.view),
    [map, setMap] = useState(initial.map),
    [mapExpanded, setMapExpanded] = useState(false),
    [settingsOpen, setSettingsOpen] = useState(initial.chapter < 7),
    [playing, setPlaying] = useState(false),
    [speed, setSpeed] = useState(initial.speed),
    [storageOk, setStorageOk] = useState(true);
  const session = useRef(null);
  session.current = { chapter, p, view, map, speed };
  function persist() {
    try {
      return saveContourSession(session.current, localStorage);
    } catch {
      return false;
    }
  }
  useEffect(() => {
    const timer = setTimeout(() => setStorageOk(persist()), 450);
    return () => clearTimeout(timer);
  }, [chapter, p, view, map, speed]);
  useEffect(() => {
    const flush = () => persist();
    window.addEventListener("pagehide", flush);
    return () => {
      window.removeEventListener("pagehide", flush);
      flush();
    };
  }, []);
  const reading = useRef(null),
    chapterList = useRef(null);
  useEffect(() => {
    chapterList.current
      ?.querySelector('[aria-current="step"]')
      ?.scrollIntoView({ block: "nearest", inline: "nearest" });
  }, [chapter]);
  const c = chapters[chapter];
  const change = (key, value) =>
    setP((old) =>
      key === "probe"
        ? {
            ...old,
            probes: old.probes.length === 2 ? [value] : [...old.probes, value],
          }
        : { ...old, [key]: value },
    );
  function select(i) {
    i = Math.max(0, Math.min(chapters.length - 1, i));
    setPlaying(false);
    if (reading.current) reading.current.scrollTop = 0;
    setChapter(i);
    setSettingsOpen(i < 7);
    setView(chapters[i][4]);
    setP((old) => ({
      ...old,
      slice: i === 1,
      profile: i === 7,
      measure: i === 2,
      flow: i === 5,
      surfaceMode:
        i === 3 || i === 6 ? "slope" : i === 4 ? "height" : "realistic",
      contours: true,
      ...(i === 1 ? { level: 600 } : {}),
      ...(i === 5 ? { water: true } : {}),
    }));
  }
  useEffect(() => {
    const key = (e) => {
      if (/INPUT|SELECT|TEXTAREA/.test(e.target.tagName)) return;
      if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        e.preventDefault();
        select(chapter + (e.key === "ArrowRight" ? 1 : -1));
      }
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [chapter]);
  useEffect(() => {
    if (!playing) return;
    const start = p.level,
      started = performance.now();
    const timer = setInterval(() => {
      const level = scanLevel(start, performance.now() - started, speed);
      setP((old) => (old.level === level ? old : { ...old, level }));
      if (level === 2400) setPlaying(false);
    }, 125);
    const hide = () => {
      if (document.hidden) setPlaying(false);
    };
    document.addEventListener("visibilitychange", hide);
    return () => {
      clearInterval(timer);
      document.removeEventListener("visibilitychange", hide);
    };
    // Capture the starting height once; subsequent ticks update only the level.
  }, [playing, speed]);
  return (
    <main className="geo-workspace">
      <nav
        className="geo-chapters"
        ref={chapterList}
        aria-label="等高线学习章节"
      >
        <button className="geo-home" onClick={goHome}>
          ← 知境 · 探索馆
        </button>
        {open && (
          <TopicPicker
            lesson={lessons.find((item) => item.id === "contour")}
            lessons={lessons}
            onSelect={open}
          />
        )}
        <ThemeSwitch />
        <p className="geo-eyebrow">CHAPTERS · 章节</p>
        <MobileChapterPicker
          chapters={chapters}
          chapter={chapter}
          onSelect={select}
        />
        {chapters.map((item, i) => (
          <button
            key={item[0]}
            className="geo-chapter"
            aria-current={chapter === i ? "step" : undefined}
            onClick={() => select(i)}
          >
            <span>{String(i).padStart(2, "0")}</span>
            <div>
              {item[0]}
              <small>{item[1]}</small>
            </div>
          </button>
        ))}
        <div className="geo-session">
          <button
            onClick={() => {
              setView("perspective");
              change("resetView", (p.resetView ?? 0) + 1);
            }}
          >
            复位视角
          </button>
          <button
            onClick={() => {
              setPlaying(false);
              setChapter(0);
              setP({
                ...CONTOUR_DEFAULTS,
                probes: [],
                resetView: (p.resetView ?? 0) + 1,
              });
              setView("perspective");
              setMap(true);
              setSpeed(200);
              if (reading.current) reading.current.scrollTop = 0;
            }}
          >
            重置本主题
          </button>
          <p role="status">
            {storageOk
              ? "章节与显示设置保存在此浏览器；测量点和动画不恢复。"
              : "当前浏览器无法保存，刷新后设置会丢失。"}
          </p>
        </div>
        <p className="geo-shortcut">
          ← → 切换章节
          <br />
          拖动旋转 · 滚轮缩放
        </p>
      </nav>
      <section className="geo-stage" aria-label="地形观察工作区">
        <header className="geo-title">
          <p className="geo-eyebrow">
            CHAPTER {String(chapter).padStart(2, "0")} / 08
          </p>
          <h1>{c[0]}</h1>
          <span>{c[1]}</span>
        </header>
        <SceneLoader id="contour" p={p} view={view} onChange={change} />
        <div className="geo-views" role="group" aria-label="地形视图">
          {[
            ["perspective", "立体"],
            ["top", "俯视"],
            ["front", "正视"],
          ].map(([id, label]) => (
            <button
              key={id}
              aria-pressed={view === id}
              onClick={() => setView(id)}
            >
              {label}
            </button>
          ))}
        </div>
        {p.contours && (
          <div className="geo-level-chip">
            高亮等高线 <strong>{p.level} m</strong>
          </div>
        )}
        {map && (
          <aside className={"geo-map" + (mapExpanded ? " expanded" : "")}>
            <header>
              等高线地形图{" "}
              <button
                aria-label={mapExpanded ? "收起平面图" : "放大平面图"}
                aria-expanded={mapExpanded}
                onClick={() => setMapExpanded(!mapExpanded)}
              >
                {mapExpanded ? "收起 ↙" : "放大 ↗"}
              </button>
            </header>
            <ContourMap
              p={p}
              onSectionChange={(value) => change("section", value)}
            />
          </aside>
        )}
        {p.surfaceMode !== "realistic" && (
          <aside className="geo-surface-legend" aria-label="地表颜色图例">
            <strong>
              {p.surfaceMode === "height" ? "海拔 / m" : "坡度 / °"}
            </strong>
            <div>
              {(p.surfaceMode === "height" ? HEIGHT_BANDS : SLOPE_BANDS).map(
                (b) => (
                  <span key={b.label}>
                    <i style={{ background: b.color }} />
                    {b.label}
                  </span>
                ),
              )}
            </div>
            <p>
              {p.surfaceMode === "height"
                ? "颜色按高程分带，不改变地形。"
                : "按网格面计算；水平与垂直均按 980 m / 模型单位换算。"}
            </p>
            <p>可关闭植被，完整观察地表颜色。</p>
          </aside>
        )}
        <div className="geo-scale-note">
          {p.flow && p.water
            ? "箭头表示河道流向 · 演示速度非真实流速"
            : "虚拟教学地形 · 高程单位 m · 植被尺寸为示意"}
        </div>
      </section>
      <aside className="geo-panel" aria-label="知识讲解与设置">
        <div className="geo-reading" ref={reading}>
          <p className="geo-eyebrow">
            {String(chapter).padStart(2, "0")} / FIELD NOTES
          </p>
          <h2>{c[0]}</h2>
          <p>{c[2]}</p>
          {chapter === 1 && (
            <section className="geo-scan" aria-label="水平截面演示">
              <div>
                <button
                  aria-pressed={playing}
                  onClick={() => {
                    if (!playing && p.level >= 2400) change("level", 100);
                    change("slice", true);
                    setPlaying(!playing);
                  }}
                >
                  {playing ? "暂停扫描" : "播放扫描"}
                </button>
                <button
                  onClick={() => {
                    setPlaying(false);
                    change("level", 100);
                  }}
                >
                  回到起点
                </button>
              </div>
              <label>
                演示速度{" "}
                <select
                  aria-label="截面演示速度"
                  value={speed}
                  onChange={(e) => setSpeed(+e.target.value)}
                >
                  <option value="100">慢速</option>
                  <option value="200">标准</option>
                  <option value="400">快速</option>
                </select>
              </label>
              <p>
                {p.level >= 2400
                  ? "已超过山峰：截面与地形没有交线。"
                  : "浅蓝色面是几何截面；亮线上的各点海拔相同。"}
              </p>
              <p>手动调节或离开本章会暂停。演示速度不表示真实水位变化。</p>
            </section>
          )}
          <div className="geo-instruction">
            <span>观察任务</span>
            <p>{c[3]}</p>
          </div>
          {[1, 2].includes(chapter) && (
            <label className="geo-range">
              截取海拔 <output>{p.level} m</output>
              <input
                aria-label="截取海拔"
                type="range"
                min="100"
                max="2400"
                step="10"
                value={p.level}
                onChange={(e) => {
                  setPlaying(false);
                  change("level", +e.target.value);
                }}
              />
            </label>
          )}
          {chapter === 4 && (
            <div className="geo-scan">
              <div>
                <button
                  aria-pressed={view === "basin"}
                  onClick={() => {
                    setView("basin");
                    change("trees", false);
                    change("interval", 50);
                    change("level", 300);
                  }}
                >
                  近看盆地
                </button>
                <button
                  onClick={() => {
                    setView("perspective");
                    change("trees", true);
                  }}
                >
                  全景对照
                </button>
              </div>
              <p>近看会隐藏植被，并使用 50 m 等高距。盆地不与主河道连通。</p>
            </div>
          )}
          {chapter === 7 && (
            <>
              <label className="geo-range">
                平移剖面线<output>{p.section}%</output>
                <input
                  aria-label="剖面位置"
                  type="range"
                  min="0"
                  max="100"
                  value={p.section}
                  onChange={(e) => change("section", +e.target.value)}
                />
              </label>
              <label className="geo-range">
                剖面方向<output>{p.sectionAngle ?? 0}°</output>
                <input
                  aria-label="剖面方向"
                  type="range"
                  min="0"
                  max="90"
                  step="5"
                  value={p.sectionAngle ?? 0}
                  onChange={(e) => change("sectionAngle", +e.target.value)}
                />
              </label>
              <p>
                0° 西—东 · 45° 西北—东南 · 90° 北—南。拖动左下地图可平移剖面线。
              </p>
              <TerrainProfile p={p} />
            </>
          )}
          {chapter === 8 && (
            <ContourQuiz
              onObserve={(nextView) => {
                setView(nextView);
                change("trees", false);
                change("contours", true);
                change("resetView", (p.resetView ?? 0) + 1);
              }}
            />
          )}
          {(chapter === 2 || p.probes.length > 0) && (
            <>
              <section className="geo-measure" aria-label="两点高程测量">
                <button
                  aria-pressed={p.measure}
                  onClick={() => change("measure", !p.measure)}
                >
                  {p.measure ? "● 测量已开启" : "开启两点测量"}
                </button>
                <p>
                  开启后依次点击地表选取
                  P1、P2；再次点击开始新一组。水域读数为水下地形高程。
                </p>
                <div aria-live="polite">
                  {p.probes.map((point, i) => (
                    <p key={i}>
                      {i === 0 ? "P1" : "P2"} 点海拔{" "}
                      <strong>{point.h.toFixed(1)} m</strong>
                      <br />
                      局部坡度 <strong>{point.slope.toFixed(1)}°</strong>
                    </p>
                  ))}
                  {p.probes.length === 2 && (
                    <p>
                      相对高度{" "}
                      <strong>
                        {Math.abs(p.probes[1].h - p.probes[0].h).toFixed(1)} m
                      </strong>
                    </p>
                  )}
                </div>
                {!!p.probes.length && (
                  <button onClick={() => change("probes", [])}>清除测量</button>
                )}
              </section>
            </>
          )}
          <div className="geo-step">
            <button
              disabled={chapter === 0}
              onClick={() => select(chapter - 1)}
            >
              ← 上一节
            </button>
            <button
              disabled={chapter === 8}
              onClick={() => select(chapter + 1)}
            >
              下一节 →
            </button>
          </div>
        </div>
        <section className="geo-settings" aria-label="地形显示设置">
          <button
            className="geo-settings-toggle"
            aria-expanded={settingsOpen}
            aria-controls="terrain-display-options"
            onClick={() => setSettingsOpen(!settingsOpen)}
          >
            <span>VIEW · 显示设置</span>
            <span>{settingsOpen ? "收起 −" : "展开 +"}</span>
          </button>
          {!settingsOpen && (
            <p className="geo-settings-summary">
              {p.quality === "fluent" ? "流畅模式" : "精细模式"} · 等高距{" "}
              {p.interval} m ·{" "}
              {[p.trees && "植被", p.water && "河湖", p.contours && "等高线"]
                .filter(Boolean)
                .join(" / ") || "地形"}
            </p>
          )}
          <div
            id="terrain-display-options"
            className="geo-settings-body"
            hidden={!settingsOpen}
          >
            <label>
              地表模式{" "}
              <select
                aria-label="地表模式"
                value={p.surfaceMode}
                onChange={(e) => change("surfaceMode", e.target.value)}
              >
                <option value="realistic">实景材质</option>
                <option value="height">分层设色</option>
                <option value="slope">坡度分布</option>
              </select>
            </label>

            <label>
              等高距{" "}
              <select
                aria-label="等高距"
                value={p.interval}
                onChange={(e) => change("interval", +e.target.value)}
              >
                {[50, 100, 200].map((n) => (
                  <option key={n} value={n}>
                    {n} m
                  </option>
                ))}
              </select>
            </label>
            <label>
              渲染质量{" "}
              <select
                aria-label="渲染质量"
                value={p.quality}
                onChange={(e) => change("quality", e.target.value)}
              >
                <option value="fluent">流畅 · 推荐老电脑</option>
                <option value="detail">精细 · 树冠与阴影</option>
              </select>
            </label>
            {p.projection && (
              <label className="geo-range">
                投影展开距离{" "}
                <input
                  aria-label="投影展开距离"
                  type="range"
                  min=".2"
                  max="1.6"
                  step=".1"
                  value={p.projectionGap}
                  onChange={(e) => change("projectionGap", +e.target.value)}
                />
              </label>
            )}
            <div className="geo-toggles">
              {[
                ["contours", "等高线"],
                ["labels", "高程标注"],
                ["trees", "植被"],
                ["water", "河流湖泊"],
                ["flow", "流向示意"],
                ["rocks", "岩石"],
                ["slice", "截取平面"],
                ["profile", "剖面线"],
                ["projection", "投影底图"],
              ].map(([key, label]) => (
                <button
                  key={key}
                  aria-pressed={p[key]}
                  onClick={() => change(key, !p[key])}
                >
                  {label}
                  <span>{p[key] ? "●" : "○"}</span>
                </button>
              ))}
              <button aria-pressed={map} onClick={() => setMap(!map)}>
                平面图 <span>{map ? "●" : "○"}</span>
              </button>
            </div>
            <p className="geo-performance">
              关闭动态演示后按需绘制。精细模式随观察距离切换树冠细节；流畅模式保持简化树形并关闭动态阴影。
            </p>
          </div>
        </section>
      </aside>
    </main>
  );
}
import { ThemeSwitch } from "./Theme.jsx";
