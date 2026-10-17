import React, { useEffect, useState } from "react";
function LoadingState() {
  return (
    <div className="scene-loading" role="status">
      <span className="scene-loading-ring" aria-hidden="true" />
      <strong>正在准备三维实验</strong>
      <span>模型加载后即可旋转观察，参数可先调整。</span>
    </div>
  );
}
function Recovery() {
  return (
    <div className="scene-loading" role="alert">
      <strong>三维场景暂时无法加载</strong>
      <p>请检查网络后重新加载页面。已保存的本机实验记录会保留。</p>
      <button className="btn" onClick={() => window.location.reload()}>
        重新加载页面
      </button>
    </div>
  );
}
class SceneBoundary extends React.Component {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? <Recovery /> : this.props.children;
  }
}
let sceneModule;
function loadScene() {
  if (!sceneModule)
    sceneModule = import("./ThreeScene.jsx").catch((error) => {
      sceneModule = undefined;
      throw error;
    });
  return sceneModule;
}
export default function SceneLoader(props) {
  const [Scene, setScene] = useState(null),
    [failed, setFailed] = useState(false);
  useEffect(() => {
    let active = true;
    loadScene().then(
      (module) => {
        if (active) setScene(() => module.default);
      },
      () => {
        if (active) setFailed(true);
      },
    );
    return () => {
      active = false;
    };
  }, []);
  if (failed) return <Recovery />;
  if (!Scene) return <LoadingState />;
  return (
    <SceneBoundary key={props.id}>
      <Scene {...props} />
    </SceneBoundary>
  );
}
