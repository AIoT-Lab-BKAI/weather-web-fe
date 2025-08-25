import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "../../app/router";
import { InfomationalLayout } from "@/features/informational/layout";
import { AboutPage } from "@/features/informational/pages/about.page";
import { ContactPage } from "@/features/informational/pages/contact.page";

const informationalRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "informational",
  component: InfomationalLayout,
});

const aboutRoute = createRoute({
  getParentRoute: () => informationalRoute,
  path: "/about",
  component: AboutPage,
});

const contactRoute = createRoute({
  getParentRoute: () => informationalRoute,
  path: "/contact",
  component: ContactPage,
});

export const informationalRouteTree = informationalRoute.addChildren([
  aboutRoute,
  contactRoute,
]);
