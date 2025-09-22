import type { Talent } from "../lib/procedural";

export interface TalentAssignment {
  readonly accountId: string;
  readonly universeId: string;
  readonly talents: readonly Talent[];
}

const assignments = new Map<string, TalentAssignment>();

function key(accountId: string, universeId: string): string {
  return `${accountId}::${universeId}`;
}

/**
 * Assigns unique talents per account and universe combination.
 * @throws Error when the talent pool cannot satisfy uniqueness.
 */
export function assignUniqueTalents(
  accountId: string,
  universeId: string,
  pool: readonly Talent[]
): TalentAssignment {
  const assignmentKey = key(accountId, universeId);
  if (assignments.has(assignmentKey)) {
    return assignments.get(assignmentKey) as TalentAssignment;
  }

  const usedTalentIds = new Set(
    Array.from(assignments.values())
      .filter((existing) => existing.universeId === universeId)
      .flatMap((existing) => existing.talents.map((talent) => talent.id))
  );

  const available = pool.filter((talent) => !usedTalentIds.has(talent.id));

  if (available.length === 0) {
    throw new Error("No hay talentos disponibles para asignar de forma única");
  }

  const assigned = available.slice(0, 2);
  const record: TalentAssignment = {
    accountId,
    universeId,
    talents: assigned
  };
  assignments.set(assignmentKey, record);
  return record;
}

export function clearTalentAssignments() {
  assignments.clear();
}
