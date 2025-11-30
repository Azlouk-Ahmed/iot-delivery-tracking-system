import React from "react";
import { useRoutes } from "react-router-dom";
import RequireAuth from "@/components/base/RequireAuth";
import { useAuthContext } from "@/hooks/useAuthContext";
import type { Role } from "@/types/types";

const LiveMapMinotoring = React.lazy(() => import("../pages/shared/LiveMapMinotoring"));
const DriverHome = React.lazy(() => import("../pages/DriverHome"));
const Login = React.lazy(() => import("../pages/Login"));
const Signup = React.lazy(() => import("../pages/SignUp"));
const AuthCallback = React.lazy(() => import("../pages/AuthCallback"));
const AllCompanies = React.lazy(
  () => import("../pages/super admin/AllCompanies")
);
const AddCompanies = React.lazy(
  () => import("../pages/super admin/AddCompany")
);
const SuperAdminsManagement = React.lazy(
  () => import("../pages/super admin/SuperAdmin")
);
const AdminsManagement = React.lazy(
  () => import("../pages/super admin/Admins")
);
const DriversManagement = React.lazy(
  () => import("../pages/super admin/Drivers")
);
const Trajectories = React.lazy(
  () => import("../pages/super admin/Trajectories")
);
const Dashboard = React.lazy(() => import("../pages/super admin/Dashboard"));
const Delivery = React.lazy(() => import("../pages/shared/Delivery"));
const TrackOrder = React.lazy(() => import("../pages/shared/TrackOrder"));
const MainLayout = React.lazy(() => import("../layouts/MainLayout"));

const OrdersOngoing = React.lazy(() => import("@/pages/client/ordersOngoing"));
const OrdersCompleted = React.lazy(
  () => import("@/pages/client/ordersCompleted")
);
const OrdersHistory = React.lazy(() => import("@/pages/client/ordersHistory"));
const Clientnotify = React.lazy(() => import("@/pages/client/Clientnotify"));
const RealTimeTracking = React.lazy(
  () => import("@/pages/client/realTimeTracking")
);
const DashboardClient = React.lazy(() => import("@/pages/client/ClientHome"));

const AllTrips = React.lazy(() => import("../pages/chauffeur/AllTrips"));
const CurrentTrips = React.lazy(
  () => import("../pages/chauffeur/CurrentTrips")
);
const UpcomingTrips = React.lazy(
  () => import("../pages/chauffeur/UpcommingTrips")
);
const TripsHistorique = React.lazy(
  () => import("../pages/chauffeur/TripsHistorique")
);
const Deliveries = React.lazy(() => import("../pages/chauffeur/Deliveries"));
const DriverAlerts = React.lazy(
  () => import("../pages/chauffeur/DriverAlerts")
);

const AdminDashboard = React.lazy(() => import("@/pages/admin/AdminDashboard"));

const ClientManagement = React.lazy(
  () => import("@/pages/admin/personalManagement/ClientManagement")
);
const DeliveredDeliveries = React.lazy(
  () => import("@/pages/admin/delivery/DeliveredDeliveries")
);
const PlannedDeliveries = React.lazy(
  () => import("@/pages/admin/delivery/PlannedDeliveries")
);
const InServiceDrivers = React.lazy(
  () => import("@/pages/admin/driver/InServiceDrivers")
);
const OfflineDrivers = React.lazy(
  () => import("@/pages/admin/driver/OfflineDrivers")
);
const VehicleManagement = React.lazy(
  () => import("@/pages/admin/vehicle/VehicleManagement")
);
const AvailableVehicles = React.lazy(
  () => import("@/pages/admin/vehicle/AvailableVehicles")
);
const InServiceVehicles = React.lazy(
  () => import("@/pages/admin/vehicle/InServiceVehicles")
);
const AlertsPage = React.lazy(() => import("@/pages/admin/AlertsPanel"));
const Settings = React.lazy(() => import("@/pages/shared/Settings"));

