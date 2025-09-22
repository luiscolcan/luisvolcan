export type ModuleSlot = "hull" | "engine" | "weapon" | "utility";

export interface ShipModule {
  readonly id: string;
  readonly name: string;
  readonly slot: ModuleSlot;
  readonly mass: number;
  readonly energy: number;
  readonly stats: Partial<Record<"hp" | "initiative" | "damage" | "shield", number>>;
}

export interface ShipBuild {
  readonly name: string;
  readonly modules: readonly ShipModule[];
}

export interface ShipDerivedStats {
  readonly totalMass: number;
  readonly totalEnergy: number;
  readonly hp: number;
  readonly initiative: number;
  readonly damage: number;
  readonly shield: number;
  readonly warnings: readonly string[];
}

export const MODULE_LIBRARY: readonly ShipModule[] = [
  {
    id: "hull_scout",
    name: "Casco Explorador",
    slot: "hull",
    mass: 12,
    energy: 0,
    stats: { hp: 80, shield: 20 }
  },
  {
    id: "engine_plasma",
    name: "Motor de Plasma",
    slot: "engine",
    mass: 5,
    energy: -20,
    stats: { initiative: 15 }
  },
  {
    id: "weapon_laser",
    name: "Láser Pulsante",
    slot: "weapon",
    mass: 8,
    energy: 25,
    stats: { damage: 24 }
  },
  {
    id: "utility_scanner",
    name: "Scanner",
    slot: "utility",
    mass: 2,
    energy: 5,
    stats: { initiative: 5 }
  }
];

const MASS_LIMIT = 40;
const ENERGY_LIMIT = 30;

export function deriveStats(build: ShipBuild): ShipDerivedStats {
  const totals = build.modules.reduce(
    (acc, module) => {
      acc.mass += module.mass;
      acc.energy += module.energy;
      acc.hp += module.stats.hp ?? 0;
      acc.initiative += module.stats.initiative ?? 0;
      acc.damage += module.stats.damage ?? 0;
      acc.shield += module.stats.shield ?? 0;
      return acc;
    },
    { mass: 0, energy: 0, hp: 0, initiative: 0, damage: 0, shield: 0 }
  );

  const warnings: string[] = [];
  if (totals.mass > MASS_LIMIT) {
    warnings.push("Exceso de masa");
  }
  if (totals.energy > ENERGY_LIMIT) {
    warnings.push("Exceso de consumo energético");
  }

  return {
    totalMass: totals.mass,
    totalEnergy: totals.energy,
    hp: totals.hp,
    initiative: totals.initiative,
    damage: totals.damage,
    shield: totals.shield,
    warnings
  };
}

export function buildDefaultShip(): ShipBuild {
  return {
    name: "Corbeta Inicial",
    modules: MODULE_LIBRARY.filter((module) => module.slot !== "utility")
  };
}
