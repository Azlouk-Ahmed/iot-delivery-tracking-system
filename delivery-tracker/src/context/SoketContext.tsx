import { useAuthContext } from '@/hooks/useAuthContext';
import { createContext, useEffect, useState, type ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';

// Define event types for type safety
interface VehicleStatusEvent {
  vehicleId: string;
  status: 'ON' | 'OFF' | 'TIMEOUT';
  driverName: string;
  model: string;
  companyName?: string;
  sessionId: string;
  timestamp: string;
}

interface VehicleGPSEvent {
  vehicleId: string;
  sessionId: string;
  driverName: string;
  model: string;
  companyName?: string;
  latitude: number;
  longitude: number;
  timestamp: string;
}

interface MQTTErrorEvent {
  message: string;
  timestamp: string;
}

// Vehicle Data Interface
export interface VehicleData {
  vehicleId: string;
  status: 'ON' | 'OFF' | 'TIMEOUT';
  driverName: string;
  model: string;
  companyName?: string;
  sessionId: string;
  latitude?: number;
  longitude?: number;
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
  'get-all-vehicles': (callback: (vehicles: VehicleData[]) => void) => void;
}

type SocketType = Socket<ServerToClientEvents, ClientToServerEvents>;

interface SocketContextType {
  socket: SocketType | null;
  isConnected: boolean;
  vehicles: Map<string, VehicleData>;
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
  const [vehicles, setVehicles] = useState<Map<string, VehicleData>>(new Map());
  const { user } = useAuthContext();

  useEffect(() => {
    if (!user) return;
    const socketInstance: SocketType = io(
      import.meta.env.VITE_API_URL || 'http://localhost:5000',
      {
        withCredentials: true,
        autoConnect: true,
        auth: {
          name: `${user.name}`,
          email: `${user.email}`,
          role: `${user.role}`,
          userId: `${user._id}`,
        },
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

    // Listen for vehicle status updates
    socketInstance.on('vehicle-status', (data) => {
      setVehicles((prev) => {
        const updated = new Map(prev);
        updated.set(data.vehicleId, {
          vehicleId: data.vehicleId,
          status: data.status,
          driverName: data.driverName,
          model: data.model,
          companyName: data.companyName,
          sessionId: data.sessionId,
          timestamp: data.timestamp,
          latitude: updated.get(data.vehicleId)?.latitude,
          longitude: updated.get(data.vehicleId)?.longitude,
        });
        return updated;
      });
    });

    // Listen for GPS updates
    socketInstance.on('vehicle-gps', (data) => {
      setVehicles((prev) => {
        const updated = new Map(prev);
        const existing = updated.get(data.vehicleId);
        if (existing) {
          updated.set(data.vehicleId, {
            ...existing,
            latitude: data.latitude,
            longitude: data.longitude,
            timestamp: data.timestamp,
          });
        } else {
          // If vehicle doesn't exist yet, create it with GPS data
          updated.set(data.vehicleId, {
            vehicleId: data.vehicleId,
            status: 'ON',
            driverName: data.driverName,
            model: data.model,
            companyName: data.companyName,
            sessionId: data.sessionId,
            latitude: data.latitude,
            longitude: data.longitude,
            timestamp: data.timestamp,
          });
          //toast.info(`${data.driverName} turned ON vehicle ${data.model}`);
        }
        return updated;
      });
    });

    setSocket(socketInstance);
    return () => {
      socketInstance.disconnect();
    };
  }, [user]);

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
    <SocketContext.Provider
      value={{ socket, isConnected, vehicles, joinVehicle, leaveVehicle }}
    >
      {children}
    </SocketContext.Provider>
  );
};