const Router = () => {
  const { user } = useAuthContext();
  const role: Role = user?.role;

  const routes = [
    {
      element: <RequireAuth />,
      children: [
        {
          path: "/",
          element: <MainLayout />,
          children: [
            {
              path: "/settings",
              element: (
                <React.Suspense fallback={<div>Loading...</div>}>
                  <Settings />
                </React.Suspense>
              ),
            },
            ...(role === "super_admin"
              ? [
                  {
                    path: "/",
                    element: (
                      <React.Suspense fallback={<div>Loading...</div>}>
                        <Dashboard />
                      </React.Suspense>
                    ),
                  },
                  {
                    path: "companies/all",
                    element: (
                      <React.Suspense fallback={<div>Loading...</div>}>
                        <AllCompanies />
                      </React.Suspense>
                    ),
                  },
                  {
                    path: "vehicles/all",
                    element: (
                      <React.Suspense fallback={<div>Loading...</div>}>
                        <VehicleManagement />
                      </React.Suspense>
                    ),
                  },
                  {
                    path: "vehicles/available",
                    element: (
                      <React.Suspense fallback={<div>Loading...</div>}>
                        <AvailableVehicles />
                      </React.Suspense>
                    ),
                  },
                  {
                    path: "deliveries/all",
                    element: (
                      <React.Suspense fallback={<div>Loading...</div>}>
                        <Delivery />
                      </React.Suspense>
                    ),
                  },
                  {
                    path: "deliveries/track",
                    element: (
                      <React.Suspense fallback={<div>Loading...</div>}>
                        <TrackOrder />
                      </React.Suspense>
                    ),
                  },
                  {
                    path: "companies/add",
                    element: (
                      <React.Suspense fallback={<div>Loading...</div>}>
                        <AddCompanies />
                      </React.Suspense>
                    ),
                  },
                  {
                    path: "companies/manage",
                    element: (
                      <React.Suspense fallback={<div>Loading...</div>}>
                        <div>manage</div>
                      </React.Suspense>
                    ),
                  },
                  {
                    path: "personnel/super-admins",
                    element: (
                      <React.Suspense fallback={<div>Loading...</div>}>
                        <SuperAdminsManagement />
                      </React.Suspense>
                    ),
                  },
                  {
                    path: "personnel/admins",
                    element: (
                      <React.Suspense fallback={<div>Loading...</div>}>
                        <AdminsManagement />
                      </React.Suspense>
                    ),
                  },
                  {
                    path: "personnel/chauffeurs",
                    element: (
                      <React.Suspense fallback={<div>Loading...</div>}>
                        <DriversManagement />
                      </React.Suspense>
                    ),
                  },
                  {
                    path: "trajectories",
                    element: (
                      <React.Suspense fallback={<div>Loading...</div>}>
                        <Trajectories />
                      </React.Suspense>
                    ),
                  },
                  {
                    path: "tracking/all-cars",
                    element: (
                      <React.Suspense fallback={<div>Loading...</div>}>
                        <LiveMapMinotoring />
                      </React.Suspense>
                    ),
                  },
                ]
              : role === "admin"
              ? [
                  {
                    index: true,
                    element: (
                      <React.Suspense fallback={<div>Loading...</div>}>
                        <AdminDashboard />
                      </React.Suspense>
                    ),
                  },
                  {
                    path: "dashboard",
                    element: (
                      <React.Suspense fallback={<div>Loading...</div>}>
                        <AdminDashboard />
                      </React.Suspense>
                    ),
                  },
                  {
                    path: "/alerts",
                    element: (
                      <React.Suspense fallback={<div>Loading...</div>}>
                        <AlertsPage />
                      </React.Suspense>
                    ),
                  },

                  {
                    path: "personnel/drivers",
                    element: (
                      <React.Suspense fallback={<div>Loading...</div>}>
                        <DriversManagement />
                      </React.Suspense>
                    ),
                  },
                  {
                    path: "personnel/clients",
                    element: (
                      <React.Suspense fallback={<div>Loading...</div>}>
                        <ClientManagement />
                      </React.Suspense>
                    ),
                  },
                  {
                    path: "personnel/admins",
                    element: (
                      <React.Suspense fallback={<div>Loading...</div>}>
                        <AdminsManagement />
                      </React.Suspense>
                    ),
                  },

                  {
                    path: "deliveries/add",
                    element: (
                      <React.Suspense fallback={<div>Loading...</div>}>
                        <Delivery />
                      </React.Suspense>
                    ),
                  },
                  {
                    path: "deliveries/all",
                    element: (
                      <React.Suspense fallback={<div>Loading...</div>}>
                        <Delivery />
                      </React.Suspense>
                    ),
                  },
                  {
                    path: "deliveries/ongoing",
                    element: (
                      <React.Suspense fallback={<div>Loading...</div>}>
                        <TrackOrder />
                      </React.Suspense>
                    ),
                  },
                  {
                    path: "deliveries/completed",
                    element: (
                      <React.Suspense fallback={<div>Loading...</div>}>
                        <DeliveredDeliveries />
                      </React.Suspense>
                    ),
                  },
                  {
                    path: "deliveries/scheduled",
                    element: (
                      <React.Suspense fallback={<div>Loading...</div>}>
                        <PlannedDeliveries />
                      </React.Suspense>
                    ),
                  },

                  {
                    path: "drivers/active",
                    element: (
                      <React.Suspense fallback={<div>Loading...</div>}>
                        <InServiceDrivers />
                      </React.Suspense>
                    ),
                  },
                  {
                    path: "drivers/offline",
                    element: (
                      <React.Suspense fallback={<div>Loading...</div>}>
                        <OfflineDrivers />
                      </React.Suspense>
                    ),
                  },
                  {
                    path: "vehicles/all",
                    element: (
                      <React.Suspense fallback={<div>Loading...</div>}>
                        <VehicleManagement />
                      </React.Suspense>
                    ),
                  },
                  {
                    path: "vehicles/available",
                    element: (
                      <React.Suspense fallback={<div>Loading...</div>}>
                        <AvailableVehicles />
                      </React.Suspense>
                    ),
                  },
                  {
                    path: "vehicles/in-service",
                    element: (
                      <React.Suspense fallback={<div>Loading...</div>}>
                        <InServiceVehicles />
                      </React.Suspense>
                    ),
                  },
                  {
                    path: "live",
                    element: (
                      <React.Suspense fallback={<div>Loading...</div>}>
                        <LiveMapMinotoring />
                      </React.Suspense>
                    ),
                  },
                ]
              : role === "user"
              ? [
                  {
                    path: "/",
                    element: (
                      <React.Suspense fallback={<div>Loading...</div>}>
                        <DashboardClient />
                      </React.Suspense>
                    ),
                  },
                  {
                    path: "orders/ongoing",
                    element: (
                      <React.Suspense fallback={<div>Loading...</div>}>
                        <OrdersOngoing />
                      </React.Suspense>
                    ),
                  },
                  {
                    path: "orders/completed",
                    element: (
                      <React.Suspense fallback={<div>Loading...</div>}>
                        <OrdersCompleted />
                      </React.Suspense>
                    ),
                  },
                  {
                    path: "orders/history",
                    element: (
                      <React.Suspense fallback={<div>Loading...</div>}>
                        <OrdersHistory />
                      </React.Suspense>
                    ),
                  },
                  {
                    path: "notifications",
                    element: (
                      <React.Suspense fallback={<div>Loading...</div>}>
                        <Clientnotify />
                      </React.Suspense>
                    ),
                  },
                  {
                    path: "tracking",
                    element: (
                      <React.Suspense fallback={<div>Loading...</div>}>
                        <LiveMapMinotoring />
                      </React.Suspense>
                    ),
                  },
                ]
              : role === "driver"
              ? [
                  {
                    path: "/",
                    element: (
                      <React.Suspense fallback={<div>Loading...</div>}>
                        <Trajectories />
                      </React.Suspense>
                    ),
                  },
                  {
                    path: "trips",
                    element: (
                      <React.Suspense fallback={<div>Loading...</div>}>
                        <AllTrips />
                      </React.Suspense>
                    ),
                  },
                  {
                    path: "trips/current",
                    element: (
                      <React.Suspense fallback={<div>Loading...</div>}>
                        <CurrentTrips />
                      </React.Suspense>
                    ),
                  },
                  {
                    path: "trips/upcoming",
                    element: (
                      <React.Suspense fallback={<div>Loading...</div>}>
                        <UpcomingTrips />
                      </React.Suspense>
                    ),
                  },
                  {
                    path: "trips/history",
                    element: (
                      <React.Suspense fallback={<div>Loading...</div>}>
                        <Trajectories />
                      </React.Suspense>
                    ),
                  },
                  {
                    path: "deliver",
                    element: (
                      <React.Suspense fallback={<div>Loading...</div>}>
                        <Deliveries />
                      </React.Suspense>
                    ),
                  },
                  {
                    path: "alerts",
                    element: (
                      <React.Suspense fallback={<div>Loading...</div>}>
                        <DriverAlerts />
                      </React.Suspense>
                    ),
                  },
                  {
                    path: "settings",
                    element: (
                      <React.Suspense fallback={<div>Loading...</div>}>
                        <div>Driver Settings</div>
                      </React.Suspense>
                    ),
                  },
                ]
              : []),
          ],
        },
      ],
    },
    {
      path: "/login",
      element: (
        <React.Suspense fallback={<div>Loading...</div>}>
          <Login />
        </React.Suspense>
      ),
    },
    {
      path: "/signup",
      element: (
        <React.Suspense fallback={<div>Loading...</div>}>
          <Signup />
        </React.Suspense>
      ),
    },
    {
      path: "/auth/callback",
      element: (
        <React.Suspense fallback={<div>Loading...</div>}>
          <AuthCallback />
        </React.Suspense>
      ),
    },
  ];

  return useRoutes(routes);
};

export default Router;
