import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { ConfigProvider } from "antd";
import { AxiosError } from "axios";
import { router } from "./router";

export function AppProvider({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        staleTime: 0,
        retry: (failureCount, error) => {
          if (error instanceof AxiosError) {
            if (error.response?.status === 401) {
              // Unauthorized, do not retry
              return false;
            }
          }
          if (failureCount < 3 && error instanceof Error) {
            return true;
          }
          return false;
        },
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider
        theme={{
          token: {
            fontFamily: "Helvetica, sans-serif",
            fontSize: 16,
            colorPrimary: "#3881A2",
          },
        }}
      >
        {children}
        <TanStackRouterDevtools initialIsOpen={false} router={router} />
        <ReactQueryDevtools initialIsOpen={false} />
      </ConfigProvider>
    </QueryClientProvider>
  );
}
