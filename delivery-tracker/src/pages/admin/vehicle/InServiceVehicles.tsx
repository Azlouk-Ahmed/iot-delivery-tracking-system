// InServiceVehicles.jsx (or .tsx)
'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Truck, Activity, MapPin, Gauge, User, Clock } from 'lucide-react';

// Define the vehicle type
interface Vehicle {
  id: string;
  driver: string;
  status: 'Active' | 'Idle' | 'Offline';
  speed: string;
  location: string;
  lastUpdate: string;
  plate: string;
  model: string;
  year: number;
  route: string;
}

export default function InServiceVehicles() {
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const vehicles: Vehicle[] = [
    {
      id: 'VH-001',
      driver: 'John Doe',
      status: 'Active',
      speed: '62 km/h',
      location: 'Tunis',
      lastUpdate: '2 min ago',
      plate: '123 TUN 456',
      model: 'Mercedes Actros',
      year: 2023,
      route: 'Tunis → Sfax',
    },
    {
      id: 'VH-014',
      driver: 'Sarah Ali',
      status: 'Active',
      speed: '50 km/h',
      location: 'Sousse',
      lastUpdate: '5 min ago',
      plate: '789 TUN 321',
      model: 'Volvo FH16',
      year: 2024,
      route: 'Sousse → Monastir',
    },
  ];

  const handleViewDetails = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setIsOpen(true);
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Vehicles In Service</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vehicles.map((vehicle) => (
          <Card
            key={vehicle.id}
            className="rounded-2xl shadow hover:shadow-lg transition-all duration-300 border"
          >
            <CardContent className="p-5 space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Truck className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-bold">{vehicle.id}</h2>
                  <p className="text-xs text-muted-foreground">{vehicle.model}</p>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <p className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Driver:</span> {vehicle.driver}
                </p>
                <p className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-green-500 animate-pulse" />
                  <span className="font-medium">Status:</span>{' '}
                  <span className="text-green-600 font-semibold">{vehicle.status}</span>
                </p>
                <p className="flex items-center gap-2">
                  <Gauge className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Speed:</span> {vehicle.speed}
                </p>
                <p className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Location:</span> {vehicle.location}
                </p>
              </div>

              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Last update: {vehicle.lastUpdate}
              </p>

              <Button onClick={() => handleViewDetails(vehicle)} className="w-full" size="sm">
                View Details
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-3">
              <Truck className="h-8 w-8 text-primary" />
              {selectedVehicle?.id}
            </DialogTitle>
            <DialogDescription>
              Detailed information for vehicle {selectedVehicle?.id}
            </DialogDescription>
          </DialogHeader>

          {selectedVehicle && (
            <div className="space-y-5 py-4">
              <div className="grid grid-cols-2 gap-6 text-sm">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Driver</p>
                      <p className="font-semibold text-base">{selectedVehicle.driver}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <div>
                      <p className="text-xs text-muted-foreground">Status</p>
                      <p className="font-semibold text-green-600">Active</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Gauge className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Current Speed</p>
                      <p className="font-semibold text-base">{selectedVehicle.speed}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Location</p>
                      <p className="font-semibold text-base">{selectedVehicle.location}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground">License Plate</p>
                    <p className="font-semibold">{selectedVehicle.plate}</p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground">Model & Year</p>
                    <p className="font-semibold">
                      {selectedVehicle.model} ({selectedVehicle.year})
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <p className="text-xs text-muted-foreground">Current Route</p>
                <p className="font-medium text-primary text-lg">
                  {selectedVehicle.route}
                </p>
              </div>

              <div className="flex justify-between items-center pt-4 border-t">
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Last updated {selectedVehicle.lastUpdate}
                </p>
                <Button onClick={() => setIsOpen(false)} variant="outline">
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
