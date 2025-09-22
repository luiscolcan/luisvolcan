import { useMemo } from "react";
import { simulateCombat, type CombatResult } from "../lib/combat";
import { buildDefaultShip, deriveStats } from "../lib/ships";
import { ButtonIcon } from "./buttons";

interface CombatSimulatorProps {
  readonly onSimulated?: (result: CombatResult) => void;
}

export function CombatSimulator({ onSimulated }: CombatSimulatorProps) {
  const player = useMemo(() => {
    const build = buildDefaultShip();
    return {
      id: "player",
      name: "Corbeta",
      stats: deriveStats(build),
      energyReserve: 20,
      modules: build.modules
    } as const;
  }, []);

  const enemy = useMemo(() => ({
    id: "enemy",
    name: "Corsario IA",
    stats: { ...deriveStats(buildDefaultShip()), hp: 60, shield: 10 },
    energyReserve: 15,
    modules: buildDefaultShip().modules
  }), []);

  const result = useMemo(() => simulateCombat([player, enemy]), [enemy, player]);

  onSimulated?.(result);

  return (
    <div className="space-y-2 text-sm">
      <p>Orden de iniciativa: {result.order.join(" → ")}</p>
      <ul className="space-y-1">
        {result.turns.map((turn) => (
          <li key={turn.attackerId} className="rounded border border-white/10 bg-black/30 p-2">
            <strong>{turn.attackerId}</strong> inflige {turn.damage} daño → Escudo {turn.targetShield} / HP {turn.targetHp}
          </li>
        ))}
      </ul>
      <ButtonIcon label="Sincronizar PvE" icon="sparkles" />
    </div>
  );
}
