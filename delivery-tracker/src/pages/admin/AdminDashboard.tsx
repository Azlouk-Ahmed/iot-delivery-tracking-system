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
          label: "En Route",
          class: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:border-blue-700",
          icon: <Activity className="w-3 h-3" />,
        };
      case "loading":
        return {
          label: "Chargement",
          class: "bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-300 dark:border-yellow-700",
          icon: <Package className="w-3 h-3" />,
        };
      case "delivered":
        return {
          label: "Livré",
          class: "bg-green-100 text-green-700 border-green-200 dark:bg-green-900 dark:text-green-300 dark:border-green-700",
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
      {" "}
      {/* Default background */}
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Activity className="w-10 h-10 text-primary" />
            Tableau de Bord - Suivi des Livraisons
          </h1>
          <p className="text-muted-foreground mt-1">
            Surveillance en temps réel de votre flotte et analyse des performances
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              title: "Véhicules Actifs",
              value: stats.activeVehicles,
              icon: <Truck className="w-6 h-6" />,
              footer: (
                <>
                  <Radio className="w-3 h-3 mr-1 animate-pulse" /> Suivi en direct
                </>
              ),
            },
            {
              title: "Livrées Aujourd'hui",
              value: `${stats.completedToday}/${stats.todayDeliveries}`,
              icon: <CheckCircle className="w-6 h-6" />,
              footer: (
                <>
                  <TrendingUp className="w-3 h-3 mr-1" /> {stats.onTimeRate}% à temps
                </>
              ),
            },
            {
              title: "Temps Moyen",
              value: stats.averageTime,
              icon: <Clock className="w-6 h-6" />,
              footer: (
                <>
                  <Activity className="w-3 h-3 mr-1" /> Par livraison
                </>
              ),
            },
            {
              title: "Distance Totale",
              value: stats.totalDistance,
              icon: <Navigation className="w-6 h-6" />,
              footer: (
                <>
                  <MapPin className="w-3 h-3 mr-1" /> Aujourd'hui
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
          {/* Left: Map + History */}
          <div className="lg:col-span-2 space-y-6">
            {/* Toggle */}
            <div className="flex gap-2">
              <Button
                onClick={() => setView("live")}
                variant={view === "live" ? "default" : "outline"}
              >
                <Radio className="w-4 h-4 mr-2" />
                Suivi en Direct
              </Button>
              <Button
                onClick={() => setView("history")}
                variant={view === "history" ? "default" : "outline"}
              >
                <Clock className="w-4 h-4 mr-2" />
                Historique
              </Button>
            </div>

            {/* Map */}
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="h-96">
                  {view === "live" ? (
                    <MapContainer
                      center={[36.8065, 10.1815]}
                      zoom={13}
                      className="h-full w-full"
                    >
                      <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />
                      {activeVehicles.map((v) => (
                        <Marker
                          key={v.id}
                          position={[v.location.lat, v.location.lng]}
                          icon={truckIcon}
                        >
                          <Popup>
                            <div className="text-sm">
                              <strong>{v.vehicle}</strong>
                              <br />
                              Chauffeur: {v.driver}
                              <br />
                              Statut: {getStatusConfig(v.status).label}
                              <br />
                              ETA: {v.eta}
                            </div>
                          </Popup>
                        </Marker>
                      ))}
                    </MapContainer>
                  ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                      <Clock className="w-5 h-5 mr-2" />
                      Historique des trajets à venir...
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Delivery History */}
            {view === "history" && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Livraisons Récentes
                  </h3>
                  <div className="space-y-3">
                    {deliveryHistory.map((d) => (
                      <div
                        key={d.id}
                        className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border"
                      >
                        <div>
                          <p className="font-semibold text-sm">{d.order}</p>
                          <p className="text-xs text-muted-foreground mt-1 flex items-center">
                            <Navigation className="w-3 h-3 mr-1" />
                            {d.route}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">
                            {d.duration} • {d.distance}
                          </p>
                          <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                            Check {d.completed}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right: Active Vehicles */}
          <div className="space-y-4">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Truck className="w-5 h-5" />
                  Véhicules Actifs ({activeVehicles.length})
                </h3>
                <div className="space-y-3">
                  {activeVehicles.map((v) => {
                    const status = getStatusConfig(v.status);
                    return (
                      <div
                        key={v.id}
                        onClick={() =>
                          setSelectedVehicle(selectedVehicle === v.id ? null : v.id)
                        }
                        className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                          selectedVehicle === v.id
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-muted-foreground/50"
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-semibold text-sm">{v.driver}</p>
                            <p className="text-xs text-muted-foreground">{v.vehicle}</p>
                          </div>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 border ${status.class}`}
                          >
                            {status.icon}
                            {status.label}
                          </span>
                        </div>

                        <div className="space-y-2 text-xs text-muted-foreground">
                          <div className="flex items-center">
                            <MapPin className="w-3 h-3 mr-2" />
                            {v.destination}
                          </div>
                          <div className="flex items-center justify-between">
                            <span>
                              <Clock className="w-3 h-3 inline mr-1" />
                              {v.eta}
                            </span>
                            <span>
                              <Activity className="w-3 h-3 inline mr-1" />
                              {v.speed} km/h
                            </span>
                          </div>
                        </div>

                        {selectedVehicle === v.id && (
                          <div className="mt-3 pt-3 border-t border-border">
                            <Button size="sm" className="w-full text-xs">
                              <Navigation className="w-3 h-3 mr-2" />
                              Suivre sur la Carte
                            </Button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Actions Rapides</h3>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => navigate("/deliveries/add")}
                  >
                    <Package className="w-4 h-4 mr-2" /> Nouvelle Livraison
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => navigate("/personnel/chauffeurs")}
                  >
                    <Users className="w-4 h-4 mr-2" /> Gérer les Chauffeurs
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => navigate("/dashboard")}
                  >
                    <TrendingUp className="w-4 h-4 mr-2" /> Rapport Journalier
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}