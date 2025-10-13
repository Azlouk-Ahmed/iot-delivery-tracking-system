import React from "react";
import { useRoutes } from "react-router-dom";

const Home = React.lazy(() => import("../pages/Home"));
const Login = React.lazy(() => import("../pages/Login"));
const Signup = React.lazy(() => import("../pages/SignUp"));
const MainLayout = React.lazy(() => import("../layouts/MainLayout"));

const Router = () => {
  const routes = [
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
              <Home />
            </React.Suspense>
          ),
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
      path: "*",
      element: <div>Page Not Found</div>,
    },
  ];

  return useRoutes(routes);
};

export default Router;
