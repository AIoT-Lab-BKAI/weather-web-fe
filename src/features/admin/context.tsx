import { createContext, ReactNode, useMemo, useState, use } from "react";

export interface AdminLayoutContextType {
  sidebarCollapsed: boolean;
  headerTitle?: string;
  toggleSidebar: () => void;
  setHeaderTitle: (title?: string) => void;
}

export const AdminLayoutContext = createContext<AdminLayoutContextType | undefined>(undefined);

export function AdminLayoutProvider({ children }: { children: ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [headerTitle, setHeaderTitle] = useState<string | undefined>(undefined);

  const toggleSidebar = () => {
    setSidebarCollapsed(prev => !prev);
  };

  const adminLayoutContextValue = useMemo<AdminLayoutContextType>(
    () => ({
      sidebarCollapsed,
      headerTitle,
      toggleSidebar,
      setHeaderTitle,
    }),
    [sidebarCollapsed, headerTitle],
  );

  return (
    <AdminLayoutContext value={adminLayoutContextValue}>
      {children}
    </AdminLayoutContext>
  );
}

export function useAdminLayout() {
  const context = use(AdminLayoutContext);
  if (!context) {
    throw new Error("useAdminLayout must be used within an AdminLayoutProvider");
  }
  return context;
}
