"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { ModeToggle } from "@/components/ModeToggle";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Spinner } from "@/components/ui/spinner";
import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "next/navigation";

export default function CookLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const loading = useAuthStore((state) => state.loading);

  if (loading || user === undefined) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!user) {
    router.replace("/");
  }

  if (user?.role !== "Cook") {
    router.replace("/");
  }

  return (
    <div className="h-full antialiased flex flex-col">
      <SidebarProvider>
        <AppSidebar role="Cook" />

        <main className="flex-1 flex flex-col p-6 gap-2 overflow-x-hidden">
          <header className="flex justify-between">
            <SidebarTrigger />
            <ModeToggle />
          </header>

          {children}
        </main>
      </SidebarProvider>
    </div>
  );
}
