import { useMemo, useState } from "react";
import { MODULE_LIBRARY, deriveStats, type ShipBuild, type ShipModule } from "../lib/ships";
import { ButtonIcon } from "./buttons";
import { Rocket, Shield, GaugeCircle } from "lucide-react";

interface ShipBuilderProps {
  readonly onStatsChange?: (build: ShipBuild) => void;
}

const SLOT_ORDER: ReadonlyArray<ShipModule["slot"]> = ["hull", "engine", "weapon", "utility"];

export function ShipBuilder({ onStatsChange }: ShipBuilderProps) {
  const [modules, setModules] = useState<ShipModule[]>(() => MODULE_LIBRARY.filter((module) => module.slot !== "utility"));

  const grouped = useMemo(
    () =>
      SLOT_ORDER.map((slot) => ({
        slot,
        items: MODULE_LIBRARY.filter((module) => module.slot === slot)
      })),
    []
  );

  const derived = useMemo(() => deriveStats({ name: "", modules }), [modules]);

  const handleSelect = (module: ShipModule) => {
    setModules((current) => {
      const withoutSlot = current.filter((item) => item.slot !== module.slot);
      const next = [...withoutSlot, module];
      onStatsChange?.({ name: "", modules: next });
      return next;
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-2">
        {grouped.map((group) => (
          <div key={group.slot} className="space-y-2">
            <h3 className="text-sm uppercase tracking-wide text-primary/80">{group.slot}</h3>
            <div className="grid gap-2">
              {group.items.map((item) => {
                const active = modules.some((module) => module.id === item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelect(item)}
                    className={`flex items-center justify-between rounded-lg border px-3 py-2 text-left transition-colors ${
                      active ? "border-primary bg-primary/10" : "border-white/10 hover:border-primary/60"
                    }`}
                  >
                    <span className="text-sm font-medium">{item.name}</span>
                    <span className="text-xs text-white/60">m:{item.mass} e:{item.energy}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-4 rounded-lg border border-white/10 bg-black/30 p-4">
        <StatBadge icon={<Shield className="h-4 w-4" />} label="HP" value={derived.hp} />
        <StatBadge icon={<Rocket className="h-4 w-4" />} label="Initiativa" value={derived.initiative} />
        <StatBadge icon={<GaugeCircle className="h-4 w-4" />} label="Daño" value={derived.damage} />
        <div className="text-xs text-white/70">Masa: {derived.totalMass} / Energía: {derived.totalEnergy}</div>
        {derived.warnings.map((warning) => (
          <span key={warning} className="rounded bg-red-500/20 px-2 py-1 text-xs text-red-300">
            {warning}
          </span>
        ))}
        <ButtonIcon label="Añadir skin" icon="palette" />
      </div>
    </div>
  );
}

interface StatBadgeProps {
  readonly icon: JSX.Element;
  readonly label: string;
  readonly value: number;
}

function StatBadge({ icon, label, value }: StatBadgeProps) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-primary/40 bg-primary/5 px-2 py-1 text-xs text-primary">
      {icon}
      <span className="font-semibold uppercase">{label}</span>
      <span>{value}</span>
    </div>
  );
}
