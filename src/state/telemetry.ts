export interface TelemetryEvent {
  readonly timestamp: number;
  readonly label: string;
  readonly payload?: Record<string, unknown>;
}

const log: TelemetryEvent[] = [];

export function recordEvent(event: TelemetryEvent): void {
  log.push(event);
}

export function useTelemetryLog(limit = 20): readonly TelemetryEvent[] {
  return log.slice(-limit);
}

export function clearTelemetry() {
  log.length = 0;
}
