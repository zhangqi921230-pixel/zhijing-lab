export function validateSpecimenHeader(bytes, size) {
  if (size > 10 * 1024 * 1024) return "照片不能超过 10 MB，请先缩小文件。";
  const jpeg = bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255;
  const png = [137, 80, 78, 71, 13, 10, 26, 10].every((v, i) => bytes[i] === v);
  const webp =
    String.fromCharCode(...bytes.slice(0, 4)) === "RIFF" &&
    String.fromCharCode(...bytes.slice(8, 12)) === "WEBP";
  return jpeg || png || webp ? "" : "请选择有效的 JPG、PNG 或 WebP 照片。";
}
