"use client";

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Package, Truck, CheckCircle, Plus } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const initialDeliveries = [
  { id: 1, order: "ORD-9876", driver: "Alice Johnson", date: "2025-11-08", status: "delivered" },
  { id: 2, order: "ORD-5432", driver: "Paul Martin", date: "2025-11-10", status: "inProgress" },
  { id: 3, order: "ORD-1122", driver: "Bob Smith", date: "2025-11-15", status: "planned" },
  { id: 4, order: "ORD-3344", driver: "Marie Dubois", date: "2025-11-10", status: "inProgress" },
  // Add more rows if you want to see pagination in action
];

const PAGE_SIZE = 3; // change to any number you like

const getStatusConfig = (status: string) => {
  switch (status) {
    case "delivered":
      return { label: "DELIVERED", icon: <CheckCircle className="w-4 h-4" /> };
    case "inProgress":
      return { label: "IN PROGRESS", icon: <Truck className="w-4 h-4" /> };
    case "planned":
      return { label: "PLANNED", icon: <Package className="w-4 h-4" /> };
    default:
      return { label: status.toUpperCase(), icon: null };
  }
};

export default function AllDeliveries() {
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  const totalPages = Math.ceil(initialDeliveries.length / PAGE_SIZE);
  const paginated = initialDeliveries.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const deliveredCount = initialDeliveries.filter((d) => d.status === "delivered").length;
  const inProgressCount = initialDeliveries.filter((d) => d.status === "inProgress").length;

  // Helper to generate page numbers (1, 2, 3 … 10)
  const getPageNumbers = () => {
    const pages: (number | "ellipsis")[] = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 4) {
        pages.push(1, 2, 3, 4, 5, "ellipsis", totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(
          1,
          "ellipsis",
          totalPages - 4,
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages
        );
      } else {
        pages.push(
          1,
          "ellipsis",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "ellipsis",
          totalPages
        );
      }
    }
    return pages;
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Package className="w-6 h-6" />
              All Deliveries
            </h1>
            <p className="text-sm mt-1">
              Complete list of deliveries, all statuses included.
            </p>
          </div>
          <Button onClick={() => navigate("/deliveries/add")}>
            <Plus className="w-4 h-4 mr-2" /> Add Delivery
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardContent className="pt-6 flex items-center justify-between">
              <div>
                <p className="text-sm mb-1">In Progress</p>
                <p className="text-3xl font-bold">{inProgressCount}</p>
              </div>
              <div className="p-3 rounded-full">
                <Truck className="w-6 h-6" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 flex items-center justify-between">
              <div>
                <p className="text-sm mb-1">Delivered</p>
                <p className="text-3xl font-bold">{deliveredCount}</p>
              </div>
              <div className="p-3 rounded-full">
                <CheckCircle className="w-6 h-6" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Delivery List */}
        <div>
          <h2 className="text-lg font-semibold mb-4">
            All Orders ({initialDeliveries.length})
          </h2>

          <div className="space-y-3">
            {paginated.map((item) => {
              const config = getStatusConfig(item.status);
              return (
                <Card key={item.id}>
                  <CardContent className="pt-5 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div className="flex-1">
                      <h3 className="font-bold text-base">Order {item.order}</h3>
                      <p className="text-sm mt-1">
                        <span className="font-medium">Driver:</span> {item.driver}
                        <span className="mx-2">•</span>
                        <span className="font-medium">Date:</span> {item.date}
                      </p>
                    </div>
                    <Badge className="flex items-center gap-1">
                      {config.icon}
                      {config.label}
                    </Badge>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage > 1) setCurrentPage(currentPage - 1);
                      }}
                    />
                  </PaginationItem>

                  {getPageNumbers().map((page, idx) =>
                    page === "ellipsis" ? (
                      <PaginationItem key={`ellipsis-${idx}`}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    ) : (
                      <PaginationItem key={page}>
                        <PaginationLink
                          href="#"
                          isActive={page === currentPage}
                          onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage(page);
                          }}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  )}

                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                      }}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}