// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { beforeAll, expect, it, vi } from "vitest";
vi.mock("../src/SceneLoader.jsx", () => ({
  default: () => <div>三维场景替身</div>,
}));
vi.mock("../src/MicroscopeField.jsx", async (importOriginal) => ({
  ...(await importOriginal()),
  default: () => <div>目镜绘图替身</div>,
}));
import App from "../src/App.jsx";
import { loadLaboratory } from "../src/LaboratoryLoader.jsx";
import { lessons, defaults } from "../src/lessons.mjs";
import { microscopeChapters } from "../src/microscopeChapters.mjs";
import { lensChapters } from "../src/lensChapters.mjs";
import { ohmChapters } from "../src/ohmChapters.mjs";
import { acidChapters } from "../src/acidChapters.mjs";
import { dilutionChapters } from "../src/dilutionChapters.mjs";
import { solubilityChapters } from "../src/solubilityChapters.mjs";

// Cold transformation of the shared laboratory is setup work. Keeping it out of
// the first React act prevents a setup timeout from leaking into later cases.
beforeAll(async () => {
  await loadLaboratory();
}, 30000);

it.each([
  ["microscope", microscopeChapters, { x: 5 }],
  ["lens", lensChapters, { sourceOffset: 2 }],
  ["ohm", ohmChapters, { trace: 2 }],
  ["acid", acidChapters, { base: 60 }],
  ["dilution", dilutionChapters, { add: 200 }],
  ["solubility", solubilityChapters, { temp: 80, mass: 100 }],
])(
  "restarts %s from clean chapter parameters without clearing records",
  async (id, chapters, changed) => {
    globalThis.IS_REACT_ACT_ENVIRONMENT = true;
    localStorage.clear();
    location.hash = id;
    window.scrollTo = vi.fn();
    const lesson = lessons.find((item) => item.id === id);
    localStorage.setItem(
      `zhijing:experiment:v1:${id}`,
      JSON.stringify({
        version: 1,
        p: { ...defaults(lesson), ...changed },
        t: 0,
        records: [],
      }),
    );
    const host = document.createElement("div"),
      root = createRoot(host);
    document.body.append(host);
    try {
      await act(() => root.render(<App />));
      await act(async () => {
        await loadLaboratory();
      });
      const index = chapters.findIndex((item) => item.preset);
      await act(() =>
        host.querySelectorAll("nav.microscope-chapters button")[index].click(),
      );
      const click = async (text) => {
        const button = [...host.querySelectorAll("button")].find(
          (b) => b.textContent.trim() === text,
        );
        expect(button, text).toBeDefined();
        await act(() => button.click());
      };
      await click("记录当前状态");
      await click("重做本节");
      const state = JSON.parse(
        localStorage.getItem(`zhijing:experiment:v1:${id}`),
      );
      expect(state.p).toEqual({
        ...defaults(lesson),
        ...chapters[index].preset,
      });
      expect(state.records).toHaveLength(1);
      expect(
        host.querySelector('nav.microscope-chapters [aria-current="step"]')
          .textContent,
      ).toContain(chapters[index].title);
      expect(host.textContent).toContain("已重做本节");
    } finally {
      await act(() => root.unmount());
      host.remove();
      localStorage.clear();
    }
  },
);

it("restarts the current cell chapter while preserving display preferences and recorded evidence", async () => {
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  localStorage.clear();
  location.hash = "cell";
  window.scrollTo = vi.fn();
  const host = document.createElement("div"),
    root = createRoot(host);
  document.body.append(host);
  const click = async (text) => {
    const button = [...host.querySelectorAll("button")].find(
      (b) => b.textContent.trim() === text,
    );
    expect(button, text).toBeDefined();
    await act(() => button.click());
  };
  try {
    await act(() => root.render(<App />));
    await act(async () => {
      await loadLaboratory();
    });
    const chapters = host.querySelectorAll(
      'nav[aria-label="学习子主题"] button',
    );
    await act(() => chapters[3].click());
    await click("基质细节");
    expect(
      JSON.parse(localStorage.getItem("zhijing:experiment:v1:cell")).p
        .mitochondrionMode,
    ).toBe(3);
    await click("俯视");
    await click("隐藏结构标注");
    await click("记录当前状态");
    await click("重做本节");
    const state = JSON.parse(
      localStorage.getItem("zhijing:experiment:v1:cell"),
    );
    expect(state.p.part).toBe(4);
    expect(state.p.mitochondrionMode).toBe(0);
    expect(state.p.cellAngle).toBe(2);
    expect(state.p.labels).toBe(0);
    expect(state.records).toHaveLength(1);
    expect(
      host.querySelector('[aria-label="当前学习任务"]').textContent,
    ).toContain("线粒体与能量转换");
    expect(
      host.querySelector('[aria-label="观察对象"] [aria-pressed="true"]')
        .textContent,
    ).toBe("线粒体近景");
  } finally {
    await act(() => root.unmount());
    host.remove();
    localStorage.clear();
  }
});

