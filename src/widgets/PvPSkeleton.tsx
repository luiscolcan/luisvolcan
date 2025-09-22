import { useEffect, useState } from "react";
import { createPvPClient, type PvPMessage } from "../lib/pvp";

interface PvPSkeletonProps {
  readonly sessionId: string;
}

export function PvPSkeleton({ sessionId }: PvPSkeletonProps) {
  const [messages, setMessages] = useState<PvPMessage[]>([]);

  useEffect(() => {
    const client = createPvPClient(sessionId, (message) => {
      setMessages((prev) => [...prev, message]);
    });
    client.session.send({ type: "join", payload: { sessionId } });
    return () => {
      client.dispose();
    };
  }, [sessionId]);

  return (
    <div className="space-y-2 text-xs">
      <p>Sesión PvP mock: <span className="font-mono">{sessionId}</span></p>
      <ul className="space-y-1">
        {messages.map((message, index) => (
          <li key={`${message.type}-${index}`} className="rounded border border-white/10 bg-black/30 p-2">
            {message.type}: {JSON.stringify(message.payload)}
          </li>
        ))}
      </ul>
    </div>
  );
}
