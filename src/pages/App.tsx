import { useMemo, useState } from "react";
import { Card, CardGrid } from "../components/ui/card";
import { generateUniverse, generateTalents } from "../lib/procedural";
import { assignUniqueTalents, clearTalentAssignments } from "../state/talents";
import { UniverseMap } from "../widgets/UniverseMap";
import { ShipBuilder } from "../widgets/ShipBuilder";
import { CombatSimulator } from "../widgets/CombatSimulator";
import { PvPSkeleton } from "../widgets/PvPSkeleton";
import { TelemetryPanel } from "../widgets/TelemetryPanel";
import { BalanceDashboard } from "../widgets/BalanceDashboard";
import { useLocalSettings } from "../hooks/useLocalSettings";
import { recordEvent } from "../state/telemetry";
import { deriveStats, type ShipDerivedStats } from "../lib/ships";
import type { CombatResult } from "../lib/combat";

const SEED = "<seed>";

export default function App() {
  const [settings, setSettings] = useLocalSettings();
  const universe = useMemo(() => generateUniverse(SEED), []);
  const talents = useMemo(() => generateTalents(SEED), []);
  const [shipStats, setShipStats] = useState<ShipDerivedStats | null>(null);
  const [combat, setCombat] = useState<CombatResult | null>(null);

  const accountTalents = useMemo(() => {
    clearTalentAssignments();
    const assigned = assignUniqueTalents("account-1", "universe-1", talents);
    recordEvent({ timestamp: Date.now(), label: "Talentos asignados", payload: { ids: assigned.talents.map((talent) => talent.id) } });
    return assigned;
  }, [talents]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-slate-900 to-black p-6 text-white">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Naves y Sistemas</h1>
          <p className="text-sm text-white/70">Semilla activa: {SEED}</p>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <label className="flex flex-col">
            Tema
            <select
              className="rounded border border-white/20 bg-black/40 p-2"
              value={settings.theme}
              onChange={(event) => setSettings({ ...settings, theme: event.target.value as typeof settings.theme })}
            >
              <option value="default">Predeterminado</option>
              <option value="aqua">Aqua</option>
              <option value="amber">Amber</option>
            </select>
          </label>
          <label className="flex flex-col">
            Skin
            <input
              className="rounded border border-white/20 bg-black/40 p-2"
              value={settings.skin}
              onChange={(event) => setSettings({ ...settings, skin: event.target.value })}
            />
          </label>
        </div>
      </header>

      <CardGrid>
        <Card title="Mapa Galáctico" description="Explora sistemas generados proceduralmente.">
          <UniverseMap systems={universe.systems} />
        </Card>
        <Card title="Talentos Únicos" description="Asigna talentos exclusivos por cuenta.">
          <ul className="space-y-1 text-sm">
            {accountTalents.talents.map((talent) => (
              <li key={talent.id} className="rounded border border-white/10 bg-black/30 p-2">
                <strong>{talent.name}</strong> — {talent.description}
              </li>
            ))}
          </ul>
        </Card>
        <Card title="Constructor de Naves" description="Combina módulos y visualiza estadísticas">
          <ShipBuilder
            onStatsChange={(build) => {
              const derivedStats = build.modules.length ? deriveStats({ name: 'custom', modules: build.modules }) : null;
              setShipStats(derivedStats);
              if (derivedStats) {
                recordEvent({ timestamp: Date.now(), label: 'Constructor actualizado', payload: { masa: derivedStats.totalMass } });
              }
            }}
          />
        </Card>
        <Card title="Combate PvE" description="Simulación de turnos con iniciativa y escudos">
          <CombatSimulator onSimulated={(result) => setCombat(result)} />
        </Card>
        <Card title="PvP Autoritativo" description="Esqueleto de conexión WebSocket mock">
          <PvPSkeleton sessionId="session-local" />
        </Card>
        <Card title="Telemetría" description="Eventos del juego">
          <TelemetryPanel />
        </Card>
        <Card title="Balance" description="Indicadores rápidos">
          <BalanceDashboard shipStats={shipStats} combat={combat} />
        </Card>
      </CardGrid>
    </main>
  );
}
