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
            <React.Suspense fallback={<div>Loading...</div>}>
              <MainLayout />
            </React.Suspense>
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
    {
      path: "*",
      element: <div>Page Not Found</div>,
    },
  ];

  return useRoutes(routes);
};

export default Router;
