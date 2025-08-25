import { LandingPage } from "./index.page";
import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "../../app/router";

const landingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: LandingPage,
});

export const landingRouteHierarchy = landingRoute.addChildren([]);
