import React from "react";
import { useRoutes } from "react-router-dom";
import RequireAuth from "@/components/base/RequireAuth";
import { useAuthContext } from "@/hooks/useAuthContext";
import type { Role } from "@/types/types";

// Admin Pages
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AddDelivery from "@/pages/admin/AddDelivery";
import AllDeliveries from "@/pages/admin/AllDeliveries";
import DriverManagement from "@/pages/admin/DriverManagement";
import ClientManagement from "@/pages/admin/ClientManagement";
import InProgressDeliveries from "@/pages/admin/InProgressDeliveries";
import DeliveredDeliveries from "@/pages/admin/DeliveredDeliveries";
import PlannedDeliveries from "@/pages/admin/PlannedDeliveries";
import AdminManagement from "@/pages/admin/AdminManagement";
import InServiceDrivers from "@/pages/admin/InServiceDrivers";
import OfflineDrivers from "@/pages/admin/OfflineDrivers";
import VehicleManagement from "@/pages/admin/VehicleManagement";

// Lazy Loaded Pages
const Home = React.lazy(() => import("../pages/Home"));
const AdminHome = React.lazy(() => import("../pages/AdminHome"));
const DriverHome = React.lazy(() => import("../pages/DriverHome"));
const UserHome = React.lazy(() => import("../pages/UserHome"));
const Login = React.lazy(() => import("../pages/Login"));
const Signup = React.lazy(() => import("../pages/SignUp"));
const AuthCallback = React.lazy(() => import("../pages/AuthCallback"));
const AllCompanies = React.lazy(() => import("../pages/super admin/AllCompanies"));
const AddCompanies = React.lazy(() => import("../pages/super admin/AddCompany"));
const MainLayout = React.lazy(() => import("../layouts/MainLayout"));

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
              path: "/",
              element: (
                <React.Suspense fallback={<div>Loading...</div>}>
                  {!user
                    ? <div>Loading user...</div>
                    : role === "admin"
                    ? <AdminHome />
                    : role === "driver"
                    ? <DriverHome />
                    : role === "user"
                    ? <UserHome />
                    : <Home />}
                </React.Suspense>
              ),
            },

            // Super Admin Routes
            ...(role === "super_admin"
              ? [
                  {
                    path: "companies/all",
                    element: (
                      <React.Suspense fallback={<div>Loading...</div>}>
                        <AllCompanies />
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
                ]
              : []),

            // Admin Routes
            ...(role === "admin"
              ? [
                  // Dashboard
                  {
                    path: "dashboard",
                    element: (
                      <React.Suspense fallback={<div>Loading...</div>}>
                        <AdminDashboard />
                      </React.Suspense>
                    ),
                  },
                  // Personnel Management
                  {
                    path: "personnel/drivers",  // Translated: "chauffeurs" → "drivers"
                    element: (
                      <React.Suspense fallback={<div>Loading...</div>}>
                        <DriverManagement />
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
                        <AdminManagement />
                      </React.Suspense>
                    ),
                  },
                  // Deliveries
                  {
                    path: "deliveries/add",
                    element: (
                      <React.Suspense fallback={<div>Loading...</div>}>
                        <AddDelivery />
                      </React.Suspense>
                    ),
                  },
                  {
                    path: "deliveries/all",
                    element: (
                      <React.Suspense fallback={<div>Loading...</div>}>
                        <AllDeliveries />
                      </React.Suspense>
                    ),
                  },
                  {
                    path: "deliveries/ongoing",
                    element: (
                      <React.Suspense fallback={<div>Loading...</div>}>
                        <InProgressDeliveries />
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
