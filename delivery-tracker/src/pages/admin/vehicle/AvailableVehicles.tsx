"use client";

import React from "react";
import { Truck, CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useSocket } from "@/hooks/useSocketContext";

export default function AvailableVehicles() {
  const { vehicles } = useSocket();

  // Convert Map to array and filter for available vehicles (status "ON")
  const availableVehicles = Array.from(vehicles?.values() || []).filter(
    (vehicle) => vehicle.status === "ON"
  );

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <CheckCircle className="w-6 h-6" />
            Available Vehicles
          </h1>
          <p className="text-sm mt-1 text-muted-foreground">
            Vehicles ready for assignment • {availableVehicles.length} available
          </p>
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
              <Card key={vehicle.vehicleId} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video relative bg-muted">
                  <div className="flex items-center justify-center h-full">
                    <Truck className="w-16 h-16 text-muted-foreground opacity-60" />
                  </div>
                  <div className="absolute top-3 right-3">
                    <Badge className="flex items-center gap-1 bg-green-500">
                      <CheckCircle className="w-3 h-3" /> AVAILABLE
                    </Badge>
                  </div>
                </div>
                <CardContent className="pt-4">
                  <h3 className="font-bold text-lg">{vehicle.model}</h3>
                  <p className="text-sm font-medium text-muted-foreground">
                    ID: {vehicle.vehicleId}
                  </p>
                  <div className="mt-3 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">Driver:</span>
                      <span className="text-sm font-medium">{vehicle.driverName}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">Company:</span>
                      <span className="text-sm font-medium">{vehicle.companyName}</span>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t">
                    <span className="text-sm font-medium text-green-600">Ready for delivery</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}