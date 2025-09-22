import { createSeededRng, pick } from "./prng";

export interface Biome {
  readonly id: string;
  readonly hazards: readonly string[];
  readonly resources: readonly string[];
}

export interface StarSystem {
  readonly name: string;
  readonly biome: Biome;
  readonly encounters: readonly string[];
}

export interface Talent {
  readonly id: string;
  readonly name: string;
  readonly description: string;
}

const BIOMES: readonly Biome[] = [
  { id: "nebula", hazards: ["Radiación"], resources: ["Gas exótico", "Plasma"] },
  { id: "asteroid", hazards: ["Fragmentos"], resources: ["Metal raro", "Hielo"] },
  { id: "ocean", hazards: ["Tormentas"], resources: ["Agua pesada", "Microvida"] }
];

const ENCOUNTERS = [
  "Ruinas ancestrales",
  "Colonia olvidada",
  "Flota mercenaria",
  "Anomalía gravitacional"
];

const TALENTS: readonly Talent[] = [
  { id: "navigator", name: "Navegante estelar", description: "Mayor evasión en campos de asteroides." },
  { id: "engineer", name: "Ingeniera cuántica", description: "Reduce el consumo de energía de módulos." },
  { id: "tactician", name: "Táctico", description: "Bonos de iniciativa en combate." },
  { id: "biologist", name: "Xenobióloga", description: "Multiplica los recursos biológicos." },
  { id: "dealer", name: "Tratante", description: "Mejores recompensas de comercio." }
];

export function generateUniverse(seed: string, systemCount = 4) {
  const rng = createSeededRng(seed);
  const systems: StarSystem[] = Array.from({ length: systemCount }, (_, index) => {
    const biome = BIOMES[Math.floor(rng() * BIOMES.length)];
    const encounters = Array.from({ length: 2 }, () => pick(rng, ENCOUNTERS));
    return {
      name: `Sistema-${index + 1}`,
      biome,
      encounters
    } satisfies StarSystem;
  });
  return {
    systems,
    talentPool: TALENTS
  };
}

export function generateTalents(seed: string): readonly Talent[] {
  const rng = createSeededRng(seed);
  const shuffled = [...TALENTS].map((talent, idx) => ({
    talent,
    weight: rng() + idx
  }));
  shuffled.sort((a, b) => a.weight - b.weight);
  return shuffled.map((entry) => entry.talent);
}
