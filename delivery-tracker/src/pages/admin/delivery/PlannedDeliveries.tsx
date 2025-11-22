"use client";

import React, { useState, useMemo } from "react";
import { Calendar as CalendarIcon, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { toast } from "sonner";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";

// Mock data
const initialDeliveries = [
  { id: 1, order: "ORD-7777", driver: "Ahmed Zaki", date: "2025-11-15", status: "planned" },
  { id: 2, order: "ORD-1010", driver: "Sofia Benali", date: "2025-11-18", status: "planned" },
  { id: 3, order: "ORD-2233", driver: "John Doe", date: "2025-11-20", status: "planned" },
  { id: 4, order: "ORD-4555", driver: "Ahmed Zaki", date: "2025-11-22", status: "planned" },
  { id: 5, order: "ORD-8911", driver: "Layla Mami", date: "2025-11-23", status: "planned" },
  { id: 6, order: "ORD-7600", driver: "John Doe", date: "2025-11-24", status: "planned" },
];

export default function PlannedDeliveries() {
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const pageSize = 4;

  // Filter planned deliveries
  const plannedDeliveries = initialDeliveries;

  const filteredDeliveries = useMemo(() => {
    if (!selectedDate) return plannedDeliveries;
    return plannedDeliveries.filter(
      (d) => new Date(d.date).toDateString() === selectedDate.toDateString()
    );
  }, [selectedDate]);

  // Pagination
  const totalPages = Math.ceil(filteredDeliveries.length / pageSize);

  const paginated = filteredDeliveries.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const sendNotification = (order: string) => {
    toast.success(`Notification sent for ${order}`);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <CalendarIcon className="w-6 h-6 text-primary" />
          Planned Deliveries
        </h1>

        <Button variant="outline" onClick={() => setShowCalendar(!showCalendar)}>
          <CalendarIcon className="w-4 h-4 mr-2" />
          Calendar
        </Button>
      </div>

      {/* Calendar */}
      {showCalendar && (
        <Card className="border">
          <CardContent className="p-4">
            <Calendar
              selected={selectedDate ?? undefined}
              onSelect={(date) => {
                setSelectedDate(date ?? null);
                setCurrentPage(1);
              }}
              className="rounded-md border"
            />
          </CardContent>
        </Card>
      )}

      {/* Delivery List */}
      <div>
        <h2 className="text-lg font-semibold mb-3">
          Scheduled Deliveries ({filteredDeliveries.length})
        </h2>

        {filteredDeliveries.length === 0 ? (
          <Card>
            <CardContent className="py-10 text-center text-muted-foreground">
              No planned deliveries for this date.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {paginated.map((item) => (
              <Card key={item.id} className="border">
                <CardContent className="py-4">
                  <div className="flex flex-col sm:flex-row justify-between gap-3">
                    <div>
                      <p className="font-semibold">
                        Order {item.order} — {item.date}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Driver: {item.driver}
                      </p>
                    </div>

                    <Button size="sm" onClick={() => sendNotification(item.order)}>
                      <Bell className="w-4 h-4 mr-1" />
                      Notify Driver
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination className="mt-4">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                />
              </PaginationItem>

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

              <PaginationItem>
                <PaginationNext
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </div>
  );
}
