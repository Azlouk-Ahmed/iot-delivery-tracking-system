// app/dashboard/alerts/page.tsx
'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell, AlertTriangle, X, Clock } from 'lucide-react';

interface Alert {
  id: number;
  type: 'warning' | 'info' | 'critical';
  title: string;
  message: string;
  time: string;
  vehicleId?: string;
}

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([
    { id: 1, type: 'warning', title: 'Speed Alert', message: 'VH-001 is driving at 95 km/h', time: '3 min ago', vehicleId: 'VH-001' },
    { id: 2, type: 'info', title: 'New Trip Started', message: 'Sarah Ali started route Sousse → Monastir', time: '10 min ago', vehicleId: 'VH-014' },
    { id: 3, type: 'critical', title: 'Long Stop Detected', message: 'VH-014 has been stopped for 28 minutes', time: '18 min ago', vehicleId: 'VH-014' },
    { id: 4, type: 'warning', title: 'Route Deviation', message: 'VH-001 is off the planned route', time: '25 min ago', vehicleId: 'VH-001' },
  ]);

  const markAsRead = (id: number) => {
    setAlerts(alerts.filter(a => a.id !== id));
  };

  const clearAll = () => {
    setAlerts([]);
  };

  const getIcon = (type: string) => {
    return type === 'critical' ? <AlertTriangle className="h-5 w-5" /> : <Bell className="h-5 w-5" />;
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <Bell className="h-8 w-8 mr-3" />
        <h1 className="text-3xl font-bold">Alerts Center</h1>
        <span className="ml-4 px-3 py-1 bg-muted rounded-full text-sm font-medium">
          {alerts.length} Active
        </span>
      </div>

      {alerts.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-lg text-muted-foreground">No active alerts</p>
            <p className="text-sm text-muted-foreground mt-2">You're all caught up!</p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="flex justify-end mb-4">
            <Button variant="outline" size="sm" onClick={clearAll}>
              Clear All
            </Button>
          </div>

          <div className="space-y-4">
            {alerts.map((alert) => (
              <Card key={alert.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={alert.type === 'critical' ? 'text-red-600' : ''}>
                        {getIcon(alert.type)}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{alert.title}</CardTitle>
                        {alert.vehicleId && (
                          <p className="text-sm text-muted-foreground mt-1">
                            Vehicle: <span className="font-medium">{alert.vehicleId}</span>
                          </p>
                        )}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => markAsRead(alert.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{alert.message}</p>
                  <p className="text-xs text-muted-foreground mt-3 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {alert.time}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}