it("diagram switch supports click and keyboard while resetting the RC experiment to the matching initial state", async () => {
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  localStorage.clear();
  location.hash = "capacitor";
  window.scrollTo = vi.fn();
  const host = document.createElement("div"),
    root = createRoot(host);
  document.body.append(host);
  const saved = () =>
    JSON.parse(localStorage.getItem("zhijing:experiment:v1:capacitor"));
  try {
    await act(() => root.render(<App />));
    await act(async () => {
      await loadLaboratory();
    });
    const control = host.querySelector(".rc-diagram-switch");
    expect(control.getAttribute("tabindex")).toBe("0");
    const probe = host.querySelector(".rc-curve-probe");
    const tau = (saved().p.r * saved().p.c) / 1000;
    await act(() =>
      [...host.querySelectorAll("button")]
        .find((b) => b.textContent.trim() === "观察 1τ")
        .click(),
    );
    expect(saved().t).toBeCloseTo(tau);
    await act(() =>
      probe.dispatchEvent(
        new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }),
      ),
    );
    expect(saved().t).toBeCloseTo(1.1 * tau);
    await act(() =>
      probe.dispatchEvent(
        new KeyboardEvent("keydown", { key: "End", bubbles: true }),
      ),
    );
    expect(saved().t).toBeCloseTo(5 * tau);
    await act(() =>
      control.dispatchEvent(new MouseEvent("click", { bubbles: true })),
    );
    expect(saved().p.mode).toBe(1);
    expect(saved().t).toBe(0);
    expect(control.getAttribute("aria-label")).toContain("当前放电");
    await act(() =>
      control.dispatchEvent(
        new KeyboardEvent("keydown", { key: "Enter", bubbles: true }),
      ),
    );
    expect(saved().p.mode).toBe(0);
    await act(() =>
      control.dispatchEvent(
        new KeyboardEvent("keydown", { key: " ", bubbles: true }),
      ),
    );
    expect(saved().p.mode).toBe(1);
    await act(() =>
      control.dispatchEvent(
        new KeyboardEvent("keydown", { key: " ", repeat: true, bubbles: true }),
      ),
    );
    expect(saved().p.mode).toBe(1);
  } finally {
    await act(() => root.unmount());
    host.remove();
    localStorage.clear();
  }
});

it("precipitation stage shortcuts seek the scene without changing reagents and preserve settled mass", async () => {
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  localStorage.clear();
  location.hash = "precipitation";
  window.scrollTo = vi.fn();
  const host = document.createElement("div"),
    root = createRoot(host);
  document.body.append(host);
  const button = (label) =>
    [...host.querySelectorAll("button")].find(
      (b) => b.textContent.trim() === label,
    );
  const saved = () =>
    JSON.parse(localStorage.getItem("zhijing:experiment:v1:precipitation"));
  try {
    await act(() => root.render(<App />));
    await act(async () => {
      await loadLaboratory();
    });
    const initial = saved().p;
    await act(() => button("滴加完成").click());
    expect(saved().t).toBe(8);
    expect(saved().p).toEqual(initial);
    const amounts = host.querySelector(".precipitation-ions").textContent;
    await act(() => button("静置观察").click());
    expect(saved().t).toBe(20);
    expect(host.querySelector(".precipitation-ions").textContent).toBe(amounts);
    await act(() => button("滴加前").click());
    expect(saved().t).toBe(0);
    expect(host.querySelector(".precipitation-guide").textContent).toContain(
      "溶液仍含铜离子",
    );
    expect(saved().p).toEqual(initial);
  } finally {
    await act(() => root.unmount());
    host.remove();
    localStorage.clear();
  }
});

