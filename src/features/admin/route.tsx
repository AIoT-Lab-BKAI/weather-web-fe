import { MainAppLayout } from "@/features/admin/layout";
import { DashboardPage } from "@/features/admin/pages/dashboard.page";
import { DashboardProfilePage } from "@/features/admin/pages/profile.page";
import { ReportPage } from "@/features/admin/pages/report.page";
import { createRoute } from "@tanstack/react-router";
import { z } from "zod";
import { rootRoute } from "../../app/router";
// import { requireAuth } from "@/lib/auth-guard";

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "admin",
  component: MainAppLayout,
  // beforeLoad: requireAuth,
});

const dashboardRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: "dashboard",
  component: DashboardPage,
  validateSearch: z.object({
    isFromLogin: z.boolean().optional(),
  }),
});

const profileRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: "profile",
  component: DashboardProfilePage,
});

const reportRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: "report",
  component: ReportPage,
});

export const mainAppRouteTree = adminRoute.addChildren([
  dashboardRoute,
  profileRoute,
  reportRoute,
]);
