import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "../../app/router";
import { AuthLayout } from "./layout";
import { LoginPage } from "./pages/login.page";
import { SignupPage } from "./pages/signup.page";
import { requireGuest } from "@/lib/auth-guard";

const authRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "auth",
  component: AuthLayout,
  beforeLoad: requireGuest,
});

const loginRoute = createRoute({
  getParentRoute: () => authRoute,
  path: "/login",
  component: LoginPage,
});

const signupRoute = createRoute({
  getParentRoute: () => authRoute,
  path: "/signup",
  component: SignupPage,
});

export const authRouteTree = authRoute.addChildren([
  loginRoute,
  signupRoute,
]);
