//@ts-nocheck
import { useEffect, useState } from 'react';
import { useSocket } from '@/hooks/useSocketContext';

// Types
interface VehicleData {
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

// Super Admin Component - Home.tsx
function Home() {
  const { socket, isConnected } = useSocket();
  const [vehicles, setVehicles] = useState<Map<string, VehicleData>>(new Map());
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);

  useEffect(() => {
    if (!socket) return;

    socket.on('vehicle-status', (data) => {
      setVehicles(prev => {
        const updated = new Map(prev);
        updated.set(data.vehicleId, {
          vehicleId: data.vehicleId,
          status: data.status,
          driverName: data.driverName,
          model: data.model,
          companyName: data.companyName,
          sessionId: data.sessionId,
          timestamp: data.timestamp
        });
        return updated;
      });
    });

    socket.on('vehicle-gps', (data) => {
      setVehicles(prev => {
        const updated = new Map(prev);
        const existing = updated.get(data.vehicleId);
        if (existing) {
          updated.set(data.vehicleId, {
            ...existing,
            latitude: data.latitude,
            longitude: data.longitude,
            timestamp: data.timestamp
          });
        }
        return updated;
      });
    });

    return () => {
      socket.off('vehicle-status');
      socket.off('vehicle-gps');
    };
  }, [socket]);

  const activeVehicles = Array.from(vehicles.values()).filter(v => v.status === 'ON');
  const inactiveVehicles = Array.from(vehicles.values()).filter(v => v.status !== 'ON');

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-2">Super Admin Dashboard</h1>
      <p className="mb-6 opacity-70">
        Connection Status: {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Vehicle List */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Active Vehicles ({activeVehicles.length})</h2>
          <div className="flex flex-col gap-3 mb-8">
            {activeVehicles.map(vehicle => (
              <div
                key={vehicle.vehicleId}
                onClick={() => setSelectedVehicle(vehicle.vehicleId)}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  selectedVehicle === vehicle.vehicleId ? 'border-blue-500 border-2' : 'border-gray-300'
                }`}
              >
                <div className="font-bold mb-1">{vehicle.driverName}</div>
                <div className="text-sm opacity-70">{vehicle.model} • {vehicle.companyName}</div>
                <div className="text-xs mt-2 opacity-60">{vehicle.vehicleId}</div>
              </div>
            ))}
          </div>

          <h2 className="text-xl font-semibold mb-4">Inactive Vehicles ({inactiveVehicles.length})</h2>
          <div className="flex flex-col gap-3">
            {inactiveVehicles.map(vehicle => (
              <div
                key={vehicle.vehicleId}
                className="p-4 border border-gray-300 rounded-lg opacity-50"
              >
                <div className="font-bold mb-1">{vehicle.driverName}</div>
                <div className="text-sm opacity-70">{vehicle.model} • {vehicle.status}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Vehicle Details */}
        <div className="lg:col-span-2">
          {selectedVehicle && vehicles.get(selectedVehicle) ? (
            <div className="border border-gray-300 rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-6">Vehicle Details</h2>
              
              <div className="flex flex-col gap-6">
                <div>
                  <div className="text-xs opacity-60 mb-1">Driver</div>
                  <div className="text-xl font-bold">{vehicles.get(selectedVehicle)!.driverName}</div>
                </div>

                <div>
                  <div className="text-xs opacity-60 mb-1">Vehicle Model</div>
                  <div className="text-lg">{vehicles.get(selectedVehicle)!.model}</div>
                </div>

                <div>
                  <div className="text-xs opacity-60 mb-1">Vehicle ID</div>
                  <div className="text-base font-mono">{vehicles.get(selectedVehicle)!.vehicleId}</div>
                </div>

                <div>
                  <div className="text-xs opacity-60 mb-1">Status</div>
                  <div className="text-lg font-bold">
                    {vehicles.get(selectedVehicle)!.status === 'ON' ? '🟢 ACTIVE' : 
                     vehicles.get(selectedVehicle)!.status === 'TIMEOUT' ? '🟠 TIMEOUT' : '🔴 OFFLINE'}
                  </div>
                </div>

                {vehicles.get(selectedVehicle)!.companyName && (
                  <div>
                    <div className="text-xs opacity-60 mb-1">Company</div>
                    <div className="text-lg">{vehicles.get(selectedVehicle)!.companyName}</div>
                  </div>
                )}

                {vehicles.get(selectedVehicle)!.latitude && vehicles.get(selectedVehicle)!.longitude && (
                  <>
                    <div>
                      <div className="text-xs opacity-60 mb-1">GPS Coordinates</div>
                      <div className="text-base font-mono">
                        Lat: {vehicles.get(selectedVehicle)!.latitude!.toFixed(6)}°<br />
                        Lng: {vehicles.get(selectedVehicle)!.longitude!.toFixed(6)}°
                      </div>
                    </div>

                    <div>
                      <div className="text-xs opacity-60 mb-2">Map Preview</div>
                      <div className="border border-gray-300 rounded-lg overflow-hidden h-80">
                        <iframe
                          width="100%"
                          height="100%"
                          frameBorder="0"
                          src={`https://www.openstreetmap.org/export/embed.html?bbox=${vehicles.get(selectedVehicle)!.longitude!-0.01},${vehicles.get(selectedVehicle)!.latitude!-0.01},${vehicles.get(selectedVehicle)!.longitude!+0.01},${vehicles.get(selectedVehicle)!.latitude!+0.01}&layer=mapnik&marker=${vehicles.get(selectedVehicle)!.latitude},${vehicles.get(selectedVehicle)!.longitude}`}
                          className="border-0"
                        />
                      </div>
                    </div>
                  </>
                )}

                <div>
                  <div className="text-xs opacity-60 mb-1">Session ID</div>
                  <div className="text-sm font-mono break-all">{vehicles.get(selectedVehicle)!.sessionId}</div>
                </div>

                <div>
                  <div className="text-xs opacity-60 mb-1">Last Update</div>
                  <div className="text-sm">{new Date(vehicles.get(selectedVehicle)!.timestamp).toLocaleString()}</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-96 border border-gray-300 rounded-lg">
              <p className="opacity-50">Select a vehicle to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;