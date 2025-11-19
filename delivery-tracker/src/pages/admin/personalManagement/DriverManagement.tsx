"use client";

import React, { useState } from "react";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  Truck,
  User,
  Shield,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  TableCaption,
} from "@/components/ui/table";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface Driver {
  id: number;
  name: string;
  email: string;
  phone: string;
  vehicleId: string; // now references vehicle ID
  status: "Active" | "Inactive";
  createdAt: string;
  photo?: string;
}

interface Vehicle {
  id: string;
  name: string;
  type: string;
}

// Mock vehicles
const availableVehicles: Vehicle[] = [
  { id: "V1", name: "Truck A", type: "Heavy Truck" },
  { id: "V2", name: "Van B", type: "Delivery Van" },
  { id: "V3", name: "Truck C", type: "Refrigerated" },
  { id: "V4", name: "Van D", type: "Standard Van" },
];

export default function DriverManagement() {
  const [drivers, setDrivers] = useState<Driver[]>([
    {
      id: 1,
      name: "Ali Ben Salah",
      email: "ali@example.com",
      phone: "+21620000000",
      vehicleId: "V1",
      status: "Active",
      createdAt: "2024-01-10",
      photo: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
      id: 2,
      name: "Sami Trabelsi",
      email: "sami@example.com",
      phone: "+21621000000",
      vehicleId: "V2",
      status: "Inactive",
      createdAt: "2024-03-12",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    vehicleId: "",
    status: "Active" as const,
    photo: "",
  });

  const filteredDrivers = drivers.filter(
    (d) =>
      d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      availableVehicles.find(v => v.id === d.vehicleId)?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5MB");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({ ...prev, photo: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const handleCreate = () => {
    setModalMode("create");
    setSelectedDriver(null);
    setFormData({
      name: "",
      email: "",
      phone: "",
      vehicleId: "",
      status: "Active",
      photo: "",
    });
    setShowModal(true);
  };

  const handleEdit = (driver: Driver) => {
    setModalMode("edit");
    setSelectedDriver(driver);
    setFormData({
      name: driver.name,
      email: driver.email,
      phone: driver.phone,
      vehicleId: driver.vehicleId,
      status: driver.status,
      photo: driver.photo || "",
    });
    setShowModal(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this driver?")) {
      setDrivers((prev) => prev.filter((d) => d.id !== id));
      toast.success("Driver deleted.");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim() || !formData.vehicleId) {
      toast.error("Name, email, and vehicle are required.");
      return;
    }

    if (modalMode === "create") {
      const newDriver: Driver = {
        id: Date.now(),
        ...formData,
        createdAt: new Date().toISOString().split("T")[0],
        photo: formData.photo || undefined,
      };
      setDrivers((prev) => [...prev, newDriver]);
      toast.success("Driver added successfully!");
    } else if (selectedDriver) {
      setDrivers((prev) =>
        prev.map((d) =>
          d.id === selectedDriver.id
            ? {
                ...d,
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                vehicleId: formData.vehicleId,
                status: formData.status,
                photo: formData.photo || undefined,
              }
            : d
        )
      );
      toast.success("Driver updated successfully!");
    }

    setShowModal(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const getStatusBadge = (status: string) => {
    return status === "Active" ? (
      <Badge className="flex items-center gap-1">
        <User className="w-3 h-3" /> Active
      </Badge>
    ) : (
      <Badge className="flex items-center gap-1">
        <Shield className="w-3 h-3" /> Inactive
      </Badge>
    );
  };

  const getVehicleName = (vehicleId: string) => {
    return availableVehicles.find(v => v.id === vehicleId)?.name || "—";
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Truck className="w-6 h-6" />
            Driver Management
          </h1>
          <p className="text-sm">
            Manage driver accounts and their vehicles
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="w-4 h-4 mr-2" /> Add Driver
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-6 border rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm">Total Drivers</p>
              <p className="text-3xl font-bold">{drivers.length}</p>
            </div>
            <div className="p-3 rounded-full">
              <Truck className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="p-6 border rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm">Active Drivers</p>
              <p className="text-3xl font-bold">
                {drivers.filter((d) => d.status === "Active").length}
              </p>
            </div>
            <div className="p-3 rounded-full">
              <User className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="p-6 border rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm">Inactive Drivers</p>
              <p className="text-3xl font-bold">
                {drivers.filter((d) => d.status === "Inactive").length}
              </p>
            </div>
            <div className="p-3 rounded-full">
              <Shield className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-3 w-4 h-4" />
        <Input
          placeholder="Search by name, email, or vehicle..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Photo</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Vehicle</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDrivers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-10">
                  No drivers found
                </TableCell>
              </TableRow>
            ) : (
              filteredDrivers.map((driver) => (
                <TableRow key={driver.id}>
                  <TableCell>
                    <Avatar className="w-10 h-10 ring-2 ring-border">
                      <AvatarImage src={driver.photo} alt={driver.name} />
                      <AvatarFallback>
                        {driver.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell className="font-medium">{driver.name}</TableCell>
                  <TableCell>{driver.email}</TableCell>
                  <TableCell>{driver.phone}</TableCell>
                  <TableCell>{getVehicleName(driver.vehicleId)}</TableCell>
                  <TableCell>{getStatusBadge(driver.status)}</TableCell>
                  <TableCell>{driver.createdAt}</TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-1">
                      <Button size="icon" variant="ghost" onClick={() => handleEdit(driver)}>
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleDelete(driver.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
          <TableCaption>
            Showing {filteredDrivers.length} driver(s)
          </TableCaption>
        </Table>
      </div>

      {/* Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{modalMode === "create" ? "Add Driver" : "Edit Driver"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Photo */}
            <div className="space-y-2">
              <Label>Photo</Label>
              <div className="flex items-center gap-4">
                <Avatar className="w-16 h-16 ring-2 ring-border">
                  <AvatarImage src={formData.photo} />
                  <AvatarFallback className="text-xl">
                    {formData.name.charAt(0).toUpperCase() || "?"}
                  </AvatarFallback>
                </Avatar>
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

            {/* Name, Email, Phone */}
            {["name", "email", "phone"].map((field) => (
              <div key={field} className="space-y-2">
                <Label htmlFor={field}>
                  {field.charAt(0).toUpperCase() + field.slice(1)} *
                </Label>
                <Input
                  id={field}
                  name={field}
                  type={field === "email" ? "email" : "text"}
                  value={formData[field as keyof typeof formData]}
                  onChange={handleInputChange}
                  required
                  placeholder={field === "phone" ? "+216..." : ""}
                />
              </div>
            ))}

            {/* Vehicle Select */}
            <div className="space-y-2">
              <Label htmlFor="vehicleId">Vehicle *</Label>
              <Select
                value={formData.vehicleId}
                onValueChange={(value) => setFormData({ ...formData, vehicleId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a vehicle" />
                </SelectTrigger>
                <SelectContent>
                  {availableVehicles.map((v) => (
                    <SelectItem key={v.id} value={v.id}>
                      {v.name} ({v.type})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: "Active" | "Inactive") =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
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