it("单位圆章节的关键角同步曲线探针，并与切线章节隔离", async () => {
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  localStorage.clear();
  location.hash = "functions";
  window.scrollTo = vi.fn();
  const host = document.createElement("div"),
    root = createRoot(host);
  document.body.append(host);
  const button = (text) =>
    [...host.querySelectorAll("button")].find(
      (b) => b.textContent.trim() === text,
    );
  try {
    await act(() => root.render(<App />));
    await act(async () => {
      await loadLaboratory();
    });
    await act(() =>
      [...host.querySelectorAll('nav[aria-label="学习子主题"] button')]
        .find((b) => b.textContent.includes("单位圆与正弦"))
        .click(),
    );
    await act(() => button("单位圆正弦").click());
    await act(() => button("π/2").click());
    expect(
      JSON.parse(localStorage.getItem("zhijing:experiment:v1:functions")).p
        .probe,
    ).toBeCloseTo(Math.PI / 2, 12);
    expect(host.querySelector(".unit-circle-values").textContent).toContain(
      "1.000",
    );
    expect(
      host.querySelector('[aria-label="函数族坐标图与可拖动探针"]').textContent,
    ).toContain("P (1.571, 1)");
    const time = () =>
      Number(host.querySelector('[aria-label="实验时间轴"]').value);
    expect(time()).toBeCloseTo(10 + Math.PI, 12);
    await act(() => button("扫描观察点").click());
    expect(time()).toBeCloseTo(10 + Math.PI, 12);
    await act(() => button("暂停").click());
    await act(() => button("前进 0.2 s").click());
    expect(time()).toBeCloseTo(10.2 + Math.PI, 12);
    expect(
      host.querySelector('[aria-label="函数族坐标图与可拖动探针"]').textContent,
    ).toContain("P (1.671, 0.995)");
    await act(() => button("振幅加倍").click());
    expect(host.querySelector(".unit-circle-values").textContent).toContain(
      "2.000",
    );
    await act(() =>
      [...host.querySelectorAll('nav[aria-label="学习子主题"] button')]
        .find((b) => b.textContent.includes("割线趋近切线"))
        .click(),
    );
    expect(host.querySelector(".unit-circle")).toBe(null);
  } finally {
    await act(() => root.unmount());
    host.remove();
    localStorage.clear();
  }
});

it("solid scanning continues from manual sections, steps forward and restarts only at the endpoint", async () => {
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  localStorage.clear();
  location.hash = "solids";
  window.scrollTo = vi.fn();
  vi.stubGlobal(
    "requestAnimationFrame",
    vi.fn(() => 1),
  );
  vi.stubGlobal("cancelAnimationFrame", vi.fn());
  const host = document.createElement("div"),
    root = createRoot(host);
  document.body.append(host);
  const button = (text) =>
    [...host.querySelectorAll("button")].find(
      (b) => b.textContent.trim() === text,
    );
  const time = () =>
    Number(host.querySelector('[aria-label="实验时间轴"]').value);
  try {
    await act(() => root.render(<App />));
    await act(async () => {
      await loadLaboratory();
    });
    expect(time()).toBe(9);
    await act(() =>
      host.querySelectorAll('nav[aria-label="学习子主题"] button')[4].click(),
    );
    await act(() => button("观察半高").click());
    expect(time()).toBe(10);
    await act(() => button("扫描水平截面").click());
    expect(time()).toBe(10);
    await act(() => button("暂停").click());
    await act(() => button("前进 0.2 s").click());
    expect(time()).toBeCloseTo(10.2, 10);
    expect(host.querySelector(".solids-guide").textContent).toContain("88.2%");
    await act(() => button("完整体积").click());
    expect(time()).toBe(20);
    await act(() => button("扫描水平截面").click());
    expect(time()).toBe(0);
    expect(
      host.querySelector(".solids-guide svg").getAttribute("aria-label"),
    ).toContain("圆锥累计体积 0.000");
    await act(() => button("暂停").click());
    await act(() => button("复位").click());
    expect(time()).toBe(9);
  } finally {
    await act(() => root.unmount());
    host.remove();
    localStorage.clear();
    vi.unstubAllGlobals();
  }
});

