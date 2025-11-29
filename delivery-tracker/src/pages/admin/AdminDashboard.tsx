import { useEffect, useState } from "react";
import { Radio } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthContext } from "@/hooks/useAuthContext";
import { useSocket } from "@/hooks/useSocketContext";
import { ChartLineDots } from "@/components/base/LineChart";
import { ChartBarDefault } from "@/components/base/BarChart";
import { ChartRadarGridCircleNoLines } from "@/components/base/ChartRadar";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

// Types
interface VehicleData {
  vehicleId: string;
  status: "ON" | "OFF" | "TIMEOUT";
  driverName: string;
  model: string;
  sessionId: string;
  latitude?: number;
  longitude?: number;
  timestamp: string;
}

const truckIcon = new L.DivIcon({
  html: `<div class="bg-primary text-primary-foreground p-1 rounded-full shadow-lg">
           <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
             <path d="M8 17a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm10 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm3-11h-6V4H9v2H3c-1.1 0-2 .9-2 2v9h2a3 3 0 0 0 6 0h6a3 3 0 0 0 6 0h2v-5l-2-6zM7 14a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm10 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm2-7h2.3l1.4 4H19V7z"/>
           </svg>
         </div>`,
  iconSize: [34, 34],
  iconAnchor: [17, 34],
  popupAnchor: [0, -34],
  className: "custom-truck-icon",
});

export default function AdminDashboard() {
  const { user } = useAuthContext();
  const { socket, isConnected } = useSocket();
  const [vehicles, setVehicles] = useState<Map<string, VehicleData>>(new Map());

  useEffect(() => {
    if (!socket) return;

    socket.on("vehicle-status", (data) => {
      setVehicles((prev) => {
        const updated = new Map(prev);
        updated.set(data.vehicleId, {
          vehicleId: data.vehicleId,
          status: data.status,
          driverName: data.driverName,
          model: data.model,
          sessionId: data.sessionId,
          timestamp: data.timestamp,
          latitude: updated.get(data.vehicleId)?.latitude,
          longitude: updated.get(data.vehicleId)?.longitude,
        });
        return updated;
      });
    });

    socket.on("vehicle-gps", (data) => {
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
        }
        return updated;
      });
    });

    return () => {
      socket.off("vehicle-status");
      socket.off("vehicle-gps");
    };
  }, [socket]);

  // Filter only active vehicles with GPS coordinates
  const activeVehicles = Array.from(vehicles.values()).filter(
    (v) => v.status === "ON" && v.latitude != null && v.longitude != null
  );

  return (
    <div className="min-h-screen p-4 sm:p-6">
      <div className="p-4 bg-primary/30 rounded-2xl">
        <div className="flex gap-4 items-center">
          <Avatar className="w-28 h-28">
            <AvatarImage src={user?.photo} />
            <AvatarFallback>{user?.name[0] + user?.name[1]}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-0.5 flex-1 min-w-0">
            <span className="text-2xl font-bold">
              Welcome Back, <span className="text-primary">{user?.name}</span>
            </span>
            <span className="text-xs text-muted-foreground truncate">
              {user?.email}
            </span>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap justify-between gap-4 md:gap-12 mb-4 mt-6 items-stretch">
        <ChartLineDots />
        <ChartBarDefault />
        <ChartRadarGridCircleNoLines />
      </div>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* Left Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Toggle */}
            <div className="flex gap-2 items-center">
              <Button variant={"default"}>
                <Radio className="w-4 h-4 mr-2" />
                Live Tracking
              </Button>
              <span className="text-sm text-muted-foreground">
                {isConnected ? "🟢 Connected" : "🔴 Disconnected"} •{" "}
                {activeVehicles.length} Active Vehicle
                {activeVehicles.length !== 1 ? "s" : ""}
              </span>
            </div>

            {/* Map */}
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <MapContainer
                  center={[36.8065, 10.1815]}
                  zoom={13}
                  style={{ height: "450px", width: "100%" }}
                >
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                  {activeVehicles.map((vehicle) => (
                    <Marker
                      key={vehicle.vehicleId}
                      position={[vehicle.latitude!, vehicle.longitude!]}
                      icon={truckIcon}
                    >
                      <Popup>
                        <div className="font-semibold">{vehicle.model}</div>
                        <div>Driver: {vehicle.driverName}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {vehicle.vehicleId}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Updated:{" "}
                          {new Date(vehicle.timestamp).toLocaleTimeString()}
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </CardContent>
            </Card>
          </div>

          {/* Right Panel - Active Vehicles List */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">
              Active Vehicles ({activeVehicles.length})
            </h2>

            <div className="flex flex-col gap-3">
              {activeVehicles.length === 0 ? (
                <Card>
                  <CardContent className="p-6 text-center text-muted-foreground">
                    No active vehicles at the moment
                  </CardContent>
                </Card>
              ) : (
                activeVehicles.map((vehicle) => (
                  <Card
                    key={vehicle.vehicleId}
                    className="hover:shadow-md transition-shadow"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="font-bold text-lg mb-1">
                            {vehicle.driverName}
                          </div>
                          <div className="text-sm text-muted-foreground mb-2">
                            {vehicle.model}
                          </div>
                          <div className="flex items-center gap-2 text-xs">
                            <span className="inline-flex items-center gap-1">
                              🟢 <span className="font-medium">Active</span>
                            </span>
                          </div>
                          <div className="text-xs text-muted-foreground mt-2">
                            {vehicle.vehicleId}
                          </div>
                        </div>
                        <div className="text-xs text-right text-muted-foreground">
                          {new Date(vehicle.timestamp).toLocaleTimeString()}
                        </div>
                      </div>

                      {vehicle.latitude && vehicle.longitude && (
                        <div className="mt-3 pt-3 border-t text-xs font-mono text-muted-foreground">
                          <div>Lat: {vehicle.latitude.toFixed(6)}°</div>
                          <div>Lng: {vehicle.longitude.toFixed(6)}°</div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
