import { landingRouteHierarchy } from "@/features/landing/route";
import { testRouteTree } from "@/features/test/route";
import { createRootRoute, createRouter, Outlet } from "@tanstack/react-router";
import { NotFound } from "../components/error/not-found";
import { mainAppRouteTree } from "../features/admin/route";
import { authRouteTree } from "../features/auth/route";
import { informationalRouteTree } from "../features/informational/route";

export const rootRoute = createRootRoute({
  component: () => (
    <>
      <Outlet />
    </>
  ),
  notFoundComponent: () => <NotFound />,
});

export const routeTree = rootRoute.addChildren([
  landingRouteHierarchy,
  authRouteTree,
  mainAppRouteTree,
  informationalRouteTree,
  testRouteTree,
]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
