export interface PvPMessage<T extends string = string, P = unknown> {
  readonly type: T;
  readonly payload: P;
}

export interface PvPSession {
  readonly id: string;
  readonly send: (message: PvPMessage) => void;
}

type Listener = (payload: { sessionId: string; message: PvPMessage }) => void;

class PvPServer {
  private readonly listeners = new Set<Listener>();

  connect(sessionId: string): { session: PvPSession; subscribe: (listener: Listener) => () => void } {
    const send = (message: PvPMessage) => {
      setTimeout(() => {
        this.emit({ sessionId, message });
      }, 10);
    };
    return {
      session: { id: sessionId, send },
      subscribe: (listener: Listener) => this.on(listener)
    };
  }

  private on(listener: Listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private emit(payload: { sessionId: string; message: PvPMessage }) {
    this.listeners.forEach((listener) => listener(payload));
  }
}

export const mockServer = new PvPServer();

export function createPvPClient(sessionId: string, handler: (message: PvPMessage) => void) {
  const { session, subscribe } = mockServer.connect(sessionId);
  const unsubscribe = subscribe((data) => {
    if (data.sessionId !== sessionId) return;
    handler(data.message);
  });
  return {
    session,
    dispose: () => {
      unsubscribe();
    }
  };
}
