import { redirect } from "@tanstack/react-router";
import { LS_KEY_ACCESS_TOKEN } from "@/constants/ls-key.constant";

export function requireAuth() {
  const token = localStorage.getItem(LS_KEY_ACCESS_TOKEN);

  if (!token) {
    throw redirect({
      to: "/login",
      search: {
        redirect: window.location.pathname + window.location.search,
      },
    });
  }
}
