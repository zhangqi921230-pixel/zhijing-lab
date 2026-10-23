import React, { useEffect, useState } from "react";

let modulePromise;
export function loadLaboratory() {
  if (!modulePromise)
    modulePromise = import("./Laboratory.jsx").catch((error) => {
      modulePromise = undefined;
      throw error;
    });
  return modulePromise;
}

function Recovery({ goHome }) {
  return (
    <main className="scene-loading" role="alert">
      <strong>实验工作台暂时无法加载</strong>
      <p>请检查网络后重新加载。已保存的本机实验记录会保留。</p>
      <div className="cube-pairs">
        <button className="btn" onClick={() => window.location.reload()}>
          重新加载页面
        </button>
        <button className="btn" onClick={goHome}>
          返回探索馆
        </button>
      </div>
    </main>
  );
}
export class LaboratoryBoundary extends React.Component {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed
      ? this.props.fallback || <Recovery goHome={this.props.goHome} />
      : this.props.children;
  }
}

export default function LaboratoryLoader(props) {
  const [Component, setComponent] = useState(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    let active = true;
    loadLaboratory().then(
      (module) => {
        if (active) setComponent(() => module.default);
      },
      () => {
        if (active) setFailed(true);
      },
    );
    return () => {
      active = false;
    };
  }, []);
  if (failed) return <Recovery goHome={props.goHome} />;
  if (!Component)
    return (
      <main className="scene-loading" role="status">
        <span className="scene-loading-ring" aria-hidden="true" />
        <strong>正在准备{props.lesson.title}</strong>
        <p>正在加载实验工作台与操作说明。</p>
        <button className="btn" onClick={props.goHome}>
          返回探索馆
        </button>
      </main>
    );
  return (
    <LaboratoryBoundary key={props.lesson.id} goHome={props.goHome}>
      <Component {...props} />
    </LaboratoryBoundary>
  );
}
