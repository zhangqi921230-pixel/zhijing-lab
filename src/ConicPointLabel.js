import * as THREE from "three";
export function conicPointLabel(parent, text, color, offset, width = 36) {
  const group = new THREE.Group();
  group.name = `conic-label-${text}`;
  parent.add(group);
  const line = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(),
      new THREE.Vector3(...offset),
    ]),
    new THREE.LineBasicMaterial({
      color,
      depthTest: false,
      toneMapped: false,
      transparent: true,
      depthWrite: false,
    }),
  );
  line.renderOrder = 9;
  group.add(line);
  let context, texture;
  if (typeof document !== "undefined") {
    const canvas = document.createElement("canvas");
    canvas.width = Math.round((width * 8) / 3);
    canvas.height = 64;
    context = canvas.getContext("2d");
    if (context) {
      texture = new THREE.CanvasTexture(canvas);
      texture.colorSpace = THREE.SRGBColorSpace;
      const sprite = new THREE.Sprite(
        new THREE.SpriteMaterial({
          map: texture,
          depthTest: false,
          depthWrite: false,
          toneMapped: false,
          sizeAttenuation: false,
        }),
      );
      sprite.userData.ownedTexture = texture;
      sprite.position.set(...offset);
      sprite.scale.set(0.27, 0.18, 1);
      const viewport = new THREE.Vector2();
      sprite.onBeforeRender = (renderer, scene, camera) => {
        // Use CSS pixels, not the drawing-buffer size: DPR must not shrink labels.
        renderer.getSize(viewport);
        const unitsPerPixel =
          2 / (Math.max(1, viewport.y) * camera.projectionMatrix.elements[5]);
        sprite.scale.set(width * unitsPerPixel, 24 * unitsPerPixel, 1);
        sprite.updateMatrixWorld();
      };
      sprite.renderOrder = 10;
      group.add(sprite);
      group.userData.conicLabel = { sprite, line, offset: [...offset], width };
    }
  }
  const setText = (value) => {
    if (group.userData.text === value) return;
    group.userData.text = value;
    if (!context) return;
    const canvasWidth = context.canvas.width;
    context.clearRect(0, 0, canvasWidth, 64);
    context.fillStyle = "#fffdf2ee";
    context.fillRect(0, 0, canvasWidth, 64);
    context.fillStyle = color;
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.font = "bold 36px Georgia, serif";
    context.fillText(value, canvasWidth / 2, 33);
    texture.needsUpdate = true;
  };
  setText(text);
  return { group, setText };
}