it("starts the selected capacitor chapter with its matching charge or discharge initial condition", async () => {
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  localStorage.clear();
  location.hash = "capacitor";
  window.scrollTo = vi.fn();
  const host = document.createElement("div"),
    root = createRoot(host);
  document.body.append(host);
  try {
    await act(() => root.render(<App />));
    await act(async () => {
      await loadLaboratory();
    });
    const chapters = host.querySelectorAll(
      'nav[aria-label="学习子主题"] button',
    );
    for (const mode of [1, 0]) {
      await act(() => chapters[mode].click());
      const saved = JSON.parse(
        localStorage.getItem("zhijing:experiment:v1:capacitor"),
      );
      expect(saved.p.mode).toBe(mode);
      expect(saved.t).toBe(1);
      expect(
        host.querySelector('[aria-label="当前学习任务"]').textContent,
      ).toContain(mode ? "电容放电" : "电容充电");
    }
    await act(() =>
      [...host.querySelectorAll("button")]
        .find((b) => b.textContent.trim() === "前进 0.2 s")
        .click(),
    );
    await act(() =>
      host.querySelector('button[aria-label="接线显示 选通路径"]').click(),
    );
    const traced = JSON.parse(
      localStorage.getItem("zhijing:experiment:v1:capacitor"),
    );
    expect(traced.t).toBeCloseTo(1.2, 10);
    expect(traced.p.trace).toBe(1);
    await act(() => chapters[3].click());
    await act(() =>
      [
        ...host.querySelectorAll('[aria-label="能量观察时刻"] button'),
      ][1].click(),
    );
    const energyState = JSON.parse(
      localStorage.getItem("zhijing:experiment:v1:capacitor"),
    );
    expect(energyState.p).toMatchObject({
      mode: 1,
      fieldLines: 1,
      u: 6,
      r: 1000,
      c: 4,
    });
    expect(energyState.t).toBe((energyState.p.r * energyState.p.c) / 1000);
    expect(
      host.querySelector(".rc-energy svg").getAttribute("aria-label"),
    ).toContain("能量守恒");
  } finally {
    await act(() => root.unmount());
    host.remove();
    localStorage.clear();
  }
});

it("keeps plate chapter selection and the visible boundary type synchronized", async () => {
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  localStorage.clear();
  location.hash = "plates";
  window.scrollTo = vi.fn();
  const host = document.createElement("div"),
    root = createRoot(host);
  document.body.append(host);
  try {
    await act(() => root.render(<App />));
    await act(async () => {
      await loadLaboratory();
    });
    const buttons = [
      ...host.querySelectorAll('nav[aria-label="学习子主题"] button'),
    ];
    await act(() => buttons[1].click());
    expect(
      JSON.parse(localStorage.getItem("zhijing:experiment:v1:plates")).p.type,
    ).toBe(1);
    expect(
      host.querySelector('[aria-label="当前学习任务"]').textContent,
    ).toContain("大陆碰撞");
    await act(() => buttons[2].click());
    expect(
      JSON.parse(localStorage.getItem("zhijing:experiment:v1:plates")).p.type,
    ).toBe(2);
    await act(() =>
      [...host.querySelectorAll("button")]
        .find((b) => b.textContent.trim() === "复位")
        .click(),
    );
    expect(
      host.querySelector('[aria-label="当前学习任务"]').textContent,
    ).toContain("张裂边界");
  } finally {
    await act(() => root.unmount());
    host.remove();
    localStorage.clear();
  }
});

