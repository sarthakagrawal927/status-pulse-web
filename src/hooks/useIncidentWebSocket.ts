import { useEffect, useRef } from 'react';
import { toast } from 'sonner';

export const useIncidentWebSocket = (onIncidentUpdate: (incident: any) => void) => {
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    // Replace with your actual WebSocket server URL
    const wsUrl = `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}/api/incidents`;
    
    ws.current = new WebSocket(wsUrl);

    ws.current.onopen = () => {
      console.log('WebSocket connection established');
    };

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      onIncidentUpdate(data);
      toast.info(`New incident update: ${data.title}`);
    };

    ws.current.onerror = (error) => {
      console.error('WebSocket error:', error);
      toast.error('Error connecting to real-time updates');
    };

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [onIncidentUpdate]);

  return ws.current;
};