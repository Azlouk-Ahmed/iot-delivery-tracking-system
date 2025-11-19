"use client";

import React, { useState, useMemo } from "react";
import {
  Truck,
  User,
  Search,
  MapPin,
  Phone,
  Mail,
  Calendar,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// ------------------------------------------------------------------
//  STATIC DATA (No server, no imports)
// ------------------------------------------------------------------
interface Driver {
  id: number;
  name: string;
  email: string;
  phone: string;
  vehicleId: string;
  status: "Active" | "Inactive";
  createdAt: string;
  photo?: string;
  location?: string;
}

interface Vehicle {
  id: string;
  name: string;
  type: string;
}

const availableVehicles: Vehicle[] = [
  { id: "V1", name: "Truck A", type: "Heavy Truck" },
  { id: "V2", name: "Van B", type: "Delivery Van" },
  { id: "V3", name: "Truck C", type: "Refrigerated" },
  { id: "V4", name: "Van D", type: "Standard Van" },
];

const drivers: Driver[] = [
  {
    id: 1,
    name: "Ali Ben Salah",
    email: "ali@example.com",
    phone: "+21620000000",
    vehicleId: "V1",
    status: "Active",
    createdAt: "2024-01-10",
    photo: "https://randomuser.me/api/portraits/men/32.jpg",
    location: "Tunis, La Marsa",
  },
  {
    id: 2,
    name: "Sami Trabelsi",
    email: "sami@example.com",
    phone: "+21621000000",
    vehicleId: "V2",
    status: "Active",
    createdAt: "2024-03-12",
    location: "Sfax, Route de Gremda",
  },
  {
    id: 3,
    name: "Omar Jlassi",
    email: "omar@example.com",
    phone: "+21622000000",
    vehicleId: "V3",
    status: "Active",
    createdAt: "2024-05-20",
    location: "Sousse, Khezama",
  },
  {
    id: 4,
    name: "Karim Ayari",
    email: "karim@example.com",
    phone: "+21623000000",
    vehicleId: "V4",
    status: "Active",
    createdAt: "2024-07-15",
    location: "Bizerte, Corniche",
  },
];

export default function InServiceDrivers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);

  // Only Active drivers
  const activeDrivers = useMemo(
    () => drivers.filter((d) => d.status === "Active"),
    []
  );

  // Live search
  const filteredDrivers = useMemo(() => {
    return activeDrivers.filter((d) => {
      const vehicleName = availableVehicles.find(v => v.id === d.vehicleId)?.name.toLowerCase() || "";
      return (
        d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicleName.includes(searchTerm.toLowerCase())
      );
    });
  }, [activeDrivers, searchTerm]);

  const getVehicleName = (id: string) => {
    return availableVehicles.find(v => v.id === id)?.name || "—";
  };

  const assignedCount = activeDrivers.filter(d => d.vehicleId).length;
  const availableCount = activeDrivers.length - assignedCount;

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Truck className="w-6 h-6" />
            Drivers In Service
          </h1>
          <p className="text-sm mt-1">
            Real-time overview of active drivers and their assignments.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm mb-1">Total Active</p>
                  <p className="text-3xl font-bold">{activeDrivers.length}</p>
                </div>
                <div className="p-3 rounded-full">
                  <User className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm mb-1">Assigned</p>
                  <p className="text-3xl font-bold">{assignedCount}</p>
                </div>
                <div className="p-3 rounded-full">
                  <Truck className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm mb-1">Available</p>
                  <p className="text-3xl font-bold">{availableCount}</p>
                </div>
                <div className="p-3 rounded-full">
                  <MapPin className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="relative max-w-md mb-6">
          <Search className="absolute left-3 top-3 w-4 h-4" />
          <Input
            placeholder="Search by name, email, or vehicle..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Drivers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDrivers.length === 0 ? (
            <Card className="col-span-full">
              <CardContent className="py-12 text-center">
                No active drivers found.
              </CardContent>
            </Card>
          ) : (
            filteredDrivers.map((driver) => (
              <Card
                key={driver.id}
                className="cursor-pointer transition-all hover:shadow-md"
                onClick={() => setSelectedDriver(driver)}
              >
                <CardContent className="pt-5">
                  <div className="flex items-start gap-3">
                    <Avatar className="w-12 h-12 ring-2 ring-border">
                      <AvatarImage src={driver.photo} alt={driver.name} />
                      <AvatarFallback>
                        {driver.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate">{driver.name}</h3>
                      <p className="text-sm truncate">{driver.email}</p>
                      <p className="text-sm font-medium mt-1">
                        {getVehicleName(driver.vehicleId)}
                      </p>
                      {driver.location && (
                        <p className="text-xs flex items-center gap-1 mt-1">
                          <MapPin className="w-3 h-3" />
                          {driver.location}
                        </p>
                      )}
                    </div>
                    <Badge className="self-start">ACTIVE</Badge>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Driver Details Modal */}
      <Dialog open={!!selectedDriver} onOpenChange={() => setSelectedDriver(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Driver Details</DialogTitle>
          </DialogHeader>
          {selectedDriver && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="w-16 h-16 ring-2 ring-border">
                  <AvatarImage src={selectedDriver.photo} />
                  <AvatarFallback className="text-xl">
                    {selectedDriver.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-bold text-lg">{selectedDriver.name}</h3>
                  <Badge>ACTIVE</Badge>
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>{selectedDriver.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>{selectedDriver.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4" />
                  <span>{getVehicleName(selectedDriver.vehicleId)}</span>
                </div>
                {selectedDriver.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{selectedDriver.location}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>Since {selectedDriver.createdAt}</span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}