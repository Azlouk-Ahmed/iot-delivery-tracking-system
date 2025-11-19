import React from "react";
import { useRoutes } from "react-router-dom";
import RequireAuth from "@/components/base/RequireAuth";
import { useAuthContext } from "@/hooks/useAuthContext";
import type { Role } from "@/types/types";
import OrdersOngoing from "@/pages/client/ordersOngoing";
import OrdersCompleted from "@/pages/client/ordersCompleted";
import OrdersHistory from "@/pages/client/ordersHistory";
import Clientnotify from "@/pages/client/Clientnotify";
import RealTimeTracking from "@/pages/client/realTimeTracking";

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
const ClientHome = React.lazy(() => import("../pages/client/ClientHome"));

const Router = () => {
  const { user} = useAuthContext();
  const role : Role = user?.role;
  const routes = [
    {
      element: <RequireAuth />,
      children: [
        {
          path: "/",
          element: (
              <MainLayout />
          ),
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
                    <ClientHome />
                  ) 
                  : (
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
                <div>manage</div>
              </React.Suspense>
            ),
          },
        ]
      : []),
        ...(role === "user" ? [
           {
    path: "/",
    element: (
      <React.Suspense fallback={<div>Loading...</div>}>
        <ClientHome/>
      </React.Suspense>
    ),
  },
  {
    path: "/orders/ongoing",
    element: (
      <React.Suspense fallback={<div>Loading...</div>}>
        <OrdersOngoing/>
      </React.Suspense>
    ),
  },
   {
    path: "/orders/completed",
    element: (
      <React.Suspense fallback={<div>Loading...</div>}>
       <OrdersCompleted/>
      </React.Suspense>
    ),
  },
   {
    path: "/orders/history",
    element: (
      <React.Suspense fallback={<div>Loading...</div>}>
       <OrdersHistory/>
      </React.Suspense>
    ),
  },
  {
    path: "/profile",
    element: (
      <React.Suspense fallback={<div>Loading...</div>}>
        <div>Profil du client</div>
      </React.Suspense>
    ),
  },
   {
    path: "/Clientnotify",
    element: (
      <React.Suspense fallback={<div>Loading...</div>}>
      <Clientnotify/>
      </React.Suspense>
    ),
  },
   {
    path: "/tracking",
    element: (
      <React.Suspense fallback={<div>Loading...</div>}>
        <RealTimeTracking/>
      </React.Suspense>
    ),
  },
] : []),
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
    }
  ];

  return useRoutes(routes);
};

export default Router;
