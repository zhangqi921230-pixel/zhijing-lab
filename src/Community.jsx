import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Heart, MessageSquare } from "lucide-react";
import Button from "./LabButton.jsx";
import { allExperiments, groupFor, workbenches } from "./communityCatalog.mjs";
import "./Community.css";
const Context = createContext(null);
const githubRepository = import.meta.env.VITE_GITHUB_REPOSITORY || "";
const githubUrl = `https://github.com/${githubRepository}/issues`;
async function request(path = "", body) {
  if (githubRepository) {
    if (body) throw new Error("公开版请通过 GitHub 提交反馈。");
    const response = await fetch(
      `https://api.github.com/repos/${githubRepository}/issues?state=all&per_page=30&sort=created&direction=desc`,
      { signal: AbortSignal.timeout(12000) },
    );
    if (!response.ok) throw new Error("无法读取 GitHub 反馈，请稍后重试。");
    const issues = await response.json();
    const field = (body, heading) =>
      body?.split(`### ${heading}\n\n`)[1]?.split("\n### ")[0]?.trim() || "";
    const entries = issues
      .filter((x) => !x.pull_request && /^\[(建议|许愿)\]/.test(x.title))
      .map((x) => ({
        id: String(x.number),
        kind: x.title.startsWith("[许愿]") ? "wish" : "suggestion",
        title: x.title,
        requirements: field(x.body, "实现要求或修改建议"),
        effect: field(x.body, "期望呈现的效果"),
        author: x.user.login,
        created: x.created_at,
        status: x.state === "closed" ? "已关闭" : "待评估",
        response: "",
      }));
    return { likes: {}, entries, total: entries.length, page: 1 };
  }
  const response = await fetch(`/api/community${path}`, {
    credentials: "same-origin",
    signal: AbortSignal.timeout(12000),
    ...(body
      ? {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      : {}),
  }).catch(() => {
    throw new Error("网络连接中断或请求超时，请检查连接后重试。");
  });
  const result = await response
    .json()
    .catch(() => ({ error: "共建服务尚未连接，请稍后重试。" }));
  if (!response.ok) throw new Error(result.error || "服务暂不可用，请重试。");
  return result;
}
export function CommunityProvider({ children }) {
  const [likes, setLikes] = useState({});
  const [recent, setRecent] = useState([]);
  const [error, setError] = useState("");
  const [ready, setReady] = useState(false);
  const busy = useRef(new Set());
  const [pending, setPending] = useState({});
  async function refresh() {
    setError("");
    try {
      const data = await request();
      setLikes(data.likes);
      setRecent(data.entries);
      setReady(true);
    } catch {
      setError("共建服务暂不可用，点赞和反馈尚未同步。请重试。");
    }
  }
  useEffect(() => {
    // Public feedback remains available via links while the embedded feed is paused.
    if (!githubRepository) refresh();
  }, []);
  async function like(topic) {
    if (!ready || busy.current.has(topic)) return;
    busy.current.add(topic);
    setPending((p) => ({ ...p, [topic]: true }));
    setError("");
    try {
      const value = await request("/like", {
        topic,
        liked: !likes[topic]?.liked,
      });
      setLikes((p) => ({ ...p, [topic]: value }));
    } catch (e) {
      setError(e.message || "点赞未确认，请重试。");
    } finally {
      busy.current.delete(topic);
      setPending((p) => ({ ...p, [topic]: false }));
    }
  }
  return (
    <Context.Provider
      value={{ likes, recent, ready, error, refresh, like, pending }}
    >
      {children}
    </Context.Provider>
  );
}
export const useCommunity = () => useContext(Context);
export function CommunityTicker({ open }) {
  return githubRepository ? null : <DatabaseCommunityTicker open={open} />;
}
function DatabaseCommunityTicker({ open }) {
  const { recent = [], ready, error, refresh } = useCommunity();
  const entries = recent.slice(0, 12);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [visible, setVisible] = useState(false);
  const [reduced, setReduced] = useState(false);
  const container = useRef(null);
  const currentIndex = Math.min(index, Math.max(0, entries.length - 1));
  const current = entries[currentIndex];
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const change = () => setReduced(media.matches);
    change();
    media.addEventListener("change", change);
    const observer = new IntersectionObserver(([entry]) =>
      setVisible(entry.isIntersecting),
    );
    observer.observe(container.current);
    return () => {
      media.removeEventListener("change", change);
      observer.disconnect();
    };
  }, []);
  useEffect(() => {
    if (
      entries.length < 2 ||
      paused ||
      hovered ||
      focused ||
      expanded ||
      reduced ||
      !visible
    )
      return;
    const timer = setInterval(() => {
      if (!document.hidden) setIndex((i) => (i + 1) % entries.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [entries.length, paused, hovered, focused, expanded, reduced, visible]);
  function step(offset) {
    setExpanded(false);
    setIndex((currentIndex + offset + entries.length) % entries.length);
  }
  return (
    <section
      ref={container}
      className="community-ticker"
      aria-label="建议与许愿速览"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setFocused(false);
      }}
    >
      <div className="community-ticker-heading">
        <div>
          <span className="eyebrow">来自课堂的声音</span>
          <h2>建议与许愿速览</h2>
        </div>
        <Button onClick={() => open("community")}>查看全部 / 我也来说</Button>
      </div>
      {current ? (
        <>
          <div className="community-ticker-window">
            <button
              className="community-ticker-summary"
              key={current.id}
              onClick={() => setExpanded((v) => !v)}
              aria-expanded={expanded}
              aria-controls="community-ticker-detail"
            >
              <span className="community-ticker-meta">
                {current.kind === "wish" ? "新主题许愿" : "修改建议"} ·{" "}
                {current.status}
              </span>
              <strong>{current.title}</strong>
              <span className="community-ticker-excerpt">
                {current.requirements.replace(/\s+/g, " ").slice(0, 120)}
                {current.requirements.length > 120 ? "…" : ""}
              </span>
              <small>{expanded ? "收起详情 ↑" : "点击展开详情 ↓"}</small>
            </button>
          </div>
          {expanded && (
            <div
              id="community-ticker-detail"
              className="community-ticker-detail"
            >
              <h3>{current.title}</h3>
              <strong>实现要求 / 修改建议</strong>
              <p>{current.requirements}</p>
              <strong>期望效果</strong>
              <p>{current.effect}</p>
              {current.response && (
                <>
                  <strong>处理回复</strong>
                  <p>{current.response}</p>
                </>
              )}
              <small>
                {current.author} ·{" "}
                {new Date(current.created).toLocaleDateString("zh-CN")}
              </small>
            </div>
          )}
          <div className="community-ticker-controls">
            <span>
              最近 {entries.length} 条 · {currentIndex + 1} / {entries.length}
              {reduced ? " · 手动翻阅" : " · 每6秒切换，阅读时暂停"}
            </span>
            <div>
              <Button
                aria-label="上一条建议或许愿"
                disabled={entries.length < 2}
                onClick={() => step(-1)}
              >
                上一条
              </Button>
              {!reduced && (
                <Button
                  aria-pressed={paused}
                  disabled={entries.length < 2}
                  onClick={() => setPaused((v) => !v)}
                >
                  {paused ? "继续滚动" : "暂停滚动"}
                </Button>
              )}
              <Button
                aria-label="下一条建议或许愿"
                disabled={entries.length < 2}
                onClick={() => step(1)}
              >
                下一条
              </Button>
            </div>
          </div>
        </>
      ) : (
        <p className="community-ticker-empty">
          {error ? (
            <>
              暂时无法读取建议与许愿。<Button onClick={refresh}>重试</Button>
            </>
          ) : ready ? (
            "还没有建议与许愿，欢迎留下第一个课堂灵感。"
          ) : (
            "正在读取建议与许愿…"
          )}
        </p>
      )}
    </section>
  );
}
export function LikeButton({ topic }) {
  const { likes, ready, like, pending } = useCommunity();
  const key = groupFor(topic)?.id || topic;
  const value = likes[key];
  return (
    <Button
      className="topic-like"
      icon={Heart}
      aria-label={`${value?.liked ? "取消点赞" : "点赞"}：${workbenches.find((t) => t.id === key)?.title || key}`}
      aria-pressed={!!value?.liked}
      disabled={!!githubRepository || !ready || pending[key]}
      title={githubRepository ? "公开版暂未连接点赞数据库" : undefined}
      onClick={() => like(key)}
    >
      {githubRepository ? (
        "点赞待开放"
      ) : (
        <>
          {pending[key] ? "保存中…" : value?.liked ? "已点赞" : "点赞"} ·{" "}
          {ready ? value?.count || 0 : "—"}
        </>
      )}
    </Button>
  );
}
export function CommunityNotice() {
  const { error, refresh } = useCommunity();
  return !githubRepository && error ? (
    <div className="community-notice" role="alert">
      {error} <Button onClick={refresh}>重新连接</Button>
    </div>
  ) : null;
}
export function TopicCommunity({ topic, open }) {
  return (
    <aside className="topic-community">
      <div>
        <strong>让这堂课更好一点</strong>
        <span>喜欢这个主题，或有新的教学想法？</span>
      </div>
      <LikeButton topic={topic} />
      <Button
        icon={MessageSquare}
        onClick={() => open(`community?topic=${encodeURIComponent(topic)}`)}
      >
        建议与许愿
      </Button>
      <CommunityNotice />
    </aside>
  );
}
const blank = (topic = "") => ({
  id: crypto.randomUUID(),
  kind: topic ? "suggestion" : "wish",
  topic,
  title: "",
  requirements: "",
  effect: "",
  author: "",
});
function readDraft(topic) {
  try {
    const saved = JSON.parse(
      sessionStorage.getItem(`community-draft:${topic}`),
    );
    return saved && typeof saved.title === "string"
      ? { ...blank(topic), ...saved }
      : blank(topic);
  } catch {
    return blank(topic);
  }
}
export function CommunityBoard({ topic = "", open }) {
  return githubRepository ? (
    <GitHubCommunityBoard topic={topic} open={open} />
  ) : (
    <DatabaseCommunityBoard topic={topic} open={open} />
  );
}
function GitHubCommunityBoard({ topic, open }) {
  const title = allExperiments.find((x) => x.id === topic)?.title || topic;
  return (
    <main className="community-board">
      <Button onClick={() => open("")}>返回探索馆</Button>
      <h1>建议与许愿</h1>
      <p>
        和老师一起改进课堂。公开版使用 GitHub 保存建议和许愿，提交需要登录
        GitHub；内容将公开展示，请勿填写学生信息或联系方式。
      </p>
      <p>
        <a
          href={`${githubUrl}/new?template=suggestion.yml&title=${encodeURIComponent(`[建议] ${title}`)}`}
          target="_blank"
          rel="noreferrer"
        >
          提出主题修改建议 ↗
        </a>
      </p>
      <p>
        <a
          href={`${githubUrl}/new?template=wish.yml`}
          target="_blank"
          rel="noreferrer"
        >
          许愿一个新主题 ↗
        </a>
      </p>
      <p>
        <a href={githubUrl} target="_blank" rel="noreferrer">
          查看全部反馈与处理进度 ↗
        </a>
      </p>
      <p>
        表单包含主题名称、实现要求和期望效果。站内反馈速览暂时隐藏，请通过上方链接查看反馈与处理进度。课程点赞暂未开放。
      </p>
      <CommunityTicker open={open} />
    </main>
  );
}
function DatabaseCommunityBoard({ topic = "", open }) {
  const { likes, refresh } = useCommunity();
  const [draft, setDraft] = useState(() => readDraft(topic));
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const lock = useRef(false);
  const [filter, setFilter] = useState("");
  const [onlyTopic, setOnlyTopic] = useState(!!topic);
  const [page, setPage] = useState(1);
  const [data, setData] = useState(null);
  const [loadError, setLoadError] = useState("");
  const [revision, setRevision] = useState(0);
  const form = useRef(null);
  useEffect(() => {
    try {
      sessionStorage.setItem(`community-draft:${topic}`, JSON.stringify(draft));
    } catch {
      /* Form remains usable without browser storage. */
    }
  }, [draft, topic]);
  useEffect(() => {
    let active = true;
    setData(null);
    setLoadError("");
    request(
      `?page=${page}&kind=${filter}&topic=${onlyTopic ? encodeURIComponent(topic) : ""}`,
    )
      .then((result) => {
        if (active) setData(result);
      })
      .catch(() => {
        if (active) setLoadError("暂时无法读取共建记录，请重试。");
      });
    return () => {
      active = false;
    };
  }, [page, filter, onlyTopic, topic, revision]);
  async function submit(e) {
    e.preventDefault();
    if (lock.current) return;
    const next = {};
    if (
      draft.kind === "suggestion" &&
      !allExperiments.some((t) => t.id === draft.topic)
    )
      next.topic = "请选择要修改的主题。";
    for (const key of ["title", "requirements", "effect"])
      if (!draft[key].trim()) next[key] = "请填写此项，让我们了解您的想法。";
    setErrors(next);
    setMessage("");
    if (Object.keys(next).length) {
      form.current.elements.namedItem(Object.keys(next)[0])?.focus();
      return;
    }
    lock.current = true;
    setSaving(true);
    try {
      const result = await request("/entries", draft);
      setDraft(blank(topic));
      setMessage(`已保存，记录编号 ${result.id}。可在下方查看处理进度。`);
      setPage(1);
      setFilter("");
      setOnlyTopic(false);
      setRevision((v) => v + 1);
      refresh();
    } catch (e) {
      setMessage(
        `提交尚未确认：${e.message || "网络异常"} 您填写的内容已保留，可重试。`,
      );
    } finally {
      lock.current = false;
      setSaving(false);
    }
  }
  function field(key, label, max, multiline = false) {
    const props = {
      id: `community-${key}`,
      name: key,
      value: draft[key],
      maxLength: max,
      disabled: saving,
      "aria-invalid": !!errors[key],
      "aria-describedby": errors[key] ? `error-${key}` : undefined,
      onChange: (e) => {
        setDraft((d) => ({ ...d, [key]: e.target.value }));
        setErrors((p) => ({ ...p, [key]: "" }));
      },
    };
    return (
      <label className="community-field" htmlFor={props.id}>
        {label}
        <small>最多 {max} 字</small>
        {multiline ? (
          <textarea className="resize-none" {...props} rows={5} />
        ) : (
          <input {...props} />
        )}
        {errors[key] && (
          <span className="field-error" id={`error-${key}`}>
            {errors[key]}
          </span>
        )}
      </label>
    );
  }
  const popular = workbenches
    .filter((t) => (likes[t.id]?.count || 0) > 0)
    .sort((a, b) => likes[b.id].count - likes[a.id].count)
    .slice(0, 5);
  return (
    <main className="community-board">
      <div className="community-heading">
        <span className="eyebrow">一起打磨每一堂课</span>
        <h1>教师共建 · 建议与许愿</h1>
        <p>把课堂里的发现留下来，让下一次探索更生动。</p>
        <Button onClick={() => open(topic || "")}>
          {topic ? "返回当前主题" : "返回探索馆"}
        </Button>
      </div>
      <CommunityNotice />
      <section className="community-popular" aria-label="受欢迎的主题">
        <h2>老师们喜欢的主题</h2>
        {popular.length ? (
          popular.map((t, i) => (
            <div key={t.id}>
              <button onClick={() => open(t.id)}>
                <b>{String(i + 1).padStart(2, "0")}</b> {t.title}
              </button>
              <LikeButton topic={t.id} />
            </div>
          ))
        ) : (
          <p>还没有已加载的点赞记录，喜欢的主题值得第一个赞。</p>
        )}
        <small>
          按主题工作台累计点赞；同一浏览器可取消点赞，不代表独立人数。
        </small>
      </section>
      <div className="community-columns">
        <section className="community-compose">
          <h2>留下一份教学灵感</h2>
          <p>提交内容会公开显示。请勿填写学生姓名、联系方式等个人信息。</p>
          <form ref={form} noValidate onSubmit={submit}>
            <fieldset disabled={saving}>
              <legend>您想分享什么？</legend>
              {[
                ["suggestion", "修改建议"],
                ["wish", "新主题许愿"],
              ].map(([value, label]) => (
                <label key={value}>
                  <input
                    type="radio"
                    name="kind"
                    checked={draft.kind === value}
                    onChange={() => setDraft((d) => ({ ...d, kind: value }))}
                  />
                  {label}
                </label>
              ))}
            </fieldset>
            {draft.kind === "suggestion" && (
              <label className="community-field">
                当前主题
                <select
                  name="topic"
                  value={draft.topic}
                  disabled={saving}
                  aria-invalid={!!errors.topic}
                  aria-describedby={errors.topic ? "error-topic" : undefined}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, topic: e.target.value }))
                  }
                >
                  <option value="">请选择主题</option>
                  {allExperiments.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.title}
                    </option>
                  ))}
                </select>
                {errors.topic && (
                  <span id="error-topic" className="field-error">
                    {errors.topic}
                  </span>
                )}
              </label>
            )}
            {field(
              "title",
              draft.kind === "wish"
                ? "希望新增的主题名称（必填）"
                : "建议标题（必填）",
              100,
            )}
            {field(
              "requirements",
              draft.kind === "wish"
                ? "希望实现的要求（必填）"
                : "哪里需要修改，建议怎样改？（必填）",
              3000,
              true,
            )}
            {field(
              "effect",
              "期望呈现的效果或课堂使用场景（必填）",
              2000,
              true,
            )}
            {field("author", "署名（选填，默认匿名老师）", 40)}
            <Button primary type="submit" disabled={saving}>
              {saving ? "正在保存…" : "提交到共建板块"}
            </Button>
            <p className="community-message" role="status">
              {message}
            </p>
          </form>
        </section>
        <section className="community-feed">
          <h2>共建记录与进展</h2>
          <div className="community-filters">
            <label>
              类型
              <select
                value={filter}
                onChange={(e) => {
                  setFilter(e.target.value);
                  setPage(1);
                }}
              >
                <option value="">全部</option>
                <option value="suggestion">修改建议</option>
                <option value="wish">新主题许愿</option>
              </select>
            </label>
            {topic && (
              <label>
                <input
                  type="checkbox"
                  checked={onlyTopic}
                  onChange={(e) => {
                    setOnlyTopic(e.target.checked);
                    setPage(1);
                  }}
                />
                只看当前主题建议
              </label>
            )}
            <Button
              onClick={() => {
                setRevision((v) => v + 1);
                refresh();
              }}
            >
              刷新记录
            </Button>
          </div>
          {loadError ? (
            <p role="alert">
              {loadError}
              <Button onClick={() => setRevision((v) => v + 1)}>重试</Button>
            </p>
          ) : !data ? (
            <p role="status">正在读取共建记录…</p>
          ) : (
            <>
              <p>共 {data.total} 条 · 最新提交在前</p>
              {!data.entries.length && (
                <div className="community-empty">
                  这里还没有记录。分享一个想法，一起让课堂更好。
                </div>
              )}
              {data.entries.map((item) => (
                <article key={item.id} className="community-entry">
                  <div className="community-entry-meta">
                    <span>
                      {item.kind === "wish" ? "新主题许愿" : "修改建议"}
                    </span>
                    <strong>{item.status}</strong>
                  </div>
                  <h3>{item.title}</h3>
                  {item.topic && (
                    <button
                      className="community-topic-link"
                      onClick={() => open(item.topic)}
                    >
                      {allExperiments.find((t) => t.id === item.topic)?.title ||
                        item.topic}{" "}
                      ↗
                    </button>
                  )}
                  <h4>实现要求 / 修改建议</h4>
                  <p>{item.requirements}</p>
                  <h4>期望效果</h4>
                  <p>{item.effect}</p>
                  {item.response && (
                    <div className="community-response">
                      <strong>处理回复</strong>
                      <p>{item.response}</p>
                    </div>
                  )}
                  <small>
                    {item.author} ·{" "}
                    {new Date(item.created).toLocaleDateString("zh-CN")}
                    <br />
                    编号 {item.id}
                  </small>
                </article>
              ))}
              <div className="community-pagination">
                <Button
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  上一页
                </Button>
                <span>
                  第 {page} / {Math.max(1, Math.ceil(data.total / 20))} 页
                </span>
                <Button
                  disabled={page * 20 >= data.total}
                  onClick={() => setPage((p) => p + 1)}
                >
                  下一页
                </Button>
              </div>
            </>
          )}
        </section>
      </div>
    </main>
  );
}
