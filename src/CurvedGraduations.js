import * as T from "three";

export function graduationSurface(radius, base, height, angularWidth = 0.85) {
  const geometry = new T.PlaneGeometry(angularWidth, height, 24, 1);
  const position = geometry.attributes.position;
  for (let i = 0; i < position.count; i++) {
    const angle = position.getX(i);
    position.setXYZ(
      i,
      radius * Math.sin(angle),
      base + height / 2 + position.getY(i),
      radius * Math.cos(angle),
    );
  }
  geometry.computeVertexNormals();
  geometry.computeBoundingSphere();
  return geometry;
}

export function addCurvedGraduations(
  root,
  { name, radius, base, height, marks, z = 0 },
) {
  let texture = null;
  if (typeof document !== "undefined") {
    const canvas = document.createElement("canvas");
    canvas.width = 384;
    canvas.height = 1024;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, 384, 1024);
    ctx.strokeStyle = ctx.fillStyle = "#d7e5df";
    ctx.lineWidth = 3;
    ctx.font = '36px "Microsoft YaHei", sans-serif';
    ctx.textBaseline = "middle";
    for (const mark of marks) {
      const y = (1 - (mark.y - base) / height) * 1024;
      if (mark.caption) {
        ctx.save();
        ctx.textAlign = "center";
        ctx.fillText(mark.caption, 192, y, 324);
        ctx.restore();
        continue;
      }
      ctx.beginPath();
      ctx.moveTo(30, y);
      ctx.lineTo(mark.label ? 170 : 100, y);
      ctx.stroke();
      if (mark.label) ctx.fillText(mark.label, 190, y);
    }
    texture = new T.CanvasTexture(canvas);
    texture.colorSpace = T.SRGBColorSpace;
  }
  const mesh = new T.Mesh(
    graduationSurface(radius, base, height),
    new T.MeshBasicMaterial({
      map: texture,
      transparent: true,
      depthWrite: false,
      toneMapped: false,
      side: T.FrontSide,
    }),
  );
  mesh.name = name;
  mesh.position.z = z;
  mesh.userData.ownedTexture = texture;
  // Printed marks do not intercept picking of glassware or apparatus behind them.
  mesh.raycast = () => {};
  root.add(mesh);
  return mesh;
}
