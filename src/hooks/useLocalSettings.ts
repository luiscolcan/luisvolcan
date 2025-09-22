import { useEffect, useState } from "react";

type Theme = "default" | "aqua" | "amber";

export interface LocalSettings {
  readonly theme: Theme;
  readonly skin: string;
}

const STORAGE_KEY = "naves-settings";

function loadSettings(): LocalSettings {
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return { theme: "default", skin: "explorer" };
  }
  try {
    const parsed = JSON.parse(raw) as LocalSettings;
    return parsed;
  } catch {
    return { theme: "default", skin: "explorer" };
  }
}

export function useLocalSettings(): [LocalSettings, (next: LocalSettings) => void] {
  const [settings, setSettings] = useState<LocalSettings>(() => loadSettings());

  useEffect(() => {
    const root = document.documentElement;
    const themeMap: Record<Theme, string> = {
      default: "",
      aqua: "bg-sky-950 text-sky-100",
      amber: "bg-amber-950 text-amber-100"
    };
    const value = themeMap[settings.theme];
    root.setAttribute("data-theme", settings.theme);
    root.className = value;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  return [settings, setSettings];
}
