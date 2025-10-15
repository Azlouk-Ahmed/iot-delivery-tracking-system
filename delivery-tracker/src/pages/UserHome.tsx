import { useEffect, useState } from 'react';
import { useSocket } from '../hooks/useSocketContext';
import { Activity, MapPin, Car, Clock, Signal } from 'lucide-react';

interface Vehicle {
  vehicleId: string;
  status: 'ON' | 'OFF';
  driverName: string;
  model: string;
  sessionId: string;
  timestamp: string;
}

interface GPSData {
  vehicleId: string;
  sessionId: string;
  driverName: string;
  model: string;
  latitude: number;
  longitude: number;
  timestamp: string;
}

function UserHome() {
  const { socket, isConnected } = useSocket();
  const [activeVehicles, setActiveVehicles] = useState<Vehicle[]>([]);
  const [gpsUpdates, setGpsUpdates] = useState<GPSData[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);

  useEffect(() => {
    if (!socket) return;

    // Handle vehicle status changes
    const handleVehicleStatus = (data: Vehicle) => {
      if (data.status === 'ON') {
        setActiveVehicles(prev => {
          const exists = prev.some(v => v.vehicleId === data.vehicleId);
          if (exists) return prev;
          return [...prev, data];
        });
      } else {
        setActiveVehicles(prev => 
          prev.filter(v => v.vehicleId !== data.vehicleId)
        );
        // Clear GPS updates for stopped vehicle
        setGpsUpdates(prev => 
          prev.filter(g => g.vehicleId !== data.vehicleId)
        );
      }
    };

    // Handle GPS updates
    const handleGPSUpdate = (data: GPSData) => {
      setGpsUpdates(prev => {
        // Keep last 100 GPS points
        const updated = [...prev, data];
        return updated.slice(-100);
      });

      // Auto-add vehicle to active list if not already there
      setActiveVehicles(prev => {
        const exists = prev.some(v => v.vehicleId === data.vehicleId);
        if (exists) return prev;
        
        // Add vehicle with ON status
        return [...prev, {
          vehicleId: data.vehicleId,
          status: 'ON',
          driverName: data.driverName,
          model: data.model,
          sessionId: data.sessionId,
          timestamp: data.timestamp
        }];
      });
    };

    socket.on('vehicle-status', handleVehicleStatus);
    socket.on('vehicle-gps', handleGPSUpdate);

    return () => {
      socket.off('vehicle-status', handleVehicleStatus);
      socket.off('vehicle-gps', handleGPSUpdate);
    };
  }, [socket]);

  // Get latest GPS for each vehicle
  const getLatestGPS = (vehicleId: string) => {
    const vehicleGPS = gpsUpdates.filter(g => g.vehicleId === vehicleId);
    return vehicleGPS[vehicleGPS.length - 1];
  };

  // Filter GPS updates for selected vehicle
  const filteredGPS = selectedVehicle 
    ? gpsUpdates.filter(g => g.vehicleId === selectedVehicle)
    : gpsUpdates;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-4xl font-bold">Vehicle Tracking Dashboard</h1>
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${
            isConnected ? 'bg-green-600' : 'bg-red-600'
          }`}>
            <Signal className="w-4 h-4" />
            <span className="text-sm font-medium">
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        </div>
        <p className="text-slate-400">Real-time monitoring of all active vehicles</p>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Vehicles Panel */}
        <div className="lg:col-span-1 bg-slate-800 rounded-xl shadow-2xl p-6 border border-slate-700">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Car className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Active Vehicles</h2>
              <p className="text-sm text-slate-400">{activeVehicles.length} online</p>
            </div>
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {activeVehicles.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                <Car className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No active vehicles</p>
              </div>
            ) : (
              activeVehicles.map(vehicle => {
                const latestGPS = getLatestGPS(vehicle.vehicleId);
                const isSelected = selectedVehicle === vehicle.vehicleId;
                
                return (
                  <div
                    key={vehicle.vehicleId}
                    onClick={() => setSelectedVehicle(isSelected ? null : vehicle.vehicleId)}
                    className={`p-4 rounded-lg cursor-pointer transition-all ${
                      isSelected 
                        ? 'bg-blue-600 border-2 border-blue-400' 
                        : 'bg-slate-700 hover:bg-slate-600 border-2 border-transparent'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-lg">{vehicle.driverName}</h3>
                        <p className="text-sm text-slate-300">{vehicle.model}</p>
                      </div>
                      <span className="flex items-center gap-1 text-xs bg-green-600 px-2 py-1 rounded-full">
                        <Activity className="w-3 h-3" />
                        Live
                      </span>
                    </div>
                    
                    <p className="text-xs text-slate-400 mb-2">ID: {vehicle.vehicleId}</p>
                    
                    {latestGPS && (
                      <div className="flex items-center gap-2 text-xs text-slate-300">
                        <MapPin className="w-3 h-3" />
                        <span>
                          {latestGPS.latitude.toFixed(4)}, {latestGPS.longitude.toFixed(4)}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* GPS Updates Panel */}
        <div className="lg:col-span-2 bg-slate-800 rounded-xl shadow-2xl p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-600 rounded-lg">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">GPS Updates</h2>
                <p className="text-sm text-slate-400">
                  {selectedVehicle ? 'Filtered by vehicle' : 'All vehicles'}
                </p>
              </div>
            </div>
            
            {selectedVehicle && (
              <button
                onClick={() => setSelectedVehicle(null)}
                className="px-3 py-1 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm transition-colors"
              >
                Show All
              </button>
            )}
          </div>

          <div className="space-y-2 max-h-[600px] overflow-y-auto">
            {filteredGPS.length === 0 ? (
              <div className="text-center py-16 text-slate-400">
                <MapPin className="w-16 h-16 mx-auto mb-3 opacity-50" />
                <p className="text-lg">No GPS data yet</p>
                <p className="text-sm">Waiting for vehicle updates...</p>
              </div>
            ) : (
              filteredGPS.slice().reverse().map((gps, idx) => (
                <div
                  key={`${gps.vehicleId}-${gps.timestamp}-${idx}`}
                  className="p-4 bg-slate-700 rounded-lg hover:bg-slate-650 transition-colors border border-slate-600"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-lg">{gps.driverName}</h3>
                        <span className="text-xs bg-slate-600 px-2 py-1 rounded">
                          {gps.model}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <p className="text-slate-400 text-xs mb-1">Latitude</p>
                          <p className="font-mono text-green-400">{gps.latitude.toFixed(6)}</p>
                        </div>
                        <div>
                          <p className="text-slate-400 text-xs mb-1">Longitude</p>
                          <p className="font-mono text-blue-400">{gps.longitude.toFixed(6)}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 mt-3 text-xs text-slate-400">
                        <Clock className="w-3 h-3" />
                        <span>{new Date(gps.timestamp).toLocaleString()}</span>
                      </div>
                    </div>
                    
                    <a
                      href={`https://www.google.com/maps?q=${gps.latitude},${gps.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-4 px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm transition-colors whitespace-nowrap"
                    >
                      View Map
                    </a>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Stats Footer */}
      <div className="max-w-7xl mx-auto mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <p className="text-slate-400 text-sm mb-1">Active Vehicles</p>
          <p className="text-3xl font-bold text-blue-400">{activeVehicles.length}</p>
        </div>
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <p className="text-slate-400 text-sm mb-1">GPS Updates</p>
          <p className="text-3xl font-bold text-green-400">{gpsUpdates.length}</p>
        </div>
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <p className="text-slate-400 text-sm mb-1">Connection Status</p>
          <p className="text-3xl font-bold text-slate-300">
            {isConnected ? '🟢 Live' : '🔴 Offline'}
          </p>
        </div>
      </div>
    </div>
  );
}

export default UserHome;