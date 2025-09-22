import { motion, useAnimationFrame } from "framer-motion";
import { useMemo, useRef, useState } from "react";
import { Compass } from "lucide-react";
import type { StarSystem } from "../lib/procedural";

interface UniverseMapProps {
  readonly systems: readonly StarSystem[];
}

interface Position {
  x: number;
  y: number;
}

const MAP_SIZE = 360;

export function UniverseMap({ systems }: UniverseMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [positions] = useState<Position[]>(() =>
    systems.map((_, index) => ({
      x: Math.cos(index) * 120 + MAP_SIZE / 2,
      y: Math.sin(index) * 120 + MAP_SIZE / 2
    }))
  );
  const [tick, setTick] = useState(0);

  useAnimationFrame((time) => {
    if (time % (1000 / 60) < 16) {
      setTick((prev) => (prev + 1) % 360);
    }
  });

  const markers = useMemo(
    () =>
      systems.map((system, index) => {
        const position = positions[index];
        const oscillation = Math.sin((tick + index * 20) * 0.05) * 6;
        return (
          <motion.div
            key={system.name}
            className="absolute flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border border-primary/60 bg-primary/10 text-xs"
            style={{ left: position.x, top: position.y }}
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <Compass className="h-5 w-5 text-primary" />
            <span className="font-semibold text-primary">{system.name}</span>
            <span className="text-[10px] text-primary/80">{system.biome.id}</span>
            <span className="text-[9px] text-primary/60">{system.encounters[0]}</span>
            <motion.div className="absolute bottom-1 h-1 w-10 rounded-full bg-primary/50" style={{ translateY: oscillation }} />
          </motion.div>
        );
      }),
    [positions, systems, tick]
  );

  return (
    <div ref={containerRef} className="relative mx-auto aspect-square max-w-[420px] overflow-hidden rounded-xl border border-primary/30 bg-black/40">
      {markers}
    </div>
  );
}
