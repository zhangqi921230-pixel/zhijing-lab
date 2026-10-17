export function microscopeObservationCaption(
  p,
  time,
  photoZoom = null,
  photoName = "",
) {
  const photo = photoZoom !== null;
  return [
    photo
      ? "知境 · 本地照片观察"
      : `知境 · ${["字母 e", "洋葱表皮", "池塘微生物"][p.specimen]}观察`,
    ...(photo && photoName ? [`来源文件：${photoName}`] : []),
    photo
      ? `数字缩放 ${photoZoom}× · 未标定尺度`
      : `总倍率 ${p.mag}×（目镜 10× · 物镜 ${p.mag / 10}×）`,
    `粗准焦 ${p.coarse} · 细准焦 ${p.focus} · 照明 ${!photo && p.power === 0 ? "关闭" : p.light + "%"}${photo ? "" : ` · 光阑 ${p.aperture ?? 70}%`}`,
    photo
      ? "调焦、照明为数字处理，不用于尺寸测量"
      : `玻片位移 X ${p.x} / Y ${p.y} · 演示时间 ${time.toFixed(1)} s`,
    photo
      ? "本地照片 · 数字缩放不增加光学分辨率"
      : "程序绘制示意 · 非实拍 · 比例尺不用于真实标本测量",
  ];
}
