import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHead, TableHeader, TableRow, TableBody, TableCell } from "@/components/ui/table";
import { Input } from "@/components/ui/input";

// Order type
type HistoryOrder = {
  id: string;
  driverName: string;
  companyAddress: string;
  deliveryAddress: string;
  deliveredAt: string;
  status: "Delivered" | "Canceled";
};

export default function OrdersHistory() {
  const [search, setSearch] = useState("");

  const historyOrders: HistoryOrder[] = [
    {
      id: "CMD-4431",
      driverName: "Ahmed Ben Ali",
      companyAddress: "Mghira Industrial Zone, Ben Arous",
      deliveryAddress: "Carrefour La Marsa",
      deliveredAt: "2025-01-11",
      status: "Delivered",
    },
    {
      id: "CMD-4432",
      driverName: "Sami Trabelsi",
      companyAddress: "Ben Arous Center",
      deliveryAddress: "Géant Tunis City",
      deliveredAt: "2025-01-12",
      status: "Canceled",
    },
    {
      id: "CMD-4433",
      driverName: "Walid Gharbi",
      companyAddress: "Rades Plage",
      deliveryAddress: "Monoprix Lac 2",
      deliveredAt: "2025-01-14",
      status: "Delivered",
    },
  ];

  // Filter only delivered orders + search filtering
  const filteredOrders = historyOrders
    .filter((order) => order.status === "Delivered")
    .filter((order) =>
      [order.id, order.driverName, order.companyAddress, order.deliveryAddress, order.status]
        .some((value) => value.toLowerCase().includes(search.toLowerCase()))
    );

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-primary">Order History</h1>

      {/* Search bar with clear button */}
      <div className="relative max-w-sm">
        <Input
          placeholder="Search by order, driver, address, status..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pr-8"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-2 top-1/2 -translate-y-1/2  "
          >
            ✕
          </button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>List of Processed Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order</TableHead>
                <TableHead>Driver</TableHead>
                <TableHead>Company Address</TableHead>
                <TableHead>Delivery Address</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>{order.id}</TableCell>
                    <TableCell>{order.driverName}</TableCell>
                    <TableCell>{order.companyAddress}</TableCell>
                    <TableCell>{order.deliveryAddress}</TableCell>
                    <TableCell>{new Date(order.deliveredAt).toLocaleDateString()}</TableCell>
                    <TableCell className="text-green-600 font-semibold">
                      {order.status}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4 ">
                    No results found...
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
