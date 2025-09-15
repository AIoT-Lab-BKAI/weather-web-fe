import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "../../app/router";
import { AuthLayout } from "./layout";
import { LoginPage } from "./pages/login.page";
import { RegisterPage } from "./pages/register.page";

const authRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "auth",
  component: AuthLayout,
});

const loginRoute = createRoute({
  getParentRoute: () => authRoute,
  path: "/login",
  component: LoginPage,
});

const registerRoute = createRoute({
  getParentRoute: () => authRoute,
  path: "/register",
  component: RegisterPage,
});

export const authRouteTree = authRoute.addChildren([
  loginRoute,
  registerRoute,
]);
