import { renderHook, act } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { useLocalSettings } from "../hooks/useLocalSettings";

describe("useLocalSettings", () => {
  beforeEach(() => window.localStorage.clear());
  afterEach(() => window.localStorage.clear());

  it("persiste cambios en localStorage", () => {
    const { result } = renderHook(() => useLocalSettings());
    act(() => {
      result.current[1]({ theme: "aqua", skin: "corsaria" });
    });
    const stored = JSON.parse(window.localStorage.getItem("naves-settings") ?? "{}");
    expect(stored).toMatchObject({ theme: "aqua", skin: "corsaria" });
  });
});
