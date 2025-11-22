"use client";

import React, { useState } from "react";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  Clock,
  CircleCheck,
  CircleX,
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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
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
import { toast } from "sonner";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination"; // adjust the path if needed

interface Admin {
  id: number;
  name: string;
  email: string;
  company: string;
  status: "Active" | "Inactive";
  createdAt: string;
  photo?: string;
}

export default function AdminManagement() {
  const currentAdminCompany = "TechCorp";

  const [admins, setAdmins] = useState<Admin[]>([
    {
      id: 1,
      name: "John Doe",
      email: "john@techcorp.com",
      company: "TechCorp",
      status: "Active",
      createdAt: "2024-01-15",
      photo: "https://randomuser.me/api/portraits/men/1.jpg",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@techcorp.com",
      company: "TechCorp",
      status: "Inactive",
      createdAt: "2024-02-20",
    },
    {
      id: 3,
      name: "Mike Johnson",
      email: "mike@smartlog.com",
      company: "SmartLog",
      status: "Active",
      createdAt: "2024-03-10",
    },
    {
      id: 4,
      name: "Alice Brown",
      email: "alice@techcorp.com",
      company: "TechCorp",
      status: "Active",
      createdAt: "2024-03-25",
    },
    {
      id: 5,
      name: "Bob White",
      email: "bob@techcorp.com",
      company: "TechCorp",
      status: "Inactive",
      createdAt: "2024-04-05",
    },
    {
      id: 6,
      name: "Charlie Green",
      email: "charlie@techcorp.com",
      company: "TechCorp",
      status: "Active",
      createdAt: "2024-05-01",
    },
    {
      id: 7,
      name: "Charlie Green",
      email: "charlie@techcorp.com",
      company: "TechCorp",
      status: "Active",
      createdAt: "2024-05-01",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    company: currentAdminCompany,
    status: "Active" as const,
    photo: "",
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Filter admins by company and search
  const filteredAdmins = admins
    .filter((a) => a.company === currentAdminCompany)
    .filter(
      (a) =>
        a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const totalPages = Math.ceil(filteredAdmins.length / itemsPerPage);
  const paginatedAdmins = filteredAdmins.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (value: string) => {
    setFormData({ ...formData, status: value as "Active" | "Inactive" });
  };

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

  const openAddModal = () => {
    setIsEditing(false);
    setSelectedAdmin(null);
    setFormData({
      name: "",
      email: "",
      password: "",
      company: currentAdminCompany,
      status: "Active",
      photo: "",
    });
    setShowModal(true);
  };

  const openEditModal = (admin: Admin) => {
    setIsEditing(true);
    setSelectedAdmin(admin);
    setFormData({
      name: admin.name,
      email: admin.email,
      password: "",
      company: admin.company,
      status: admin.status,
      photo: admin.photo || "",
    });
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim()) {
      toast.error("Name and email are required.");
      return;
    }

    if (!isEditing && formData.password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    if (isEditing && selectedAdmin) {
      setAdmins((prev) =>
        prev.map((a) =>
          a.id === selectedAdmin.id
            ? {
                ...a,
                name: formData.name,
                email: formData.email,
                status: formData.status,
                photo: formData.photo || undefined,
              }
            : a
        )
      );
      toast.success("Admin updated successfully!");
    } else {
      const newAdmin: Admin = {
        id: Date.now(),
        name: formData.name,
        email: formData.email,
        company: currentAdminCompany,
        status: formData.status,
        createdAt: new Date().toISOString().split("T")[0],
        photo: formData.photo || undefined,
      };
      setAdmins((prev) => [...prev, newAdmin]);
      toast.success("Admin added successfully!");
    }

    setShowModal(false);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this admin?")) {
      setAdmins((prev) => prev.filter((a) => a.id !== id));
      toast.success("Admin deleted.");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Active":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800 flex items-center gap-1"
          >
            <CircleCheck className="w-3 h-3" /> Active
          </Badge>
        );
      case "Inactive":
        return (
          <Badge
            variant="outline"
            className="bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800 flex items-center gap-1"
          >
            <CircleX className="w-3 h-3" /> Inactive
          </Badge>
        );
      default:
        return (
          <Badge
            variant="outline"
            className="bg-muted text-muted-foreground flex items-center gap-1"
          >
            <Clock className="w-3 h-3" /> {status}
          </Badge>
        );
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <CircleCheck className="w-6 h-6 text-primary" />
            Admin Management
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage admins for{" "}
            <span className="font-medium">{currentAdminCompany}</span>
          </p>
        </div>
        <Button onClick={openAddModal}>
          <Plus className="w-4 h-4 mr-2" /> Add Admin
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1); // reset page when searching
          }}
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
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedAdmins.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-10 text-muted-foreground"
                >
                  No admins found in your company.
                </TableCell>
              </TableRow>
            ) : (
              paginatedAdmins.map((admin) => (
                <TableRow key={admin.id} className="hover:bg-muted/50">
                  <TableCell>
                    <Avatar className="w-10 h-10 ring-2 ring-border">
                      <AvatarImage src={admin.photo} alt={admin.name} />
                      <AvatarFallback className="bg-muted text-muted-foreground">
                        {admin.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell className="font-medium">{admin.name}</TableCell>
                  <TableCell>{admin.email}</TableCell>
                  <TableCell>{getStatusBadge(admin.status)}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {admin.createdAt}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => openEditModal(admin)}
                        aria-label="Edit admin"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="text-destructive hover:text-destructive/80"
                        onClick={() => handleDelete(admin.id)}
                        aria-label="Delete admin"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
          <TableCaption className="text-xs">
            Showing {paginatedAdmins.length} of {filteredAdmins.length} admin(s)
            from {currentAdminCompany}
          </TableCaption>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination className="mt-4">
          <PaginationPrevious
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
          />
          <PaginationContent>
            {Array.from({ length: totalPages }, (_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  isActive={currentPage === i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
          </PaginationContent>
          <PaginationNext
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
          />
        </Pagination>
      )}

      {/* Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit Admin" : "Add New Admin"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Photo Upload */}
            <div className="space-y-2">
              <Label>Photo</Label>
              <div className="flex items-center gap-4">
                <Avatar className="w-16 h-16 ring-2 ring-border">
                  <AvatarImage src={formData.photo} alt="Preview" />
                  <AvatarFallback className="bg-muted text-muted-foreground text-xl">
                    {formData.name.charAt(0).toUpperCase() || "?"}
                  </AvatarFallback>
                </Avatar>
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <div className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 flex items-center gap-1 text-sm">
                    <Upload className="w-3.5 h-3.5" />
                    Choose Photo
                  </div>
                </label>
                {formData.photo && (
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, photo: "" })}
                    className="text-xs text-destructive hover:underline"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder="John Doe"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                placeholder="john@techcorp.com"
              />
            </div>

            {!isEditing && (
              <div className="space-y-2">
                <Label htmlFor="password">Password *</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  placeholder="••••••••"
                  minLength={6}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={handleSelectChange}>
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowModal(false)}
              >
                <X className="w-4 h-4 mr-1" /> Cancel
              </Button>
              <Button type="submit">
                <Check className="w-4 h-4 mr-1" /> {isEditing ? "Update" : "Add"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