it("preserves recorded evidence across scenarios and reset, and only clears through the explicit control", async () => {
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  localStorage.clear();
  location.hash = "volcano";
  window.scrollTo = vi.fn();
  const host = document.createElement("div"),
    root = createRoot(host);
  document.body.append(host);
  const click = async (text) => {
    const button = [...host.querySelectorAll("button")].find(
      (item) => item.textContent.trim() === text,
    );
    expect(button, text).toBeDefined();
    await act(() => button.click());
  };
  try {
    await act(() => root.render(<App />));
    await act(async () => {
      await loadLaboratory();
    });
    await click("记录当前状态");
    expect(host.querySelectorAll("tbody tr").length).toBe(1);
    await click("完整外观");
    await click("复位");
    expect(host.querySelectorAll("tbody tr").length).toBe(1);
    const snapshot = JSON.parse(
      localStorage.getItem("zhijing:experiment:v1:volcano"),
    );
    expect(snapshot.records.length).toBe(1);
    await click("确认清空当前主题记录");
    expect(host.querySelectorAll("tbody tr").length).toBe(0);
    expect(host.textContent).toContain("已清空当前主题");
  } finally {
    await act(() => root.unmount());
    host.remove();
    localStorage.clear();
  }
});

it("synchronizes molecular chapters with single and ensemble models", async () => {
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  localStorage.clear();
  location.hash = "molecule";
  window.scrollTo = vi.fn();
  const host = document.createElement("div"),
    root = createRoot(host);
  document.body.append(host);
  try {
    await act(() => root.render(<App />));
    await act(async () => {
      await loadLaboratory();
    });
    const chapters = host.querySelectorAll(
      'nav[aria-label="学习子主题"] button',
    );
    for (const [chapter, type, ensemble] of [
      [1, 1, 0],
      [2, 2, 0],
      [3, 0, 1],
      [0, 0, 0],
    ]) {
      await act(() => chapters[chapter].click());
      const saved = JSON.parse(
        localStorage.getItem("zhijing:experiment:v1:molecule"),
      );
      expect(saved.p.type).toBe(type);
      expect(saved.p.ensemble).toBe(ensemble);
      if (chapter === 2) expect(saved.p.lonePairs).toBe(1);
      expect(saved.t).toBe(0);
    }
  } finally {
    await act(() => root.unmount());
    host.remove();
    localStorage.clear();
  }
});

it("prepares appropriate initial conditions for projectile learning chapters", async () => {
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  localStorage.clear();
  location.hash = "projectile";
  window.scrollTo = vi.fn();
  const host = document.createElement("div"),
    root = createRoot(host);
  document.body.append(host);
  try {
    await act(() => root.render(<App />));
    await act(async () => {
      await loadLaboratory();
    });
    const chapters = host.querySelectorAll(
      'nav[aria-label="学习子主题"] button',
    );
    for (const [chapter, angle, height, time] of [
      [0, 0, 5, 0.5],
      [1, 30, 0, 0.75],
      [2, 45, 0, 1],
    ]) {
      await act(() => chapters[chapter].click());
      const saved = JSON.parse(
        localStorage.getItem("zhijing:experiment:v1:projectile"),
      );
      expect(saved.p.angle).toBe(angle);
      expect(saved.p.height).toBe(height);
      expect(saved.t).toBe(time);
    }
  } finally {
    await act(() => root.unmount());
    host.remove();
    localStorage.clear();
  }
});

