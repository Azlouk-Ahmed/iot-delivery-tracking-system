"use client";

import React, { useState, useMemo } from "react";
import {
  Truck,
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  Search,
  Calendar,
  Shield,
  Upload,
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
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { toast } from "sonner";

// ------------------------------------------------------------------
// Types
// ------------------------------------------------------------------
interface Driver {
  id: number;
  name: string;
  photo?: string;
}

interface Vehicle {
  id: string;
  name: string;
  type: string;
  plate: string;
  status: "Available" | "In Use" | "Maintenance";
  currentDriverId?: number;
  lastUsed?: string;
  photo?: string;
}

// ------------------------------------------------------------------
// Mock Data
// ------------------------------------------------------------------
const mockDrivers: Driver[] = [
  { id: 1, name: "Ali Ben Salah", photo: "https://randomuser.me/api/portraits/men/32.jpg" },
  { id: 2, name: "Sami Trabelsi", photo: "https://randomuser.me/api/portraits/men/45.jpg" },
  { id: 3, name: "Omar Jlassi" },
  { id: 4, name: "Karim Ayari" },
];

const initialVehicles: Vehicle[] = [
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
    id: "V4",
    name: "Van D",
    type: "Standard Van",
    plate: "TN-901-234",
    status: "In Use",
    currentDriverId: 2,
    lastUsed: "2025-11-11",
  },
  // Additional vehicles for pagination demo
  ...Array.from({ length: 16 }, (_, i) => ({
    id: `V${i + 5}`,
    name: `Vehicle ${i + 5}`,
    type: ["Heavy Truck", "Delivery Van", "Refrigerated", "Standard Van"][i % 4],
    plate: `TN-${100 + i}-${200 + i}`,
    status: ["Available", "In Use", "Maintenance"][i % 3] as Vehicle["status"],
    currentDriverId: i % 5 === 0 ? undefined : (i % 4) + 1,
    lastUsed: `2025-11-${String(5 + (i % 10)).padStart(2, "0")}`,
  })),
];

