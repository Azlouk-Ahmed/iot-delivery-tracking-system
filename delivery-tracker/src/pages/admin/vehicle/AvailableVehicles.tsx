"use client";

import React, { useMemo, useState } from "react";
import { Truck, Search, Calendar, CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const mockDrivers = [
  { id: 1, name: "Ali Ben Salah", photo: "https://randomuser.me/api/portraits/men/32.jpg" },
  { id: 2, name: "Sami Trabelsi", photo: "https://randomuser.me/api/portraits/men/45.jpg" },
  { id: 3, name: "Omar Jlassi" },
  { id: 4, name: "Karim Ayari" },
];

const allVehicles = [
  {
    id: "V1",
    name: "Truck A",
    type: "Heavy Truck",
    plate: "TN-123-456",
    status: "In Use",
    currentDriverId: 1,
    lastUsed: "2025-11-12",
    photo: "https://images.unsplash.com/photo-1544620347-97d5c4e7e2f5?w=400",
  },
  {
    id: "V2",
    name: "Van B",
    type: "Delivery Van",
    plate: "TN-789-012",
    status: "Available",
    lastUsed: "2025-11-10",
  },
  {
    id: "V3",
    name: "Truck C",
    type: "Refrigerated",
    plate: "TN-345-678",
    status: "Maintenance",
    lastUsed: "2025-11-08",
  },
  {
    id: "V5",
    name: "Express Van",
    type: "Standard Van",
    plate: "TN-555-999",
    status: "Available",
    lastUsed: "2025-11-05",
  },
  {
    id: "V6",
    name: "Big Hauler",
    type: "Heavy Truck",
    plate: "TN-777-888",
    status: "Available",
    lastUsed: "2025-11-01",
  },
];

export default function AvailableVehicles() {
  const [searchTerm, setSearchTerm] = useState("");

  const availableVehicles = useMemo(() => {
    return allVehicles
      .filter(v => v.status === "Available")
      .filter(v =>
        v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.type.toLowerCase().includes(searchTerm.toLowerCase())
      );
  }, [searchTerm]);

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <CheckCircle className="w-6 h-6" />
              Available Vehicles
            </h1>
            <p className="text-sm mt-1 text-muted-foreground">
              Vehicles ready for assignment • {availableVehicles.length} available
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative max-w-md mb-8">
          <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search available vehicles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Grid */}
        {availableVehicles.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <Truck className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-lg font-medium">No vehicles available right now</p>
              <p className="text-sm text-muted-foreground mt-2">
                All vehicles are either in use or under maintenance.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {availableVehicles.map((vehicle) => (
              <Card key={vehicle.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video relative bg-muted">
                  {vehicle.photo ? (
                    <img
                      src={vehicle.photo}
                      alt={vehicle.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <Truck className="w-16 h-16 text-muted-foreground opacity-60" />
                    </div>
                  )}

                  <div className="absolute top-3 right-3">
                    <Badge className="flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      AVAILABLE
                    </Badge>
                  </div>
                </div>

                <CardContent className="pt-4">
                  <h3 className="font-bold text-lg">{vehicle.name}</h3>
                  <p className="text-sm font-medium">{vehicle.plate}</p>
                  <p className="text-xs text-muted-foreground mt-1">{vehicle.type}</p>

                  {vehicle.lastUsed && (
                    <p className="text-xs flex items-center gap-1 mt-3 text-muted-foreground">
                      <Calendar className="w-3.5 h-3.5" />
                      Last used: {vehicle.lastUsed}
                    </p>
                  )}

                  <div className="mt-4 flex justify-between items-center">
                    <span className="text-sm font-medium">
                      Ready for delivery
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Stats */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-3xl font-bold">{availableVehicles.length}</p>
              <p className="text-sm text-muted-foreground">Available Now</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-3xl font-bold">
                {allVehicles.filter(v => v.status === "In Use").length}
              </p>
              <p className="text-sm text-muted-foreground">In Use</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-3xl font-bold">
                {allVehicles.filter(v => v.status === "Maintenance").length}
              </p>
              <p className="text-sm text-muted-foreground">Maintenance</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-3xl font-bold">{allVehicles.length}</p>
              <p className="text-sm text-muted-foreground">Total Fleet</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
