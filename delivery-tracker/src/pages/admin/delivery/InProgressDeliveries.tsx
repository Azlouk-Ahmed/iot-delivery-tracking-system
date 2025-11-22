"use client";

import React, { useState, useMemo } from "react";
import { Truck, MapPin, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/components/ui/pagination"; // import your simplified pagination component

// Mock data
const initialDeliveries = [
  { id: 1, order: "ORD-5432", driver: "Paul Martin", date: "2025-11-10", status: "inProgress", location: "Near Client B, ETA 30 min" },
  { id: 2, order: "ORD-3344", driver: "Marie Dubois", date: "2025-11-10", status: "inProgress", location: "Regional Hub" },
  { id: 3, order: "ORD-5566", driver: "Alice Johnson", date: "2025-11-11", status: "inProgress", location: "Warehouse" },
  { id: 4, order: "ORD-7788", driver: "Bob Smith", date: "2025-11-12", status: "inProgress", location: "Client A" },
  { id: 5, order: "ORD-9900", driver: "John Doe", date: "2025-11-13", status: "inProgress", location: "Regional Hub" },
  { id: 6, order: "ORD-1111", driver: "Mary Lee", date: "2025-11-14", status: "inProgress", location: "Warehouse" },
];

export default function InProgressDeliveries() {
  const [deliveries, setDeliveries] = useState(initialDeliveries);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 3;

  const inProgressDeliveries = useMemo(() => 
    deliveries.filter((d) => d.status === "inProgress"), [deliveries]
  );

  const totalPages = Math.ceil(inProgressDeliveries.length / pageSize);

  const paginatedDeliveries = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return inProgressDeliveries.slice(start, start + pageSize);
  }, [inProgressDeliveries, currentPage]);

  const markAsDelivered = (id: number) => {
    setDeliveries((prev) => prev.filter((d) => d.id !== id));
    toast.success(`Order ${id} marked as delivered!`);
  };

  const handlePrevious = () => setCurrentPage((p) => Math.max(1, p - 1));
  const handleNext = () => setCurrentPage((p) => Math.min(totalPages, p + 1));

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <Truck className="w-6 h-6 text-primary" />
        In-Progress Deliveries
      </h1>

      <Card className="border">
        <CardContent className="py-4 flex justify-between items-center">
          <p className="text-sm text-muted-foreground">Active Deliveries</p>
          <p className="text-2xl font-bold text-primary">{inProgressDeliveries.length}</p>
        </CardContent>
      </Card>

      <div>
        <h2 className="text-lg font-semibold mb-3">Live Tracking ({inProgressDeliveries.length})</h2>

        {paginatedDeliveries.length === 0 ? (
          <Card className="border">
            <CardContent className="py-10 text-center text-muted-foreground">
              No deliveries currently in progress.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {paginatedDeliveries.map((d) => (
              <Card key={d.id} className="border hover:bg-muted/30 transition-colors">
                <CardContent className="py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <p className="font-semibold">Order {d.order} — {d.driver}</p>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-muted-foreground mt-1">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4 text-primary" />
                        <span>{d.location}</span>
                      </div>
                      <div>
                        <span className="font-medium">Scheduled:</span> {d.date}
                      </div>
                    </div>
                  </div>

                  <Button size="sm" onClick={() => markAsDelivered(d.id)} className="w-full sm:w-auto">
                    <Check className="w-4 h-4 mr-1" /> Mark Delivered
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination className="mt-6">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious onClick={handlePrevious} />
              </PaginationItem>

              {getPageNumbers().map((page, idx) =>
                page === "..." ? (
                  <PaginationItem key={`ellipsis-${idx}`}>
                    <PaginationEllipsis />
                  </PaginationItem>
                ) : (
                  <PaginationItem key={page}>
                    <PaginationLink
                      isActive={currentPage === page}
                      onClick={() => setCurrentPage(page as number)}
                      className="cursor-pointer"
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                )
              )}

              <PaginationItem>
                <PaginationNext onClick={handleNext} />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </div>
  );
}
