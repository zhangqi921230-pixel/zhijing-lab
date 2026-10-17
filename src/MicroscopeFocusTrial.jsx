import { microscopeTrialFeedback } from "./microscopeTrialFeedback.mjs";
import React, { useState } from "react";
import Button from "./LabButton.jsx";
export default function MicroscopeFocusTrial({ p, optics, onPrepare }) {
  const [trial, setTrial] = useState(null);
  const valid =
    trial && Object.entries(trial.expected).every(([k, v]) => p[k] === v);
  const visible =
    optics.illuminated && p.light >= 20 && optics.apertureTransmission >= 0.1;
  function adjust(step) {
    const next = Math.max(0, Math.min(100, p.focus + step));
    setTrial({ expected: { ...p, focus: next }, blur: optics.blur, visible });
    onPrepare({ focus: next });
  }
  return (
    <div className="micro-task" aria-label="细调前后观察练习">
      <strong>小幅试调，再决定方向</strong>
      <p>
        每次只移动细准焦 2
        格，比较当前模拟视野和调整前的清晰程度；变模糊时尝试反向。方向指模拟旋钮刻度，不代表真实镜头升降方向。
      </p>
      <div className="motion-shortcuts">
        <Button disabled={p.focus <= 0} onClick={() => adjust(-2)}>
          细调 −2 格
        </Button>
        <Button disabled={p.focus >= 100} onClick={() => adjust(2)}>
          细调 +2 格
        </Button>
      </div>
      <p role="status">
        {microscopeTrialFeedback({ valid, visible, blur: optics.blur, trial })}
      </p>
      <p>
        反馈来自当前模拟的调焦模型；更换标本、倍率或其他观察条件后重新比较，不评价本地上传照片的真实焦点。
      </p>
    </div>
  );
}
