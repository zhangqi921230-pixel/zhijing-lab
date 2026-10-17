export function microscopeTrialFeedback({ valid, visible, blur, trial }) {
  if (!visible) return "照明不足，暂不比较清晰度。先改善照明再试调。";
  if (blur <= 0.6)
    return "当前已合焦：停止连续试调，先观察标本细节，再将目标移到中央。";
  if (!valid) return "先观察目镜，再选择一个方向小幅调整。";
  if (!trial.visible)
    return "调整前照明不足，无法比较。请在当前照明下重新试调。";
  if (trial.blur <= 0.6)
    return "已离开刚才的合焦范围：尝试反向细调，重新观察标本边缘。";
  const difference = blur - trial.blur;
  if (Math.abs(difference) < 0.01)
    return "调整前后清晰程度相近，可继续小幅尝试。";
  return difference < 0
    ? "比调整前更清晰：可以沿这一方向继续小幅尝试。"
    : "比调整前更模糊：尝试反向细调，并观察目镜。";
}
