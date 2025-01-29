import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "./useAuth";

type EventCallback = (data: any) => void;
type EventType = "action" | "incident" | "service";

interface SocketHookOptions {
  organizationId: string;
  events?: {
    type: EventType;
    callback: EventCallback;
  }[];
}

export const useSocket = ({
  organizationId,
  events = [],
}: SocketHookOptions) => {
  const socket = useRef<Socket>();
  const { user } = useAuth();

  useEffect(() => {
    // Initialize socket connection
    socket.current = io(
      import.meta.env.VITE_API_URL || "http://localhost:3000"
    );

    // Clean up on unmount
    return () => {
      if (socket.current) {
        socket.current.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    console.log("useEffect", organizationId, socket.current);
    if (!socket.current || !organizationId) return;

    // Join organization room
    console.log(socket.current, organizationId);
    socket.current.emit("join-organization", organizationId);

    // Clean up when organizationId changes or component unmounts
    return () => {
      console.log(socket.current, organizationId);
      if (socket.current) {
        socket.current.emit("leave-organization", organizationId);
      }
    };
  }, [organizationId]);

  // Set up event listeners
  useEffect(() => {
    if (!socket.current) return;

    // Add listeners for each event
    events.forEach(({ type, callback }) => {
      socket.current?.on(type, callback);
    });

    // Clean up listeners
    return () => {
      events.forEach(({ type, callback }) => {
        socket.current?.off(type, callback);
      });
    };
  }, [events]);

  return socket.current;
};

// Helper hooks for specific event types
export const useActionSocket = (
  organizationId: string,
  onAction: EventCallback
) => {
  useSocket({
    organizationId,
    events: [{ type: "action", callback: onAction }],
  });
};

export const useIncidentSocket = (
  organizationId: string,
  onIncident: EventCallback
) => {
  useSocket({
    organizationId,
    events: [{ type: "incident", callback: onIncident }],
  });
};

// Hook to listen to multiple event types
export const useMultiSocket = (options: SocketHookOptions) => {
  useSocket(options);
};
