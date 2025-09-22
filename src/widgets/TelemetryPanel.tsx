import { useMemo } from "react";
import { useTelemetryLog } from "../state/telemetry";

export function TelemetryPanel() {
  const events = useTelemetryLog();
  const formatted = useMemo(
    () =>
      events.map((event) => ({
        ...event,
        time: new Date(event.timestamp).toLocaleTimeString()
      })),
    [events]
  );
  return (
    <div className="space-y-2 text-xs">
      {formatted.length === 0 ? <p>Sin eventos registrados.</p> : null}
      <ul className="space-y-1">
        {formatted.map((event) => (
          <li key={event.timestamp} className="rounded border border-white/10 bg-black/30 p-2">
            [{event.time}] {event.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
