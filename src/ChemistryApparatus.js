import { distillationDrop } from "./distillationDrop.mjs";
import { displacementGrain } from "./displacementGrains.mjs";
import { vesselGraduations } from "./VesselGraduations.js";
import { teachingMeniscusGeometry } from "./TeachingMeniscus.js";
import { displacementAppearance } from "./displacementAppearance.mjs";
import { buildFlaskLiquid } from "./FlaskLiquid.js";
import { sphericalLiquidLevel } from "./sphericalLiquid.mjs";
import * as T from "three";
import { electrolysisColumn } from "./electrolysisColumn.mjs";
import {
  displacementState,
  electrolysisState,
  distillationState,
  flameSamples,
} from "./chemistryTopics.mjs";
export function buildChemistryApparatus(id) {
  const root = new T.Group(),
    geometries = new Set(),
    materials = new Set(),
    updates = [],
    labels = [];
  const geo = (g) => (geometries.add(g), g),
    mat = (color, roughness = 0.4, metalness = 0) => {
      const m = new T.MeshStandardMaterial({ color, roughness, metalness });
      materials.add(m);
      return m;
    };
  const steel = mat("#9eafb6", 0.3, 0.35),
    rubber = mat("#24323a", 0.7),
    copper = mat("#bb6a3b", 0.38, 0.25),
    ceramic = mat("#e4e8df", 0.8),
    blue = mat("#4687a2", 0.6),
    red = mat("#ac4e43", 0.6);
  const glass = new T.MeshPhongMaterial({
    color: "#b0d9e6",
    transparent: true,
    opacity: 0.2,
    shininess: 100,
    side: T.DoubleSide,
    depthWrite: false,
  });
  materials.add(glass);
  const markings = new T.LineBasicMaterial({ color: "#38535a" });
  materials.add(markings);
  const water = mat("#72c5d5", 0.25);
  water.transparent = true;
  water.opacity = 0.7;
  water.depthWrite = false;
  const sphere = geo(new T.SphereGeometry(1, 20, 12)),
    cylinder = geo(new T.CylinderGeometry(1, 1, 1, 28)),
    box = geo(new T.BoxGeometry(1, 1, 1));
  function mesh(g, m, pos = [0, 0, 0], scale = [1, 1, 1], parent = root) {
    const o = new T.Mesh(g, m);
    o.position.set(...pos);
    o.scale.set(...scale);
    parent.add(o);
    return o;
  }
  const ball = (p, s, m = steel, parent = root) =>
    mesh(sphere, m, p, [s, s, s], parent);
  const block = (p, s, m = steel) => mesh(box, m, p, s);
  const cyl = (p, r, h, m = steel) => mesh(cylinder, m, p, [r, h, r]);
  function rod(a, b, r = 0.035, m = steel) {
    let va = new T.Vector3(...a),
      vb = new T.Vector3(...b);
    const o = mesh(
      cylinder,
      m,
      va.clone().add(vb).multiplyScalar(0.5).toArray(),
      [r, va.distanceTo(vb), r],
    );
    o.quaternion.setFromUnitVectors(
      new T.Vector3(0, 1, 0),
      vb.sub(va).normalize(),
    );
    return o;
  }
  function tube(points, r, m = glass) {
    return mesh(
      geo(
        new T.TubeGeometry(
          new T.CatmullRomCurve3(points.map((p) => new T.Vector3(...p))),
          Math.max(12, points.length * 8),
          r,
          8,
          false,
        ),
      ),
      m,
    );
  }
  function ring(x, y, z, r, m = glass) {
    const o = mesh(
      geo(new T.TorusGeometry(r, Math.min(0.018, r * 0.035), 5, 32)),
      m,
      [x, y, z],
    );
    o.rotation.x = Math.PI / 2;
    return o;
  }
  function label(text, pos, offset = [0, 0]) {
    const annotation = { text, pos, offset };
    labels.push(annotation);
    return annotation;
  }
  function vessel(x, z, r, h, y = 0.12) {
    const profile = [
      [0, 0],
      [r - 0.02, 0],
      [r, 0.06],
      [r, h],
      [r - 0.045, h],
      [r - 0.045, 0.09],
      [0, 0.09],
    ].map(([a, b]) => new T.Vector2(a, b));
    const o = mesh(geo(new T.LatheGeometry(profile, 32)), glass, [x, y, z]);
    ring(x, y + h, z, r);
    ring(x, y + 0.08, z, r - 0.025);
    const ticks = new T.LineSegments(geo(vesselGraduations(r, h)), markings);
    ticks.name = "vessel-graduations";
    ticks.position.set(x, y, z);
    ticks.userData.radius = r;
    ticks.userData.height = h;
    root.add(ticks);
    return o;
  }
  let liquidWallGeometry, liquidSurfaceGeometry;
  function liquid(x, z, r, h, y = 0.21, m = water) {
    liquidWallGeometry ||= geo(new T.CylinderGeometry(1, 1, 1, 32, 1, true));
    liquidSurfaceGeometry ||= geo(teachingMeniscusGeometry());
    const o = mesh(liquidWallGeometry, m),
      surface = mesh(liquidSurfaceGeometry, m);
    o.name = "vessel-liquid-body";
    surface.name = "vessel-liquid-meniscus";
    o.userData.surface = surface;
    o.userData.setHeight = (height) => {
      const nominal = Math.max(0, height),
        amplitude = Math.min(0.018, r * 0.04, nominal * 0.2);
      const edge = amplitude * liquidSurfaceGeometry.userData.edgeHeight;
      o.visible = surface.visible = nominal > 0;
      o.scale.set(r, nominal + edge, r);
      o.position.set(x, y + (nominal + edge) / 2, z);
      surface.scale.set(r, amplitude, r);
      surface.position.set(x, y + nominal, z);
      o.userData.nominalHeight = nominal;
    };
    o.userData.setHeight(h);
    return o;
  }
  function stand(x, z, h = 3) {
    block([x, 0.065, z], [0.7, 0.13, 0.5], rubber);
    rod([x, 0.13, z], [x, h, z], 0.035);
    return (y, target) => {
      rod([x, y, z], target, 0.032);
      ball([x, y, z], 0.065, steel);
      cyl([target[0], target[1], target[2]], 0.13, 0.08, rubber);
    };
  }
  // Repeated small particles share one geometry and one instanced draw call.
  let bubbleGeometry, bubbleMaterial;
  function bubbles(x, z, y, height, count) {
    bubbleGeometry ||= geo(new T.SphereGeometry(0.025, 8, 5));
    bubbleMaterial ||= mat("#c6eaf0", 0.18);
    const o = new T.InstancedMesh(bubbleGeometry, bubbleMaterial, count);
    o.frustumCulled = false;
    root.add(o);
    const dummy = new T.Object3D();
    updates.push((p, time, running) => {
      o.visible = time > 0 && (p.current === undefined || p.current > 0);
      const rise = typeof height === "function" ? height(p, time) : height;
      for (let i = 0; i < count; i++) {
        dummy.position.set(
          x + Math.sin(i * 9) * 0.08,
          y + ((time * 0.07 + i / count) % 1) * rise,
          z + Math.cos(i * 5) * 0.07,
        );
        dummy.scale.setScalar(0.6 + (i % 3) * 0.35);
        dummy.updateMatrix();
        o.setMatrixAt(i, dummy.matrix);
      }
      o.instanceMatrix.needsUpdate = true;
    });
    return o;
  }
  const base = block([0, -0.11, 0], [6.4, 0.2, 4.1], mat("#c6d0c9", 0.9));
  base.name = "chem-bench";
  // Brass screws and raised rubber feet make the bench tangible without shadow maps.
  for (const x of [-3, 3])
    for (const z of [-1.85, 1.85]) {
      cyl([x, 0.002, z], 0.035, 0.02, steel);
      cyl([x, -0.25, z], 0.1, 0.12, rubber);
    }
  if (id === "flame") {
    cyl([0, 0.12, 0], 0.48, 0.22, rubber);
    cyl([0, 0.28, 0], 0.25, 0.2, steel);
    cyl([0, 0.77, 0], 0.11, 0.86, steel);
    ring(0, 1.21, 0, 0.115, rubber);
    for (let i = 0; i < 6; i++) {
      const a = (i * Math.PI) / 3;
      ball([Math.cos(a) * 0.11, 0.43, Math.sin(a) * 0.11], 0.025, rubber);
    }
    tube(
      [
        [0.15, 0.3, 0],
        [0.65, 0.2, 0.15],
        [1.2, 0.12, 0.5],
        [2, 0.16, 0.9],
      ],
      0.045,
      rubber,
    );
    cyl([0.34, 0.25, 0], 0.07, 0.08, copper);
    // Two continuous envelopes stay volumetric when orbiting; no crossed billboards.
    const flameUniforms = {
      clock: { value: 0 },
      tint: { value: new T.Color("#ffbd28") },
      pollution: { value: 0 },
    };
    const flameMat = new T.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      side: T.DoubleSide,
      uniforms: { ...flameUniforms, core: { value: 0 } },
      vertexShader: `
        varying vec2 v; varying float facing;
        uniform float clock;
        void main() {
          v = uv;
          vec3 p = position;
          float bend = v.y * v.y;
          float ripple = sin(v.y * 16. - clock * 5. + uv.x * 6.283185);
          p.xz *= 1. + .07 * ripple * sin(v.y * 3.141593);
          p.x += bend * (.045 * sin(clock * 2.7) + .018 * sin(clock * 6.1 - v.y * 9.));
          p.z += bend * .035 * sin(clock * 3.3 + v.y * 5.);
          vec4 eye = modelViewMatrix * vec4(p, 1.);
          facing = abs(dot(normalize(normalMatrix * normal), normalize(-eye.xyz)));
          gl_Position = projectionMatrix * eye;
        }`,
      fragmentShader: `
        varying vec2 v; varying float facing;
        uniform float clock; uniform vec3 tint; uniform float pollution; uniform float core;
        void main() {
          float y = v.y;
          float stream = .5 + .5 * sin(y * 27. - clock * 7. + sin(v.x * 18.84956 + clock) * .7);
          vec3 sampleColor = mix(tint, vec3(1., .77, .05), pollution);
          vec3 color = mix(vec3(.12, .4, 1.), sampleColor, smoothstep(.02, .28, y));
          color = mix(color, vec3(.2, .65, 1.), core);
          color = mix(color, vec3(.8, .92, 1.), core * .35 * (1. - y));
          float rim = pow(1. - clamp(facing, 0., 1.), 1.4);
          float alpha = (.27 + .3 * rim + .08 * stream) * smoothstep(0., .035, y) * (1. - smoothstep(.88, 1., y));
          gl_FragColor = vec4(color * (.9 + .1 * stream), alpha);
        }`,
    });
    materials.add(flameMat);
    const profile = Array.from({ length: 15 }, (_, i) => {
      const y = i / 14;
      return new T.Vector2(
        0.12 * (1 - y) + 0.2 * Math.pow(Math.sin(Math.PI * y), 1.2) * (1 - y),
        y,
      );
    });
    const envelope = geo(new T.LatheGeometry(profile, 20));
    const outer = mesh(envelope, flameMat, [0, 1.21, 0], [1, 1.85, 1]);
    outer.name = "flame-outer-envelope";
    const coreMat = flameMat.clone();
    coreMat.uniforms = { ...flameUniforms, core: { value: 1 } };
    materials.add(coreMat);
    const inner = mesh(envelope, coreMat, [0, 1.21, 0], [0.58, 0.57, 0.58]);
    inner.name = "flame-blue-core";
    const loop = ring(0, 1.7, 0, 0.07, steel);
    loop.rotation.x = 0.6;
    rod([0.07, 1.7, 0], [1.45, 2.05, 0], 0.014);
    rod([1.45, 2.05, 0], [2.05, 2.2, 0], 0.055, mat("#79573d"));
    for (let i = 0; i < 4; i++) {
      const x = -2.25 + i * 0.4;
      vessel(x, 0.6, 0.14, 0.52);
      liquid(x, 0.6, 0.095, 0.23, 0.21, i === 3 ? water : glass);
      cyl([x, 0.7, 0.6], 0.15, 0.07, rubber);
    }
    updates.push((p, time) => {
      flameMat.uniforms.clock.value = time;
      flameMat.uniforms.tint.value.set(flameSamples[p.sample].color);
      flameMat.uniforms.pollution.value = p.contamination;
    });
    label("取样环 · 火焰中", [0, 1.72, 0], [75, -8]);
    label("蓝色内焰", [-0.12, 1.47, 0], [-90, -25]);
    label("金属盐样品", [-1.7, 0.8, 0.6]);
    label("空气调节孔", [0, 0.5, 0.25]);
  } else if (id === "displacement") {
    vessel(0, 0, 0.88, 2.15);
    const solution = water.clone();
    materials.add(solution);
    liquid(0, 0, 0.82, 1.39, 0.21, solution);
    const strip = block([0, 0.9, 0], [0.24, 1.25, 0.085], steel);
    strip.name = "displacement-original-metal";
    const brushing = [];
    for (const side of [-1, 1])
      for (let i = 0; i < 28; i++) {
        const y = -0.46 + (i * 0.92) / 27;
        brushing.push(
          -0.42,
          y,
          side * 0.502,
          0.27 + (i % 4) * 0.05,
          y + 0.004,
          side * 0.502,
        );
      }
    const brushMaterial = new T.LineBasicMaterial({
      color: "#52646b",
      transparent: true,
      opacity: 0.3,
    });
    materials.add(brushMaterial);
    const surface = new T.LineSegments(
      geo(
        new T.BufferGeometry().setAttribute(
          "position",
          new T.Float32BufferAttribute(brushing, 3),
        ),
      ),
      brushMaterial,
    );
    surface.name = "displacement-metal-surface-detail";
    strip.add(surface);
    rod([-0.17, 1.54, 0], [-0.17, 2.75, 0], 0.024, rubber);
    block([-0.025, 1.55, 0], [0.34, 0.045, 0.12], rubber);
    block([0, 2.77, 0], [0.42, 0.08, 0.16], steel);
    const grains = new T.InstancedMesh(
      geo(new T.IcosahedronGeometry(0.04, 0)),
      copper,
      100,
    );
    grains.geometry.computeBoundingBox();
    const grainSupport = -grains.geometry.boundingBox.min.y;
    grains.name = "displacement-deposited-copper";
    grains.frustumCulled = false;
    root.add(grains);
    const copperLabel = label("析出铜", [0.2, 0.7, 0.3]);
    copperLabel.visible = false;
    const d = new T.Object3D();
    updates.push((p, time) => {
      const s = displacementState(p.metal, p.mass, time / 60);
      const appearance = displacementAppearance(p.metal, p.mass, s);
      copperLabel.visible = s.extent > 1e-10;
      copperLabel.pos = [
        0.2,
        0.7 * (1 - appearance.settling) + 0.25 * appearance.settling,
        0.3,
      ];
      strip.scale.z = 0.085 * appearance.metalFraction;
      strip.visible = appearance.metalFraction > 1e-8;
      strip.material = p.metal === "copper" ? copper : steel;
      solution.color.setRGB(
        0.12 + s.fraction * 0.28,
        0.5 + s.fraction * 0.12,
        0.86 - s.fraction * 0.45,
      );
      solution.opacity = p.metal === "zinc" ? 0.4 - s.fraction * 0.3 : 0.35;
      for (let i = 0; i < 100; i++) {
        const grain = displacementGrain(
          i,
          s.fraction,
          appearance,
          grainSupport,
        );
        d.position.set(grain.x, grain.y, grain.z);
        d.scale.setScalar(grain.scale);
        d.updateMatrix();
        grains.setMatrixAt(i, d.matrix);
      }
      grains.instanceMatrix.needsUpdate = true;
    });
    const clamp = stand(-1.6, -0.2, 3);
    clamp(2.7, [0, 2.7, 0]);
    vessel(1.8, 0.6, 0.33, 0.9);
    label("溶液", [0.65, 1.35, 0.35], [65, -20]);
    label("原金属片位置", [0.1, 1.2, 0], [-85, -5]);
    label("夹持杆", [-0.17, 2.65, 0], [-50, 0]);
  } else if (id === "electrolysis") {
    vessel(0, 0, 1.5, 1.1);
    liquid(0, 0, 1.43, 0.8);
    const gases = [],
      surfaces = [];
    for (let i = 0; i < 2; i++) {
      const x = i ? 0.68 : -0.68;
      const profile = [
        [0.2, 0],
        [0.2, 2.1],
        [0.15, 2.2],
        [0, 2.2],
      ].map((a) => new T.Vector2(...a));
      mesh(geo(new T.LatheGeometry(profile, 24)), glass, [x, 0.65, 0]);
      ring(x, 0.65, 0, 0.2);
      const w = cyl([x, 1.7, 0], 0.175, 2, water);
      w.name = i ? "oxygen-column-liquid" : "hydrogen-column-liquid";
      gases.push(w);
      const surface = ring(x, 2.84, 0, 0.175, blue);
      surface.name = i ? "oxygen-meniscus" : "hydrogen-meniscus";
      surfaces.push(surface);
      cyl([x, 0.5, 0], 0.055, 0.5, steel);
      for (let n = 1; n < 9; n++)
        tube(
          [
            [x - 0.08, 0.8 + n * 0.21, 0.185],
            [x + 0.08, 0.8 + n * 0.21, 0.185],
          ],
          0.005,
          steel,
        );
      const cable = tube(
        [
          [x, 0.25, 0],
          [x, 0.35, 0.35],
          [i ? 0.95 : -0.95, 1.4, 0.35],
          [i ? 1.8 : -1.8, 1.4, 0.35],
          [i ? 2.1 : -2.1, 0.2, 1.2],
          [i ? 1.3 : -1.8, 0.18, 1.97],
          [i ? -0.65 : -1.15, 0.2, 2.02],
          [i ? -0.65 : -1.15, 0.27, 1.97],
        ],
        0.025,
        i ? red : blue,
      );
      cable.name = i
        ? "electrolysis-positive-cable"
        : "electrolysis-negative-cable";
      const stream = bubbles(
        x,
        0,
        0.75,
        (p, time) => {
          const state = electrolysisState(p.current, time);
          return electrolysisColumn(i ? state.oxygen : state.hydrogen)
            .bubbleHeight;
        },
        i ? 8 : 16,
      );
      stream.name = i ? "oxygen-bubbles" : "hydrogen-bubbles";
    }
    block([-0.9, 0.37, 1.55], [1, 0.65, 0.65], rubber);
    block([-0.9, 0.52, 1.89], [0.66, 0.24, 0.012], mat("#91baa6"));
    for (let i = 0; i < 2; i++) {
      const tx = -1.15 + i * 0.5;
      const terminal = rod(
        [tx, 0.27, 1.89],
        [tx, 0.27, 1.97],
        0.055,
        i ? red : blue,
      );
      terminal.name = i
        ? "electrolysis-positive-terminal"
        : "electrolysis-negative-terminal";
      rod([tx - 0.04, 0.38, 1.9], [tx + 0.04, 0.38, 1.9], 0.009, ceramic);
      if (i) rod([tx, 0.34, 1.9], [tx, 0.42, 1.9], 0.009, ceramic);
    }
    const s1 = stand(-1.1, -0.5, 3.2),
      s2 = stand(1.1, -0.5, 3.2);
    s1(2.45, [-0.68, 2.45, 0]);
    s2(2.45, [0.68, 2.45, 0]);
    updates.push((p, time) => {
      const s = electrolysisState(p.current, time);
      [s.hydrogen, s.oxygen].forEach((v, i) => {
        const column = electrolysisColumn(v);
        gases[i].scale.y = column.liquidHeight;
        gases[i].position.y = 0.66 + column.liquidHeight / 2;
        surfaces[i].position.y = column.surface;
      });
    });
    label("− 阴极 · H₂", [-0.68, 3.08, 0]);
    label("+ 阳极 · O₂", [0.68, 3.08, 0]);
    label("恒流电源", [-0.9, 0.88, 1.55]);
  } else {
    const x = -1.7,
      z = 0;
    block([x, 0.2, z], [1.1, 0.38, 1.05], rubber);
    cyl([x, 0.43, z], 0.51, 0.12, steel);
    ball([x, 1.18, z], 0.63, glass);
    const flaskLiquid = buildFlaskLiquid(water, geo);
    flaskLiquid.group.position.set(x, 1.18, z);
    root.add(flaskLiquid.group);
    rod([x, 1.7, z], [x, 2.52, z], 0.12, glass);
    ring(x, 2.5, z, 0.12, rubber);
    rod([x, 2.37, z], [x, 3.03, z], 0.04, glass);
    const thermometerColumn = rod([x, 2.37, z], [x, 2.96, z], 0.013, red);
    thermometerColumn.name = "distillation-steam-thermometer-column";
    thermometerColumn.visible = false;
    const thermometerTicks = [];
    for (let i = 0; i <= 16; i++) {
      const y = 2.56 + i * 0.025,
        width = i % 4 === 0 ? 0.065 : 0.037;
      thermometerTicks.push(
        x + 0.045,
        y,
        z + 0.018,
        x + 0.045 + width,
        y,
        z + 0.018,
      );
    }
    const thermometerScale = new T.LineSegments(
      geo(
        new T.BufferGeometry().setAttribute(
          "position",
          new T.Float32BufferAttribute(thermometerTicks, 3),
        ),
      ),
      markings,
    );
    thermometerScale.name = "distillation-thermometer-scale";
    root.add(thermometerScale);
    ball([x, 2.36, z], 0.035, red);
    const a = [-0.95, 2.35, 0],
      b = [1.62, 1.43, 0];
    const innerPoints = [
      [x, 2.34, 0],
      [-1.3, 2.34, 0],
      a,
      b,
      [1.88, 1.29, 0],
      [1.88, 1.01, 0],
    ];
    tube(innerPoints, 0.055, glass);
    const innerCurve = new T.CatmullRomCurve3(
      innerPoints.map((point) => new T.Vector3(...point)),
    );
    const innerMaterial = new T.MeshBasicMaterial({ color: 0xffffff });
    materials.add(innerMaterial);
    const innerFlow = new T.InstancedMesh(
      geo(new T.ConeGeometry(0.028, 0.085, 6)),
      innerMaterial,
      10,
    );
    innerFlow.name = "distillation-inner-flow";
    innerFlow.frustumCulled = false;
    root.add(innerFlow);
    const innerMarker = new T.Object3D(),
      innerUp = new T.Vector3(0, 1, 0);
    const steamColor = new T.Color("#d5a14c"),
      condensateColor = new T.Color("#5dc9dc");
    const jacketGlass = glass.clone();
    materials.add(jacketGlass);
    const jacket = rod(a, b, 0.16, jacketGlass);
    rod([-0.9, 2.39, 0], [-0.86, 2.7, 0], 0.045, glass);
    rod([1.4, 1.46, 0], [1.4, 1.16, 0], 0.045, glass);
    const inlet = tube(
      [
        [1.4, 1.16, 0],
        [1.35, 0.65, -0.35],
        [2.25, 0.15, -0.6],
        [2.8, 0.15, -1.2],
      ],
      0.035,
      blue,
    );
    const outlet = tube(
      [
        [-0.86, 2.7, 0],
        [-0.7, 2.9, -0.3],
        [0.1, 1, -0.7],
        [0.6, 0.15, -1.3],
      ],
      0.035,
      blue,
    );
    const s1 = stand(-2.6, -0.4, 2.8);
    s1(2.3, [x, 2.3, 0]);
    const s2 = stand(0.65, -0.5, 2.5);
    s2(1.87, [0.55, 1.87, 0]);
    vessel(1.88, 0, 0.43, 0.87);
    const collected = liquid(1.88, 0, 0.38, 0);
    collected.name = "distillation-collected-liquid";
    const drop = ball([1.88, 0.95, 0], 0.035, water);
    drop.name = "distillation-drop";
    const rippleMaterial = new T.MeshBasicMaterial({
      color: "#72c5d5",
      transparent: true,
      opacity: 0,
      depthWrite: false,
    });
    materials.add(rippleMaterial);
    const ripple = mesh(
      geo(new T.TorusGeometry(0.12, 0.006, 4, 32)),
      rippleMaterial,
      [1.88, 0.22, 0],
    );
    ripple.name = "distillation-impact-ripple";
    ripple.rotation.x = Math.PI / 2;
    const boilingBubbles = bubbles(
      x,
      0,
      0.8,
      (p, time) => {
        const q = distillationState(p.power, time, p.cooling);
        return Math.max(
          0,
          1.18 + sphericalLiquidLevel(0.565, q.remaining / 400).y - 0.8 - 0.035,
        );
      },
      12,
    );
    const flowMaterial = new T.MeshBasicMaterial({ color: "#359dc4" });
    materials.add(flowMaterial);
    const coolingFlow = new T.InstancedMesh(
      geo(new T.ConeGeometry(0.035, 0.11, 6)),
      flowMaterial,
      6,
    );
    coolingFlow.name = "condenser-cooling-direction";
    coolingFlow.frustumCulled = false;
    root.add(coolingFlow);
    const flowStart = new T.Vector3(...b),
      flowEnd = new T.Vector3(...a),
      flowMarker = new T.Object3D();
    flowMarker.quaternion.setFromUnitVectors(
      new T.Vector3(0, 1, 0),
      flowEnd.clone().sub(flowStart).normalize(),
    );
    updates.push((p, time, running) => {
      const s = distillationState(p.power, time, p.cooling);
      thermometerColumn.visible = s.boiling && s.evaporated > 0;
      innerFlow.visible = s.evaporated > 0;
      for (let i = 0; i < innerFlow.count; i++) {
        const fraction = (time * 0.035 + i / innerFlow.count) % 1;
        innerMarker.position.copy(innerCurve.getPoint(fraction));
        innerMarker.quaternion.setFromUnitVectors(
          innerUp,
          innerCurve.getTangent(fraction),
        );
        innerMarker.updateMatrix();
        innerFlow.setMatrixAt(i, innerMarker.matrix);
        innerFlow.setColorAt(
          i,
          p.cooling && fraction > 0.6 ? condensateColor : steamColor,
        );
      }
      innerFlow.instanceMatrix.needsUpdate = true;
      innerFlow.instanceColor.needsUpdate = true;
      flaskLiquid.update(s.remaining);
      collected.userData.setHeight((s.collected / 60) * 0.55);
      const falling = distillationDrop(time, s.collected),
        active = s.boiling && p.cooling;
      drop.visible = active && falling.visible;
      drop.position.y = falling.y;
      ripple.visible = active && !falling.visible;
      ripple.position.y = falling.surface + 0.003;
      ripple.scale.setScalar(0.3 + falling.ripple * 1.7);
      rippleMaterial.opacity = 0.65 * (1 - falling.ripple);
      jacket.material.opacity = p.cooling ? 0.24 : 0.1;
      inlet.material = p.cooling ? blue : rubber;
      outlet.material = p.cooling ? blue : rubber;
      boilingBubbles.visible = time > 0 && s.boiling;
      coolingFlow.visible = p.cooling;
      for (let i = 0; i < coolingFlow.count; i++) {
        const fraction = (time * 0.015 + i / coolingFlow.count) % 1;
        flowMarker.position.lerpVectors(
          flowStart,
          flowEnd,
          0.04 + 0.92 * fraction,
        );
        flowMarker.position.z += 0.09;
        flowMarker.updateMatrix();
        coolingFlow.setMatrixAt(i, flowMarker.matrix);
      }
      coolingFlow.instanceMatrix.needsUpdate = true;
    });
    label("温度计 · 蒸汽位置", [-1.7, 3.15, 0]);
    label("冷却水：低端进", [1.45, 1.15, -0.15]);
    label("高端出", [-0.86, 2.82, 0]);
    label("接收杯", [2.15, 0.85, 0.2]);
  }
  return {
    root,
    labels,
    update(p, time, running) {
      for (const fn of updates) fn(p, time, running);
    },
    setTheme(dark) {
      base.material.color.set(dark ? "#23383e" : "#d4dcd4");
      markings.color.set(dark ? "#d5e1df" : "#38535a");
    },
    dispose() {
      geometries.forEach((g) => g.dispose());
      materials.forEach((m) => m.dispose());
    },
  };
}
