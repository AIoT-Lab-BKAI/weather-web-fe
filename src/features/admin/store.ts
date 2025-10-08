import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface AdminLayoutState {
  sidebarCollapsed: boolean;
  headerTitle?: string;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setHeaderTitle: (title?: string) => void;
}

export const useAdminLayoutStore = create<AdminLayoutState>()(
  devtools(
    set => ({
      sidebarCollapsed: false,
      headerTitle: undefined,
      toggleSidebar: () => set(state => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      setSidebarCollapsed: collapsed => set({ sidebarCollapsed: collapsed }),
      setHeaderTitle: title => set({ headerTitle: title }),
    }),
    { name: "AdminLayoutStore" },
  ),
);
