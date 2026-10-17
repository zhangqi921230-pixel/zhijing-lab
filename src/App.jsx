import {
  CommunityProvider,
  CommunityTicker,
  CommunityBoard,
  CommunityNotice,
  TopicCommunity,
  LikeButton,
  useCommunity,
} from "./Community.jsx";
import { curriculumNote } from "./curriculumLevels.mjs";
import "./NatureScene.css";
import React, { useState, useRef, useEffect, lazy, Suspense } from "react";
import { ArrowUpRight, Search, X, Play, Compass } from "lucide-react";
import { subjects, lessons } from "./topicMetadata.mjs";
import { threeIds } from "./sceneCatalog.mjs";
import ThreeScene from "./SceneLoader.jsx";
import Button from "./LabButton.jsx";
import Laboratory from "./LaboratoryLoader.jsx";
import { workbenches, allExperiments, groupFor } from "./courseCatalog.mjs";
import { explorations } from "./topicMetadata.mjs";
import { ThemeProvider, ThemeSwitch } from "./Theme.jsx";
import AnimatedPreview, { usePreviewPlayback } from "./AnimatedPreview.jsx";
const ChemistryLab = lazy(() => import("./ChemistryLab.jsx"));
const MotionLab = lazy(() => import("./MotionLab.jsx"));
import { motionTopics } from "./motionTopics.mjs";
import { chemistryCatalog as chemistryTopics } from "./chemistryCatalog.mjs";
const ExplorationLab = lazy(() => import("./ExplorationLab.jsx"));
const initialId = () => {
  try {
    return decodeURIComponent(location.hash.slice(1));
  } catch {
    return "invalid";
  }
};
function Library({ open, subject, setSubject }) {
  const previews = usePreviewPlayback();
  const { likes } = useCommunity();
  const [popular, setPopular] = useState(false);
  const [stage, setStage] = useState("all");
  const [baseOnly, setBaseOnly] = useState(false);
  const [query, setQuery] = useState("");
  const searchRef = useRef(null);
  const [previewActive, setPreviewActive] = useState(false);
  let items = workbenches.filter(
    (l) =>
      (subject === "all" || l.subject === subject) &&
      (stage === "all" || l.curriculum.stage === stage) &&
      (!baseOnly || l.curriculum.scope === "基础") &&
      `${l.title}${l.grade}${l.tag}${l.searchText}`.includes(query.trim()),
  );
  if (popular)
    items = [...items].sort(
      (a, b) => (likes[b.id]?.count || 0) - (likes[a.id]?.count || 0),
    );
  return (
    <main className="library">
      <section className="library-hero">
        <div>
          <div className="eyebrow">
            <span className="live-dot" /> 让知识发生，而不只是被讲述
          </div>
          <h1>
            把世界，
            <br />
            带进<span>你的课堂。</span>
          </h1>
          <p>
            从一束光到一颗星球。
            <br />
            在可以操作的世界里，观察、提问、发现。
          </p>
          <Button primary icon={ArrowUpRight} onClick={() => open("contour")}>
            开启一次地形探索
          </Button>
          <div className="hero-numbers">
            <span>
              <b>05</b> 学科领域
            </span>
            <span>
              <b>{workbenches.length}</b> 主题工作台
            </span>
            <span>
              <b>∞</b> 探究可能
            </span>
          </div>
        </div>
        <div className="hero-model">
          {previewActive ? (
            <ThreeScene id="contour" p={{ level: 400, interval: 200 }} small />
          ) : (
            <>
              <img
                className="hero-preview"
                src="./previews/contour.webp"
                alt="等高线与山体三维实验预览"
                width="720"
                height="384"
                fetchPriority="high"
              />
              <button
                className="hero-preview-start"
                onClick={() => setPreviewActive(true)}
              >
                <Play size={16} />
                旋转查看地形
              </button>
            </>
          )}
          <div className="hero-caption">
            <span>FIELD NOTE / 001</span>
            <strong>从山川，读懂等高线</strong>
            <span>真实几何切面 · 联动平面投影</span>
          </div>
          <button
            className="hero-go"
            aria-label="进入等高线与地形"
            onClick={() => open("contour")}
          >
            <ArrowUpRight />
          </button>
        </div>
      </section>
      <CommunityTicker open={open} />
      <section className="course-section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">THE EXPLORATION COLLECTION</span>
            <h2>每一次理解，都从探索开始</h2>
          </div>
          <div className="search">
            <Search size={17} />
            <input
              ref={searchRef}
              aria-label="搜索互动主题"
              placeholder="搜索知识点、学段…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {query && (
              <button
                aria-label="清除搜索"
                onClick={() => {
                  setQuery("");
                  searchRef.current?.focus();
                }}
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>
        <div className="subject-tabs">
          <button
            className={subject === "all" ? "active" : ""}
            onClick={() => setSubject("all")}
          >
            全部主题 <small>{workbenches.length}</small>
          </button>
          {subjects.map((s) => (
            <button
              key={s.id}
              onClick={() => setSubject(s.id)}
              className={subject === s.id ? "active" : ""}
            >
              <span>{s.symbol}</span>
              {s.name}
              <small>
                {workbenches.filter((l) => l.subject === s.id).length}
              </small>
            </button>
          ))}
        </div>
        <div className="curriculum-filter" aria-label="学段筛选">
          <span>由浅入深</span>
          {[
            ["all", "全部学段"],
            ["primary", "小学"],
            ["middle", "初中"],
            ["high", "高中"],
          ].map(([value, label]) => (
            <button
              key={value}
              aria-pressed={stage === value}
              onClick={() => setStage(value)}
            >
              {label}
            </button>
          ))}
          <button
            aria-pressed={baseOnly}
            onClick={() => setBaseOnly((v) => !v)}
          >
            仅看基础内容
          </button>
        </div>
        <p className="curriculum-notice">
          {curriculumNote} 同年级基础内容在前。合并主题内各单元分别标注学段。
        </p>
        <div className="preview-controls">
          <p>真实演示片段 · 自动循环播放，点击卡片进入互动。</p>
          <Button
            aria-pressed={previews.enabled}
            onClick={() => previews.setEnabled((v) => !v)}
          >
            {previews.enabled ? "暂停动态预览" : "开启动态预览"}
          </Button>
        </div>
        <CommunityNotice />
        <div className="preview-controls">
          <Button aria-pressed={popular} onClick={() => setPopular((v) => !v)}>
            {popular ? "正在按点赞排序" : "按点赞排序"}
          </Button>
          <Button onClick={() => open("community")}>
            教师共建 · 建议与许愿
          </Button>
        </div>
        <div className="course-grid">
          {items.map((l) => (
            <div className="course-tile" key={l.id}>
              <button
                className="course-card"
                key={l.id}
                onClick={() => open(l.id)}
              >
                <AnimatedPreview
                  id={l.id}
                  title={l.title}
                  playing={previews.isPlaying(l.id)}
                  onVisible={previews.visibility}
                />
                <div className="card-copy">
                  <div className="card-meta">
                    <span>
                      {subjects.find((s) => s.id === l.subject).name} / {l.tag}
                    </span>
                    <span>
                      {threeIds.includes(l.id) ? "3D 探索" : "互动实验"}
                    </span>
                  </div>
                  <h3>
                    {l.title}
                    <ArrowUpRight size={19} />
                  </h3>
                  <p>{l.description}</p>
                  <div className="card-grade">
                    {l.grade}
                    {l.members.length > 1
                      ? ` · ${l.members.length} 个学习单元`
                      : ""}
                  </div>
                </div>
              </button>
              <div className="course-social">
                <LikeButton topic={l.id} />
                <Button onClick={() => open(`community?topic=${l.id}`)}>
                  提建议
                </Button>
              </div>
            </div>
          ))}
        </div>
        {items.length === 0 && (
          <div className="empty">
            <Search />
            <h3>没有找到这个主题</h3>
            <p>试试“光”“细胞”或清除关键词。</p>
            <Button
              onClick={() => {
                setQuery("");
                setSubject("all");
                setStage("all");
                setBaseOnly(false);
              }}
            >
              查看全部主题
            </Button>
          </div>
        )}
      </section>
      <footer>
        知境 · 互动教学实验室{" "}
        <span>
          {workbenches.length} 个主题工作台 · {allExperiments.length} 个实验单元
        </span>
        <a href="./curriculum.html" target="_blank" rel="noreferrer">
          课程依据与模型边界 ↗
        </a>
      </footer>
    </main>
  );
}
const GeographyLab = lazy(() => import("./GeographyLab.jsx"));
export default function App() {
  return (
    <ThemeProvider>
      <CommunityProvider>
        <AppContent />
      </CommunityProvider>
    </ThemeProvider>
  );
}
function AppContent() {
  const [id, setId] = useState(initialId),
    [subject, setSubject] = useState("all");
  useEffect(() => {
    const change = () => setId(initialId());
    window.addEventListener("hashchange", change);
    return () => window.removeEventListener("hashchange", change);
  }, []);
  const communityPage = id === "community" || id.startsWith("community?");
  const communityTopic = communityPage
    ? new URLSearchParams(id.split("?")[1]).get("topic") || ""
    : "";
  const lesson = allExperiments.find((l) => l.id === id);
  useEffect(() => {
    document.title = communityPage
      ? "教师共建 · 知境课堂"
      : lesson
        ? `${groupFor(id)?.title ?? lesson.title} · 知境课堂`
        : "知境 · 互动教学实验室";
    window.scrollTo(0, 0);
  }, [id]);
  function open(next) {
    location.hash = next;
    setId(next);
  }
  if (id === "contour")
    return (
      <Suspense
        fallback={<div className="scene-loading">正在准备地形工作台…</div>}
      >
        <GeographyLab goHome={() => open("")} open={open} />
        <TopicCommunity topic={id} open={open} />
      </Suspense>
    );
  return (
    <>
      <header className="topbar">
        <button
          className="brand"
          onClick={() => open("")}
          aria-label="知境首页"
        >
          <span className="brand-mark">
            <Compass size={25} />
          </span>
          <span>
            知境<small>互动教学实验室</small>
          </span>
        </button>
        <div className="header-links">
          <button
            onClick={() => open("")}
            aria-current={!lesson && !communityPage ? "page" : undefined}
          >
            探索馆
          </button>
          <button
            aria-current={communityPage ? "page" : undefined}
            onClick={() => open("community")}
          >
            建议与许愿
          </button>
          <a href="./curriculum.html" target="_blank" rel="noreferrer">
            课程与方法 <ArrowUpRight size={13} />
          </a>
        </div>
        <ThemeSwitch />
        <div className="header-note">
          <span className="live-dot" /> 让理解，看得见
        </div>
      </header>
      {communityPage ? (
        <CommunityBoard
          key={communityTopic}
          topic={communityTopic}
          open={open}
        />
      ) : motionTopics.some((x) => x.id === id) ? (
        <Suspense
          fallback={
            <div className="scene-loading">正在准备动态探究工作台…</div>
          }
        >
          <MotionLab
            key={id}
            lesson={lesson}
            open={open}
            goHome={() => open("")}
          />
        </Suspense>
      ) : chemistryTopics.some((x) => x.id === id) ? (
        <Suspense
          fallback={<div className="scene-loading">正在准备化学工作台…</div>}
        >
          <ChemistryLab
            key={id}
            lesson={lesson}
            open={open}
            goHome={() => open("")}
          />
        </Suspense>
      ) : explorations.some((x) => x.id === id) ? (
        <Suspense
          fallback={<div className="scene-loading">正在准备实验工作台…</div>}
        >
          <ExplorationLab
            key={id}
            lesson={lesson}
            open={open}
            goHome={() => open("")}
          />
        </Suspense>
      ) : lesson ? (
        <Laboratory
          key={lesson.id}
          lesson={lesson}
          open={open}
          goHome={() => open("")}
        />
      ) : id ? (
        <main className="empty">
          <h1>这个实验暂未收录</h1>
          <Button onClick={() => open("")}>返回探索馆</Button>
        </main>
      ) : (
        <Library open={open} subject={subject} setSubject={setSubject} />
      )}
      {lesson && <TopicCommunity topic={id} open={open} />}
    </>
  );
}