it("cell structure selection synchronizes close-up, chapter and cutaway while cut adjustments return to overview", async () => {
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  localStorage.clear();
  location.hash = "cell";
  window.scrollTo = vi.fn();
  const host = document.createElement("div"),
    root = createRoot(host);
  document.body.append(host);
  try {
    await act(() => root.render(<App />));
    await act(async () => {
      await loadLaboratory();
    });
    const chapters = host.querySelectorAll(
      'nav[aria-label="学习子主题"] button',
    );
    await act(() => chapters[2].click());
    const chlor = host.querySelector('button[aria-label="观察结构 叶绿体"]');
    await act(() => chlor.click());
    expect(
      host.querySelector('[aria-label="当前学习任务"]').textContent,
    ).toContain("叶绿体与整体");
    expect(
      [
        ...host.querySelectorAll(
          '[aria-label="观察对象"] button, [aria-label="观察方向"] button',
        ),
      ]
        .find((b) => b.textContent === "叶绿体近景")
        .getAttribute("aria-pressed"),
    ).toBe("true");
    const saved = JSON.parse(
      localStorage.getItem("zhijing:experiment:v1:cell"),
    );
    expect(saved.p.cut).toBe(100);
    expect(saved.p.part).toBe(3);
    await act(() =>
      host.querySelector('button[aria-label="观察结构 细胞核"]').click(),
    );
    expect(
      host.querySelector('[aria-label="当前学习任务"]').textContent,
    ).toContain("细胞核与液泡");
    await act(() =>
      host.querySelector('button[aria-label="观察结构 线粒体"]').click(),
    );
    expect(
      host.querySelector('[aria-label="当前学习任务"]').textContent,
    ).toContain("线粒体与能量转换");
    expect(
      [
        ...host.querySelectorAll(
          '[aria-label="观察对象"] button, [aria-label="观察方向"] button',
        ),
      ]
        .find((b) => b.textContent === "线粒体近景")
        .getAttribute("aria-pressed"),
    ).toBe("true");
    expect(
      JSON.parse(localStorage.getItem("zhijing:experiment:v1:cell")).p.part,
    ).toBe(4);
    await act(() =>
      [
        ...host.querySelectorAll(
          '[aria-label="观察对象"] button, [aria-label="观察方向"] button',
        ),
      ]
        .find((b) => b.textContent === "液泡近景")
        .click(),
    );
    expect(
      JSON.parse(localStorage.getItem("zhijing:experiment:v1:cell")).p.part,
    ).toBe(2);
    expect(
      host.querySelector('[aria-label="当前学习任务"]').textContent,
    ).toContain("细胞核与液泡");
    await act(() =>
      host.querySelector('button[aria-label="液泡呈现 完整外形"]').click(),
    );
    expect(
      JSON.parse(localStorage.getItem("zhijing:experiment:v1:cell")).p
        .vacuoleSection,
    ).toBe(0);
    await act(() => root.render(null));
    await act(() => root.render(<App />));
    await act(async () => {
      await loadLaboratory();
    });
    const cameraButton = (name) =>
      [
        ...host.querySelectorAll(
          '[aria-label="观察对象"] button, [aria-label="观察方向"] button',
        ),
      ].find((b) => b.textContent === name);
    expect(cameraButton("液泡近景").getAttribute("aria-pressed")).toBe("true");
    expect(
      host.querySelector('[aria-label="当前学习任务"]').textContent,
    ).toContain("细胞核与液泡");
    await act(() =>
      [...host.querySelectorAll("button")]
        .find((b) => b.textContent.trim() === "返回细胞全景")
        .click(),
    );
    await act(() => root.render(null));
    await act(() => root.render(<App />));
    await act(async () => {
      await loadLaboratory();
    });
    expect(cameraButton("立体").getAttribute("aria-pressed")).toBe("true");
    expect(
      JSON.parse(localStorage.getItem("zhijing:experiment:v1:cell")).p.part,
    ).toBe(2);
    await act(() =>
      host.querySelectorAll('nav[aria-label="学习子主题"] button')[5].click(),
    );
    expect(cameraButton("内质网近景").getAttribute("aria-pressed")).toBe(
      "true",
    );
    await act(() =>
      [...host.querySelectorAll("button")]
        .find((b) => b.textContent.trim() === "隐藏结构标注")
        .click(),
    );
    expect(
      JSON.parse(localStorage.getItem("zhijing:experiment:v1:cell")).p.labels,
    ).toBe(0);
    expect(host.querySelector(".topic-explanation").open).toBe(false);
    expect(host.querySelector(".topic-explanation").textContent).toContain(
      "不是原子级结构",
    );
    expect(host.querySelector(".micro-task").textContent.length).toBeLessThan(
      80,
    );
    await act(() =>
      [...host.querySelectorAll("button")]
        .find((b) => b.textContent.trim() === "单看粗面")
        .click(),
    );
    expect(
      JSON.parse(localStorage.getItem("zhijing:experiment:v1:cell")).p.labels,
    ).toBe(0);
    expect(
      JSON.parse(localStorage.getItem("zhijing:experiment:v1:cell")).p.erMode,
    ).toBe(1);
    await act(() => root.render(null));
    await act(() => root.render(<App />));
    await act(async () => {
      await loadLaboratory();
    });
    expect(
      [...host.querySelectorAll("button")]
        .find((b) => b.textContent.trim() === "显示结构标注")
        .getAttribute("aria-pressed"),
    ).toBe("false");
    expect(cameraButton("内质网近景").getAttribute("aria-pressed")).toBe(
      "true",
    );
    expect(
      JSON.parse(localStorage.getItem("zhijing:experiment:v1:cell")).p.part,
    ).toBe(6);
  } finally {
    await act(() => root.unmount());
    host.remove();
    localStorage.clear();
  }
});

