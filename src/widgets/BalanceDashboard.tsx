import type { CombatResult } from "../lib/combat";
import type { ShipDerivedStats } from "../lib/ships";

interface BalanceDashboardProps {
  readonly shipStats: ShipDerivedStats | null;
  readonly combat: CombatResult | null;
}

export function BalanceDashboard({ shipStats, combat }: BalanceDashboardProps) {
  return (
    <div className="space-y-2 text-xs">
      <div className="rounded border border-emerald-500/30 bg-emerald-500/10 p-3">
        <h4 className="font-semibold uppercase text-emerald-200">Resumen de Nave</h4>
        {shipStats ? (
          <dl className="grid grid-cols-2 gap-x-3 gap-y-1">
            <Metric label="HP" value={shipStats.hp} />
            <Metric label="Iniciativa" value={shipStats.initiative} />
            <Metric label="Daño" value={shipStats.damage} />
            <Metric label="Escudo" value={shipStats.shield} />
            <Metric label="Masa" value={shipStats.totalMass} />
            <Metric label="Energía" value={shipStats.totalEnergy} />
          </dl>
        ) : (
          <p>Selecciona módulos para generar métricas.</p>
        )}
      </div>
      <div className="rounded border border-indigo-500/30 bg-indigo-500/10 p-3">
        <h4 className="font-semibold uppercase text-indigo-200">Ultimo combate</h4>
        {combat ? (
          <div>
            <p className="font-mono">Orden: {combat.order.join(" → ")}</p>
            <p className="font-mono">Turnos: {combat.turns.length}</p>
          </div>
        ) : (
          <p>Ejecuta un combate para analizar balance.</p>
        )}
      </div>
    </div>
  );
}

function Metric({ label, value }: { readonly label: string; readonly value: number }) {
  return (
    <div>
      <dt className="text-white/70">{label}</dt>
      <dd className="font-mono text-lg text-white">{value}</dd>
    </div>
  );
}
