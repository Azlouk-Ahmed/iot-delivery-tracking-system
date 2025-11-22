/* English version of AdminDashboard.jsx (all French texts translated) */

'use client';

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Truck,
  Package,
  Clock,
  TrendingUp,
  Radio,
  CheckCircle,
  Users,
  MapPin,
  Activity,
  Navigation,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet default icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

// =================== MOCK DATA ===================
const activeVehicles = [
  {
    id: 1,
    driver: "Alice Johnson",
    vehicle: "VAN-001",
    status: "enRoute",
    location: { lat: 36.8065, lng: 10.1815 },
    destination: "Client A",
    eta: "15 min",
    speed: 45,
  },
  {
    id: 2,
    driver: "Bob Smith",
    vehicle: "TRUCK-002",
    status: "loading",
    location: { lat: 36.8125, lng: 10.1865 },
    destination: "Client B",
    eta: "30 min",
    speed: 0,
  },
  {
    id: 3,
    driver: "Marie Dubois",
    vehicle: "VAN-003",
    status: "enRoute",
    location: { lat: 36.7989, lng: 10.1698 },
    destination: "Client C",
    eta: "10 min",
    speed: 52,
  },
];

const deliveryHistory = [
  {
    id: 1,
    order: "ORD-9876",
    route: "Tunis → La Marsa",
    duration: "45 min",
    distance: "12 km",
    completed: "14:30",
  },
  {
    id: 2,
    order: "ORD-8765",
    route: "Ariana → Carthage",
    duration: "30 min",
    distance: "8 km",
    completed: "13:15",
  },
  {
    id: 3,
    order: "ORD-7654",
    route: "Tunis → Bardo",
    duration: "25 min",
    distance: "6 km",
    completed: "11:45",
  },
];

const stats = {
  activeVehicles: 3,
  todayDeliveries: 24,
  completedToday: 18,
  averageTime: "35 min",
  onTimeRate: 94,
  totalDistance: "245 km",
};

