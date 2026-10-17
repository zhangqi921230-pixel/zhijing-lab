import { reaction } from "./models.mjs";
export function atomLayout(h2, o2, extent) {
  const q = reaction(h2, o2, extent),
    molecules = [];
  for (let i = 2 * q.extent; i < h2; i++)
    molecules.push({
      type: "H₂",
      atoms: [
        ["H", 2 * i],
        ["H", 2 * i + 1],
      ],
    });
  for (let i = q.extent; i < o2; i++)
    molecules.push({
      type: "O₂",
      atoms: [
        ["O", 2 * i],
        ["O", 2 * i + 1],
      ],
    });
  for (let i = 0; i < 2 * q.extent; i++)
    molecules.push({
      type: "H₂O",
      atoms: [
        ["O", i],
        ["H", 2 * i],
        ["H", 2 * i + 1],
      ],
    });
  const atoms = {},
    bonds = [];
  molecules.forEach((m, i) => {
    const x = 66 + (i % 4) * 100,
      y = 125 + Math.floor(i / 4) * 100;
    const offsets =
      m.type === "H₂O"
        ? [
            [0, -12],
            [
              -36 * Math.sin((52.25 * Math.PI) / 180),
              -12 + 36 * Math.cos((52.25 * Math.PI) / 180),
            ],
            [
              36 * Math.sin((52.25 * Math.PI) / 180),
              -12 + 36 * Math.cos((52.25 * Math.PI) / 180),
            ],
          ]
        : [
            [-19, 0],
            [19, 0],
          ];
    m.atoms.forEach(([element, n], j) => {
      const id = element + (n + 1);
      atoms[id] = { id, element, x: x + offsets[j][0], y: y + offsets[j][1] };
    });
    for (let j = 1; j < m.atoms.length; j++)
      bonds.push([
        m.atoms[0][0] + (m.atoms[0][1] + 1),
        m.atoms[j][0] + (m.atoms[j][1] + 1),
      ]);
    m.x = x;
    m.y = y + 49;
  });
  return { atoms, bonds, molecules, q };
}
export function conservationFrame(p) {
  const limit = Math.min(Math.floor(p.h2 / 2), p.o2),
    progress = Math.max(0, Math.min(limit, p.progress));
  const complete = Math.floor(progress),
    fraction = progress - complete;
  const from = atomLayout(p.h2, p.o2, complete),
    to = atomLayout(p.h2, p.o2, Math.min(limit, complete + 1));
  const mix = fraction * fraction * (3 - 2 * fraction);
  return {
    from,
    to,
    complete,
    fraction,
    limit,
    atoms: Object.values(from.atoms).map((a) => ({
      ...a,
      x: a.x + (to.atoms[a.id].x - a.x) * mix,
      y: a.y + (to.atoms[a.id].y - a.y) * mix,
    })),
    mass: 2 * p.h2 + 32 * p.o2,
  };
}
