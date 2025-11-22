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
  Shield,
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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

// ----------------------------
// STATIC DATA
// ----------------------------
interface Driver {
  id: number;
  name: string;
  email: string;
  phone: string;
  vehicleId?: string;
  status: "Active" | "Inactive";
  createdAt: string;
  lastActive?: string;
  photo?: string;
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
  { id: 5, name: "Mourad Ben Ali", email: "mourad@example.com", phone: "+21624000000", vehicleId: "V3", status: "Inactive", createdAt: "2024-02-18", lastActive: "2025-10-28", photo: "https://randomuser.me/api/portraits/men/45.jpg" },
  { id: 6, name: "Fathi Khlifi", email: "fathi@example.com", phone: "+21625000000", status: "Inactive", createdAt: "2024-06-10", lastActive: "2025-09-15" },
  { id: 7, name: "Nizar Gharbi", email: "nizar@example.com", phone: "+21626000000", vehicleId: "V4", status: "Inactive", createdAt: "2023-11-05", lastActive: "2025-08-20" },
];

// ----------------------------
// Component
// ----------------------------
export default function OfflineDrivers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 2; // Number of drivers per page

  // Only Inactive drivers
  const offlineDrivers = useMemo(() => drivers.filter(d => d.status === "Inactive"), []);

  // Live search
  const filteredDrivers = useMemo(() => {
    return offlineDrivers.filter((d) => {
      const vehicleName = d.vehicleId ? availableVehicles.find(v => v.id === d.vehicleId)?.name.toLowerCase() || "" : "";
      return (
        d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicleName.includes(searchTerm.toLowerCase())
      );
    });
  }, [offlineDrivers, searchTerm]);

  const totalPages = Math.ceil(filteredDrivers.length / itemsPerPage);
  const paginatedDrivers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredDrivers.slice(start, start + itemsPerPage);
  }, [filteredDrivers, currentPage]);

  const getVehicleName = (id?: string) => (id ? availableVehicles.find(v => v.id === id)?.name || "—" : "—");
  const unassignedCount = offlineDrivers.filter(d => !d.vehicleId).length;

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Shield className="w-6 h-6" />
            Drivers Hors Service
          </h1>
          <p className="text-sm mt-1">List of offline or inactive drivers.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm mb-1">Total Offline</p>
                  <p className="text-3xl font-bold">{offlineDrivers.length}</p>
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
                  <p className="text-sm mb-1">Unassigned</p>
                  <p className="text-3xl font-bold">{unassignedCount}</p>
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
                  <p className="text-sm mb-1">Last Active</p>
                  <p className="text-base font-medium">{offlineDrivers[0]?.lastActive || "—"}</p>
                </div>
                <div className="p-3 rounded-full">
                  <Calendar className="w-6 h-6" />
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
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="pl-10"
          />
        </div>

        {/* Drivers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginatedDrivers.length === 0 ? (
            <Card className="col-span-full">
              <CardContent className="py-12 text-center">No offline drivers found.</CardContent>
            </Card>
          ) : (
            paginatedDrivers.map(driver => (
              <Card
                key={driver.id}
                className="cursor-pointer transition-all hover:shadow-md"
                onClick={() => setSelectedDriver(driver)}
              >
                <CardContent className="pt-5">
                  <div className="flex items-start gap-3">
                    <Avatar className="w-12 h-12 ring-2 ring-border">
                      <AvatarImage src={driver.photo} alt={driver.name} />
                      <AvatarFallback>{driver.name.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate">{driver.name}</h3>
                      <p className="text-sm truncate">{driver.email}</p>
                      <p className="text-sm font-medium mt-1">{getVehicleName(driver.vehicleId)}</p>
                      {driver.lastActive && (
                        <p className="text-xs flex items-center gap-1 mt-1">
                          <Calendar className="w-3 h-3" />{driver.lastActive}
                        </p>
                      )}
                    </div>
                    <Badge className="self-start">OFFLINE</Badge>
                  </div>
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
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
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
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
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
                  <AvatarFallback className="text-xl">{selectedDriver.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-bold text-lg">{selectedDriver.name}</h3>
                  <Badge>OFFLINE</Badge>
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2"><Mail className="w-4 h-4" /><span>{selectedDriver.email}</span></div>
                <div className="flex items-center gap-2"><Phone className="w-4 h-4" /><span>{selectedDriver.phone}</span></div>
                <div className="flex items-center gap-2"><Truck className="w-4 h-4" /><span>{getVehicleName(selectedDriver.vehicleId)}</span></div>
                {selectedDriver.lastActive && <div className="flex items-center gap-2"><Calendar className="w-4 h-4" /><span>Last Active: {selectedDriver.lastActive}</span></div>}
                <div className="flex items-center gap-2"><Calendar className="w-4 h-4" /><span>Joined: {selectedDriver.createdAt}</span></div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
