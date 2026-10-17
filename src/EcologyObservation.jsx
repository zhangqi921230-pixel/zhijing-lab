import "./EcologyObservation.css";

const specimens = {
  plant: {
    name: "植物",
    count: "plants",
    view: "plant",
    text: "观察叶片、叶柄和茎的连接。不同高矮与姿态仍属于同一个示例种，不能只凭个体大小判断物种。",
  },
  insect: {
    name: "昆虫",
    count: "insects",
    view: "insect",
    text: "观察触角、六足、卷曲口器和两对翅。翅的颜色与花纹为示意，不能用于现实物种鉴定。",
  },
  bird: {
    name: "鸟类",
    count: "birds",
    text: "观察羽毛覆盖的翅、尾羽与喙。飞行路径为演示，不表示捕食关系或种群变化。",
  },
  fungus: {
    name: "真菌",
    count: "fungi",
    view: "fungus",
    text: "观察菌盖、菌褶和菌柄。可见部分是子实体，地下菌丝未展示；子实体数不能直接等同于真实真菌个体数。",
  },
};

export default function EcologyObservation({
  selected,
  onSelect,
  p,
  onViewChange,
}) {
  const item = specimens[selected];
  return (
    <aside className="ecology-observation" aria-label="生物观察卡">
      <div
        className="ecology-observation-tabs"
        role="group"
        aria-label="选择观察对象"
      >
        {Object.entries(specimens).map(([key, entry]) => (
          <button
            key={key}
            disabled={!p[entry.count]}
            aria-pressed={selected === key}
            onClick={() => onSelect(key)}
          >
            {entry.name}
          </button>
        ))}
      </div>
      {item ? (
        <div className="ecology-observation-body" aria-live="polite">
          <div>
            <strong>{item.name} · 示例种</strong>
            <button aria-label="收起生物说明" onClick={() => onSelect(null)}>
              ×
            </button>
          </div>
          <p>{item.text}</p>
          <span>
            样方展示 {p[item.count]} 个
            {selected === "fungus" ? "子实体" : "个体"}
          </span>
          {item.view && (
            <button className="btn" onClick={() => onViewChange?.(item.view)}>
              观察代表标本近景
            </button>
          )}
        </div>
      ) : (
        <small>点击场景中的生物，或选择上方类别。</small>
      )}
    </aside>
  );
}
