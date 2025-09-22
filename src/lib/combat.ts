import type { ShipDerivedStats, ShipModule } from "./ships";

export interface Combatant {
  readonly id: string;
  readonly name: string;
  readonly stats: ShipDerivedStats;
  readonly energyReserve: number;
  readonly modules: readonly ShipModule[];
}

export interface CombatTurn {
  readonly attackerId: string;
  readonly damage: number;
  readonly targetShield: number;
  readonly targetHp: number;
}

export interface CombatResult {
  readonly order: readonly string[];
  readonly turns: readonly CombatTurn[];
}

export function simulateCombat(actors: readonly Combatant[]): CombatResult {
  const order = [...actors].sort((a, b) => b.stats.initiative - a.stats.initiative).map((actor) => actor.id);
  const turns: CombatTurn[] = [];
  const hp = new Map(actors.map((actor) => [actor.id, actor.stats.hp]));
  const shields = new Map(actors.map((actor) => [actor.id, actor.stats.shield]));

  for (const attackerId of order) {
    const attacker = actors.find((actor) => actor.id === attackerId);
    if (!attacker) continue;
    const target = actors.find((actor) => actor.id !== attackerId);
    if (!target) continue;

    const energyModules = attacker.modules.filter((module) => module.stats.damage);
    const energyCost = energyModules.reduce((acc, module) => acc + module.energy, 0);
    if (attacker.energyReserve + energyCost < 0) {
      turns.push({
        attackerId,
        damage: 0,
        targetShield: shields.get(target.id) ?? 0,
        targetHp: hp.get(target.id) ?? 0
      });
      continue;
    }

    let damage = attacker.stats.damage;
    const currentShield = shields.get(target.id) ?? 0;
    const remainingShield = Math.max(currentShield - damage, 0);
    damage = Math.max(damage - currentShield, 0);
    const currentHp = hp.get(target.id) ?? 0;
    const remainingHp = Math.max(currentHp - damage, 0);
    shields.set(target.id, remainingShield);
    hp.set(target.id, remainingHp);
    turns.push({
      attackerId,
      damage,
      targetShield: remainingShield,
      targetHp: remainingHp
    });
  }

  return { order, turns };
}