// ------------------------------------------------------------------
// Component
// ------------------------------------------------------------------
export default function VehicleManagement() {
  const [vehicles, setVehicles] = useState<Vehicle[]>(initialVehicles);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    plate: "",
    status: "Available" as const,
    currentDriverId: "",
    photo: "",
  });

  const itemsPerPage = 6;

  // ------------------------------------------------------------------
  // Filtered & Paginated Vehicles
  // ------------------------------------------------------------------
  const filteredVehicles = useMemo(() => {
    return vehicles.filter((v) => {
      const driverName = mockDrivers.find(d => d.id === v.currentDriverId)?.name.toLowerCase() || "";
      return (
        v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
        driverName.includes(searchTerm.toLowerCase())
      );
    });
  }, [vehicles, searchTerm]);

  const totalPages = Math.ceil(filteredVehicles.length / itemsPerPage);

  const paginatedVehicles = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredVehicles.slice(start, start + itemsPerPage);
  }, [filteredVehicles, currentPage]);

  const getDriver = (id?: number) => mockDrivers.find(d => d.id === id);

  // ------------------------------------------------------------------
  // Handlers
  // ------------------------------------------------------------------
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5MB");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({ ...prev, photo: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const handleCreate = () => {
    setModalMode("create");
    setSelectedVehicle(null);
    setFormData({
      name: "",
      type: "",
      plate: "",
      status: "Available",
      currentDriverId: "",
      photo: "",
    });
    setShowModal(true);
  };

  const handleEdit = (vehicle: Vehicle) => {
    setModalMode("edit");
    setSelectedVehicle(vehicle);
    setFormData({
      name: vehicle.name,
      type: vehicle.type,
      plate: vehicle.plate,
      status: vehicle.status,
      currentDriverId: vehicle.currentDriverId?.toString() || "",
      photo: vehicle.photo || "",
    });
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Delete this vehicle?")) {
      setVehicles(prev => prev.filter(v => v.id !== id));
      toast.success("Vehicle deleted.");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.plate.trim()) {
      toast.error("Name and plate are required.");
      return;
    }

    if (modalMode === "create") {
      const newVehicle: Vehicle = {
        id: `V${Date.now()}`,
        ...formData,
        currentDriverId: formData.currentDriverId ? Number(formData.currentDriverId) : undefined,
        lastUsed: new Date().toISOString().split("T")[0],
        photo: formData.photo || undefined,
      };
      setVehicles(prev => [...prev, newVehicle]);
      toast.success("Vehicle added.");
    } else if (selectedVehicle) {
      setVehicles(prev =>
        prev.map(v =>
          v.id === selectedVehicle.id
            ? { ...v, ...formData, currentDriverId: formData.currentDriverId ? Number(formData.currentDriverId) : undefined }
            : v
        )
      );
      toast.success("Vehicle updated.");
    }
    setShowModal(false);
  };

  const getStatusBadge = (status: string) => {
    const config: Record<string, { label: string; icon: React.ReactNode }> = {
      Available: { label: "AVAILABLE", icon: <Check className="w-3 h-3" /> },
      "In Use": { label: "IN USE", icon: <Truck className="w-3 h-3" /> },
      Maintenance: { label: "MAINTENANCE", icon: <Shield className="w-3 h-3" /> },
    };
    const { label, icon } = config[status] || { label: status, icon: null };
    return <Badge className="flex items-center gap-1">{icon} {label}</Badge>;
  };

  // ------------------------------------------------------------------
  // JSX
  // ------------------------------------------------------------------
  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Truck className="w-6 h-6" /> Vehicle Management
            </h1>
            <p className="text-sm mt-1">Manage fleet vehicles and assignments</p>
          </div>
          <Button onClick={handleCreate}>
            <Plus className="w-4 h-4 mr-2" /> Add Vehicle
          </Button>
        </div>

        {/* Search */}
        <div className="relative max-w-md mb-6">
          <Search className="absolute left-3 top-3 w-4 h-4" />
          <Input
            placeholder="Search by name, plate, or driver..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="pl-10"
          />
        </div>

        {/* Vehicles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {paginatedVehicles.length === 0 ? (
            <Card className="col-span-full">
              <CardContent className="py-12 text-center">
                No vehicles found.
              </CardContent>
            </Card>
          ) : (
            paginatedVehicles.map(vehicle => {
              const driver = getDriver(vehicle.currentDriverId);
              return (
                <Card key={vehicle.id} className="overflow-hidden">
                  <div className="aspect-video relative">
                    {vehicle.photo ? (
                      <img src={vehicle.photo} alt={vehicle.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center">
                        <Truck className="w-12 h-12 text-muted-foreground" />
                      </div>
                    )}
                    <div className="absolute top-2 right-2">{getStatusBadge(vehicle.status)}</div>
                  </div>
                  <CardContent className="pt-4">
                    <h3 className="font-bold text-lg">{vehicle.name}</h3>
                    <p className="text-sm font-medium">{vehicle.plate}</p>
                    <p className="text-xs text-muted-foreground mt-1">{vehicle.type}</p>
                    {driver && (
                      <div className="flex items-center gap-2 mt-3">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={driver.photo} />
                          <AvatarFallback>{driver.name[0]}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium">{driver.name}</span>
                      </div>
                    )}
                    {vehicle.lastUsed && (
                      <p className="text-xs flex items-center gap-1 mt-2 text-muted-foreground">
                        <Calendar className="w-3 h-3" /> {vehicle.lastUsed}
                      </p>
                    )}
                    <div className="flex justify-end gap-1 mt-4">
                      <Button size="icon" variant="ghost" onClick={() => handleEdit(vehicle)}>
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => handleDelete(vehicle.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
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
        )}
      </div>

      {/* Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{modalMode === "create" ? "Add Vehicle" : "Edit Vehicle"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Photo */}
            <div className="space-y-2">
              <Label>Photo</Label>
              <div className="flex items-center gap-4">
                {formData.photo ? (
                  <img src={formData.photo} alt="Preview" className="w-20 h-20 object-cover rounded" />
                ) : (
                  <div className="w-20 h-20 bg-muted rounded flex items-center justify-center">
                    <Truck className="w-8 h-8 text-muted-foreground" />
                  </div>
                )}
                <label className="cursor-pointer">
                  <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                  <div className="px-4 py-2 border rounded-md hover:bg-accent flex items-center gap-1 text-sm">
                    <Upload className="w-3.5 h-3.5" /> Choose
                  </div>
                </label>
                {formData.photo && (
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, photo: "" })}
                    className="text-xs hover:underline"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>

            {/* Name, Type, Plate */}
            {["name", "type", "plate"].map((field) => (
              <div key={field} className="space-y-2">
                <Label htmlFor={field}>
                  {field.charAt(0).toUpperCase() + field.slice(1)} *
                </Label>
                <Input
                  id={field}
                  name={field}
                  value={formData[field as keyof typeof formData]}
                  onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                  required
                  placeholder={field === "plate" ? "TN-123-456" : ""}
                />
              </div>
            ))}

            {/* Status */}
            <div className="space-y-2">
              <Label>Status</Label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as Vehicle["status"] })}
                className="w-full px-3 py-2 border rounded-md bg-background"
              >
                <option value="Available">Available</option>
                <option value="In Use">In Use</option>
                <option value="Maintenance">Maintenance</option>
              </select>
            </div>

            {/* Driver */}
            <div className="space-y-2">
              <Label>Current Driver</Label>
              <select
                value={formData.currentDriverId}
                onChange={(e) => setFormData({ ...formData, currentDriverId: e.target.value })}
                className="w-full px-3 py-2 border rounded-md bg-background"
              >
                <option value="">None</option>
                {mockDrivers.map(d => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowModal(false)}>
                <X className="w-4 h-4 mr-1" /> Cancel
              </Button>
              <Button type="submit">
                <Check className="w-4 h-4 mr-1" /> {modalMode === "create" ? "Add" : "Update"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
