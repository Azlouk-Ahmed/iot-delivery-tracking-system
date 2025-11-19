import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Notification = {
  id: string;
  title: string;
  message: string;
  date: string;
  status: "Read" | "Unread";
};

export default function Clientnotify() {
  // Static Data
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "NOT-001",
      title: "Order in progress",
      message: "Your order CMD-4521 is currently being delivered.",
      date: "2025-01-09 10:15",
      status: "Unread",
    },
    {
      id: "NOT-002",
      title: "Order delivered",
      message: "Your order CMD-4501 has been delivered.",
      date: "2025-01-08 14:30",
      status: "Read",
    },
    {
      id: "NOT-003",
      title: "New Offer",
      message: "Enjoy a 10% discount on your next order.",
      date: "2025-01-07 09:00",
      status: "Unread",
    },
    {
      id: "NOT-004",
      title: "Maintenance Notice",
      message: "The website will be under maintenance on January 15.",
      date: "2025-01-05 08:00",
      status: "Read",
    },
  ]);

  const [search, setSearch] = useState("");

  // Filtering notifications
  const filteredNotifications = notifications.filter((notif) =>
    [notif.title, notif.message, notif.status]
      .some((value) => value.toLowerCase().includes(search.toLowerCase()))
  );

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, status: "Read" } : n))
    );
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-yellow-500">Notifications</h1>

      {/* Search Bar */}
      <div className="max-w-sm">
        <Input
          placeholder="Search by title, message or status..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Notification List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Message</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredNotifications.length > 0 ? (
                filteredNotifications.map((notif) => (
                  <TableRow key={notif.id}>
                    <TableCell>{notif.title}</TableCell>
                    <TableCell>{notif.message}</TableCell>
                    <TableCell>{new Date(notif.date).toLocaleString()}</TableCell>
                    <TableCell
                      className={
                        notif.status === "Read"
                          ? "text-gray-500 font-semibold"
                          : "text-blue-600 font-semibold"
                      }
                    >
                      {notif.status}
                    </TableCell>
                    <TableCell>
                      {notif.status === "Unread" && (
                        <Button
                          size="sm"
                          className="bg-yellow-400 hover:bg-yellow-500 text-black"
                          onClick={() => markAsRead(notif.id)}
                        >
                          Mark as read
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4 text-gray-500">
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
