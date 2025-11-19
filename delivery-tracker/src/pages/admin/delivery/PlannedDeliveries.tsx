"use client";

import React, { useState, useMemo } from "react";
import { Calendar as CalendarIcon, Bell, AlertCircle, ChevronLeftIcon, ChevronRightIcon, MoreHorizontalIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// Pagination Components (included inline)
function Pagination({ className, ...props }: React.ComponentProps<"nav">) {
  return (
    <nav
      role="navigation"
      aria-label="pagination"
      className={cn("mx-auto flex w-full justify-center", className)}
      {...props}
    />
  );
}

function PaginationContent({ className, ...props }: React.ComponentProps<"ul">) {
  return (
    <ul className={cn("flex flex-row items-center gap-1", className)} {...props} />
  );
}

function PaginationItem({ ...props }: React.ComponentProps<"li">) {
  return <li {...props} />;
}

type PaginationLinkProps = {
  isActive?: boolean;
  size?: "default" | "icon" | "sm" | "lg";
} & React.ComponentProps<"a">;

function PaginationLink({
  className,
  isActive,
  size = "icon",
  ...props
}: PaginationLinkProps) {
  return (
    <a
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
        isActive
          ? "border border-input bg-background shadow-sm"
          : "hover:bg-accent hover:text-accent-foreground",
        size === "default" && "h-9 px-4 py-2",
        size === "sm" && "h-8 rounded-md px-3",
        size === "lg" && "h-10 rounded-md px-8",
        size === "icon" && "h-9 w-9",
        className
      )}
      {...props}
    />
  );
}

function PaginationPrevious({ className, ...props }: React.ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink
      aria-label="Go to previous page"
      size="default"
      className={cn("gap-1 pl-2.5", className)}
      {...props}
    >
      <ChevronLeftIcon className="h-4 w-4" />
      <span className="hidden sm:inline">Previous</span>
    </PaginationLink>
  );
}

function PaginationNext({ className, ...props }: React.ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink
      aria-label="Go to next page"
      size="default"
      className={cn("gap-1 pr-2.5", className)}
      {...props}
    >
      <span className="hidden sm:inline">Next</span>
      <ChevronRightIcon className="h-4 w-4" />
    </PaginationLink>
  );
}

function PaginationEllipsis({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      aria-hidden
      className={cn("flex h-9 w-9 items-center justify-center", className)}
      {...props}
    >
      <MoreHorizontalIcon className="h-4 w-4" />
      <span className="sr-only">More pages</span>
    </span>
  );
}

// Mock data
const initialDeliveries = [
  { id: 5, order: "ORD-7777", driver: "Ahmed Zaki", date: "2025-11-15", status: "planned" },
  { id: 6, order: "ORD-1010", driver: "Sofia Benali", date: "2025-11-18", status: "planned"},
  { id: 1, order: "ORD-9876", driver: "Alice Johnson", date: "2025-11-08", status: "delivered"},
  // Add more mock data for pagination demo
  { id: 7, order: "ORD-2233", driver: "John Doe", date: "2025-11-15", status: "planned"},

];

export default function PlannedDeliveries() {
  const [deliveries] = useState(initialDeliveries);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5; // Adjust as needed

  const plannedDeliveries = useMemo(
    () => deliveries.filter((d) => d.status === "planned"),
    [deliveries]
  );

  const filteredDeliveries = useMemo(() => {
    if (!selectedDate) return plannedDeliveries;
    return plannedDeliveries.filter(
      (d) => new Date(d.date).toDateString() === selectedDate.toDateString()
    );
  }, [plannedDeliveries, selectedDate]);

  // Pagination logic
  const totalPages = Math.ceil(filteredDeliveries.length / pageSize);
  const paginatedDeliveries = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredDeliveries.slice(start, start + pageSize);
  }, [filteredDeliveries, currentPage, pageSize]);


  const tileContent = ({ date }: { date: Date }) => {
    const deliveriesOnDate = plannedDeliveries.filter(
      (d) => new Date(d.date).toDateString() === date.toDateString()
    );
    if (deliveriesOnDate.length === 0) return null;

    return (
      <div className="flex justify-center gap-1 mt-1">
        {deliveriesOnDate.map((d) => {
          const config = getPriorityConfig(d.priority);
          return (
            <span
              key={d.id}
              className={`w-2 h-2 rounded-full border ${config.badge}`}
            />
          );
        })}
      </div>
    );
  };

  const sendNotification = (order: string) => {
    toast.success(`Notification sent for ${order}`);
  };

  const handlePrevious = () => setCurrentPage((p) => Math.max(1, p - 1));
  const handleNext = () => setCurrentPage((p) => Math.min(totalPages, p + 1));

  // Generate page numbers (show up to 5 pages, with ellipsis if needed)
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push("...");
        pages.push.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push("...");
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push("...");
        pages.push(totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <CalendarIcon className="w-6 h-6 text-primary" />
              Planned Deliveries
            </h1>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowCalendar(!showCalendar)}
              aria-label="Toggle calendar"
            >
              <CalendarIcon className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Calendar */}
        {showCalendar && (
          <Card className="border mb-6">
            <CardContent className="p-4">
              <Calendar
                selected={selectedDate ?? undefined}
                onSelect={(date) => {
                  setSelectedDate(date ?? null);
                  setCurrentPage(1); // Reset to first page on date change
                }}
                tileContent={tileContent}
                className="rounded-md border"
              />
            </CardContent>
          </Card>
        )}

        {/* Delivery List */}
        <div>
          <h2 className="text-lg font-semibold mb-4">
            Scheduled Deliveries ({filteredDeliveries.length})
          </h2>

          {filteredDeliveries.length === 0 ? (
            <Card className="border">
              <CardContent className="py-12 text-center text-muted-foreground">
                No deliveries planned for this date.
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="space-y-4">
                {paginatedDeliveries.map((item) => {
               //   const config = getPriorityConfig(item.priority);
                  return (
                    <Card key={item.id} className="border hover:bg-muted/30 transition-colors">
                      <CardContent className="pt-5 pb-4">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                          <div className="flex-1">
                            <h3 className="font-bold text-base">
                              Order {item.order} — Scheduled for {item.date}
                            </h3>
                            <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mt-1">
                              <span className="font-medium">Driver:</span> {item.driver}
                              <span className="text-muted-foreground">•</span>
                              {/* <span className="font-medium">Priority:</span> */}
                              {/* <Badge
                                variant="outline"
                                className={`flex items-center gap-1 ${config.badge}`}
                              >
                                {/* {config.icon} */}
                                {/* {item.priority} */}
                              {/* </Badge> */}
                            </div>
                          </div>
                          <Button
                            onClick={() => sendNotification(item.order)}
                            size="sm"
                            className="w-full sm:w-auto"
                          >
                            <Bell className="w-4 h-4 mr-1" />
                            Send Reminder
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <Pagination className="mt-6">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={handlePrevious}
                        className={cn(currentPage === 1 && "pointer-events-none opacity-50")}
                      />
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
                      <PaginationNext
                        onClick={handleNext}
                        className={cn(currentPage === totalPages && "pointer-events-none opacity-50")}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}