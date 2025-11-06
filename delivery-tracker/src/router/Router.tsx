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
const AllCompanies = React.lazy(() => import("../pages/super admin/AllCompanies"));
const AddCompanies = React.lazy(() => import("../pages/super admin/AddCompany"));
const MainLayout = React.lazy(() => import("../layouts/MainLayout"));

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
                <div>manage</div>
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
    }
  ];

  return useRoutes(routes);
};

export default Router;
