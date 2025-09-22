import { describe, expect, it } from "vitest";
import { simulateCombat } from "../lib/combat";
import { buildDefaultShip, deriveStats } from "../lib/ships";

describe("simulateCombat", () => {
  it("ordena por iniciativa", () => {
    const base = buildDefaultShip();
    const fast = { ...base, modules: base.modules.map((module) => ({ ...module, stats: { ...module.stats, initiative: 30 } })) };
    const slow = base;
    const result = simulateCombat([
      { id: "fast", name: "Rápida", stats: deriveStats(fast), energyReserve: 10, modules: fast.modules },
      { id: "slow", name: "Lenta", stats: deriveStats(slow), energyReserve: 10, modules: slow.modules }
    ]);
    expect(result.order[0]).toBe("fast");
  });
});
