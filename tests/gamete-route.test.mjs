import { it, expect } from "vitest";
import { gameteRoute } from "../src/gameteRoute.mjs";
it("each chosen gamete route begins at its own source and converges without jumping", () => {
  for (const parent of [0, 1])
    for (const chosen of [0, 1]) {
      const a = gameteRoute(parent, chosen, 0),
        b = gameteRoute(parent, chosen, 1);
      expect(a.x).toBe((parent ? 580 : 220) + (chosen ? 65 : -65));
      expect(a.y).toBe(155);
      expect(b.x).toBe(parent ? 425 : 375);
      expect(b.y).toBe(290);
      expect(gameteRoute(parent, chosen, -1)).toEqual(a);
      expect(gameteRoute(parent, chosen, 2)).toEqual(b);
      let last = 155;
      for (let i = 1; i <= 100; i++) {
        const q = gameteRoute(parent, chosen, i / 100);
        expect(q.y).toBeGreaterThanOrEqual(last);
        expect(q.x).toBeGreaterThanOrEqual(150);
        expect(q.x).toBeLessThanOrEqual(650);
        last = q.y;
      }
    }
});