it("opens the cytoskeleton chapter with a valid overview and restores its comparison after reload", async () => {
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  localStorage.clear();
  location.hash = "cell";
  window.scrollTo = vi.fn();
  const host = document.createElement("div"),
    root = createRoot(host);
  document.body.append(host);
  const saved = () =>
    JSON.parse(localStorage.getItem("zhijing:experiment:v1:cell"));
  try {
    await act(() => root.render(<App />));
    await act(async () => {
      await loadLaboratory();
    });
    await act(() =>
      host.querySelectorAll('nav[aria-label="学习子主题"] button')[7].click(),
    );
    expect(saved().p).toMatchObject({ part: 0, cut: 100, cytoskeleton: 3 });
    expect(saved().observation).toMatchObject({
      chapter: 7,
      view: "perspective",
    });
    await act(() =>
      host.querySelector('[aria-label="细胞骨架对照 肌动蛋白丝"]').click(),
    );
    expect(saved().p.cytoskeleton).toBe(2);
    await act(() => root.render(null));
    await act(() => root.render(<App />));
    await act(async () => {
      await loadLaboratory();
    });
    expect(saved().observation.chapter).toBe(7);
    expect(
      host
        .querySelector('[aria-label="细胞骨架对照 肌动蛋白丝"]')
        .getAttribute("aria-pressed"),
    ).toBe("true");
    expect(host.textContent).toContain("皮层微管位于细胞壁之外");
  } finally {
    await act(() => root.unmount());
    host.remove();
    localStorage.clear();
  }
});

it.each(lessons.filter((l) => l.id !== "contour").map((l) => [l.id]))(
  "%s chapter buttons load corresponding demonstrations, including repeat selection",
  async (id) => {
    globalThis.IS_REACT_ACT_ENVIRONMENT = true;
    vi.stubGlobal(
      "ResizeObserver",
      class {
        observe() {}
        unobserve() {}
        disconnect() {}
      },
    );
    localStorage.clear();
    location.hash = id;
    window.scrollTo = vi.fn();
    const host = document.createElement("div"),
      root = createRoot(host);
    document.body.append(host);
    try {
      await act(() => root.render(<App />));
      await act(async () => {
        await loadLaboratory();
      });
      const nav = () => [
        ...host.querySelectorAll(
          'nav[aria-label="学习子主题"] button,nav.microscope-chapters button',
        ),
      ];
      const buttons = [...new Set(nav())];
      expect(buttons.length).toBeGreaterThan(0);
      let previous;
      for (let i = 0; i < buttons.length; i++) {
        await act(() => buttons[i].click());
        const state = JSON.parse(
          localStorage.getItem(`zhijing:experiment:v1:${id}`),
        );
        expect(
          buttons[i].getAttribute("aria-current"),
          `${id}/${i} current chapter`,
        ).toBe("step");
        if (state.observation) expect(state.observation.chapter).toBe(i);
        const signature = JSON.stringify({
          p: state.p,
          t: state.t,
          view: state.observation?.view,
          presentation: host
            .querySelector(".genetics-studio")
            ?.getAttribute("aria-label"),
        });
        expect(signature, `${id}/${i} must change demo`).not.toBe(previous);
        previous = signature;
        await act(() => buttons[i].click());
        const repeated = JSON.parse(
          localStorage.getItem(`zhijing:experiment:v1:${id}`),
        );
        expect({
          p: repeated.p,
          t: repeated.t,
          view: repeated.observation?.view,
        }).toEqual({ p: state.p, t: state.t, view: state.observation?.view });
      }
    } finally {
      await act(() => root.unmount());
      host.remove();
      vi.unstubAllGlobals();
      localStorage.clear();
    }
  },
  20000,
);
