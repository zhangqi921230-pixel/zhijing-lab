import React from "react";

// Native selection keeps every chapter reachable without horizontal swiping.
export function MobileChapterPicker({ chapters, chapter, onSelect }) {
  return (
    <label className="mobile-chapter-picker">
      学习章节 · {chapter + 1} / {chapters.length}
      <select
        aria-label="选择学习章节"
        value={chapter}
        onChange={(e) => onSelect(Number(e.target.value))}
      >
        {chapters.map((item, index) => (
          <option key={index} value={index}>
            {index + 1}. {Array.isArray(item) ? item[0] : item.title}
          </option>
        ))}
      </select>
    </label>
  );
}

const destinations = {
  scene:
    ".geo-stage, .motion-stage, .chem-apparatus, .exploration-stage, .stage",
  controls:
    ".stage-tools, .motion-transport, .chem-playbar, .exploration-stage > .exploration-actions, .geo-scan",
  settings:
    ".control-panel, .motion-notes, .chem-notes, .exploration-notes, .geo-panel",
  chapters:
    ".geo-chapters, .lesson-nav, .motion-nav, .chem-nav, .exploration-nav",
};
export default function MobileLearningNav() {
  function jump(key) {
    const visible = (selector) =>
      [...document.querySelectorAll(selector)].find(
        (e) => e.getClientRects().length,
      );
    const target = visible(destinations[key]) || visible(destinations.settings);
    if (!target) return;
    target.scrollIntoView({ block: "start", behavior: "instant" });
    const control = target.querySelector(
      "button:not(:disabled), select, input:not(:disabled)",
    );
    control?.focus({ preventScroll: true });
  }
  return (
    <nav className="mobile-learning-nav" aria-label="课堂快捷导航">
      <button onClick={() => jump("chapters")}>选章节</button>
      <button onClick={() => jump("scene")}>看实验</button>
      <button className="mobile-play-entry" onClick={() => jump("controls")}>
        播放 / 操作
      </button>
      <button onClick={() => jump("settings")}>调参数</button>
    </nav>
  );
}
