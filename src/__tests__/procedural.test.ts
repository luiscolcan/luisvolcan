import { describe, expect, it } from "vitest";
import { generateUniverse, generateTalents } from "../lib/procedural";

const SEED = "<seed>";

describe("procedural generation", () => {
  it("produce sistemas deterministas con la misma seed", () => {
    const first = generateUniverse(SEED);
    const second = generateUniverse(SEED);
    expect(second).toEqual(first);
  });

  it("produce talentos deterministas", () => {
    const first = generateTalents(SEED);
    const second = generateTalents(SEED);
    expect(second).toEqual(first);
  });
});
