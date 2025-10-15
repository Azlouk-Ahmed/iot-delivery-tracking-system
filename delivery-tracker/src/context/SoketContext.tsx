import { createContext, useContext, useEffect, useState,type ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';

// Define event types for type safety
interface VehicleStatusEvent {
  vehicleId: string;
  status: 'ON' | 'OFF';
  driverName: string;
  model: string;
  sessionId: string;
  timestamp: string;
}

interface VehicleGPSEvent {
  vehicleId: string;
  sessionId: string;
  driverName: string;
  model: string;
  latitude: number;
  longitude: number;
  timestamp: string;
}

interface MQTTErrorEvent {
  message: string;
  timestamp: string;
}

// Define socket events
interface ServerToClientEvents {
  'vehicle-status': (data: VehicleStatusEvent) => void;
  'vehicle-gps': (data: VehicleGPSEvent) => void;
  'vehicle-started': (data: VehicleStatusEvent) => void;
  'vehicle-stopped': (data: VehicleStatusEvent) => void;
  'gps-update': (data: Omit<VehicleGPSEvent, 'driverName' | 'model'>) => void;
  'mqtt-error': (data: MQTTErrorEvent) => void;
}

interface ClientToServerEvents {
  'join-vehicle': (vehicleId: string) => void;
  'leave-vehicle': (vehicleId: string) => void;
}

type SocketType = Socket<ServerToClientEvents, ClientToServerEvents>;

interface SocketContextType {
  socket: SocketType | null;
  isConnected: boolean;
  joinVehicle: (vehicleId: string) => void;
  leaveVehicle: (vehicleId: string) => void;
}

export const SocketContext = createContext<SocketContextType | undefined>(undefined);

interface SocketProviderProps {
  children: ReactNode;
}

export const SocketProvider = ({ children }: SocketProviderProps) => {
  const [socket, setSocket] = useState<SocketType | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const socketInstance: SocketType = io(
      import.meta.env.VITE_API_URL || 'http://localhost:5000',
      {
        withCredentials: true,
        autoConnect: true,
      }
    );

    socketInstance.on('connect', () => {
      console.log('✅ Socket connected:', socketInstance.id);
      setIsConnected(true);
    });

    socketInstance.on('disconnect', () => {
      console.log('❌ Socket disconnected');
      setIsConnected(false);
    });

    socketInstance.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      setIsConnected(false);
    });

    setSocket(socketInstance);
    return () => {
      socketInstance.disconnect();
    };
  }, []);

  const joinVehicle = (vehicleId: string) => {
    if (socket?.connected) {
      socket.emit('join-vehicle', vehicleId);
      console.log(`📡 Joined vehicle room: ${vehicleId}`);
    }
  };

  const leaveVehicle = (vehicleId: string) => {
    if (socket?.connected) {
      socket.emit('leave-vehicle', vehicleId);
      console.log(`📡 Left vehicle room: ${vehicleId}`);
    }
  };

  return (
    <SocketContext.Provider value={{ socket, isConnected, joinVehicle, leaveVehicle }}>
      {children}
    </SocketContext.Provider>
  );
};