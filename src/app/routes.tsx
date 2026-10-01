import { lazy, Suspense, type ReactNode } from "react";
import { createBrowserRouter, Navigate, type RouteObject } from "react-router-dom";
import { GuestRoute } from "@/components/layout/GuestRoute";
import { ErrorPage } from "@/components/layout/ErrorPage";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { RouteFallback } from "@/components/layout/RouteFallback";
import { SiteLayout } from "@/components/layout/SiteLayout";

const Landing = lazy(() => import("@/pages/Landing"));
const Templates = lazy(() => import("@/pages/Templates"));
const Pricing = lazy(() => import("@/pages/Pricing"));
const Login = lazy(() => import("@/pages/Login"));
const Register = lazy(() => import("@/pages/Register"));
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const DashboardInvitations = lazy(() => import("@/pages/DashboardInvitations"));
const DashboardSettings = lazy(() => import("@/pages/DashboardSettings"));
const Editor = lazy(() => import("@/pages/Editor"));
const PublicInvitation = lazy(() => import("@/pages/PublicInvitation"));
const NotFound = lazy(() => import("@/pages/NotFound"));

const page = (element: ReactNode) => <Suspense fallback={<RouteFallback />}>{element}</Suspense>;

const routes: RouteObject[] = [
  {
    errorElement: <ErrorPage />,
    children: [
      {
        element: <SiteLayout />,
        children: [
          { index: true, element: page(<Landing />) },
          { path: "templates", element: page(<Templates />) },
          { path: "templates/:category", element: page(<Templates />) },
          { path: "pricing", element: page(<Pricing />) },
          {
            element: <GuestRoute />,
            children: [
              { path: "login", element: page(<Login />) },
              { path: "register", element: page(<Register />) },
            ],
          },
          {
            element: <ProtectedRoute />,
            children: [
              { path: "dashboard", element: page(<Dashboard />) },
              { path: "dashboard/invitations", element: page(<DashboardInvitations />) },
              { path: "dashboard/settings", element: page(<DashboardSettings />) },
            ],
          },
          { path: "*", element: page(<NotFound />) },
        ],
      },
      // Full-screen routes: no site navigation.
      { path: "invitation/:slug", element: page(<PublicInvitation />) },
      {
        element: <ProtectedRoute />,
        children: [
          { path: "editor/new", element: page(<Editor />) },
          { path: "editor/:invitationId", element: page(<Editor />) },
        ],
      },
      { path: "editor", element: <Navigate to="/editor/new" replace /> },
    ],
  },
];

export const router = createBrowserRouter(routes);
