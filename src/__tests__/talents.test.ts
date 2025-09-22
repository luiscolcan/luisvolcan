import { describe, expect, it, beforeEach } from "vitest";
import { assignUniqueTalents, clearTalentAssignments } from "../state/talents";
import { generateTalents } from "../lib/procedural";

const SEED = "<seed>";

describe("assignUniqueTalents", () => {
  beforeEach(() => clearTalentAssignments());

  it("mantiene talentos únicos por universo", () => {
    const pool = generateTalents(SEED);
    const first = assignUniqueTalents("cuenta-1", "u-1", pool);
    const second = assignUniqueTalents("cuenta-2", "u-1", pool);
    const shared = first.talents.filter((talent) => second.talents.some((other) => other.id === talent.id));
    expect(shared).toHaveLength(0);
  });

  it("reutiliza asignaciones existentes", () => {
    const pool = generateTalents(SEED);
    const first = assignUniqueTalents("cuenta-1", "u-1", pool);
    const second = assignUniqueTalents("cuenta-1", "u-1", pool);
    expect(second).toBe(first);
  });
});
