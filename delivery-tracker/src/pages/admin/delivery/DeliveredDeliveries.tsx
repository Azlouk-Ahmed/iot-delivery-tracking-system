"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  CheckCircle,
  Package,
  Clock,
  Filter,
  X,
  Calendar as CalendarIcon,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";

// Pagination UI
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

// Mock data
const initialDeliveries = [
  { id: 1, order: "ORD-9876", driver: "Alice Johnson", client: "Sarah Lee", date: "2025-11-08", time: "14:30", status: "delivered" },
  { id: 3, order: "ORD-2020", driver: "Bob Smith", client: "Ahmed Zaki", date: "2025-11-07", time: "10:15", status: "delivered" },
  { id: 7, order: "ORD-6543", driver: "Charles Dupont", client: "Marie Benali", date: "2025-11-09", time: "16:00", status: "delivered" },
  { id: 8, order: "ORD-1122", driver: "Alice Johnson", client: "Omar Trabelsi", date: "2025-11-10", time: "09:45", status: "delivered" },
  { id: 2, order: "ORD-5432", driver: "Paul Martin", client: "Sami Jlassi", date: "2025-11-10", time: "", status: "inProgress" },
];

export default function DeliveredDeliveries() {
  const [deliveries] = useState(initialDeliveries);
  const [searchClient, setSearchClient] = useState("");
  const [selectedDriver, setSelectedDriver] = useState<string>("all");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [showCalendar, setShowCalendar] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2; // change items per page here

  const deliveredDeliveries = deliveries.filter((d) => d.status === "delivered");

  const drivers = Array.from(new Set(deliveredDeliveries.map((d) => d.driver))).sort();

  const filteredDeliveries = useMemo(() => {
    return deliveredDeliveries.filter((item) => {
      const matchesClient = item.client.toLowerCase().includes(searchClient.toLowerCase());
      const matchesDriver = selectedDriver === "all" || item.driver === selectedDriver;
      const matchesDate =
        !selectedDate ||
        item.date === selectedDate.toISOString().split("T")[0];
      return matchesClient && matchesDriver && matchesDate;
    });
  }, [deliveredDeliveries, searchClient, selectedDriver, selectedDate]);

  // Reset to page 1 whenever filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchClient, selectedDriver, selectedDate]);

  // Pagination logic
  const totalPages = Math.max(1, Math.ceil(filteredDeliveries.length / itemsPerPage));

  const paginatedDeliveries = filteredDeliveries.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const clearFilters = () => {
    setSearchClient("");
    setSelectedDriver("all");
    setSelectedDate(undefined);
  };

  const totalThisWeek = 3;

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <CheckCircle className="w-6 h-6" />
            Delivered Orders
          </h1>
          <p className="text-sm mt-1">History of successfully completed deliveries.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm mb-1">Completed Deliveries</p>
                  <p className="text-3xl font-bold">{deliveredDeliveries.length}</p>
                </div>
                <div className="p-3 rounded-full">
                  <Package className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm mb-1">This Week</p>
                  <p className="text-3xl font-bold">{totalThisWeek}</p>
                </div>
                <div className="p-3 rounded-full">
                  <Clock className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-5">
            <div className="flex items-center gap-2 mb-3">
              <Filter className="w-5 h-5" />
              <h3 className="font-semibold">Filters</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Client Search */}
              <Input
                placeholder="Search client..."
                value={searchClient}
                onChange={(e) => setSearchClient(e.target.value)}
              />

              {/* Driver Select */}
              <Select value={selectedDriver} onValueChange={setSelectedDriver}>
                <SelectTrigger>
                  <SelectValue placeholder="All drivers" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Drivers</SelectItem>
                  {drivers.map((driver) => (
                    <SelectItem key={driver} value={driver}>
                      {driver}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Calendar Toggle */}
              <div className="space-y-2">
                <Button className="w-full justify-start" onClick={() => setShowCalendar(!showCalendar)}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? selectedDate.toLocaleDateString() : "Pick a date"}
                </Button>

                {showCalendar && (
                  <div className="p-2 border rounded-md">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => {
                        setSelectedDate(date || undefined);
                        setShowCalendar(false);
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            {(searchClient || selectedDriver !== "all" || selectedDate) && (
              <Button size="sm" onClick={clearFilters} className="mt-3">
                <X className="w-4 h-4 mr-1" />
                Clear filters
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Delivery List */}
        <div>
          <h2 className="text-lg font-semibold mb-4">
            Delivery Report ({filteredDeliveries.length})
          </h2>

          {paginatedDeliveries.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                No deliveries match your filters.
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {paginatedDeliveries.map((item) => (
                <Card key={item.id}>
                  <CardContent className="pt-5 pb-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                      <div>
                        <h3 className="font-bold text-base">Order {item.order}</h3>
                        <p className="text-sm">
                          <span className="font-medium">Driver:</span> {item.driver}
                        </p>
                        <p className="text-sm">
                          <span className="font-medium">Client:</span> {item.client}
                        </p>
                        <p className="text-sm">
                          <span className="font-medium">Delivered:</span> {item.date} at {item.time}
                        </p>
                      </div>
                      <Badge>DELIVERED</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Pagination */}
          <div className="mt-6 flex justify-center">
            <Pagination>
              <PaginationPrevious
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              />
              <PaginationContent>
                {Array.from({ length: totalPages }).map((_, index) => (
                  <PaginationItem key={index}>
                    <PaginationLink
                      isActive={currentPage === index + 1}
                      onClick={() => setCurrentPage(index + 1)}
                    >
                      {index + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
              </PaginationContent>
              <PaginationNext
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              />
            </Pagination>
          </div>
        </div>
      </div>
    </div>
  );
}
