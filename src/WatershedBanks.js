import * as T from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";

// Static shore detail shares three draw calls; no textures or per-frame work.
export function addWatershedBanks(root, riverX, height) {
  const stones = [],
    reeds = [],
    edge = [];
  for (const side of [-1, 1]) {
    for (let i = 0; i < 48; i++) {
      const z = -1.94 + (i * 3.88) / 47;
      const x = riverX(z) + side * (0.16 + 0.018 * Math.sin(i * 2.4));
      const rock = new T.IcosahedronGeometry(0.024, 0);
      rock.scale(1.3, 0.62, 0.8);
      rock.rotateY(i * 2.399);
      rock.translate(x, height(x, z) + 0.01, z);
      stones.push(rock);
      if (i % 2 === 0)
        for (let j = 0; j < 3; j++) {
          const rx = x + side * 0.04,
            rz = z + j * 0.014,
            y = height(rx, rz);
          reeds.push(
            rx - 0.012,
            y,
            rz,
            rx + 0.012,
            y,
            rz,
            rx + side * 0.025,
            y + 0.08 + j * 0.025,
            rz + 0.01,
          );
        }
    }
    for (let i = 0; i < 96; i++) {
      const z0 = -2 + i / 24,
        z1 = z0 + 1 / 24;
      const points = [z0, z1].flatMap((z) =>
        [0.125, 0.18].map((d) => {
          const x = riverX(z) + side * d;
          return [x, height(x, z) + 0.004, z];
        }),
      );
      for (const n of [0, 1, 2, 1, 3, 2]) edge.push(...points[n]);
    }
  }
  const geometry = mergeGeometries(stones);
  stones.forEach((g) => g.dispose());
  const gravel = new T.Mesh(
    geometry,
    new T.MeshStandardMaterial({ color: "#9b9b87", roughness: 1 }),
  );
  gravel.name = "watershed-bank-gravel";
  root.add(gravel);
  for (const [name, vertices, color] of [
    ["watershed-bank-reeds", reeds, "#64804b"],
    ["watershed-wet-bank", edge, "#716955"],
  ]) {
    const geo = new T.BufferGeometry();
    geo.setAttribute("position", new T.Float32BufferAttribute(vertices, 3));
    geo.computeVertexNormals();
    const mesh = new T.Mesh(
      geo,
      new T.MeshStandardMaterial({ color, roughness: 1, side: T.DoubleSide }),
    );
    mesh.name = name;
    root.add(mesh);
  }
}
