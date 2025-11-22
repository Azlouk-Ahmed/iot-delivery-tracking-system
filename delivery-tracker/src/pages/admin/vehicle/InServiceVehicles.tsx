// InServiceVehicles.tsx
'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Truck, Activity, MapPin, Gauge, User, Clock, Search } from 'lucide-react';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

// ----------------------------
// Vehicle Type
// ----------------------------
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

// ----------------------------
// Static Vehicles (6 only)
// ----------------------------
const allVehicles: Vehicle[] = [
  { id: 'VH-001', driver: 'John Doe', status: 'Active', speed: '62 km/h', location: 'Tunis', lastUpdate: '2 min ago', plate: '123 TUN 456', model: 'Mercedes Actros', year: 2023, route: 'Tunis → Sfax' },
  { id: 'VH-002', driver: 'Sarah Ali', status: 'Active', speed: '55 km/h', location: 'Sousse', lastUpdate: '5 min ago', plate: '789 TUN 321', model: 'Volvo FH16', year: 2024, route: 'Sousse → Monastir' },
  { id: 'VH-003', driver: 'Omar Jlassi', status: 'Idle', speed: '0 km/h', location: 'Sfax', lastUpdate: '10 min ago', plate: '456 TUN 789', model: 'MAN TGX', year: 2022, route: 'Sfax → Gabes' },
  { id: 'VH-004', driver: 'Karim Ayari', status: 'Active', speed: '48 km/h', location: 'Monastir', lastUpdate: '3 min ago', plate: '321 TUN 654', model: 'Scania R500', year: 2021, route: 'Monastir → Hammamet' },
  { id: 'VH-005', driver: 'Leila Ben Salah', status: 'Idle', speed: '0 km/h', location: 'Tunis', lastUpdate: '15 min ago', plate: '987 TUN 123', model: 'Mercedes Atego', year: 2020, route: 'Tunis → Bizerte' },
  { id: 'VH-006', driver: 'Sami Trabelsi', status: 'Active', speed: '60 km/h', location: 'Sousse', lastUpdate: '1 min ago', plate: '654 TUN 987', model: 'Volvo FMX', year: 2023, route: 'Sousse → Kairouan' },
];

// ----------------------------
// Component
// ----------------------------
export default function InServiceVehicles() {
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 3; // 3 vehicles per page

  // ----------------------------
  // Filtered Vehicles
  // ----------------------------
  const filteredVehicles = useMemo(() => {
    return allVehicles.filter(v =>
      v.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.driver.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.plate.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const totalPages = Math.ceil(filteredVehicles.length / itemsPerPage);

  const paginatedVehicles = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredVehicles.slice(start, start + itemsPerPage);
  }, [filteredVehicles, currentPage]);

  const handleViewDetails = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setIsOpen(true);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Truck className="w-6 h-6" />
          Vehicles In Service
        </h1>
        <div className="relative max-w-md mt-2 sm:mt-0">
          <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search vehicles..."
            value={searchTerm}
            onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="pl-10 pr-3 py-2 w-full border rounded-md"
          />
        </div>
      </div>

      {/* Vehicle Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedVehicles.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="py-16 text-center text-muted-foreground">
              No vehicles found.
            </CardContent>
          </Card>
        ) : (
          paginatedVehicles.map(vehicle => (
            <Card key={vehicle.id} className="rounded-2xl shadow hover:shadow-lg transition-all duration-300 border">
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
                    <Activity className={`h-4 w-4 ${vehicle.status === 'Active' ? 'text-green-500 animate-pulse' : 'text-gray-400'}`} />
                    <span className="font-medium">Status:</span>
                    <span className={`${vehicle.status === 'Active' ? 'text-green-600' : 'text-gray-500'} font-semibold`}>{vehicle.status}</span>
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
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>

              {Array.from({ length: totalPages }, (_, i) => (
                <PaginationItem key={i + 1}>
                  <PaginationLink
                    onClick={() => setCurrentPage(i + 1)}
                    isActive={currentPage === i + 1}
                    className="cursor-pointer"
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

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
                    <div className={`w-3 h-3 rounded-full ${selectedVehicle.status === 'Active' ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                    <div>
                      <p className="text-xs text-muted-foreground">Status</p>
                      <p className="font-semibold">{selectedVehicle.status}</p>
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
                    <p className="font-semibold">{selectedVehicle.model} ({selectedVehicle.year})</p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <p className="text-xs text-muted-foreground">Current Route</p>
                <p className="font-medium text-primary text-lg">{selectedVehicle.route}</p>
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
