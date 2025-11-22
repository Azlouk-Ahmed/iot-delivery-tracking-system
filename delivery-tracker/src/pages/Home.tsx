import { useState } from 'react';
import { useSocket } from '@/hooks/useSocketContext';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Truck, 
  Building2, 
  MapPin, 
  Clock,
  Phone,
  Mail,
  Activity
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom marker for active vehicles
const activeMarkerIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="oklch(0.7082 0.1393 96.7240)" stroke="white" stroke-width="2">
      <circle cx="12" cy="12" r="10"/>
    </svg>
  `),
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16]
});

// Types
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

// Vehicle Card Component
function VehicleCard({ 
  vehicle, 
  isSelected, 
  onClick 
}: { 
  vehicle: VehicleData; 
  isSelected: boolean; 
  onClick: () => void;
}) {
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'ON': return 'bg-green-500';
      case 'TIMEOUT': return 'bg-orange-500';
      default: return 'bg-red-500';
    }
  };

  const getStatusText = (status: string) => {
    switch(status) {
      case 'ON': return 'Active';
      case 'TIMEOUT': return 'Timeout';
      default: return 'Offline';
    }
  };
  

  return (
    <Card 
      onClick={onClick}
      className={`cursor-pointer transition-all hover:shadow-md ${
        isSelected ? 'ring-2 ring-primary' : ''
      }`}
    >
      <CardContent className="pt-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex gap-3 items-start flex-1">
            <Avatar>
              <AvatarFallback>
                {vehicle.driverName.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <h3 className="font-bold flex items-center gap-2">
                <User size={14} />
                {vehicle.driverName}
              </h3>
              <p className="text-[10px] text-muted-foreground flex items-center gap-1 mt-1">
                <Truck size={10} />
                {vehicle.model}
              </p>
              {vehicle.companyName && (
                <p className="text-[10px] text-muted-foreground flex items-center gap-1 mt-1">
                  <Building2 size={10} />
                  {vehicle.companyName}
                </p>
              )}
            </div>
          </div>

          <Badge 
            variant="secondary" 
            className={`${getStatusColor(vehicle.status)} text-white text-[10px] px-2`}
          >
            {getStatusText(vehicle.status)}
          </Badge>
        </div>

        <div className="flex items-center gap-2 text-[10px] text-muted-foreground mt-3 pt-3 border-t">
          <Clock size={12} />
          {new Date(vehicle.timestamp).toLocaleString()}
        </div>
      </CardContent>
    </Card>
  );
}

// Vehicle Details Component
function VehicleDetails({ vehicle }: { vehicle: VehicleData }) {
  const dark = document.getElementsByClassName('dark');

  return (
    <Card className="h-full">
      <CardHeader className="font-extrabold text-primary text-2xl">
        Vehicle Details
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Driver Info */}
        <div className="flex gap-4 items-center pb-4 border-b">
          <Avatar className="w-16 h-16">
            <AvatarFallback className="text-xl">
              {vehicle.driverName.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <User size={16} />
              {vehicle.driverName}
            </h3>
            <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
              <Truck size={14} />
              {vehicle.model}
            </p>
          </div>

          <div className="flex gap-2">
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <Phone size={18} className="text-[var(--blue)]" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <Mail size={18} className="text-[var(--blue)]" />
            </button>
          </div>
        </div>

        {/* Vehicle Info Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Vehicle ID</p>
            <p className="text-sm font-mono break-all">{vehicle.vehicleId}</p>
          </div>

          {vehicle.companyName && (
            <div>
              <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                <Building2 size={12} />
                Company
              </p>
              <p className="text-sm font-medium">{vehicle.companyName}</p>
            </div>
          )}

          <div>
            <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
              <Activity size={12} />
              Status
            </p>
            <Badge 
              className={`${
                vehicle.status === 'ON' ? 'bg-green-500' : 
                vehicle.status === 'TIMEOUT' ? 'bg-orange-500' : 'bg-red-500'
              } text-white`}
            >
              {vehicle.status === 'ON' ? 'Active' : 
               vehicle.status === 'TIMEOUT' ? 'Timeout' : 'Offline'}
            </Badge>
          </div>

          <div>
            <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
              <Clock size={12} />
              Last Update
            </p>
            <p className="text-sm">{new Date(vehicle.timestamp).toLocaleTimeString()}</p>
          </div>
        </div>

        {/* GPS Coordinates */}
        {vehicle.latitude && vehicle.longitude && (
          <div>
            <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
              <MapPin size={12} />
              GPS Coordinates
            </p>
            <div className="text-sm font-mono bg-gray-50 p-3 rounded-lg">
              <div>Lat: {vehicle.latitude.toFixed(6)}°</div>
              <div>Lng: {vehicle.longitude.toFixed(6)}°</div>
            </div>
          </div>
        )}

        {/* Session ID */}
        <div>
          <p className="text-xs text-muted-foreground mb-1">Session ID</p>
          <p className="text-xs font-mono break-all bg-gray-50 p-2 rounded">
            {vehicle.sessionId}
          </p>
        </div>

        {/* Map */}
        {vehicle.latitude && vehicle.longitude && (
          <div>
            <p className="text-xs text-muted-foreground mb-2">Live Location</p>
            <div className="h-64 rounded-lg overflow-hidden border">
              <MapContainer
                center={[vehicle.latitude, vehicle.longitude]}
                zoom={15}
                style={{ height: '100%', width: '100%' }}
                className="z-0"
              >
                {
                  dark.length > 0 ? (
                    <TileLayer
                      url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                    />
                  ) : (
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                  )
                }
                <Marker 
                  position={[vehicle.latitude, vehicle.longitude]}
                  icon={activeMarkerIcon}
                >
                  <Popup>
                    <div className="text-sm">
                      <strong>{vehicle.driverName}</strong>
                      <br />
                      {vehicle.model}
                    </div>
                  </Popup>
                </Marker>
              </MapContainer>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Main Home Component
function Home() {
  const { isConnected, vehicles } = useSocket();
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);

  const activeVehicles = Array.from(vehicles.values()).filter(v => v.status === 'ON');
  const inactiveVehicles = Array.from(vehicles.values()).filter(v => v.status !== 'ON');

  return (
    <div className="flex gap-4 flex-col md:flex-row w-full p-6">
      {/* Left Sidebar - Vehicle List */}
      <Card className="md:w-1/3">
        <CardContent className="px-0">
          <CardHeader className="font-extrabold text-primary text-3xl flex flex-row justify-between items-center">
            <span>Tracking Monitor</span>
            <Badge 
              variant="secondary" 
              className={`${isConnected ? 'bg-green-500' : 'bg-red-500'} text-white`}
            >
              {isConnected ? 'Connected' : 'Disconnected'}
            </Badge>
          </CardHeader>

          {/* Active Vehicles */}
          <CardContent className="space-y-3">
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
                <Activity size={16} className="text-green-500" />
                Active Vehicles ({activeVehicles.length})
              </h3>
              <div className="space-y-3 max-h-[40vh] overflow-y-auto">
                {activeVehicles.map(vehicle => (
                  <VehicleCard
                    key={vehicle.vehicleId}
                    vehicle={vehicle}
                    isSelected={selectedVehicle === vehicle.vehicleId}
                    onClick={() => setSelectedVehicle(vehicle.vehicleId)}
                  />
                ))}
              </div>
            </div>

            {/* Inactive Vehicles */}
            {inactiveVehicles.length > 0 && (
              <div className="pt-4 border-t">
                <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
                  <Activity size={16} className="text-gray-400" />
                  Inactive Vehicles ({inactiveVehicles.length})
                </h3>
                <div className="space-y-3 max-h-[30vh] overflow-y-auto">
                  {inactiveVehicles.map(vehicle => (
                    <VehicleCard
                      key={vehicle.vehicleId}
                      vehicle={vehicle}
                      isSelected={selectedVehicle === vehicle.vehicleId}
                      onClick={() => setSelectedVehicle(vehicle.vehicleId)}
                    />
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </CardContent>
      </Card>

      {/* Right Panel - Vehicle Details */}
      <div className="flex-1">
        {selectedVehicle && vehicles.get(selectedVehicle) ? (
          <VehicleDetails vehicle={vehicles.get(selectedVehicle)!} />
        ) : (
          <Card className="h-full">
            <CardContent className="flex items-center justify-center h-[85vh]">
              <div className="text-center">
                <Truck size={64} className="mx-auto text-gray-300 mb-4" />
                <p className="text-muted-foreground">
                  Select a vehicle to view details
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

export default Home;