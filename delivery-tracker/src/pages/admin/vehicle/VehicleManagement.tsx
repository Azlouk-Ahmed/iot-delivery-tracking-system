"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  Truck,
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  Calendar,
  Loader2,
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
import { toast } from "sonner";
import useFetch from "@/hooks/useFetchData";
import { SelectContent,Select, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { axiosPublic } from "@/api/axios";

// ------------------------------------------------------------------
// Types
// ------------------------------------------------------------------
interface Driver {
  _id: string;
  name: string;
  email: string;
  photo?: string;
}

interface Company {
  _id: string;
  name: string;
  location?: {
    address?: string;
    city?: string;
  };
}

interface Vehicle {
  _id: string;
  vehicleId: string;
  model: string;
  licensePlate: string;
  driverId?: Driver;
  companyId?: Company;
  createdAt: string;
  updatedAt: string;
}

// ------------------------------------------------------------------
// Component
// ------------------------------------------------------------------
export default function VehicleManagement() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const { data : drivers } = useFetch("/auth/drivers", { immediate: true });
  const { data : companies } = useFetch("/companies/all", { immediate: true });
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [formData, setFormData] = useState({
    model: "",
    licensePlate: "",
    driverId: "",
    companyId: "",
  });
  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/vehicle/all`
      );
      const result = await response.json();

      if (result.success && result.data) {
        setVehicles(result.data);
      } else {
        toast.error("Failed to load vehicles");
      }
    } catch (error) {
      toast.error("Error loading vehicles");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // ------------------------------------------------------------------
  // Handlers
  // ------------------------------------------------------------------
  const handleCreate = () => {
    setModalMode("create");
    setSelectedVehicle(null);
    setFormData({
      model: "",
      licensePlate: "",
      driverId: "",
      companyId: "",
    });
    setShowModal(true);
  };

  const handleEdit = (vehicle: Vehicle) => {
    setModalMode("edit");
    setSelectedVehicle(vehicle);
    setFormData({
      model: vehicle.model,
      licensePlate: vehicle.licensePlate,
      driverId: vehicle.driverId?._id || "",
      companyId: vehicle.companyId,
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this vehicle?")) return;

    try {
      const response = await fetch(`/api/vehicle/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        setVehicles((prev) => prev.filter((v) => v._id !== id));
        toast.success("Vehicle deleted successfully");
      } else {
        toast.error("Failed to delete vehicle");
      }
    } catch (error) {
      toast.error("Error deleting vehicle");
    }
  };

 const handleSubmit = async () => {
  // Validate required fields
  if (
    !formData.model.trim() ||
    !formData.licensePlate.trim()
  ) {
    toast.error("Vehicle ID, model, and license plate are required");
    return;
  }

  try {
    const payload = {
      ...formData,
      driverId: formData.driverId || undefined,
    };
    console.log("Submitting payload:", payload);
    console.log("Submitting formdata:", formData);

    let response;

    if (modalMode === "create") {
      // CREATE vehicle
      response = await axiosPublic.post("/vehicle", payload);

      toast.success("Vehicle added successfully");
      fetchVehicles();
    } 
    else if (selectedVehicle) {
      // UPDATE vehicle
      response = await axiosPublic.put(`/vehicle/${selectedVehicle._id}`, payload);

      toast.success("Vehicle updated successfully");
      fetchVehicles();
    }

    setShowModal(false);
  } catch (error: any) {
    console.log(error.response?.data || error.message);

    toast.error(
      error.response?.data?.message ||
      "An error occurred"
    );
  }
};

  if (loading) {
    return (
      <div className="p-4 sm:p-6 flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin" />
          <p className="text-sm text-muted-foreground">Loading vehicles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Truck className="w-6 h-6" /> Vehicle Management
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manage fleet vehicles and assignments ({vehicles.length} total)
            </p>
          </div>
          <Button onClick={handleCreate}>
            <Plus className="w-4 h-4 mr-2" /> Add Vehicle
          </Button>
        </div>

        {/* Vehicles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {vehicles.length === 0 ? (
            <Card className="col-span-full">
              <CardContent className="py-12 text-center">
                <Truck className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
              </CardContent>
            </Card>
          ) : (
            vehicles.map((vehicle) => {
              const driver = vehicle.driverId;
              return (
                <Card
                  key={vehicle._id}
                  className="overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="font-bold text-lg">{vehicle.model}</h3>
                        <p className="text-sm font-mono font-medium text-blue-600">
                          {vehicle.licensePlate}
                        </p>
                      </div>
                      <span className="text-xs px-2 py-1 bg-muted rounded font-mono">
                        {vehicle.vehicleId}
                      </span>
                    </div>

                    {vehicle.companyId && (
                      <div className="mt-3 p-2 bg-muted/50 rounded">
                        <p className="text-xs font-medium text-muted-foreground mb-1">
                          Company
                        </p>
                        <p className="text-sm font-medium">
                          {vehicle.companyId.name}
                        </p>
                        {vehicle.companyId.location?.city && (
                          <p className="text-xs text-muted-foreground">
                            📍 {vehicle.companyId.location.city}
                          </p>
                        )}
                      </div>
                    )}

                    {driver ? (
                      <div className="flex items-center gap-2 mt-3 p-2 bg-muted/50 rounded">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={driver.photo} alt={driver.name} />
                          <AvatarFallback>{driver.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {driver.name}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {driver.email}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-3 p-2 bg-muted/30 rounded text-center">
                        <p className="text-xs text-muted-foreground">
                          No driver assigned
                        </p>
                      </div>
                    )}

                    <div className="flex items-center justify-between mt-3 pt-3 border-t">
                      <p className="text-xs flex items-center gap-1 text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        {new Date(vehicle.updatedAt).toLocaleDateString()}
                      </p>
                      <div className="flex gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleEdit(vehicle)}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleDelete(vehicle._id)}
                          className="hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {modalMode === "create" ? "Add New Vehicle" : "Edit Vehicle"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">

            {/* Model */}
            <div className="space-y-2">
              <Label htmlFor="model">
                Model <span className="text-red-500">*</span>
              </Label>
              <Input
                id="model"
                name="model"
                value={formData.model}
                onChange={(e) =>
                  setFormData({ ...formData, model: e.target.value })
                }
                placeholder="Toyota Hilux"
              />
            </div>

            {/* License Plate */}
            <div className="space-y-2">
              <Label htmlFor="licensePlate">
                License Plate <span className="text-red-500">*</span>
              </Label>
              <Input
                id="licensePlate"
                name="licensePlate"
                value={formData.licensePlate}
                onChange={(e) =>
                  setFormData({ ...formData, licensePlate: e.target.value })
                }
                placeholder="TN-123-456"
              />
            </div>

            {/* Driver */}
            <div className="space-y-2">
               <Select
    value={formData.driverId}
    onValueChange={(value) =>
      setFormData({ ...formData, driverId: value })
    }
  >
    <SelectTrigger id="driverId">
      <SelectValue placeholder="Select a driver" />
    </SelectTrigger>

    <SelectContent>
      {drivers && drivers.users && drivers?.users?.map((driver: any) => (
        <SelectItem key={driver._id.toString()} value={driver._id}>
          {driver.name}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
            </div>

             <div className="space-y-2">
               <Select
    value={formData.companyId}
    onValueChange={(value) =>
      setFormData({ ...formData, companyId: value })
    }
  >
    <SelectTrigger id="driverId">
      <SelectValue placeholder="Select a company" />
    </SelectTrigger>

    <SelectContent>
      {companies && companies && companies?.map((driver: any) => (
        <SelectItem key={driver._id.toString()} value={driver._id}>
          {driver.name}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowModal(false)}
            >
              <X className="w-4 h-4 mr-1" /> Cancel
            </Button>
            <Button onClick={handleSubmit}>
              <Check className="w-4 h-4 mr-1" />
              {modalMode === "create" ? "Add Vehicle" : "Update Vehicle"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
