// Advice follows the same simulated focus tolerance as the eyepiece renderer.
// It suggests an operation, never sets the focal plane automatically.
export function microscopeFocusAdvice(p, optics) {
  if (!optics.illuminated)
    return {
      title: "先打开光源",
      text: "当前视野没有照明，暂时不能判断是否合焦。",
      action: "打开光源",
      patch: { power: 1 },
      canAssessFocus: false,
    };
  if (optics.apertureTransmission < 0.1)
    return {
      title: "先调大孔径光阑",
      text: "当前光阑开口过小，模拟视野明显变暗。适当调大开口，再观察标本边缘；这里的提示不表示已计算真实显微镜的最佳孔径。",
      canAssessFocus: false,
    };
  if (p.light < 20)
    return {
      title: "先改善照明",
      text: "当前照明较暗。适当提高灯光强度，再观察标本边缘是否清楚。",
      canAssessFocus: false,
    };
  if (optics.blur <= 0.6)
    return {
      title: "已合焦 · 可以观察",
      text:
        p.mag === 40
          ? "先把要观察的结构移至视野中央，再换高倍；换倍后用细准焦微调。"
          : "观察细胞边缘和内部结构。移动玻片寻找目标时，留意物像沿相反方向移动。",
    };
  const fineReach = 50 * 0.035 + 0.6 / Math.sqrt(p.mag / 100);
  if (p.mag > 40 && Math.abs((p.coarse - 50) * 0.2) > fineReach)
    return {
      title: "回到低倍重新找像",
      text: "当前粗调位置超出细准焦可补偿范围。先换低倍找清物像并居中，再换高倍。",
      action: "换回低倍 40×",
      patch: { mag: 40 },
    };
  return {
    title: p.mag > 40 ? "用细准焦微调" : "寻找清晰的物像",
    text:
      p.mag > 40
        ? "小幅转动细准焦旋钮，观察边缘变清晰还是更模糊；若更模糊，反向微调。"
        : "先缓慢转动粗准焦找到物像，再用细准焦微调；同时侧视物镜与玻片间隙。",
  };
}
