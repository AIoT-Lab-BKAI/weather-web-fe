import { SuspenseFallback } from "@/components/fallback/suspense-fallback";
import { notification } from "antd";
import { Suspense } from "react";

export function AppBoundary({ children }: { children: React.ReactNode }) {
  const [, contextHolder] = notification.useNotification();
  return (
    <Suspense fallback={<SuspenseFallback />}>
      {children}
      {contextHolder}
    </Suspense>
  );
}
