import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "@/app/router";
import { TestPage } from "./test.page";

const testRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/test",
  component: TestPage,
});

export const testRouteTree = testRoute.addChildren([]);
