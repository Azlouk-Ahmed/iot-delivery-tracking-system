import { useEffect, useState } from "react";
import { useSocket } from "@/hooks/useSocketContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, MapPin, User, Car, Activity, Clock, TruckElectric } from "lucide-react";

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

function LiveMapMinotoring() {
  const { socket, isConnected } = useSocket();
  const [vehicles, setVehicles] = useState<Map<string, VehicleData>>(new Map());
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);

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

  const activeVehicles = Array.from(vehicles.values()).filter(
    (v) => v.status === "ON"
  );
  const allVehicles = Array.from(vehicles.values());

  // Calculate map bounds for all active vehicles
  const getMapBounds = () => {
    const vehiclesToShow = selectedVehicle
      ? [vehicles.get(selectedVehicle)].filter(Boolean)
      : activeVehicles;

    const coordVehicles = vehiclesToShow.filter(
      (v) => v?.latitude && v?.longitude
    );

    if (coordVehicles.length === 0) return null;

    if (coordVehicles.length === 1) {
      const v = coordVehicles[0]!;
      return {
        minLat: v.latitude! - 0.01,
        maxLat: v.latitude! + 0.01,
        minLng: v.longitude! - 0.01,
        maxLng: v.longitude! + 0.01,
        centerLat: v.latitude!,
        centerLng: v.longitude!,
      };
    }

    const lats = coordVehicles.map((v) => v!.latitude!);
    const lngs = coordVehicles.map((v) => v!.longitude!);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);

    const padding = 0.005;

    return {
      minLat: minLat - padding,
      maxLat: maxLat + padding,
      minLng: minLng - padding,
      maxLng: maxLng + padding,
      centerLat: (minLat + maxLat) / 2,
      centerLng: (minLng + maxLng) / 2,
    };
  };

  const bounds = getMapBounds();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ON":
        return (
          <Badge variant="default" className="bg-green-600">
            Active
          </Badge>
        );
      case "TIMEOUT":
        return (
          <Badge variant="default" className="bg-orange-600">
            Timeout
          </Badge>
        );
      default:
        return <Badge variant="destructive">Offline</Badge>;
    }
  };

  const selectedVehicleData = selectedVehicle
    ? vehicles.get(selectedVehicle)
    : null;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Real-Time Vehicle Monitoring</h1>
          <p className="flex items-center gap-2 mt-2">
            <Activity className="w-4 h-4" />
            {isConnected ? (
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                Connected
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-red-500"></span>
                Disconnected
              </span>
            )}
            <span className="mx-2">•</span>
            <span>{activeVehicles.length} Active Vehicles</span>
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-6">

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Live Location Map
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-6 mb-6">
              <div className="">
                <Select
                  value={selectedVehicle || "all"}
                  onValueChange={(value) =>
                    setSelectedVehicle(value === "all" ? null : value)
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="View all active vehicles" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        All Active Vehicles
                      </div>
                    </SelectItem>
                    {allVehicles.map((vehicle) => (
                      <SelectItem
                        key={vehicle.vehicleId}
                        value={vehicle.vehicleId}
                      >
                        <div className="flex items-center gap-2">
                          {vehicle.status !== "ON" && (
                            <AlertCircle className="w-4 h-4 text-yellow-600" />
                          )}
                          <span
                            className={
                              vehicle.status !== "ON" ? "text-yellow-600" : ""
                            }
                          >
                            {vehicle.driverName}
                          </span>
                          <span
                            className={
                              vehicle.status !== "ON"
                                ? "text-yellow-600 opacity-50"
                                : "opacity-50"
                            }
                          >
                            •
                          </span>
                          <span
                            className={
                              vehicle.status !== "ON" ? "text-yellow-600 " : ""
                            }
                          >
                            {vehicle.model}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
                <span className="flex gap-2 items-center"><Car /> {activeVehicles.length}</span>
            </div>
            <div
              className="rounded-lg overflow-hidden border"
              style={{ height: "600px" }}
            >
              {bounds ? (
                <iframe
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${
                    bounds.minLng
                  },${bounds.minLat},${bounds.maxLng},${
                    bounds.maxLat
                  }&layer=mapnik${
                    selectedVehicle &&
                    selectedVehicleData?.latitude &&
                    selectedVehicleData?.longitude
                      ? `&marker=${selectedVehicleData.latitude},${selectedVehicleData.longitude}`
                      : activeVehicles
                          .filter((v) => v.latitude && v.longitude)
                          .map((v) => `&marker=${v.latitude},${v.longitude}`)
                          .join("")
                  }`}
                  className="border-0"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center space-y-2">
                    <MapPin className="w-12 h-12 mx-auto opacity-20" />
                    <p className="opacity-50">No GPS data available</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Vehicle Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Vehicle Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedVehicleData ? (
              <div className="space-y-6">
                {/* Status Badge */}
                <div>{getStatusBadge(selectedVehicleData.status)}</div>

                {/* Driver */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 opacity-60">
                    <User className="w-4 h-4" />
                    <span className="text-sm font-medium">Driver</span>
                  </div>
                  <p className="text-xl font-semibold">
                    {selectedVehicleData.driverName}
                  </p>
                </div>

                {/* Vehicle Model */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 opacity-60">
                    <Car className="w-4 h-4" />
                    <span className="text-sm font-medium">Vehicle Model</span>
                  </div>
                  <p className="text-lg">{selectedVehicleData.model}</p>
                </div>

                {/* Vehicle ID */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 opacity-60">
                    <span className="text-sm font-medium">Vehicle ID</span>
                  </div>
                  <p className="text-sm font-mono break-all opacity-80">
                    {selectedVehicleData.vehicleId}
                  </p>
                </div>

                {/* GPS Coordinates */}
                {selectedVehicleData.latitude &&
                  selectedVehicleData.longitude && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 opacity-60">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm font-medium">
                          GPS Coordinates
                        </span>
                      </div>
                      <div className="font-mono text-sm space-y-1">
                        <p>Lat: {selectedVehicleData.latitude.toFixed(6)}°</p>
                        <p>Lng: {selectedVehicleData.longitude.toFixed(6)}°</p>
                      </div>
                    </div>
                  )}

                {/* Session ID */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 opacity-60">
                    <span className="text-sm font-medium">Session ID</span>
                  </div>
                  <p className="text-xs font-mono break-all opacity-70">
                    {selectedVehicleData.sessionId}
                  </p>
                </div>

                {/* Last Update */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 opacity-60">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm font-medium">Last Update</span>
                  </div>
                  <p className="text-sm">
                    {new Date(selectedVehicleData.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-96 space-y-3">
                <Car className="w-16 h-16 opacity-20" />
                <p className="opacity-50 text-center">
                  Select a vehicle to view detailed information
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Active Vehicles Overview */}
      {!selectedVehicle && activeVehicles.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Active Vehicles Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeVehicles.map((vehicle) => (
                <div
                  key={vehicle.vehicleId}
                  onClick={() => setSelectedVehicle(vehicle.vehicleId)}
                  className="p-4 border rounded-lg cursor-pointer hover:border-primary transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold">{vehicle.driverName}</p>
                      <p className="text-sm opacity-70">{vehicle.model}</p>
                    </div>
                    {getStatusBadge(vehicle.status)}
                  </div>
                  {vehicle.latitude && vehicle.longitude && (
                    <div className="flex items-center gap-1 text-xs opacity-60 mt-2">
                      <MapPin className="w-3 h-3" />
                      <span>
                        {vehicle.latitude.toFixed(4)}°,{" "}
                        {vehicle.longitude.toFixed(4)}°
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default LiveMapMinotoring;
