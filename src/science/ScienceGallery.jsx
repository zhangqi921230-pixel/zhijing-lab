import React, { useState, useEffect, useRef } from "react";
import {
  ArrowLeft,
  ArrowUpRight,
  Bookmark,
  Search,
  X,
  Maximize,
  Printer,
} from "lucide-react";
import Button from "../LabButton.jsx";
import { TopicCommunity } from "../Community.jsx";
import {
  categories,
  scienceTopics,
  scienceById,
  templates,
} from "./catalog.mjs";
import { contentGroups } from "./publication.mjs";
import {
  parseScienceRoute,
  readLearning,
  saveLearning,
  filterTopics,
  listHash,
} from "./state.mjs";
import { loadTopic } from "./content.mjs";
import { flowerAssets, originalAssetRecord } from "./assets.mjs";
import ScienceScene, { OpticalDiagram } from "./ScienceScene.jsx";
import { WeatherDiagram } from "./WeatherScene.jsx";
import { EarthDiagram } from "./EarthScene.jsx";
import { MechanismDiagram } from "./MechanismScene.jsx";
import { SpaceDiagram } from "./SpaceScene.jsx";
import { previews } from "./previews.mjs";
import { HomeDiagram } from "./HomeScene.jsx";
import { MaterialsDiagram } from "./MaterialsScene.jsx";
import { SignalsDiagram } from "./SignalsScene.jsx";
import { TransportDiagram } from "./TransportScene.jsx";
import { KitchenDiagram } from "./KitchenScene.jsx";
import { BodyDiagram } from "./BodyScene.jsx";
import { AnimalDiagram } from "./AnimalScene.jsx";
import { PlantDiagram } from "./PlantScene.jsx";
import { natureAssets } from "./natureAssets.mjs";
import RocketAtlas from "./RocketAtlas.jsx";
import AirConditionerAtlas from "./AirConditionerAtlas.jsx";
import StructureAtlas from "./StructureAtlas.jsx";
import { structureAtlases } from "./structureAtlases.mjs";
import VisualStory, { StoryPicture } from "./VisualStory.jsx";
import { supplementalVisuals } from "./supplementalVisuals.mjs";
import ReadingGuide from "./ReadingGuide.jsx";
import { storyboards } from "./storyboards.mjs";
import "./science.css";
const published = scienceTopics.filter((t) => contentGroups[t.id]);
const views = new Map();
let lastList = "science";
function Cover({ topic }) {
  if (storyboards[topic.id])
    return <StoryPicture entry={storyboards[topic.id]} thumbnail />;
  const atlas = structureAtlases[topic.id];
  if (atlas)
    return (
      <img
        src={`${import.meta.env.BASE_URL}${atlas.thumbnail || atlas.file}`}
        width="1536"
        height="1024"
        loading="lazy"
        alt={atlas.alt}
      />
    );
  const photo = natureAssets.find((a) => a.topic === topic.id);
  if (photo)
    return (
      <img
        src={`${import.meta.env.BASE_URL}${photo.file}`}
        width={photo.width}
        height={photo.height}
        alt={photo.alt}
        loading="lazy"
      />
    );
  if (topic.category === "plants" && topic.id !== "spring-flowers")
    return <PlantDiagram id={topic.id} />;
  if (topic.category === "animals") return <AnimalDiagram id={topic.id} />;
  if (topic.category === "body") return <BodyDiagram id={topic.id} />;
  if (topic.category === "kitchen") return <KitchenDiagram id={topic.id} />;
  if (topic.category === "transport") return <TransportDiagram id={topic.id} />;
  if (topic.category === "signals") return <SignalsDiagram id={topic.id} />;
  if (topic.category === "materials") return <MaterialsDiagram id={topic.id} />;
  if (topic.id === "air-conditioner")
    return (
      <img
        src={`${import.meta.env.BASE_URL}science/air-conditioner-cutaway.png`}
        width="1536"
        height="1024"
        loading="lazy"
        alt="分体空调室内外机的宏观剖面概念插画"
      />
    );
  if (topic.category === "home") return <HomeDiagram id={topic.id} />;
  if (topic.category === "space" && topic.id !== "rocket")
    return <SpaceDiagram id={topic.id} />;
  if (topic.category === "objects") return <MechanismDiagram id={topic.id} />;
  if (topic.category === "earth" && topic.id !== "sea-blue")
    return <EarthDiagram id={topic.id} />;
  if (
    topic.category === "weather" &&
    !["sky-blue", "sunset"].includes(topic.id)
  )
    return <WeatherDiagram id={topic.id} />;
  if (topic.id === "sunset") return <OpticalDiagram id="sky-blue" value={15} />;
  if (topic.id === "rocket")
    return (
      <img
        src={`${import.meta.env.BASE_URL}science/rocket-cutaway-v2.png`}
        width="1536"
        height="1024"
        loading="lazy"
        alt="AI 辅助制作的两级火箭剖面概念插画"
      />
    );
  if (topic.id === "spring-flowers")
    return (
      <img
        src={`${import.meta.env.BASE_URL}science/peach-flower.jpg`}
        width="1024"
        height="768"
        loading="lazy"
        alt="枝条上的桃花实拍"
      />
    );
  if (["sky-blue", "sea-blue"].includes(topic.id))
    return <OpticalDiagram id={topic.id} />;
  return (
    <svg viewBox="0 0 800 450" role="img" aria-label="两级火箭结构示意">
      <rect width="800" height="450" fill="#dae4e8" />
      <g transform="translate(400,225) rotate(23)">
        <path
          d="M-30 -125 L0 -195 L30 -125 V135 H-30Z"
          fill="#f3f4ef"
          stroke="#667f8c"
          strokeWidth="3"
        />
        <path d="M-27 -70 H27 V20 H-27Z" fill="#96bdce" />
        <path d="M-27 25 H27 V125 H-27Z" fill="#c8a878" />
        <path d="M-15 135 L-30 170 H30 L15 135" fill="#495c69" />
        <path d="M-30 -80 H30 M-30 20 H30" stroke="#566d76" strokeWidth="5" />
      </g>
    </svg>
  );
}
function Gallery({ route, raw, open, learning }) {
  const search = useRef(null);
  const [query, setQuery] = useState(route.q);
  const composing = useRef(false);
  useEffect(() => setQuery(route.q), [route.q]);
  useEffect(() => {
    lastList = raw;
    const y = views.get(raw) || 0;
    const frame = requestAnimationFrame(() => window.scrollTo(0, y));
    return () => cancelAnimationFrame(frame);
  }, []);
  const update = (values) => open(listHash({ ...route, ...values, limit: 24 }));
  const items = filterTopics(published, route, learning);
  const enter = (id) => {
    views.set(raw, window.scrollY);
    lastList = raw;
    open(`science/${id}`);
  };
  return (
    <main className="science-gallery">
      <section className="science-hero">
        <div>
          <p className="science-eyebrow">知境 · 科普馆</p>
          <h1>
            熟悉的世界，
            <br />
            还有这么多<span>为什么。</span>
          </h1>
          <p>
            从一片天空到一朵春花，从日常物件到太空。
            <br />
            看清结构，改变条件，找到现象背后的原因。
          </p>
          <button
            onClick={() =>
              document
                .getElementById("science-directory")
                ?.scrollIntoView({ block: "start" })
            }
            className="science-hero-link"
          >
            开始观察 <ArrowUpRight size={19} />
          </button>
        </div>
        <button className="science-feature" onClick={() => enter("sky-blue")}>
          <OpticalDiagram id="sky-blue" />
          <div>
            <span>从一个日常问题开始</span>
            <strong>
              天空为什么是蓝色的？ <ArrowUpRight size={24} />
            </strong>
          </div>
        </button>
      </section>
      <section className="science-featured-row" aria-label="本期推荐">
        {["sky-blue", "rocket", "spring-flowers"].map((id) => (
          <button
            key={id}
            className="science-featured-item"
            onClick={() => enter(id)}
          >
            <Cover topic={scienceById[id]} />
            <span>
              {scienceById[id].title}
              <ArrowUpRight size={20} />
            </span>
          </button>
        ))}
      </section>
      {learning.recent.length > 0 && (
        <section className="science-resume" aria-label="继续阅读">
          <strong>继续阅读</strong>
          {learning.recent.slice(0, 3).map(
            (r) =>
              contentGroups[r.id] && (
                <Button
                  key={r.id}
                  onClick={() => open(`science/${r.id}?chapter=${r.chapter}`)}
                >
                  {scienceById[r.id].title}
                </Button>
              ),
          )}
          <small>阅读记录保存在此设备</small>
        </section>
      )}
      <section id="science-directory" className="science-directory">
        <div className="science-directory-heading">
          <div>
            <p className="science-eyebrow">生活科学图鉴</p>
            <h2>从你的好奇心出发</h2>
          </div>
          <span>{published.length} 个可阅读主题</span>
        </div>
        <div className="science-filters">
          <div className="science-search">
            <Search size={19} />
            <input
              ref={search}
              value={query}
              aria-label="搜索科普主题"
              placeholder="搜索问题、物件或关键词"
              onCompositionStart={() => {
                composing.current = true;
              }}
              onCompositionEnd={(e) => {
                composing.current = false;
                update({ q: e.currentTarget.value });
              }}
              onChange={(e) => {
                setQuery(e.target.value);
                if (!composing.current) update({ q: e.target.value });
              }}
            />
            {query && (
              <button
                aria-label="清除搜索"
                onClick={() => {
                  setQuery("");
                  update({ q: "" });
                  search.current?.focus();
                }}
              >
                <X size={18} />
              </button>
            )}
          </div>
          <label>
            讲解方式
            <select
              value={route.mode}
              onChange={(e) => update({ mode: e.target.value })}
            >
              <option value="all">所有方式</option>
              {Object.entries(templates).map(([id, name]) => (
                <option key={id} value={id}>
                  {name}
                </option>
              ))}
            </select>
          </label>
          <Button
            aria-pressed={route.saved}
            icon={Bookmark}
            onClick={() => update({ saved: route.saved ? "" : "1" })}
          >
            我的收藏
          </Button>
        </div>
        <nav className="science-categories" aria-label="科普领域">
          <Button
            aria-pressed={route.category === "all"}
            onClick={() => update({ category: "all" })}
          >
            全部领域
          </Button>
          {categories.map((c) => (
            <Button
              key={c.id}
              aria-pressed={route.category === c.id}
              onClick={() => update({ category: c.id })}
            >
              {c.name}
            </Button>
          ))}
        </nav>
        <p className="science-result" role="status">
          {route.q ? `“${route.q}” · ` : ""}
          {items.length} 个主题{route.saved ? " · 收藏保存在此设备" : ""}
        </p>
        <div className="science-card-grid">
          {items.slice(0, route.limit).map((topic) => (
            <button
              key={topic.id}
              className="science-card"
              onClick={() => enter(topic.id)}
            >
              <div className="science-cover">
                {topic.id === "rocket" ? (
                  <RocketAtlas />
                ) : topic.id === "air-conditioner" ? (
                  <AirConditionerAtlas />
                ) : (
                  <Cover topic={topic} />
                )}
              </div>
              <div className="science-card-copy">
                <small>
                  {categories.find((c) => c.id === topic.category)?.name} · 约{" "}
                  {topic.minutes} 分钟
                </small>
                <h3>{topic.title}</h3>
                <p className="science-card-summary">{previews[topic.id]}</p>
                <p>
                  {templates[topic.template]}
                  {topic.spatial
                    ? " · 三维观察"
                    : topic.enhanced
                      ? " · 深入互动"
                      : ""}
                </p>
                <span>
                  进入观察 <ArrowUpRight size={16} />
                </span>
              </div>
            </button>
          ))}
        </div>
        {!items.length && (
          <div className="science-empty">
            <h3>暂时没有匹配的已发布主题</h3>
            <p>试试“天空”“火箭”或“卷尺”。未完成的选题不会作为空页面展示。</p>
            <Button
              onClick={() => {
                setQuery("");
                open("science");
              }}
            >
              清除筛选
            </Button>
          </div>
        )}
        {items.length > route.limit && (
          <Button
            onClick={() =>
              open(listHash({ ...route, limit: route.limit + 24 }))
            }
          >
            再看 24 个主题
          </Button>
        )}
      </section>
      <footer className="science-footer">
        知境 · 科普馆 <span>从生活提问，用观察理解。</span>
      </footer>
    </main>
  );
}
function Quiz({ quiz, hidden }) {
  const [answer, setAnswer] = useState(null);
  return (
    <section className="science-quiz">
      <h2>检查一下理解</h2>
      <p>{quiz.question}</p>
      <div>
        {quiz.choices.map((c, i) => (
          <Button
            key={c}
            aria-pressed={answer === i}
            onClick={() => setAnswer(i)}
          >
            {c}
          </Button>
        ))}
      </div>
      {answer !== null && !hidden && (
        <p role="status" className="science-answer">
          <strong>
            {answer === quiz.answer ? "判断正确。" : "再看看依据。"}
          </strong>
          {quiz.explanation}
        </p>
      )}
    </section>
  );
}
function Topic({ topic, route, open, learning, setLearning }) {
  const [content, setContent] = useState(null),
    [error, setError] = useState(false),
    [attempt, setAttempt] = useState(0),
    [storageOk, setStorageOk] = useState(true),
    [teaching, setTeaching] = useState(false),
    [hidden, setHidden] = useState(false);
  const shell = useRef(null);
  useEffect(() => {
    let active = true;
    setError(false);
    loadTopic(topic.id)
      .then((c) => {
        if (active) {
          setContent(c);
          if (!c) setError(true);
        }
      })
      .catch(() => active && setError(true));
    return () => {
      active = false;
    };
  }, [topic.id, attempt]);
  const chapter =
    content?.chapters.find((x) => x[0] === route.chapter) ||
    content?.chapters[0];
  useEffect(() => {
    if (!chapter) return;
    const recent = [
      { id: topic.id, chapter: chapter[0] },
      ...learning.recent.filter((r) => r.id !== topic.id),
    ].slice(0, 12);
    const next = { ...learning, recent };
    setLearning(next);
    setStorageOk(saveLearning(next));
    document.title = `${topic.title} · 知境科普馆`;
  }, [topic.id, chapter?.[0]]);
  useEffect(() => {
    const change = () => setTeaching(!!document.fullscreenElement);
    const key = (e) => {
      if (e.key === "Escape") setTeaching(false);
    };
    document.addEventListener("fullscreenchange", change);
    document.addEventListener("keydown", key);
    return () => {
      document.removeEventListener("fullscreenchange", change);
      document.removeEventListener("keydown", key);
    };
  }, []);
  async function toggleTeaching() {
    if (document.fullscreenElement) {
      await document.exitFullscreen?.();
      setTeaching(false);
    } else if (teaching) setTeaching(false);
    else {
      setTeaching(true);
      try {
        await shell.current?.requestFullscreen?.();
      } catch {
        /* Expanded page remains usable if fullscreen is denied. */
      }
    }
  }
  const bookmark = () => {
    const next = {
      ...learning,
      saved: learning.saved.includes(topic.id)
        ? learning.saved.filter((id) => id !== topic.id)
        : [...learning.saved, topic.id],
    };
    setLearning(next);
    setStorageOk(saveLearning(next));
  };
  return (
    <main
      ref={shell}
      className={`science-topic${teaching ? " science-teaching" : ""}`}
    >
      <nav className="science-topic-toolbar" aria-label="主题工具">
        <Button icon={ArrowLeft} onClick={() => open(lastList)}>
          返回科普馆
        </Button>
        <div>
          <Button
            icon={Bookmark}
            aria-pressed={learning.saved.includes(topic.id)}
            onClick={bookmark}
          >
            {learning.saved.includes(topic.id) ? "已收藏" : "收藏"}
          </Button>
          <Button
            icon={Maximize}
            aria-pressed={teaching}
            onClick={toggleTeaching}
          >
            {teaching ? "退出讲解" : "投屏讲解"}
          </Button>
          <Button icon={Printer} onClick={() => window.print()}>
            打印
          </Button>
        </div>
      </nav>
      <header className="science-title">
        <p className="science-eyebrow">
          {categories.find((c) => c.id === topic.category)?.name} /{" "}
          {templates[topic.template]}
        </p>
        <h1>{topic.title}</h1>
        <p className="science-local-note">
          约 {topic.minutes} 分钟 · 收藏和阅读位置保存在此设备
          {!storageOk ? "；当前浏览器无法保存，本次仍可正常学习。" : ""}
        </p>
      </header>
      {error ? (
        <div className="science-empty" role="alert">
          <h2>主题内容加载失败</h2>
          <p>检查网络后重试；也可以返回目录选择其他主题。</p>
          <Button onClick={() => setAttempt(attempt + 1)}>重新加载</Button>
        </div>
      ) : !content ? (
        <div className="science-stage-loading" role="status">
          正在准备图解与讲解…
        </div>
      ) : (
        <>
          <p className="science-short-answer">{content.summary}</p>
          <div className="science-learning">
            <section className="science-stage" aria-label="互动观察">
              <div className="science-print-visual">
                {storyboards[topic.id] ? (
                  <VisualStory id={topic.id} print />
                ) : structureAtlases[topic.id] ? (
                  <StructureAtlas id={topic.id} />
                ) : topic.id === "rocket" ? (
                  <RocketAtlas />
                ) : topic.id === "air-conditioner" ? (
                  <AirConditionerAtlas />
                ) : (
                  <Cover topic={topic} />
                )}
                <p>主题标准图解；网页中可改变条件观察。</p>
                {supplementalVisuals[topic.id] &&
                  (supplementalVisuals[topic.id].type === "structure" ? (
                    <StructureAtlas
                      id={topic.id}
                      entry={supplementalVisuals[topic.id].entry}
                    />
                  ) : (
                    <VisualStory
                      id={topic.id}
                      entry={supplementalVisuals[topic.id].entry}
                      print
                    />
                  ))}
              </div>
              <ScienceScene
                key={topic.id}
                topic={topic}
                chapter={chapter[0]}
                scene={content.scene}
                observationGoal={chapter[2]}
              />
              <p className="science-boundary">{content.boundary}</p>
            </section>
            <aside className="science-guide">
              <p className="science-eyebrow">看图弄明白</p>
              <nav aria-label="讲解步骤">
                {content.chapters.map((ch, i) => (
                  <Button
                    key={ch[0]}
                    aria-current={chapter[0] === ch[0] ? "step" : undefined}
                    onClick={() => open(`science/${topic.id}?chapter=${ch[0]}`)}
                  >
                    <span>{String(i + 1).padStart(2, "0")}</span> {ch[1]}
                  </Button>
                ))}
              </nav>
              <article>
                <h2>{chapter[1]}</h2>
                <p className="science-goal">观察任务：{chapter[2]}</p>
                <p>{chapter[3]}</p>
              </article>
            </aside>
          </div>
          <div className="science-reading">
            <ReadingGuide key={topic.id} id={topic.id} hiddenAnswers={hidden} />
            <section className="science-print-chapters">
              <h2>完整图解讲稿</h2>
              {content.chapters.map((ch) => (
                <article key={ch[0]}>
                  <h3>{ch[1]}</h3>
                  <p>{ch[3]}</p>
                </article>
              ))}
            </section>
            <details className="science-deeper">
              <summary>再深入一点</summary>
              <p>{content.deeper}</p>
              <p>
                <strong>常见误解：</strong>
                {content.misconception}
              </p>
            </details>
            <div className="science-quiz-toolbar">
              <Button aria-pressed={hidden} onClick={() => setHidden(!hidden)}>
                {hidden ? "允许显示答案" : "讲解时隐藏答案"}
              </Button>
            </div>
            <Quiz key={topic.id} quiz={content.quiz} hidden={hidden} />
            <section>
              <h2>把观察带回生活</h2>
              <p>{content.application}</p>
            </section>
            <section className="science-related">
              <h2>继续追问</h2>
              {content.related
                .filter((id) => contentGroups[id])
                .map((id) => (
                  <Button key={id} onClick={() => open(`science/${id}`)}>
                    {scienceById[id].title}
                  </Button>
                ))}
              {content.experiment && (
                <Button onClick={() => open(content.experiment)}>
                  到探索馆做相关实验 ↗
                </Button>
              )}
            </section>
            <details className="science-sources">
              <summary>科学依据、素材与适用范围</summary>
              <h3>科学来源</h3>
              <ul>
                {content.sources.map((s) => (
                  <li key={s.url}>
                    <a href={s.url} target="_blank" rel="noreferrer">
                      {s.title} ↗
                    </a>
                  </li>
                ))}
              </ul>
              <p>{content.boundary}</p>
              <h3>画面来源</h3>
              {structureAtlases[topic.id] && (
                <p>
                  写实结构插画由内置 image_gen
                  生成，宏观结构及标注已按图像核对记录检查。图像版本与提示词记录在项目素材台账；细部及比例为教学示意，独立科学编审待完成。
                </p>
              )}
              {natureAssets
                .filter((a) => a.topic === topic.id)
                .map((a) => (
                  <p key={a.id}>
                    {a.name} / {a.species}：<a href={a.source}>{a.author}</a> ·{" "}
                    <a href={a.licenseUrl}>{a.license}</a> ·
                    原图未重绘或改色；网页可放大观察。
                  </p>
                ))}
              {topic.id === "spring-flowers" ? (
                flowerAssets.map((a) => (
                  <p key={a.id}>
                    {a.name} / {a.species}：<a href={a.source}>{a.author}</a> ·{" "}
                    <a href={a.licenseUrl}>{a.license}</a> ·
                    本地文件仅采用来源站缩略版本；未重绘或改色，页面提供缩放观察。
                  </p>
                ))
              ) : (
                <p>
                  {topic.id === "rocket" && (
                    <>
                      写实图鉴插画由内置 image_gen 生成，2026-10-21
                      修订贮箱排列；为通用概念图，未指称真实型号。微小管线与泵件仍待独立科学审核。
                    </>
                  )}
                  {topic.id === "air-conditioner" && (
                    <>
                      写实主图由内置 image_gen 于 2026-10-21
                      生成，用于宏观部件识别；细管与阀件为概念表达。制冷循环以网页原理图为依据，独立科学编审待完成。
                    </>
                  )}
                  {originalAssetRecord.kind}，{originalAssetRecord.author}。
                  {originalAssetRecord.modification}
                </p>
              )}
              <p>
                修订：{content.review.revised} · {content.review.status}
              </p>
            </details>
          </div>
          <TopicCommunity topic={`science:${topic.id}`} open={open} />
        </>
      )}
    </main>
  );
}
export default function ScienceGallery({ route: raw, open }) {
  const route = parseScienceRoute(raw);
  const [learning, setLearning] = useState(readLearning);
  useEffect(() => {
    document.title = route.id
      ? scienceById[route.id] && contentGroups[route.id]
        ? `${scienceById[route.id].title} · 知境科普馆`
        : "主题尚未发布 · 知境科普馆"
      : "科普馆 · 知境";
  }, [route.id]);
  if (route.id) {
    const topic = scienceById[route.id];
    if (!topic || !contentGroups[route.id])
      return (
        <main className="science-empty">
          <h1>这个主题尚未发布</h1>
          <p>返回科普馆浏览已经完成的内容。</p>
          <Button onClick={() => open("science")}>返回科普馆</Button>
        </main>
      );
    return (
      <Topic
        key={topic.id}
        topic={topic}
        route={route}
        open={open}
        learning={learning}
        setLearning={setLearning}
      />
    );
  }
  return <Gallery route={route} raw={raw} open={open} learning={learning} />;
}
