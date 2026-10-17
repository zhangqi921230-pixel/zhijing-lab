import { gradeFor } from "./curriculumLevels.mjs";
import React, { useEffect, useRef } from "react";
import { defaults, subjects } from "./lessons.mjs";
import "./MicroscopeGuide.css";
import "./TopicLearning.css";
import { workbenches, groupFor, allExperiments } from "./courseCatalog.mjs";

export function TopicPicker({ lesson, lessons, onSelect }) {
  const group = groupFor(lesson.id);
  return (
    <>
      <label className="topic-picker">
        切换主题
        <select
          value={group?.id ?? lesson.id}
          onChange={(event) => onSelect(event.target.value)}
        >
          {[...subjects]
            .sort(
              (a, b) =>
                Number(b.id === lesson.subject) -
                Number(a.id === lesson.subject),
            )
            .map((subject) => (
              <optgroup key={subject.id} label={subject.name}>
                {workbenches
                  .filter((item) => item.subject === subject.id)
                  .map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.title} · {item.grade}
                    </option>
                  ))}
              </optgroup>
            ))}
        </select>
      </label>
      <small className="curriculum-level">
        建议学习：{gradeFor(lesson.id)} · 年级以本校教材为准
      </small>
      {group && (
        <nav className="course-units" aria-label="主题内学习单元">
          <span className="nav-heading">
            {group.title} · {group.members.length} 单元
          </span>
          {group.members.map((id, i) => (
            <button
              key={id}
              aria-current={id === lesson.id ? "page" : undefined}
              onClick={() => id !== lesson.id && onSelect(id)}
            >
              <small>{String.fromCharCode(65 + i)}</small>
              <span>
                {allExperiments.find((x) => x.id === id).title}
                <small>{gradeFor(id)}</small>
              </span>
            </button>
          ))}
        </nav>
      )}
    </>
  );
}

export function TopicChapters({ chapters, chapter, onSelect }) {
  return (
    <nav className="microscope-chapters" aria-label="学习子主题">
      <span className="nav-heading">逐步探究 · {chapters.length} 节</span>
      {chapters.map((item, index) => (
        <button
          key={item.title}
          className={chapter === index ? "selected" : ""}
          aria-current={chapter === index ? "step" : undefined}
          onClick={() => onSelect(index)}
        >
          <small>{String(index + 1).padStart(2, "0")}</small>
          <span>{item.title}</span>
        </button>
      ))}
    </nav>
  );
}

export function TopicGuide({
  lesson,
  chapters,
  chapter,
  p,
  time = 0,
  onSelect,
  onApply,
}) {
  const section = useRef(null),
    item = chapters[chapter];
  const scenarioTarget = (scenario) => ({
    ...defaults(lesson),
    ...Object.fromEntries(
      (
        {
          cell: ["labels", "cellAngle"],
          precipitation: ["volumeGuide"],
          biodiversity: ["groundDetails"],
          water: ["vegetation", "pathways"],
          conics: [
            "showPlane",
            "showShell",
            "showGuides",
            "showFocus",
            "showSpheres",
          ],
        }[lesson.id] ?? []
      )
        .filter((key) => p[key] !== undefined)
        .map((key) => [key, p[key]]),
    ),
    ...scenario.p,
  });
  useEffect(() => {
    const panel = section.current?.closest(".control-panel");
    if (panel) panel.scrollTop = 0;
  }, [chapter]);
  return (
    <section
      ref={section}
      className="microscope-guide topic-guide"
      aria-label="当前学习任务"
    >
      <p className="micro-kicker">
        第 {chapter + 1} / {chapters.length} 节
      </p>
      <h2>{item.title}</h2>
      <p>{item.text}</p>
      <div className="micro-task">
        <strong>动手试一试</strong>
        <p>{item.task}</p>
      </div>
      <fieldset className="topic-scenarios">
        <legend>一键对照</legend>
        {item.scenarios.map((scenario) => {
          const target = scenarioTarget(scenario);
          const selected =
            (scenario.time === undefined ||
              Math.abs(time - scenario.time) < 1e-8) &&
            Object.keys(target).every(
              (key) => Math.abs(p[key] - target[key]) < 1e-8,
            );
          return (
            <button
              key={scenario.label}
              aria-pressed={selected}
              onClick={() =>
                scenario.time === undefined
                  ? onApply(target, item.view, scenario.label)
                  : onApply(target, item.view, scenario.label, scenario.time)
              }
            >
              {scenario.label}
            </button>
          );
        })}
      </fieldset>
      {item.explanation && (
        <details key={item.title} className="topic-explanation">
          <summary>进一步理解 · 结构与模型说明</summary>
          <p>{item.explanation}</p>
        </details>
      )}
      <p className="topic-hint">
        选择情境会准备整组参数并暂停，实验记录保留。下方可继续微调。
      </p>
      <div className="micro-step">
        <button disabled={chapter === 0} onClick={() => onSelect(chapter - 1)}>
          ← 上一节
        </button>
        {item.scenarios.length > 0 && (
          <button
            title="恢复本节第一组情境并暂停，保留当前章节和实验记录"
            onClick={() =>
              onApply(
                scenarioTarget(item.scenarios[0]),
                item.view,
                item.scenarios[0].label,
              )
            }
          >
            重做本节
          </button>
        )}
        <button
          disabled={chapter === chapters.length - 1}
          onClick={() => onSelect(chapter + 1)}
        >
          下一节 →
        </button>
      </div>
    </section>
  );
}
