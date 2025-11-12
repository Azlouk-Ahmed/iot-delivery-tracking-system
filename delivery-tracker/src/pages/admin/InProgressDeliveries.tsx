"use client";

import React, { useState } from "react";
import { Truck, MapPin, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

// Mock data
const initialDeliveries = [
  { id: 1, order: "ORD-9876", driver: "Alice Johnson", date: "2025-11-08", status: "delivered", location: "Delivered" },
  { id: 2, order: "ORD-5432", driver: "Paul Martin", date: "2025-11-10", status: "inProgress", location: "Near Client B, ETA 30 min" },
  { id: 3, order: "ORD-1122", driver: "Bob Smith", date: "2025-11-15", status: "planned", location: "Warehouse" },
  { id: 4, order: "ORD-3344", driver: "Marie Dubois", date: "2025-11-10", status: "inProgress", location: "Regional Hub" },
];

export default function InProgressDeliveries() {
  const [deliveries, setDeliveries] = useState(initialDeliveries);

  const inProgressDeliveries = deliveries.filter((d) => d.status === "inProgress");

  const markAsDelivered = (id: number) => {
    setDeliveries((prev) =>
      prev.map((d) =>
        d.id === id
          ? { ...d, status: "delivered", location: "Delivered" }
          : d
      )
    );
    toast.success(`Order ${id} marked as delivered!`);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Truck className="w-6 h-6 text-primary" />
              In-Progress Deliveries
            </h1>
            <p className="text-sm text-muted-foreground">
              Real-time tracking of active deliveries in transit.
            </p>
          </div>
        </div>

        {/* Stats Card */}
        <Card className="border">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Active Deliveries
                </p>
                <p className="text-3xl font-bold text-primary">
                  {inProgressDeliveries.length}
                </p>
              </div>
              <div className="p-3 bg-primary/10 rounded-full">
                <Truck className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Live Tracking List */}
        <div>
          <h2 className="text-lg font-semibold mb-4">
            Live Tracking ({inProgressDeliveries.length})
          </h2>

          {inProgressDeliveries.length === 0 ? (
            <Card className="border">
              <CardContent className="py-12">
                <p className="text-center text-muted-foreground">
                  No deliveries currently in progress.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {inProgressDeliveries.map((item) => (
                <Card key={item.id} className="border hover:bg-muted/30 transition-colors">
                  <CardContent className="pt-5 pb-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div className="flex-1">
                        <h3 className="font-bold text-base">
                          Order {item.order} — {item.driver}
                        </h3>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-sm text-muted-foreground mt-1">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4 text-primary" />
                            <span className="font-medium">Location:</span> {item.location}
                          </div>
                          <span className="hidden sm:inline text-muted-foreground">•</span>
                          <div>
                            <span className="font-medium">Scheduled:</span> {item.date}
                          </div>
                        </div>
                      </div>
                      <Button
                        onClick={() => markAsDelivered(item.id)}
                        size="sm"
                        className="w-full sm:w-auto"
                      >
                        <Check className="w-4 h-4 mr-1" />
                        Mark Delivered
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}