// Custom Truck Icon
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
  const [selectedVehicle, setSelectedVehicle] = useState<number | null>(null);
  const [view, setView] = useState<"live" | "history">("live");
  const navigate = useNavigate();

  // Status Helpers
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "enRoute":
        return {
          label: "On Route",
          class:
            "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:border-blue-700",
          icon: <Activity className="w-3 h-3" />,
        };
      case "loading":
        return {
          label: "Loading",
          class:
            "bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-300 dark:border-yellow-700",
          icon: <Package className="w-3 h-3" />,
        };
      case "delivered":
        return {
          label: "Delivered",
          class:
            "bg-green-100 text-green-700 border-green-200 dark:bg-green-900 dark:text-green-300 dark:border-green-700",
          icon: <CheckCircle className="w-3 h-3" />,
        };
      default:
        return {
          label: status,
          class: "bg-muted text-muted-foreground border",
          icon: null,
        };
    }
  };

  return (
    <div className="min-h-screen p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Activity className="w-10 h-10 text-primary" />
            Dashboard – Delivery Tracking
          </h1>
          <p className="text-muted-foreground mt-1">
            Real-time fleet monitoring and performance analytics
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              title: "Active Vehicles",
              value: stats.activeVehicles,
              icon: <Truck className="w-6 h-6" />,
              footer: (
                <>
                  <Radio className="w-3 h-3 mr-1 animate-pulse" /> Live Tracking
                </>
              ),
            },
            {
              title: "Delivered Today",
              value: `${stats.completedToday}/${stats.todayDeliveries}`,
              icon: <CheckCircle className="w-6 h-6" />,
              footer: (
                <>
                  <TrendingUp className="w-3 h-3 mr-1" /> {stats.onTimeRate}% on time
                </>
              ),
            },
            {
              title: "Average Time",
              value: stats.averageTime,
              icon: <Clock className="w-6 h-6" />,
              footer: (
                <>
                  <Activity className="w-3 h-3 mr-1" /> Per delivery
                </>
              ),
            },
            {
              title: "Total Distance",
              value: stats.totalDistance,
              icon: <Navigation className="w-6 h-6" />,
              footer: (
                <>
                  <MapPin className="w-3 h-3 mr-1" /> Today
                </>
              ),
            },
          ].map((card, idx) => (
            <Card key={idx} className="border">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      {card.title}
                    </p>
                    <p className="text-3xl font-bold">{card.value}</p>
                  </div>
                  <div className="bg-muted p-3 rounded-lg">{card.icon}</div>
                </div>
                <div className="mt-3 flex items-center text-xs text-muted-foreground">
                  {card.footer}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Toggle */}
            <div className="flex gap-2">
              <Button
                onClick={() => setView("live")}
                variant={view === "live" ? "default" : "outline"}
              >
                <Radio className="w-4 h-4 mr-2" />
                Live Tracking
              </Button>
              <Button
                onClick={() => setView("history")}
                variant={view === "history" ? "default" : "outline"}
              >
                <Clock className="w-4 h-4 mr-2" />
                History
              </Button>
            </div>

            {/* Map */}
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                {view === "live" ? (
                  <MapContainer
                    center={[36.8065, 10.1815]}
                    zoom={13}
                    style={{ height: "450px", width: "100%" }}
                  >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                    {activeVehicles.map((v) => (
                      <Marker
                        key={v.id}
                        position={[v.location.lat, v.location.lng]}
                        icon={truckIcon}
                        eventHandlers={{
                          click: () => setSelectedVehicle(v.id),
                        }}
                      >
                        <Popup>
                          <div className="font-semibold">{v.vehicle}</div>
                          <div>Driver: {v.driver}</div>
                          <div>Destination: {v.destination}</div>
                          <div>ETA: {v.eta}</div>
                        </Popup>
                      </Marker>
                    ))}
                  </MapContainer>
                ) : (
                  <div className="p-6 text-sm text-muted-foreground">
                    Select a delivery from the right panel to view route history.
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Panel */}
          <div className="space-y-6">
            {/* Live Vehicles List */}
            {view === "live" && (
              <Card>
                <CardContent className="p-4 space-y-4">
                  <h2 className="text-lg font-semibold flex items-center gap-2">
                    <Truck className="w-5 h-5 text-primary" /> Active Vehicles
                  </h2>

                  {activeVehicles.map((v) => {
                    const status = getStatusConfig(v.status);
                    return (
                      <div
                        key={v.id}
                        onClick={() => setSelectedVehicle(v.id)}
                        className={`p-4 border rounded-xl cursor-pointer hover:bg-muted transition ${
                          selectedVehicle === v.id ? "bg-muted" : ""
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold">{v.vehicle}</p>
                            <p className="text-xs text-muted-foreground">
                              {v.driver}
                            </p>
                          </div>
                          <div
                            className={`px-2 py-1 text-xs rounded-lg border flex items-center gap-1 ${status.class}`}
                          >
                            {status.icon} {status.label}
                          </div>
                        </div>
                        <div className="mt-2 text-xs text-muted-foreground">
                          Destination: {v.destination} — ETA {v.eta}
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            )}

            {/* History List */}
            {view === "history" && (
              <Card>
                <CardContent className="p-4 space-y-4">
                  <h2 className="text-lg font-semibold flex items-center gap-2">
                    <Clock className="w-5 h-5 text-primary" /> Delivery History
                  </h2>

                  {deliveryHistory.map((h) => (
                    <div
                      key={h.id}
                      className="p-4 border rounded-xl hover:bg-muted transition"
                    >
                      <p className="font-semibold">{h.order}</p>
                      <p className="text-xs text-muted-foreground">{h.route}</p>
                      <div className="mt-2 text-xs text-muted-foreground">
                        Duration: {h.duration} — Distance: {h.distance}
                      </div>
                      <p className="text-xs mt-1">Completed at {h.completed}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}