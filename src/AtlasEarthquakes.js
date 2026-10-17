import * as THREE from "three";
import { globePoint } from "./plateGlobeGeometry.mjs";
import { depthBands, earthquakeDepthBand } from "./earthquakeDepth.mjs";

export function addAtlasEarthquakes(scene, events, pixelRatio) {
  const positions = new THREE.Float32BufferAttribute(
    new Float32Array(events.length * 3),
    3,
  );
  const geometry = new THREE.BufferGeometry().setAttribute(
    "position",
    positions,
  );
  const material = (size, color, ring = false) =>
    new THREE.ShaderMaterial({
      uniforms: {
        size: { value: size * pixelRatio },
        tint: { value: new THREE.Color(color) },
      },
      transparent: true,
      depthTest: true,
      depthWrite: false,
      vertexShader:
        "uniform float size; void main(){gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);gl_PointSize=size;}",
      fragmentShader:
        `uniform vec3 tint; void main(){float r=length(gl_PointCoord*2.-1.);float alpha=1.-smoothstep(.72,1.,r);${ring ? "alpha*=smoothstep(.35,.55,r);" : ""}if(alpha<.01)discard;gl_FragColor=vec4(tint,alpha);#include <colorspace_fragment>\n}`.replace(
          ";#include",
          ";\n#include",
        ),
    });
  const dots = new THREE.Points(geometry, material(6, "#ff6f64"));
  const colors = new THREE.Float32BufferAttribute(
    new Float32Array(events.length * 3),
    3,
  );
  geometry.setAttribute("eventColor", colors);
  const palette = depthBands.map((band) => new THREE.Color(band.color));
  const uniformColor = new THREE.Color("#ff6f64");
  dots.material.vertexShader =
    "attribute vec3 eventColor; varying vec3 dotColor; " +
    dots.material.vertexShader.replace(
      "void main(){",
      "void main(){dotColor=eventColor;",
    );
  dots.material.fragmentShader =
    "varying vec3 dotColor; " +
    dots.material.fragmentShader.replace(
      "vec4(tint,alpha)",
      "vec4(dotColor,alpha)",
    );
  dots.name = "atlas-earthquakes";
  dots.frustumCulled = false;
  scene.add(dots);
  const selectedGeometry = new THREE.BufferGeometry().setAttribute(
    "position",
    new THREE.Float32BufferAttribute([0, 0, 0], 3),
  );
  const ring = new THREE.Points(
    selectedGeometry,
    material(19, "#fff0b3", true),
  );
  ring.name = "atlas-selected-earthquake";
  ring.frustumCulled = false;
  scene.add(ring);
  return (visible, threshold, selectedId, depthColor = false) => {
    dots.visible = visible;
    let count = 0;
    for (const event of events) {
      if (event.magnitude < threshold) continue;
      const color = depthColor
        ? palette[earthquakeDepthBand(event.depthKm)]
        : uniformColor;
      colors.setXYZ(count, color.r, color.g, color.b);
      positions.setXYZ(
        count++,
        ...globePoint(event.longitude, event.latitude, 1.822),
      );
    }
    positions.needsUpdate = true;
    colors.needsUpdate = true;
    geometry.setDrawRange(0, count);
    const selected = events.find(
      (event) => event.id === selectedId && event.magnitude >= threshold,
    );
    ring.visible = visible && !!selected;
    if (selected) {
      selectedGeometry.attributes.position.setXYZ(
        0,
        ...globePoint(selected.longitude, selected.latitude, 1.825),
      );
      selectedGeometry.attributes.position.needsUpdate = true;
    }
    return count;
  };
}
