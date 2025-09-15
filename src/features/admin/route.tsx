import { AdminLayout } from "@/features/admin/layout";
import { PrecipitationPage } from "@/features/admin/pages/precipitation.page";
import { DashboardProfilePage } from "@/features/admin/pages/profile.page";
import { RiveLevelPage } from "@/features/admin/pages/rive-level.page";
import { TropicalCyclonePage } from "@/features/admin/pages/tropical-cyclone.page";
import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "../../app/router";
// import { requireAuth } from "@/lib/auth-guard";

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "admin",
  component: AdminLayout,
  // beforeLoad: requireAuth,
});

const profileRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: "profile",
  component: DashboardProfilePage,
});

const precipitationRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: "precipitation",
  component: PrecipitationPage,
});

const riveLevelRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: "rive-level",
  component: RiveLevelPage,
});

const tropicalCycloneRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: "tropical-cyclone",
  component: TropicalCyclonePage,
});

export const mainAppRouteTree = adminRoute.addChildren([
  profileRoute,
  precipitationRoute,
  riveLevelRoute,
  tropicalCycloneRoute,
]);
