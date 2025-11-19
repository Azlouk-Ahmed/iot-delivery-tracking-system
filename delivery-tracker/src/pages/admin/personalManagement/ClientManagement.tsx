'use client';

import React, { useState, useMemo } from "react";
import {
  Users,
  Mail,
  Phone,
  MapPin,
  Search,
  RefreshCw,
  Plus,
  Edit,
  Trash2,
  Upload,
} from "lucide-react";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  photo: string;
  role: "user";
}

export default function ClientManagement() {
  const [clients, setClients] = useState<Client[]>([
    {
      id: 1,
      name: "Alice Johnson",
      email: "alice@example.com",
      phone: "+1 555 123 456",
      address: "New York, USA",
      photo: "https://randomuser.me/api/portraits/women/1.jpg",
      role: "user",
    },
    {
      id: 2,
      name: "Bob Smith",
      email: "bob@example.com",
      phone: "+1 555 987 654",
      address: "Los Angeles, USA",
      photo: "https://randomuser.me/api/portraits/men/2.jpg",
      role: "user",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  const [formData, setFormData] = useState<Omit<Client, "id" | "role">>({
    name: "",
    email: "",
    phone: "",
    address: "",
    photo: "",
  });

  const resetForm = () => {
    setFormData({ name: "", email: "", phone: "", address: "", photo: "" });
    setEditingClient(null);
  };

  const openDialog = (client?: Client) => {
    if (client) {
      setEditingClient(client);
      setFormData({
        name: client.name,
        email: client.email,
        phone: client.phone,
        address: client.address,
        photo: client.photo,
      });
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    resetForm();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5 MB");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({ ...prev, photo: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    if (!formData.name.trim() || !formData.email.trim()) {
      toast.error("Name and email are required.");
      return;
    }

    if (editingClient) {
      setClients((prev) =>
        prev.map((c) =>
          c.id === editingClient.id
            ? {
                ...c,
                ...formData,
                photo:
                  formData.photo ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=64748b&color=fff`,
              }
            : c
        )
      );
      toast.success("Client updated!");
    } else {
      const newClient: Client = {
        id: Date.now(),
        ...formData,
        role: "user",
        photo:
          formData.photo ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=64748b&color=fff`,
      };
      setClients((prev) => [...prev, newClient]);
      toast.success("Client added!");
    }
    closeDialog();
  };

  const handleDelete = (id: number) => {
    if (confirm("Delete this client?")) {
      setClients((prev) => prev.filter((c) => c.id !== id));
      toast.success("Client deleted.");
    }
  };

  const filteredClients = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return clients.filter((c) => c.role === "user");
    return clients.filter(
      (c) =>
        c.role === "user" &&
        [c.name, c.email, c.phone, c.address].some((field) =>
          field.toLowerCase().includes(term)
        )
    );
  }, [clients, searchTerm]);

  return (
    <div className="min-h-screen p-4 sm:p-8">
      {" "}
      {/* ← Default background */}
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold flex items-center gap-2">
              <Users className="w-8 h-8 text-primary" />
              Client Management
            </h1>
            <p className="text-muted-foreground mt-1">
              View, search, edit, and manage clients
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full sm:w-72"
              />
            </div>

            <Button
              variant="outline"
              onClick={() => setSearchTerm("")}
              className="flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" /> Reset
            </Button>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  onClick={() => openDialog()}
                  className="flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Add Client
                </Button>
              </DialogTrigger>

              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>
                    {editingClient ? "Edit Client" : "Add New Client"}
                  </DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-4">
                  <Input
                    placeholder="Full Name *"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                  <Input
                    placeholder="Email *"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                  <Input
                    placeholder="Phone"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                  />
                  <Input
                    placeholder="Address"
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                  />

                  {/* Photo Upload */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Photo</label>
                    <div className="flex items-center gap-4">
                      <Avatar className="w-16 h-16 ring-2 ring-border">
                        <AvatarImage src={formData.photo} />
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
                          Choose
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
                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={closeDialog}>
                    Cancel
                  </Button>
                  <Button onClick={handleSave}>
                    {editingClient ? "Update" : "Save"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground">Total Clients</p>
                <p className="text-3xl font-bold">{filteredClients.length}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Table */}
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            {filteredClients.length === 0 ? (
              <div className="py-20 text-center text-muted-foreground">
                No clients found.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead>Photo</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead className="w-20 text-center">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredClients.map((client) => (
                      <TableRow key={client.id} className="hover:bg-muted/30">
                        <TableCell className="py-3">
                          <Avatar className="w-10 h-10 ring-2 ring-border">
                            <AvatarImage src={client.photo} alt={client.name} />
                            <AvatarFallback className="bg-muted text-muted-foreground">
                              {client.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                        </TableCell>
                        <TableCell className="font-medium">
                          {client.name}
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1 text-sm">
                            <div className="flex items-center gap-2">
                              <Mail className="w-4 h-4 text-muted-foreground" />
                              {client.email}
                            </div>
                            {client.phone && (
                              <div className="flex items-center gap-2 text-muted-foreground/80">
                                <Phone className="w-4 h-4" />
                                {client.phone}
                              </div>
                            )}
                            {client.address && (
                              <div className="flex items-center gap-2 text-muted-foreground/80">
                                <MapPin className="w-4 h-4" />
                                {client.address}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-center gap-1">
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => openDialog(client)}
                              aria-label="Edit"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => handleDelete(client.id)}
                              aria-label="Delete"
                            >
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}