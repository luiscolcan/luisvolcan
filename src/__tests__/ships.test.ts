import { describe, expect, it } from "vitest";
import { buildDefaultShip, deriveStats } from "../lib/ships";

describe("deriveStats", () => {
  it("calcula los totales de masa y energía", () => {
    const build = buildDefaultShip();
    const stats = deriveStats(build);
    expect(stats.totalMass).toBeGreaterThan(0);
    expect(stats.totalEnergy).toBeLessThan(40);
  });

  it("indica advertencias cuando excede límites", () => {
    const build = {
      name: "Sobrecarga",
      modules: buildDefaultShip().modules.concat([
        { id: "extra", name: "Extra", slot: "utility", mass: 50, energy: 50, stats: { hp: 10 } }
      ])
    } as const;
    const stats = deriveStats(build);
    expect(stats.warnings).toContain("Exceso de masa");
    expect(stats.warnings).toContain("Exceso de consumo energético");
  });
});
