import React from "react";
import { useRoutes } from "react-router-dom";
import RequireAuth from "@/components/base/RequireAuth";
import { useAuthContext } from "@/hooks/useAuthContext";
import type { Role } from "@/types/types";

const Home = React.lazy(() => import("../pages/Home"));
const AdminHome = React.lazy(() => import("../pages/AdminHome"));
const DriverHome = React.lazy(() => import("../pages/DriverHome"));
const UserHome = React.lazy(() => import("../pages/UserHome"));
const Login = React.lazy(() => import("../pages/Login"));
const Signup = React.lazy(() => import("../pages/SignUp"));
const AuthCallback = React.lazy(() => import("../pages/AuthCallback"));

// Super Admin Pages
const AllCompanies = React.lazy(() => import("../pages/super admin/AllCompanies"));
const AddCompanies = React.lazy(() => import("../pages/super admin/AddCompany"));

// Driver Pages
const AllTrips = React.lazy(() => import("../pages/chauffeur/AllTrips"));
const CurrentTrips = React.lazy(() => import("../pages/chauffeur/CurrentTrips"));
const UpcomingTrips = React.lazy(() => import("../pages/chauffeur/UpcommingTrips"));
const TripsHistorique = React.lazy(() => import("../pages/chauffeur/TripsHistorique"));
const Deliveries = React.lazy(() => import("../pages/chauffeur/Deliveries"));
const DriverAlerts = React.lazy(() => import("../pages/chauffeur/DriverAlerts"));

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
                  {!user ? (
                    <div>Loading user...</div>
                  ) : role === "admin" ? (
                    <AdminHome />
                  ) : role === "driver" ? (
                    <DriverHome />
                  ) : role === "user" ? (
                    <UserHome />
                  ) : (
                    <Home />
                  )}
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
                      <div>Manage Companies</div>
                    </React.Suspense>
                  ),
                },
              ]
              : []),

            // Driver Routes
            ...(role === "driver"
              ? [
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
                      <TripsHistorique />
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