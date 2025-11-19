"use client";

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Package, Truck, Calendar, User, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function AddDelivery() {
  const [form, setForm] = useState({
    clientName: "",
    address: "",
    date: "",
    driver: "",
  });

  const [errors, setErrors] = useState({
    clientName: "",
    address: "",
    date: "",
    driver: "",
  });

  const navigate = useNavigate();

  // Mock driver list
  const drivers = ["Alice Johnson", "Bob Smith", "Marie Dubois", "Paul Martin"];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" })); // Clear error
  };

  const handleDriverChange = (driver: string) => {
    setForm((prev) => ({ ...prev, driver }));
    setErrors((prev) => ({ ...prev, driver: "" }));
  };

  const validate = () => {
    const newErrors: typeof errors = { clientName: "", address: "", date: "", driver: "" };
    let isValid = true;

    if (!form.clientName.trim()) {
      newErrors.clientName = "Client name is required";
      isValid = false;
    }

    if (!form.address.trim()) {
      newErrors.address = "Address is required";
      isValid = false;
    }

    if (!form.date) {
      newErrors.date = "Delivery date is required";
      isValid = false;
    } else {
      const selectedDate = new Date(form.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        newErrors.date = "Delivery date cannot be in the past";
        isValid = false;
      }
    }

    if (!form.driver) {
      newErrors.driver = "Driver is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    console.log("Delivery added:", form);
    // TODO: Replace with real API call
    // await axios.post("/api/deliveries", form);

    toast.success("Delivery added successfully!");
    navigate("/deliveries/all");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md border">
        <CardContent className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center gap-3">
            <Package className="w-8 h-8 text-primary" />
            <h2 className="text-2xl font-bold">Add New Delivery</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Client Name */}
            <div className="space-y-1">
              <Label htmlFor="clientName" className="flex items-center gap-1">
                <User className="w-4 h-4" /> Client Name
              </Label>
              <Input
                id="clientName"
                name="clientName"
                placeholder="Enter client name"
                value={form.clientName}
                onChange={handleChange}
                required
              />
              {errors.clientName && (
                <p className="text-xs text-destructive">{errors.clientName}</p>
              )}
            </div>

            {/* Address */}
            <div className="space-y-1">
              <Label htmlFor="address" className="flex items-center gap-1">
                <Package className="w-4 h-4" /> Delivery Address
              </Label>
              <Input
                id="address"
                name="address"
                placeholder="Enter full address"
                value={form.address}
                onChange={handleChange}
                required
              />
              {errors.address && (
                <p className="text-xs text-destructive">{errors.address}</p>
              )}
            </div>

            {/* Date */}
            <div className="space-y-1">
              <Label htmlFor="date" className="flex items-center gap-1">
                <Calendar className="w-4 h-4" /> Delivery Date
              </Label>
              <Input
                id="date"
                name="date"
                type="date"
                value={form.date}
                onChange={handleChange}
                required
              />
              {errors.date && (
                <p className="text-xs text-destructive">{errors.date}</p>
              )}
            </div>

            {/* Driver Select */}
            <div className="space-y-1">
              <Label htmlFor="driver" className="flex items-center gap-1">
                <Truck className="w-4 h-4" /> Assign Driver
              </Label>
              <Select value={form.driver} onValueChange={handleDriverChange}>
                <SelectTrigger id="driver">
                  <SelectValue placeholder="Select a driver" />
                </SelectTrigger>
                <SelectContent>
                  {drivers.map((driver) => (
                    <SelectItem key={driver} value={driver}>
                      {driver}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.driver && (
                <p className="text-xs text-destructive">{errors.driver}</p>
              )}
            </div>

            {/* Buttons */}
            <div className="flex gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => navigate("/deliveries/all")}
              >
                <X className="w-4 h-4 mr-1" /> Cancel
              </Button>
              <Button type="submit" className="flex-1">
                <Check className="w-4 h-4 mr-1" /> Add Delivery
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}