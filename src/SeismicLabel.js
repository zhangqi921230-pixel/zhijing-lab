import * as THREE from "three";

export function seismicLabel(parent, text, position) {
  const label = new THREE.Sprite(
    new THREE.SpriteMaterial({
      color: "#ffffff",
      depthTest: true,
      depthWrite: false,
      sizeAttenuation: false,
      toneMapped: false,
    }),
  );
  label.name = `seismic-label-${text}`;
  label.position.set(...position);
  label.userData.pixelScale = 1;
  let ctx, texture;
  if (typeof document !== "undefined") {
    const canvas = document.createElement("canvas");
    canvas.width = text.length * 40 + 32;
    canvas.height = 64;
    ctx = canvas.getContext("2d");
    if (ctx) {
      texture = new THREE.CanvasTexture(canvas);
      texture.colorSpace = THREE.SRGBColorSpace;
      label.material.map = texture;
      label.userData.ownedTexture = texture;
    }
  }
  label.userData.setText = (value) => {
    if (label.userData.text === value) return;
    label.userData.text = value;
    if (!ctx) return;
    ctx.clearRect(0, 0, ctx.canvas.width, 64);
    ctx.fillStyle = "#10232de8";
    ctx.fillRect(0, 0, ctx.canvas.width, 64);
    ctx.fillStyle = "#f0eadb";
    ctx.font = "500 36px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(value, ctx.canvas.width / 2, 33);
    texture.needsUpdate = true;
  };
  label.userData.setText(text);
  const viewport = new THREE.Vector2();
  label.onBeforeRender = (renderer, scene, camera) => {
    renderer.getSize(viewport);
    const unit =
      2 / (Math.max(1, viewport.y) * camera.projectionMatrix.elements[5]);
    const height = 24 * label.userData.pixelScale;
    label.scale.set(
      (text.length * 15 + 16) * unit * label.userData.pixelScale,
      height * unit,
      1,
    );
    label.updateMatrixWorld();
  };
  parent.add(label);
  return label;
}
