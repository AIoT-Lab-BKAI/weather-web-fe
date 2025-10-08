import { Outlet } from "@tanstack/react-router";
import { HeaderComponent } from "./components/header";
import { Sidebar } from "./components/sidebar";

function AdminLayoutContent() {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1">
        <HeaderComponent />
        <div className="h-[calc(100vh-var(--header-height))]">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export function AdminLayout() {
  return (
    <AdminLayoutContent />
  );
}
